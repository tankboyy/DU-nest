import { Args, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { inputAddLogDot, logDto, logDto2 } from './logs.dto';
import { firebaseConfig } from '../firebase';
import { LogsService } from './logs.service';
import { AppModule } from '../app.module';

interface todayLogType {
	allLogs: {
		userName: string;
		gameName: string;
		userId: string;
		userGender: string;
		currentTime: string;
	};
	todayLog: {
		userName: string;
		gameName: string;
		userId: string;
		userGender: string;
		currentTime: string;
	};
}

@Resolver(() => ObjectType)
export class LogsResolver {
	constructor(private readonly logsService: LogsService) {
	}

	@Query(() => [logDto])
	async getAllLogs() {
		return this.logsService.getAllLogs();
	}

	@Query(() => [logDto2])
	async getTodayLog() {
		return this.logsService.getTodayLog();
	}

	@Mutation(() => String)
	async addLog(@Args('addLogInput') addLogInput: inputAddLogDot) {
		return this.logsService.addLog(addLogInput);
	}


}
