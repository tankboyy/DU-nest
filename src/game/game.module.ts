import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { firebaseConfig } from "../firebase";
import { LogsModule } from "../logs/logs.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [firebaseConfig, LogsModule, UsersModule],
  controllers: [GameController],
  providers: [GameService, GameResolver]
})
export class GameModule {}
