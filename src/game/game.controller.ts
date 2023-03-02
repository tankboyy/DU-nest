import { Body, Controller, Get, Post } from "@nestjs/common";
import { cancelType, multiGameDataType, newReservedDataDto, reservedDataType } from "./game.dto";
import { multiReservedDataDto } from "./game.dto";
import { GameService } from "./game.service";
import { gameType } from "./gameTypes";




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

	@Post("/resSoloGame")
	async reservedGame(@Body() reservedGameData: reservedDataType) {
		return await this.gameService.reservedGame(reservedGameData).then(data => {
			return data;
		});
	}

	@Post("/test1")
	async test(@Body() testData: {email: string, password: string}) {
		return await this.gameService.test(testData).then(data => data);
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

	@Get("/newGetGames")
	async newGetGames(): Promise<gameType[]> {
		return await this.gameService.newGetGames();
	}

	@Post("/newReservedGame")
	async newReservedGame(@Body() newReservedGameData: newReservedDataDto) {
		return await this.gameService.newReservedGame(newReservedGameData);
	}

}
