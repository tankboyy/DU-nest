import { Module } from "@nestjs/common";
import { LogsResolver } from "./logs.resolver";
import { LogsService } from "./logs.service";
import { UsersModule } from "../users/users.module";
import { firebaseConfig } from "../firebase";

@Module({
  imports: [UsersModule, firebaseConfig],
  controllers: [],
  providers: [LogsResolver, LogsService],
  exports: [LogsResolver, LogsService]
})
export class LogsModule {
}
