import { Body, Controller, Get, Post } from '@nestjs/common';
import { LogsService } from './logs.service';
import { checkedLogDataDto, inputAddData, inputAddLogDot } from './logs.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('all')
  async getAllLogs(@Body() dateData: { start: string; end: string }) {
    return await this.logsService.getAllLogs(dateData).then((data) => {
      return data;
    });
  }

  @Get('today')
  async getTodayLog() {
    return await this.logsService.getTodayLog();
  }

  @Post('addlog')
  async addLog(@Body() addLogData: inputAddLogDot) {
    return await this.logsService.addLog(addLogData).then((data) => {
      return data;
    });
  }

  @Get('getReserveLog')
  async getReserveLog() {
    return await this.logsService.getReserveLog().then((data) => data);
  }

  @Post('addReserveLog')
  async addReserveLog(@Body() addLogData: inputAddData) {
    return this.logsService.addReserveLog(addLogData);
  }

  @Post('checkedLog')
  async checkedLog(@Body() checkedLogData: checkedLogDataDto) {
    return this.logsService.checkedLog(checkedLogData);
  }
}
