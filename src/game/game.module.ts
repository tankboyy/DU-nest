import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { firebaseConfig } from "../firebase";
import { UsersModule } from "../users/users.module";
import { LogsModule } from "../logs/logs.module";
import { GameController } from './game.controller';

@Module({
  imports: [firebaseConfig, UsersModule, LogsModule],
  controllers: [GameController],
  providers: [GameService, GameResolver]
})
export class GameModule {}
