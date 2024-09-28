import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Min,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateItemReqDto {
  @ApiPropertyOptional({
    example: 'phone',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'description',
    required: false,
  })
  @MaxLength(255)
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({
    example: 25,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  readonly quantity?: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'image upload',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
