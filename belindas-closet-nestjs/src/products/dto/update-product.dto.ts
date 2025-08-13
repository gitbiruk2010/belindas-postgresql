import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import {ProductType, ProductGender, ProductSizes, ShoeSize, PantsSize} from "../enums"

export class UpdateProductDto {
  @IsOptional()
  readonly createdByUser?: User;

  @IsOptional()
  readonly updatedByUser?: User;

  @IsOptional()
  // @IsEnum(ProductType)
  productType?: ProductType;

  @IsOptional()
  // @IsEnum(ProductGender)
  productGender?: ProductGender;

  @IsOptional()
  @IsString()
  productSizeShoe?: string;

  @IsOptional()
  @IsString()
  productSizes?: string | null;

  @IsOptional()
  @IsString()
  productSizePantsWaist?: string;

  @IsOptional()
  @IsString()
  productSizePantsInseam?: string;

  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;

  @IsOptional()
  @IsBoolean()
  isSold?: boolean;
}