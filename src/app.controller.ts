import { Controller, Get } from "@nestjs/common";
import { ApiService } from "./api/api.service";

@Controller("/api")
export class AppController {
  constructor(private readonly apiService: ApiService) {
  }

  @Get("/ss")
  async getC() {
    return this.apiService.getC().then((data) => {
      return data
    })
  }
}
