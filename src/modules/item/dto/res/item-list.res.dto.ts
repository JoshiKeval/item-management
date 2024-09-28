import { Items } from '@core/database/postgres';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
export class ItemResDto {
  @ApiProperty()
  readonly itemId: string;

  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional()
  readonly description: string;

  @ApiProperty()
  readonly quantity: number;

  @ApiProperty()
  readonly image: string;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(
    itemId: string,
    name: string,
    quantity: number,
    image: string,
    createdAt: Date,
    description?: string,
  ) {
    this.itemId = itemId;
    this.name = name;
    this.description = description || '';
    this.quantity = quantity;
    this.image = image;
    this.createdAt = createdAt;
  }
}

export class ItemListReqDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly perPage: number;

  @ApiProperty({ type: ItemResDto, isArray: true })
  readonly items: ItemResDto[];

  constructor(page: number, perPage: number, items: Items[]) {
    (this.page = page),
      (this.perPage = perPage),
      (this.items = items.map(
        (i) =>
          new ItemResDto(
            i.itemId,
            i.name,
            i.quantity,
            i.image,
            i.createdAt,
            i.description,
          ),
      ));
  }
}
