import { Module } from "@nestjs/common";
import { LogsResolver } from "./logs.resolver";
import { LogsService } from "./logs.service";
import { UsersModule } from "../users/users.module";
import { firebaseConfig } from "../firebase";
import { LogsController } from './logs.controller';

@Module({
  imports: [UsersModule, firebaseConfig],
  controllers: [LogsController],
  providers: [LogsResolver, LogsService],
  exports: [LogsResolver, LogsService]
})
export class LogsModule {
}
