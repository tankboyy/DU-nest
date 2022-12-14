import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class userDto {
  @Field(() => String, { nullable: true })
  created: string;

  @Field(() => String, { nullable: true })
  userGender: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => String, { nullable: true })
  userBirthDay: string;

  @Field(() => String, { nullable: true })
  userName: string;

  @Field(() => String, { nullable: true })
  userPw: string;

  @Field(() => String, { nullable: true })
  userSchool: string;

  @Field(() => [String], { nullable: true })
  friends: string[];

  @Field(() => String, { nullable: true })
  userNumber: string;

  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String, { nullable: true })
  deletedTime: string;
}

@InputType()
export class inputUserDto {
  @Field(() => String, { nullable: true })
  created: string;

  @Field(() => String, { nullable: true })
  userGender: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => String, { nullable: true })
  userBirthDay: string;

  @Field(() => String, { nullable: true })
  userName: string;

  @Field(() => String, { nullable: true })
  userPw: string;

  @Field(() => String, { nullable: true })
  userSchool: string;

  @Field(() => [String], { nullable: true })
  friends: string[];

  @Field(() => String, { nullable: true })
  userNumber: string;

  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String, { nullable: true })
  deletedTime: string;
}

// export class loginDataDto {
//   @Field(() => String, { nullable: true })
//   userId: string;

//   @Field(() => String, { nullable: true })
//   userPw: string;
// }

export class loginDto {
  @Field(() => String, { nullable: true })
  created: string;

  @Field(() => String, { nullable: true })
  userGender: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => String, { nullable: true })
  userBirthDay: string;

  @Field(() => String, { nullable: true })
  userName: string;

  @Field(() => String, { nullable: true })
  userPw: string;

  @Field(() => String, { nullable: true })
  userSchool: string;

  @Field(() => String, { nullable: true })
  userNumber: string;

  @Field(() => String, { nullable: true })
  friends: any[];
}

export type Tuser = {
  created: string;
  userGender: string;
  userId: string;
  userBirthDay: string;
  userName: string;
  userPw: string;
  userSchool: string;
  friends: any[];
  userNumber: string;
};

export type loginType = { data: { userId: string; userPw: string } };
