import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserSearchData, UserSearchFilters } from '../../dto/user-search-filters.dto';

@Injectable()
export class UserService {

  private readonly logger = new Logger;
  SERVICE: string = UserService.name;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async getAllUsers(): Promise<any[]> {
    const users: User[] = await this.userRepository.find();
    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      pronoun: u.pronoun,
      email: u.email,
      role: u.role,
    }));
  }

  /* ───────────── SEARCH with filters ───────────── */
  async searchUsers(filters: UserSearchFilters): Promise<UserSearchData> {
    const { firstName, lastName, email, role, page } = filters;
    const currentPage = Number(page) || 1;
    const limit = 9;
    const skip = (currentPage - 1) * limit;

    /* Build TypeORM query */
    const whereClause: any = {};
    
    if (firstName) {
      whereClause.firstName = Like(`%${firstName}%`);
    }
    
    if (lastName) {
      whereClause.lastName = Like(`%${lastName}%`);
    }
    
    if (email) {
      whereClause.email = Like(`%${email}%`);
    }
    
    if (role) {
      whereClause.role = role;
    }

    try {
      const [data, total] = await Promise.all([
        this.userRepository.find({
          where: whereClause,
          order: { lastName: 'ASC' },
          skip: skip,
          take: limit,
        }),
        this.userRepository.count({ where: whereClause }),
      ]);

      const serialized = data.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        pronoun: u.pronoun,
        email: u.email,
        role: u.role,
      }));

      return {
        data: serialized,
        page: currentPage,
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (err) {
      this.logger.error('Error searching users', err);
      throw new HttpException(
        'Error retrieving users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    this.logger.log(`Getting User with id: ${id}`, this.SERVICE);
    let user: User;
    try {
      user = await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`User not found, error message: ${error.message}`, this.SERVICE);
      throw new HttpException('User not found!', 404);
    }
    if (!user) {
      this.logger.warn('User not found', this.SERVICE);
      throw new HttpException('User not found!', 404);
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      pronoun: user.pronoun,
      role: user.role,
    } as User;
  }

  async deleteUser(id: string): Promise<void> { // No return value needed
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(`User not found, error message: ${error.message}`, this.SERVICE);
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    this.logger.log(`Getting User with email: ${email}`, this.SERVICE);
    let user: User;
    try {
      user = await this.userRepository.findOne({ where: { email } });
      this.logger.log(`Found user: ${user}`, this.SERVICE);
    } catch (error) {
      this.logger.error(`User not found, error message: ${error.message}`, this.SERVICE);
      throw new HttpException('User not found!', 404);
    }
    if (!user) {
      this.logger.warn('User not found', this.SERVICE);
      throw new HttpException('User not found!', 404);
    }
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    this.logger.log(
      `Updating User with id: ${id} with: ${JSON.stringify(userData, null, '\t')}`,
      this.SERVICE
    );
    if (userData === null) {
      this.logger.warn('Requires a User with updated properties')
      throw new BadRequestException(`Updated User not supplied`);
    }
    
    await this.userRepository.update(id, userData);
    return await this.userRepository.findOne({ where: { id } });
  }
}
