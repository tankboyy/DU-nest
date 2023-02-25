import { Injectable } from "@nestjs/common";
import { inputAddData, inputAddLogDot, inputLogDto } from "./logs.dto";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { UsersService } from "../users/users.service";
import { userDto } from "../users/users.dto";
import { firebaseConfig } from "../firebase";

@Injectable()
export class LogsService {
	constructor(
		private readonly usersService: UsersService,
		private readonly fb: firebaseConfig
	) {
	}

	logsType: {
		userName: string;
		gameName: string;
		userId: string;
		userGender: string;
		currentTime: string;
	};

	async getAllLogs(
		time: inputLogDto = {
			start: String(new Date(2020, 0, 1)),
			end: String(new Date())
		}
	) {
		const start = new Date(time.start);
		const end = new Date(time.end);
		start.setHours(start.getHours() + 9);
		end.setHours(end.getHours() + 9);
		const logsDoc = doc(this.fb.db, "logs", "gameLog2");
		const snapshot = await getDoc(logsDoc);
		const logsData = snapshot.data().logs;

		let newData: LogsService["logsType"][] = logsData.filter(
			(log: LogsService["logsType"]) => {
				const now = new Date(new Date(log.currentTime).toUTCString());
				if (start <= now && now <= end) return log;
			}
		);

		return newData;
	}

	async getTodayLog(time = {start: new Date(), end: new Date()}) {
		time.start.setHours(9, 0, 0);
		time.end.setHours(time.end.getHours() + 9);

		let todayLog: LogsService["logsType"][] = [];
		let allLogs: LogsService["logsType"][] = [];
		await this.getAllLogs().then((data) => {
			allLogs = data
			data.forEach((log) => {
				const middle = new Date(new Date(log.currentTime).toUTCString());
				middle.setHours(middle.getHours() + 9);
				if (time.start <= middle && middle <= time.end) todayLog.push(log);
			});
		});

		// const writeData = {}
		// allLogs.map((item, i) => {
		//   console.log(i, item)
		//   writeData[i + 8930] = item
		// })


		//
		const fs = require('fs');
		// fs.writeFileSync('./11.json', JSON.stringify(writeData));
		// console.log(JSON.parse(fs.readFileSync('./logs.json')))
		return {todayLog, allLogs};
	}

	async addLog(addLogData: inputAddLogDot) {
		const logsDoc = doc(this.fb.db, "logs", "gameLog2");
		const snapshot = await getDoc(logsDoc);
		const logsData = snapshot.data().logs;

		const db = getFirestore();
		const b = db.collection("logsCollection")


		this.usersService.getAllUsers().then(async (users: userDto[]) => {
			users.forEach((user) => {
				addLogData.userId.forEach((id) => {
					if (user.userId === id) {
						const addData = {
							userName: user.userName,
							gameName: addLogData.gameName,
							userId: id,
							currentTime: String(new Date()),
							userGender: user.userGender

						};
						logsData.push(addData);
						console.log(addData, "Zz", logsData[logsData.length - 1]);
					}
				});
			});
			let newLogData = logsData[logsData.length - 1];
			const {currentTime, ...newData} = newLogData;
			await Promise.all([b.add({
				timestamp: new Date(),
				...newData
			}), setDoc(logsDoc, {logs: logsData})])
		});
		return "addLog!!";
	}

	async getReserveLog() {
		const logsDoc = doc(this.fb.db, "logs", "reserveLog");
		const snapshot = await getDoc(logsDoc);
		const logsData = snapshot.data().logArr;

		console.log(logsData, "zz")

		return logsData
	}

	async addReserveLog(addData: inputAddData) {
		const logsDoc = doc(this.fb.db, "logs", "reserveLog");
		const snapshot = await getDoc(logsDoc);
		const logsData = snapshot.data().logArr;

		console.log(logsData)

		return "성공"
	}
}
