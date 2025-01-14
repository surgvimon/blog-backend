import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AuthService } from 'src/auth/providers/auth.service';
import profileConfig from '../config/profile.config';

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
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try{
      // Check if user with email exists
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      // Might save the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: 'Error connecting to the database',
        },
      );
    }
    
    //Handle exceptions 
    if(existingUser){
      throw new BadRequestException(
        'The user already exists, please check your email.'
      );
    }

    // create a new user
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: 'Error connecting to the database',
        },
      );
    }
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
}