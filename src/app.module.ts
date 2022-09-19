import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LogsModule } from './logs/logs.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/graphql/schema.gql',
      playground: true,
      // typePaths: ['**/*.graphql'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : 'env.pro',
      ignoreEnvFile: process.env.NODE_ENV !== 'dev',
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string().valid('dev', 'prod').required(),
      //   fb_apiKey: Joi.string().required(),
      //   fb_authDomain: Joi.string().required(),
      //   fb_projectId: Joi.string().required(),
      //   fb_storageBucket: Joi.string().required(),
      //   fb_messagingSenderId: Joi.string().required(),
      // }),
    }),
    UsersModule,
    LogsModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
