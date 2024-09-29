import { TransformInterceptor } from '@core/interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import { SuccessMessages } from '@core/utils';
import { AddItemReqDto, GetItemQueryDto, UpdateItemReqDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetSession } from '@core/decorators';
import { User } from '@core/interfaces';
import { UserAuthGuard } from '@core/guard';

@ApiTags('Items Apis')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for add item',
    description: 'Api for add item',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.ITEM_ADDED,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async addItem(
    @Body() payload: AddItemReqDto,
    @UploadedFile() image: Express.Multer.File,
    @GetSession() user: User,
  ) {
    return { message: await this.service.addItem(payload, image, user) };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for get single item OR list Items',
    description: 'Api for get single item OR list Items',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getItem(@Query() query: GetItemQueryDto, @GetSession() user: User) {
    return { data: await this.service.getItem(query, user) };
  }

  @Patch('/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for update item',
    description: 'Api for update item',
  })
  @ApiParam({ name: 'itemId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.ITEM_UPDATED,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateItem(
    @Body() payload: UpdateItemReqDto,
    @Param('itemId') itemId: string,
    @GetSession() user: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return {
      message: await this.service.updateItem(payload, itemId, user, image),
    };
  }

  @Delete('/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for delete item',
    description: 'Api for delete item',
  })
  @ApiParam({ name: 'itemId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.ITEM_DELETED,
  })
  async deleteItem(@Param('itemId') itemId: string) {
    return { message: await this.service.deleteItem(itemId) };
  }
}
