import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersResolver } from "./users.resolver";
import { firebaseConfig } from "../firebase";

@Module({
  imports: [firebaseConfig],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver]
})
export class UsersModule {}
