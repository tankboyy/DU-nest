import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { firebaseConfig } from '../firebase';
import { UsersController } from './users.controller';

@Module({
  imports: [firebaseConfig],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
