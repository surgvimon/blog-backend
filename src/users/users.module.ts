import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import profileConfig from './config/profile.config';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService, 
    UsersCreateManyProvider, 
    CreateUserProvider, 
    FindOneUserByEmailProvider
  ],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
