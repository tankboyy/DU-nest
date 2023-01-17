import { Module } from '@nestjs/common';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
