import { Controller, Get } from "@nestjs/common";
import { firebaseConfig } from "./firebase";

@Controller("/")
export class AppController {

  @Get("")
  getHello() {
    console.log(process.env.NODE_ENV)
    return "hi";
  }
}
