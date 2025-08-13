import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User, Role } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = {
    id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    pronoun: 'they/them',
    role: Role.ADMIN,
    password: 'hashedPassword',
    resetPasswordToken: null,
    resetPasswordExpires: null,
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of user data without sensitive information', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      
      const result = await service.getAllUsers();
      
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([{
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        pronoun: mockUser.pronoun,
        email: mockUser.email,
        role: mockUser.role,
      }]);
      // Should not include password or reset tokens
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0]).not.toHaveProperty('resetPasswordToken');
    });
  });

  describe('getUserById', () => {
    it('should return user data by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      
      const result = await service.getUserById(mockUser.id);
      
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id }
      });
      expect(result).toEqual({
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        pronoun: mockUser.pronoun,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw HttpException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      
      await expect(service.getUserById('nonexistent-id'))
        .rejects.toThrow(HttpException);
    });
  });

  // Add more tests as needed for other methods
});
