import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsString,
  MaxLength,
} from 'class-validator';

export class AddItemReqDto {
  @ApiProperty({
    example: 'phone',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name: string;

  @ApiPropertyOptional({
    description: 'description',
    required: false,
  })
  @MaxLength(255)
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 25,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly quantity: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'image upload',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
