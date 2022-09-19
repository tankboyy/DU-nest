import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from "./users.resolver";
import { firebaseConfig } from "../firebase";

@Module({
  imports: [firebaseConfig],
  controllers: [],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver]
})
export class UsersModule {}
