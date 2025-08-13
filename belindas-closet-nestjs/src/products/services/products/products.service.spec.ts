import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ProductGender, ProductType } from '../../enums';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockProduct = {
    id: 'test-uuid',
    productType: ProductType.SHIRTS,
    productGender: ProductGender.MALE,
    productSizeShoe: '10',
    productSizes: 'L',
    productSizePantsWaist: '32',
    productSizePantsInseam: '30',
    productDescription: 'Test product',
    productImage: 'image.jpg',
    isHidden: false,
    isSold: false,
    createdByUser: { id: 'user-id' } as User,
    updatedByUser: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const user = { id: 'user-id' } as User;
      const productData = {
        productType: ProductType.SHIRTS,
        productDescription: 'New product',
      };
      
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);
      
      const result = await service.createProduct(productData, user);
      
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...productData,
        createdByUser: user,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockRepository.find.mockResolvedValue([mockProduct]);
      
      const result = await service.findAll();
      
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
    
    it('should throw NotFoundException when no products are found', async () => {
      mockRepository.find.mockResolvedValue([]);
      
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);
      
      const result = await service.findOne(mockProduct.id);
      
      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: mockProduct.id },
        relations: ['createdByUser', 'updatedByUser'] 
      });
      expect(result).toEqual(mockProduct);
    });
    
    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findOne(mockProduct.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return products by type', async () => {
      mockRepository.find.mockResolvedValue([mockProduct]);
      
      const result = await service.findByType(ProductType.SHIRTS);
      
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { productType: ProductType.SHIRTS },
        relations: ['createdByUser', 'updatedByUser']
      });
      expect(result).toEqual([mockProduct]);
    });
    
    it('should throw NotFoundException when no products of type are found', async () => {
      mockRepository.find.mockResolvedValue([]);
      
      await expect(service.findByType(ProductType.PANTS)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    const updateData = {
      productDescription: 'Updated description'
    };
    
    const user = { id: 'updater-id' } as User;
    
    it('should update and return a product', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockProduct);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      
      const updatedProduct = { ...mockProduct, ...updateData, updatedByUser: user };
      mockRepository.findOne.mockResolvedValueOnce(updatedProduct);
      
      const result = await service.updateProduct(mockProduct.id, updateData, user);
      
      expect(mockRepository.update).toHaveBeenCalledWith(mockProduct.id, {
        ...updateData,
        updatedByUser: user
      });
      expect(result).toEqual(updatedProduct);
    });
    
    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      
      await expect(service.updateProduct(mockProduct.id, updateData, user))
        .rejects.toThrow(NotFoundException);
    });
    
    it('should throw BadRequestException if no update data provided', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockProduct);
      
      await expect(service.updateProduct(mockProduct.id, null, user))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should soft delete a product', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockProduct);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      
      const deletedProduct = { ...mockProduct, isHidden: true };
      mockRepository.findOne.mockResolvedValueOnce(deletedProduct);
      
      const result = await service.delete(mockProduct.id);
      
      expect(mockRepository.update).toHaveBeenCalledWith(mockProduct.id, { isHidden: true });
      expect(result).toEqual(deletedProduct);
    });
    
    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      
      await expect(service.delete(mockProduct.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('archive', () => {
    it('should archive a product', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockProduct);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      
      const archivedProduct = { ...mockProduct, isSold: true };
      mockRepository.findOne.mockResolvedValueOnce(archivedProduct);
      
      const result = await service.archive(mockProduct.id);
      
      expect(mockRepository.update).toHaveBeenCalledWith(mockProduct.id, { isSold: true });
      expect(result).toEqual(archivedProduct);
    });
    
    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      
      await expect(service.archive(mockProduct.id)).rejects.toThrow(NotFoundException);
    });
  });
});