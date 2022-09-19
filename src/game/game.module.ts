import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { firebaseConfig } from "../firebase";
import { UsersModule } from "../users/users.module";
import { LogsModule } from "../logs/logs.module";

@Module({
  imports: [firebaseConfig, UsersModule, LogsModule],
  controllers: [],
  providers: [GameService, GameResolver]
})
export class GameModule {}
