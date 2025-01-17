import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // Set the default Auth Type
  private static readonly defaultAuthType = AuthType.Bearer;

  // Create authTypeGuardMap
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // console.log(this.authTypeGuardMap);

    // authTypes from reflector
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY,[ 
      context.getHandler(), 
      context.getClass()
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // Show authTypes
    console.log(authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    //print all the guards
    console.log(guards);

    // Default error
    const error = new UnauthorizedException();

    // loop guards canActivate
    for(const instance of guards) {
      console.log(instance);
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch((err)=>{
        error: err;
      });
      console.log(canActivate);
      if(canActivate){
        return true;
      }
    }
    throw error;
  }
}