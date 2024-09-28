import { Order } from '@core/interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationReqDto {
  @ApiPropertyOptional({ default: 1 })
  @Transform((tr) => Number(tr.value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly page!: number;

  @ApiPropertyOptional({ default: 10 })
  @Transform((tr) => Number(tr.value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly perPage!: number;

  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC,
  })
  @IsEnum(Order, { message: 'Must be ASC | DESC' })
  @IsOptional()
  readonly order!: Order;
}
