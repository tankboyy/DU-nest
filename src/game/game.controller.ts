import { Body, Controller, Get, Post } from "@nestjs/common";
import { cancelType, multiGameDataType } from "./game.dto";
import { multiReservedDataDto } from "./game.dto";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {

  constructor(private readonly gameService: GameService) {
  }

  @Get()
  async getGames() {
    return await this.gameService.getGames().then(data => {
      return data;
    });
  }

  @Post("/resG")
  async multiReservedGame(@Body() multiReservedData: multiReservedDataDto) {
    return await this.gameService.multiReservedGame(multiReservedData).then(data => {
      return data;
    });
  }

  @Post("/cancelG")
  async cancelReserved(@Body() cancelReservedData: cancelType) {
    return await this.gameService.cancelReserved(cancelReservedData).then(data => {
      return data;
    });
  }

  @Post("/boardG")
  async boardGame(@Body() boardGameData: Omit<multiGameDataType, "select">) {
    return await this.gameService.boardGame(boardGameData).then(data => {
      return data;
    });
  }

}
