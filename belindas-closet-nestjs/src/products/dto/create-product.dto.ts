import { IsEmpty, IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { User } from "../../user/entities/user.entity";
import {ProductType, ProductGender, ProductSizes, ShoeSize, PantsSize} from "../enums"

export class CreateProductDto {
    @IsEmpty({message: 'ID field is not required'})
    createdByUser: User;
    
    @IsEnum(ProductType)
    productType: ProductType;
  
    @IsEnum(ProductGender)
    productGender: ProductGender;
  
    @IsOptional()
    @IsString()
    productSizeShoe?: string | null;
  
    @IsOptional()
    @IsString()
    productSizes?: string | null;
  
    @IsOptional()
    @IsString()
    productSizePantsWaist?: string | null;
  
    @IsOptional()
    @IsString()
    productSizePantsInseam?: string | null;
  
    @IsOptional()
    @IsString()
    productDescription?: string;
  
    @IsString()
    @IsOptional()
    productImage?: string;
  
    @IsBoolean()
    isHidden: boolean;
  
    @IsBoolean()
    isSold: boolean;
}