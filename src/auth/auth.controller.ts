import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  public async signIn(@Body() signInDto: SignInDto){}
}