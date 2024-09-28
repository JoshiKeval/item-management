import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationReqDto } from './pagination.req.dto';
import { Type } from 'class-transformer';

export class GetItemQueryDto extends PaginationReqDto {
  @ApiPropertyOptional({
    example: 'id',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly id: string;

  @ApiPropertyOptional({
    example: 'phone',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly name: string;

  @ApiPropertyOptional({
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  readonly quantityStart: number;

  @ApiPropertyOptional({
    example: 56,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  readonly quantityEnd?: number;

  @ApiPropertyOptional({
    example: '2024-09-28T05:33:58.019Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly startDate: Date;

  @ApiPropertyOptional({
    example: '2024-09-28T05:33:58.019Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly endDate: Date;
}
