import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LogsController } from './logs/logs.controller';
import { LogsResolver } from './logs/logs.resolver';
import { LogsService } from './logs/logs.service';

@Module({
  exports: [firebaseConfig],
})
export class firebaseConfig {
  firebaseConfig = {
    apiKey: process.env.fb_apiKey,
    authDomain: process.env.fb_authDomain,
    projectId: process.env.fb_projectId,
    storageBucket: process.env.fb_storageBucket,
    messagingSenderId: process.env.fb_messagingSenderId,
    appId: process.env.fb_appId,
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
}

//
//
// const firebaseConfig = {
//   apiKey: process.env.fb_apiKey,
//   authDomain: process.env.fb_authDomain,
//   projectId: process.env.fb_projectId,
//   storageBucket: process.env.fb_storageBucket,
//   messagingSenderId: process.env.fb_messagingSenderId,
//   appId: process.env.fb_appId,
// };
// const app = initializeApp(firebaseConfig);
//
//
// export default app;
// export const db = getFirestore(app);
