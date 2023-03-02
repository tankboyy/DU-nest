import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";


export type gamesType = {
  [key in | "오락기"
    | "축구"
    | "컴퓨터"
    | "탁구"
    | "포켓볼"
    | "플스"]: gameType[];
};

export interface gameType {
  userId: string;
  startTime: string;
}

export interface TgameData {
  id: string;
  users: gameType[];
}

export interface reservedDataType {
  name: string;
  gameNumber: number;
  userId: string;
}

export interface multiGameDataType {
  name: string;
  userIds: string[];
  select: boolean[];
}

export interface cancelType {
  newData: gameType[];
  gameName: string;
  gamesData: TgameData[];
}

export class multiReservedDataDto {
  @IsString()
  readonly name: string;
  @IsBoolean()
  readonly select: boolean[];
  @IsString()
  readonly userIds: string[];
}
export class restGameDto {
  @IsString()
  readonly userId: string;
  @IsString()
  readonly startTime: string;
}

export class cancelReservedDataDto {
  @IsString()
  readonly newData: restGameDto;
  @IsBoolean()
  readonly select: boolean[];
  @IsString()
  readonly userIds: string[];
}

// Graphql Dto
@ObjectType()
export class gamesDto {
  @Field(() => String)
  id: string;

  @Field(() => [gameDto])
  users;
}

@ObjectType()
export class gameDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  startTime: string;
}

@InputType()
export class inputReservedDto {
  @Field(() => String)
  name;

  @Field(() => Int)
  gameNumber;

  @Field(() => String)
  userId;
}

@InputType()
export class inputMultiReservedDto {
  @Field(() => String)
  name;

  @Field(() => [String])
  userIds;

  @Field(() => [Boolean])
  select;
}

@InputType()
export class inputBoardDto {
  @Field(() => String)
  name;

  @Field(() => [String])
  userIds;
}

@InputType()
export class inputCancelDto {
  @Field(() => String)
  gameName;

  @Field(() => [inputGamesDto])
  gamesData;

  @Field(() => [inputGameDto])
  newData;
}

@InputType()
export class inputGamesDto {
  @Field(() => String)
  id: string;

  @Field(() => [inputGameDto])
  users;
}

@InputType()
export class inputGameDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  startTime: string;
}


export class newReservedDataDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly targetGameName: string;

  @IsNumber()
  readonly targetGameIndex: number;
}
