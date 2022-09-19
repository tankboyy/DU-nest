import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class gamesDto {
  @Field(() => String)
  id: string;

  @Field(() => [gameDto])
  users
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
  name

  @Field(() => Int)
  gameNumber

  @Field(() => String)
  userId
}

@InputType()
export class inputMultiReservedDto {
  @Field(() => String)
  name

  @Field(() => [String])
  userIds

  @Field(() => [Boolean])
  select
}

@InputType()
export class inputBoardDto {
  @Field(() => String)
  name

  @Field(() => [String])
  userIds
}

@InputType()
export class inputCancelDto {
  @Field(() => String)
  gameName

  @Field(() => [inputGamesDto])
  gamesData

  @Field(() => [inputGameDto])
  newData
}

@InputType()
export class inputGamesDto {
  @Field(() => String)
  id: string;

  @Field(() => [inputGameDto])
  users
}

@InputType()
export class inputGameDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  startTime: string;
}
