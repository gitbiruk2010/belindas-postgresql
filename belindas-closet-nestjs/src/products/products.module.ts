import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from './controllers/products/products.controller';
import { ProductsService } from './services/products/products.service';
import { Product } from "./entities/product.entity";

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Product]) ],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'PRODUCTS_SERVICE',
      useClass: ProductsService,
    }
  ]
})
export class ProductsModule {}
