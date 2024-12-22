import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Body,
    Headers,
    Ip,
    ParseIntPipe,
    DefaultValuePipe,
    ValidationPipe,
  } from '@nestjs/common';
  import { CreateUserDto } from './dtos/create-user.dto';
  import { GetUsersParamDto } from './dtos/get-users-param.dto';
  import { PatchUserDto } from './dtos/patch-user.dto';
  import { UsersService } from './providers/users.service';
  
  @Controller('users')
  export class UsersController {
    constructor(
        // Injecting Users Service
        private readonly usersService: UsersService,
    ) {}

    /**
     * Final Endpoint - /users/id?limit=10&page=1
     * Parama id - optional, convert to integer, cannot have a default value
     * Query limit - integer, default 10
     * Query page - integer, default value 1
     * ==> USE CASES
     * /users/ -> return all users with default pagination
     * /users/1223 -> returns one user whos id is 1234
     * /users?limit=10&page=2 -> return page 2 with limt of pagination 10
     */
  
    @Get('/:id?')
    public getUsers(
        @Param() getUserParamDto: GetUsersParamDto,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.usersService.findAll(getUserParamDto, limit, page);
    }
  
    @Post()
    public createUsers(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto instanceof CreateUserDto);
        return 'You sent a post request to users endpoint';
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return patchUserDto;
    }
  }