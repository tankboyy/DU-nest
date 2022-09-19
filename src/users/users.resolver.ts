import { Args, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { inputUserDto, userDto } from './users.dto';
import { UsersService } from './users.service';

@Resolver(() => ObjectType)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [userDto])
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => [userDto])
  async getUser(@Args('userId', { type: () => String }) userId: string) {
    return this.usersService.getUser(userId);
  }

  @Query(() => String)
  async idCheck(@Args('userId', { type: () => String }) userId: string) {
    return this.usersService.idCheck(userId);
  }

  @Mutation(() => String)
  addUser(@Args('userData') userData: inputUserDto) {
    return this.usersService.addUser(userData);
  }

  @Mutation(() => userDto)
  updateUser(@Args("userData") userData: inputUserDto) {
    return this.usersService.updateUser(userData)
  }

  @Mutation(() => userDto)
  deleteUser(@Args("userIndex") userIndex: number) {
    return this.usersService.deleteUser(userIndex)
  }
}
