import { ItemsRepository } from '@core/database/postgres';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddItemReqDto, GetItemQueryDto, UpdateItemReqDto } from './dto';
import {
  ErrorMessages,
  getPaginateOffset,
  isImageValid,
  SuccessMessages,
} from '@core/utils';
import { S3Service } from '@core/aws';
import { extname } from 'path';
import { User } from '@core/interfaces';
import { Between, ILike, LessThan, MoreThan } from 'typeorm';
import { ItemListReqDto } from './dto/res';

@Injectable()
export class ItemService {
  constructor(
    private readonly pgItemsRepo: ItemsRepository,
    private readonly s3Service: S3Service,
  ) {}

  async addItem(payload: AddItemReqDto, file: any, user: User) {
    const { name, quantity, description } = payload;
    const isItemExist = await this.pgItemsRepo.fetchOne(
      {},
      {},
      { name, userId: user?.id },
    );

    if (isItemExist) {
      throw new BadRequestException(ErrorMessages.ITEM_ALREADY_EXIST);
    }
    let url;
    if (file) {
      url = await this.uploadImage(user.id, file);
    }
    const item = this.pgItemsRepo.create({
      name,
      quantity,
      description,
      image: url
        ? url
        : `https://imt-task.s3.ap-south-1.amazonaws.com/demo.png`,
      userId: user?.id,
    });

    await this.pgItemsRepo.saveItem(item);
    return SuccessMessages.ITEM_ADDED;
  }

  async getItem(query: GetItemQueryDto, user: User): Promise<ItemListReqDto> {
    const { limit, offset } = getPaginateOffset(query?.page, query?.perPage);

    const whereOption = {
      ...(query?.id ? { itemId: query.id } : {}),
      ...(query?.name ? { name: ILike('%' + query.name.trim() + '%') } : {}),

      ...(query?.quantityStart && query?.quantityEnd
        ? { quantity: Between(query.quantityStart, query.quantityEnd) }
        : query?.quantityStart
          ? { quantity: MoreThan(query.quantityStart) }
          : query?.quantityEnd
            ? { quantity: LessThan(query.quantityEnd) }
            : {}),

      ...(query?.startDate && query?.endDate
        ? {
            createdAt: Between(
              new Date(query.startDate),
              new Date(query.endDate),
            ),
          }
        : query?.startDate
          ? { createdAt: MoreThan(new Date(query.startDate)) }
          : query?.endDate
            ? { createdAt: LessThan(new Date(query.endDate)) }
            : {}),

      userId: user?.id,
    };

    const items = await this.pgItemsRepo.findAll(
      {},
      {},
      { ...whereOption },
      { createdAt: query?.order },
      limit,
      offset,
    );
    return new ItemListReqDto(query?.page, query?.perPage, items);
  }

  async updateItem(
    payload: UpdateItemReqDto,
    itemId: string,
    user: User,
    file: any,
  ) {
    const isItemExist = await this.pgItemsRepo.fetchOne({}, {}, { itemId });
    if (!isItemExist) {
      throw new BadRequestException(ErrorMessages.ITEM_NOT_EXIST);
    }
    if (payload?.name) {
      const isItemExist = await this.pgItemsRepo.fetchOne(
        {},
        {},
        { name: payload?.name, userId: user?.id },
      );
      if (isItemExist) {
        throw new BadRequestException(ErrorMessages.ITEM_ALREADY_EXIST);
      }
    }

    let url;
    if (file) {
      url = await this.uploadImage(user.id, file);
    }

    await this.pgItemsRepo.updateItem(
      { itemId },
      {
        ...(payload?.description ? { description: payload?.description } : {}),
        ...(file ? { image: url } : {}),
        ...(payload?.name ? { name: payload?.name } : {}),
        ...(payload?.quantity ? { quantity: payload?.quantity } : {}),
      },
    );

    return SuccessMessages.ITEM_UPDATED;
  }

  async deleteItem(itemId: string) {
    const isItemExist = await this.pgItemsRepo.fetchOne({}, {}, { itemId });
    if (!isItemExist) {
      throw new BadRequestException(ErrorMessages.ITEM_NOT_EXIST);
    }
    await this.pgItemsRepo.softDeleteItem({ itemId });
    return SuccessMessages.ITEM_DELETED;
  }

  async uploadImage(userId: string, file: any) {
    const isFileValid = isImageValid(file);
    const ext = extname(file.originalname);
    const key = `${userId}/${Date.now()}${ext}`;
    if (!isFileValid) {
      throw new BadRequestException(ErrorMessages.IMAGE_FORMAT_NOT_VALID);
    }
    const objectUrl = await this.s3Service.uploadFile(file, key);
    return objectUrl;
  }
}
