import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { User } from '../../../user/entities/user.entity';
import { ProductType } from '../../enums';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger();
  SERVICE: string = ProductsService.name;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(product: Partial<Product>, user: User): Promise<Product> {
    this.logger.log(
      `Creating Product: ${JSON.stringify(product, null, '\t')}`,
      this.SERVICE,
    );
    
    const newProduct = this.productRepository.create({
      ...product,
      createdByUser: user,
    });
    
    return await this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    this.logger.log(`Finding all Products`, this.SERVICE);
    
    const products = await this.productRepository.find({
      relations: ['createdByUser', 'updatedByUser'],
    });
    
    if (!products || products.length === 0) {
      this.logger.warn('Products not found', this.SERVICE);
      throw new NotFoundException('No products found');
    }
    
    return products;
  }

  async findOne(id: string): Promise<Product> {
    this.logger.log(`Finding Product with id: ${id}`, this.SERVICE);
    
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser'],
    });
    
    if (!product) {
      this.logger.warn('Product not found', this.SERVICE);
      throw new NotFoundException(`Product ${id} not found`);
    }
    
    this.logger.log(
      `Product found: ${JSON.stringify(product, null, '\t')}`,
      this.SERVICE,
    );
    return product;
  }

  // Find by type
  async findByType(productType: ProductType | string): Promise<Product[]> {
    this.logger.log(`Finding Products with type: ${productType}`, this.SERVICE);
    
    const products = await this.productRepository.find({
      where: { productType: productType as ProductType },
      relations: ['createdByUser', 'updatedByUser'],
    });
    
    if (!products || products.length === 0) {
      this.logger.warn('Products not found', this.SERVICE);
      throw new NotFoundException(`No products of type ${productType} found`);
    }
    
    return products;
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>,
    user: User,
  ): Promise<Product> {
    this.logger.log(`Updating Product with id: ${id}`, this.SERVICE);
    
    // First check if the product exists
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser'],
    });
    
    if (!existingProduct) {
      this.logger.warn('Product not found', this.SERVICE);
      throw new NotFoundException(`Product ${id} not found`);
    }
    
    if (!productData) {
      this.logger.warn('Updated product not supplied', this.SERVICE);
      throw new BadRequestException('Updated product not supplied');
    }
    
    this.logger.log(
      `Updated Product; ${JSON.stringify(productData, null, '\t')}`,
      this.SERVICE,
    );
    
    // Update the product with the new data
    await this.productRepository.update(id, {
      ...productData,
      updatedByUser: user,
    });
    
    // Get the updated product
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser'],
    });
    
    return updatedProduct;
  }

  async delete(id: string): Promise<Product> {
    this.logger.log(`Soft deleting Product with id: ${id}`, this.SERVICE);
    
    // Check if the product exists
    const product = await this.productRepository.findOne({
      where: { id },
    });
    
    if (!product) {
      this.logger.warn('Product not found');
      throw new NotFoundException(`Product ${id} not found`);
    }
    
    // Update the isHidden property
    await this.productRepository.update(id, { isHidden: true });
    
    // Return the updated product
    return await this.productRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser'],
    });
  }

  async archive(id: string): Promise<Product> {
    this.logger.log(`Archiving Product with id: ${id}`, this.SERVICE);
    
    // Check if the product exists
    const product = await this.productRepository.findOne({
      where: { id },
    });
    
    if (!product) {
      this.logger.warn('Product not found');
      throw new NotFoundException(`Product ${id} not found`);
    }
    
    // Update the isSold property
    await this.productRepository.update(id, { isSold: true });
    
    // Return the updated product
    return await this.productRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'updatedByUser'],
    });
  }
}
