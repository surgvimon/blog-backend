import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AuthService } from 'src/auth/providers/auth.service';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';

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

    // Injecting Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    // Injecting ConfigService
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

     /**
     * Inject UsersCreateMany provider
     */
     private readonly usersCreateManyProvider: UsersCreateManyProvider,

     /**
      * Inject createUserProvider
      */
     private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    // let loggenIn = false;
    // if (!loggenIn) {
      throw new HttpException(
        {
          status: HttpStatus.MOVED_PERMANENTLY,
          error: `The API endpoint doesn't exist anymore`,
          fileName: 'users.service.ts',
          lineNumber: 89,
        },
        HttpStatus.MOVED_PERMANENTLY,
        {
          cause: new Error(),
          description:
            'Occured because the API endpoint was permanently moved to a new location',
        },
      );
    // }
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    /**
     * Handle the user does not exist
     */

    if(!user){
      throw new BadRequestException('The user id does not exist.');
    }

    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }


}