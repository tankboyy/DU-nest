import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GameService, TgameData } from "./game.service";
import { inputUserDto } from "../users/users.dto";
import { gamesDto, inputBoardDto, inputCancelDto, inputMultiReservedDto, inputReservedDto } from "./game.dto";

@Resolver()
export class GameResolver {
  constructor(private readonly gameService: GameService) {



    }
  // @Mutation(() => String)
  //   addUser(@Args('userData') userData: inputUserDto) {
  //     return this.usersService.addUser(userData);
  //   }
  @Query(() => [gamesDto])
  getGames(): Promise<TgameData[]> {
    return this.gameService.getGames()
  }

  @Mutation(() => String)
  reservedGame(@Args('reservedData') reservedData: inputReservedDto) {
    return this.gameService.reservedGame(reservedData)
  }

  @Mutation(() => String)
  multiReservedGame(@Args('data') data: inputMultiReservedDto) {
    return this.gameService.multiReservedGame(data)
  }

  @Mutation(() => [String])
  boardGame(@Args('data') data: inputBoardDto) {
    return this.gameService.boardGame(data)
  }

  @Mutation(() => [gamesDto])
  cancelReserved(@Args('data') data: inputCancelDto){
    return this.gameService.cancelReserved(data)
  }
}
