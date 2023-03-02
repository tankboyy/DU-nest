export interface gameType {
	gameId: string
	gameData: {
		[index: number]: {
			userId: string,
			startTime: string
		}
	}

}
