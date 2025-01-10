import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
/**
 * Controller class for '/users' API endpoint
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting User repository into UsersService
     * */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
     /**
     * Injecting Config service
     * */

     private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // Check if user with email exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    /**
     * Handle exceptions if user exists later
     * */

    // Try to create a new user
    // - Handle Exceptions Later
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    // Create the user
    return newUser;
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    const environment = this.configService.get<string>('S3_BUCKET');
    console.log(environment);

    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}