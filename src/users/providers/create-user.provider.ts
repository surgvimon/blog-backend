import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
    constructor(
        // inject usersRepository
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        /**
         *  Inject hashingProvider
         */
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider, 
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
        let newUser = this.usersRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password),
        });
    
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
}
