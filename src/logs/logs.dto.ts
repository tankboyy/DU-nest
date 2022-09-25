import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from "class-validator";




@ObjectType()
export class logDto {
  @Field(() => String)
  userName: string;

  @Field(() => String)
  gameName: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  userGender: string;

  @Field(() => String)
  currentTime: string;
}

@ObjectType()
export class logDto2 {
  @Field(() => logDto)
  allLogs: {
    userName: string;
    gameName: string;
    userId: string;
    userGender: string;
    currentTime: string;
  }

  @Field(() => logDto)
  todayLog: {
    userName: string;
    gameName: string;
    userId: string;
    userGender: string;
    currentTime: string;
  }
}

@InputType()
export class inputLogDto {
  @Field(() => String)
  start: string;

  @Field(() => String)
  end: string;
}

@InputType()
export class inputAddLogDot {
  @Field(() => String)
  gameName: string;

  @Field(() => [String])
  userId: string[];
}
