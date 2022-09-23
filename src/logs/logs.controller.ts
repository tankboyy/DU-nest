import { Body, Controller, Get, Post } from "@nestjs/common";
import { LogsService } from "./logs.service";
import { inputAddLogDot } from "./logs.dto";

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {
  }

  @Get("all")
  async getAllLogs(){
    return await this.logsService.getAllLogs().then(data => {
      return data
    })
  }

  @Get("today")
  async getTodayLog(){
    return await this.logsService.getTodayLog().then(data => {
      return data
    })
  }

  @Post("addlog")
  async addLog(@Body() addLogData: inputAddLogDot) {
    return await this.logsService.addLog(addLogData).then(data => {
      return data
    })
  }

}
