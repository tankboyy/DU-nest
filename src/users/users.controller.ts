import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './users.dto';

@Controller('users')
export class UsersController {}
