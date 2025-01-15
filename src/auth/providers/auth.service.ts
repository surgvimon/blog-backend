import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public signIn(signInDto: SignInDto) {
    //Find the user using email ID
    //Throw an exception user not found
    // Compare password to the hash
    //Send confirmation
  }

  public isAuth() {
    return true;
  }
}