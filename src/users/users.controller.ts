import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { loginType, userDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers().then((data) => {
      return data;
    });
  }

  @Post('/login')
  async login(@Body() loginData: loginType) {
    return this.usersService.login(loginData).then((data) => {
      return data;
    });
  }

  @Post('/idcheck')
  async idCheck(@Body() userId: string) {
    return this.usersService.idCheck(userId).then((data) => {
      return data;
    });
  }

  @Post('/adduser')
  async addUser(@Body() userData: userDto) {
    return this.usersService.addUser(userData).then((data) => {
      return data;
    });
  }

  @Post('/updateuser')
  async updateUser(@Body() userData: userDto) {
    return this.usersService.updateUser(userData).then((data) => {
      return data;
    });
  }

  @Post('/deleteuser')
  async deleteUser(@Body() userIndex: number) {
    return this.usersService.deleteUser(userIndex).then((data) => {
      return data;
    });
  }
}
