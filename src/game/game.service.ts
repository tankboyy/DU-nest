import { Injectable } from "@nestjs/common";
import { firebaseConfig } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { LogsResolver } from "../logs/logs.resolver";
import { UsersResolver } from "../users/users.resolver";
import {
	cancelType,
	gamesType,
	multiGameDataType, newReservedDataDto,
	reservedDataType,
	TgameData
} from "./game.dto";
import { initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { credential, firestore, auth } from "firebase-admin";
import { Timestamp } from "firebase/firestore";
import { gameType } from "./gameTypes";


@Injectable()
export class GameService {
	constructor(
		private readonly fb: firebaseConfig,
		private readonly logsResolver: LogsResolver,
		private readonly usersResolver: UsersResolver
	) {
	}


	async getGames() {
		const db = getFirestore();
		const gamesRef = db.collection("gamesCollection");
		const data = await gamesRef.get();
		const resultData = [];
		data.forEach(item => {
			resultData.push({
				gameId: item.id,
				gameData: item.data()
			});
		});
		return resultData;
	}


	async test(testData: {email: string, password: string}) {

		const db = getFirestore();


		// 로그불러오기 + 한국시간으로 변경
		// const db = getFirestore();
		// const b = db.collection("logsCollection")
		// b.orderBy("timestamp").get().then(data => {
		// 	data.forEach(item => console.log(item.data().timestamp.toDate().toLocaleString('ko-KR', { timeZone:
		// 'Asia/Seoul' }))) })

		// 새로운 회원가입
		// const {email, password} = testData;
		// const userRecord = await auth().createUser({email, password});
		//
		// console.log(userRecord.phoneNumber)

		// gamesCollection 기본 설정값
		const gameList = ["축구", "포켓볼", "탁구", "플스", "스위치", "오락기", "컴퓨터", "충전", "노래방"];
		//
		// const db = getFirestore();
		const ref = db.collection("gamesCollection");
		gameList.forEach(game => {
			ref.doc(game).set({
				0: {startTime: String(new Date()), userId: ""},
				1: {startTime: String(new Date()), userId: ""},
				2: {startTime: String(new Date()), userId: ""},
				3: {startTime: String(new Date()), userId: ""},
				4: {startTime: String(new Date()), userId: ""},
				5: {startTime: String(new Date()), userId: ""}
			});
		});


		// 체크
		// const nowTime = new Date().toLocaleDateString();
		// const nextTime = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString();
		// console.log(nowTime, nextTime);
		// const logsRef = db.collection("logsCollection");
		// logsRef
		// 	.where("timestamp", ">=", firestore.Timestamp.fromDate(new Date(nowTime)))
		// 	.where("timestamp", "<=", firestore.Timestamp.fromDate(new Date(nextTime)))
		// 	.orderBy("timestamp")
		// 	.get()
		// 	.then(data => data.forEach(item => console.log(item.id, item.data().userId, item.data().timestamp.toDate().toLocaleString('ko-KR', { timeZone:'Asia/Seoul' }))))
		// 	.catch(err => console.log(err));
		//
		// return "성공";
		// const gamesRef = db.collection("gamesCollection");
		// const data = await gamesRef.get();
		// const resultData = [];
		// data.forEach(item => {
		// 	console.log(item.data())
		// 	// console.log(typeof item.data()[0].startTime.toDate().toLocaleString("ko-KR", {
		// 	// 	timeZone:
		// 	// 		"Asia/Seoul"
		// 	// }));
		// 	resultData.push({
		// 		gameId: item.id,
		// 		gameData: item.data()
		// 	});
		// });
		//
		// return resultData;


	}


	async reservedGame(reservedData: reservedDataType) {
		console.log(reservedData, "solo res start");
		const gamesRef = doc(this.fb.db, "game", "gamesState");
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
				console.log(err);
			});
		this.getGames().then(async (data) => {
			data.forEach((item) => {
				const newData = {...item};
				item.users.forEach((item2, i) => {
					if (item2.userId === reservedData.userId) {
						newData.users[i].userId = "";
						newData.users[i].startTime = "";
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
		return "성공";
	}

	async multiReservedGame(data: multiGameDataType) {
		const gamesRef = doc(this.fb.db, "game", "gamesState");
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
							newData[i].userId = "";
							newData[i].startTime = "";
						}
					});
				});

				if (item.id === data.name) {
					let i = 0;
					data.select.forEach((selectData, index) => {
						if (selectData) {
							newData[index] = {
								userId: data.userIds[i],
								startTime: startTime
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
		return "성공";
	}

	async boardGame(data: Omit<multiGameDataType, "select">) {
		const gameLogDoc = doc(this.fb.db, "logs", "gameLog2");
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
							userGender: userData.userGender
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
		const gamesRef = doc(this.fb.db, "game", "gamesState");
		await setDoc(gamesRef, newd);
		return newGamesData;
	}

	async newGetGames() {
		const db = getFirestore();
		const gamesRef = db.collection("gamesCollection");
		const data = await gamesRef.get();
		const resultData: gameType[] = [];
		data.forEach(item => {
			resultData.push({
				gameId: item.id,
				gameData: item.data()
			});
		});

		return resultData;
	}

	async newReservedGame(data: newReservedDataDto) {
		const db = getFirestore();

		// 체크


		// 예약
		const gamesRef = db.collection("gamesCollection").doc(data.targetGameName);
		gamesRef.update({
			[data.targetGameIndex]: {startTime: String(new Date()), userId: data.userId}
		}).then(() => {
			return "성공";
		})
			.catch(err => err);
		return "성공";
	}
}
