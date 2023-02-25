import { Injectable } from '@nestjs/common';
import { firebaseConfig } from '../firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { LogsResolver } from '../logs/logs.resolver';
import { UsersResolver } from '../users/users.resolver';
import {
	cancelType,
	gamesType,
	multiGameDataType,
	reservedDataType,
	TgameData,
} from './game.dto';
import { initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { credential, firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;


@Injectable()
export class GameService {
	constructor(
		private readonly fb: firebaseConfig,
		private readonly logsResolver: LogsResolver,
		private readonly usersResolver: UsersResolver,
	) {
	}


	async getGames() {
		const gamesRef = doc(this.fb.db, 'game', 'gamesState');
		const snapshots = await getDoc(gamesRef);
		const gamesData = snapshots.data();
		let newData: TgameData[] = [];
		Object.entries(gamesData).forEach(([key, value]) => {
			value.users.map((item, i) => {
				if (!item.startTime) return
				const endTime = new Date(item.startTime);
				endTime.setMinutes(endTime.getMinutes() + 40);
				if (endTime < new Date()) {
					value.users[i] = {userId: '', startTime: ''}
				}
			});
			const newValue = {id: key, users: [...value.users]};
			newData.push(newValue);
		});
		return newData;
	}

	async test(testData: {}) {

		// const a = await db.collection("logCollection").get()
		// a.forEach(item => console.log(item.id))
		const db = getFirestore();
		const b = db.collection("logsCollection")

		// await b.add({
		// 	timestamp: new Date(),
		// 	level: 'error',
		// 	message: 'Something went wrong!'
		// });
		// console.log(await b.get());

		// b.orderBy("timestamp").get()
		// 	.then((data) => {
		// 		data.forEach((doc) => {
		// 			console.log(doc.id, doc.data().timestamp)
		// 		})
		// 	})
		// 	.catch(err => console.log(err))

		// b.set({
		// 	name: "name",
		// 	age: 17
		// }, {merge: true});
		// console.log(await b.get())
		// const gamesRef = await db.collection("game").doc("gamesState").get();
		// console.log(gamesRef);
		// console.log(Timestamp.fromDate(new Date('December 10, 1815')))
		// const data = {
		// 	name: "오석중",
		// 	gameName: "보드게임",
		// 	time: Timestamp.fromDate(new Date())
		// }
		// await b.set(data, {merge: true})
		return "성공"
	}

	async reservedGame(reservedData: reservedDataType) {
		console.log(reservedData, "solo res start")
		const gamesRef = doc(this.fb.db, 'game', 'gamesState');
		let nextData: gamesType;
		this.logsResolver.getTodayLog().then(({todayLog}) => {
			if (todayLog !== undefined) {
				todayLog.forEach((item) => {
					if (
						item.userId === reservedData.userId &&
						item.gameName === reservedData.name
					)
						throw new Error(`${reservedData.userId}님은 이미 사용하셨습니다`);
				});
			}
		})
			.catch((err) => {
				console.log(err)
			})
		this.getGames().then(async (data) => {
			data.forEach((item) => {
				const newData = {...item};
				item.users.forEach((item2, i) => {
					if (item2.userId === reservedData.userId) {
						newData.users[i].userId = '';
						newData.users[i].startTime = '';
					}
				});

				if (reservedData.name === item.id) {
					newData.users[reservedData.gameNumber].userId = reservedData.userId;
					newData.users[reservedData.gameNumber].startTime = String(new Date());
				}
				nextData = {...nextData, [item.id]: newData};
			});
			await setDoc(gamesRef, nextData);
		});
		return '성공';
	}

	async multiReservedGame(data: multiGameDataType) {
		const gamesRef = doc(this.fb.db, 'game', 'gamesState');
		let playedUser: string[] = [];
		this.logsResolver.getTodayLog().then(({todayLog}) => {
			if (todayLog !== undefined) {
				todayLog.forEach((log) => {
					data.userIds.forEach((id) => {
						if (log.userId === id && log.gameName === data.name)
							playedUser.push(id);
					});
				});
			}
		});
		if (playedUser.length !== 0)
			throw new Error(`${playedUser}하루에 한 번만 하실 수 있습니다`);

		const startTime = String(new Date());
		let nextData = {};
		this.getGames().then(async (gamesData) => {
			gamesData.forEach((item) => {
				const newData = [...item.users];
				// 다른 게임에 예약돼있으면 지우기
				item.users.forEach((item2, i) => {
					data.userIds.forEach((id) => {
						if (item2.userId === id) {
							newData[i].userId = '';
							newData[i].startTime = '';
						}
					});
				});

				if (item.id === data.name) {
					let i = 0;
					data.select.forEach((selectData, index) => {
						if (selectData) {
							newData[index] = {
								userId: data.userIds[i],
								startTime: startTime,
							};
							i++;
						}
					});
				}
				console.log(nextData);
				nextData = {...nextData, [item.id]: newData};
			});
			await setDoc(gamesRef, nextData);
		});
		return '성공';
	}

	async boardGame(data: Omit<multiGameDataType, 'select'>) {
		const gameLogDoc = doc(this.fb.db, 'logs', 'gameLog2');
		let playedUser: string[] = [];
		let allLogs1;
		this.logsResolver.getTodayLog().then(({allLogs, todayLog}) => {
			allLogs1 = allLogs;
			todayLog.forEach((log) => {
				data.userIds.forEach((id) => {
					if (log.userId === id && log.gameName === data.name)
						playedUser.push(id);
				});
			});
		});
		let filteredIds = [...data.userIds];

		if (playedUser.length !== 0) {
			playedUser.forEach((id) => {
				if (filteredIds.indexOf(id) !== -1) {
					filteredIds.splice(filteredIds.indexOf(id), 1);
				}
			});
		}
		this.usersResolver.getAllUsers().then(async (usersData) => {
			usersData.forEach((userData) => {
				filteredIds.forEach((id) => {
					if (userData.userId === id) {
						allLogs1.push({
							userName: userData.userName,
							gameName: data.name,
							userId: id,
							currentTime: String(new Date()),
							userGender: userData.userGender,
						});
					}
				});
			});
			await setDoc(gameLogDoc, {logs: allLogs1});
		});
		return filteredIds;
	}

	async cancelReserved(data: cancelType) {
		const newGamesData = Object.values(data.gamesData);
		Object.values(data.gamesData).forEach((item, i) => {
			if (item.id === data.gameName) {
				newGamesData[i].users = data.newData;
			}
		});
		let newd;
		newGamesData.forEach((item) => {
			newd = {...newd, [item.id]: item.users};
		});
		const gamesRef = doc(this.fb.db, 'game', 'gamesState');
		await setDoc(gamesRef, newd);
		return newGamesData;
	}
}
