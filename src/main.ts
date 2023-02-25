import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { initializeApp, ServiceAccount } from "firebase-admin/app";;
import { credential } from "firebase-admin";
import * as firestoreKey from "../firestoreKey.json";

dotenv.config({
	path: path.resolve(
		process.env.NODE_ENV === 'production'
			? '.env'
			: '.env.dev'
	),
});

const serviceAccountKey = firestoreKey as ServiceAccount;


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();

	await app.listen(3001);

	initializeApp({
		credential: credential.cert(serviceAccountKey),
	});


	console.log(process.env.CLIENT_URL);
}

bootstrap();
