import { Injectable } from '@nestjs/common';
import { firebaseConfig } from '../firebase';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { AppModule } from '../app.module';
import { initializeApp } from 'firebase/app';
import { LogsResolver } from '../logs/logs.resolver';
import { UsersResolver } from '../users/users.resolver';

type gamesType = {
  [key in
    | '오락기'
    | '축구'
    | '컴퓨터'
    | '탁구'
    | '포켓볼'
    | '플스']: gameType[];
};

interface gameType {
  userId: string;
  startTime: string;
}

export interface TgameData {
  id: string;
  users: gameType[];
}

interface reservedDataType {
  name: string;
  gameNumber: number;
  userId: string;
}

interface multiGameDataType {
  name: string;
  userIds: string[];
  select: boolean[];
}

interface cancelType {
  newData: gameType[];
  gameName: string;
  gamesData: TgameData[];
}

@Injectable()
export class GameService {
  constructor(
    private readonly fb: firebaseConfig,
    private readonly logsResolver: LogsResolver,
    private readonly usersResolver: UsersResolver,
  ) {}

  gameList = ['오락기', '축구', '컴퓨터', '탁구', '포켓볼', '플스'];

  async getGames() {
    const gamesRef = doc(this.fb.db, 'game', 'gamesState');
    const snapshots = await getDoc(gamesRef);
    const gamesData = snapshots.data();

    let newData: TgameData[];

    Object.entries(gamesData).forEach(([key, value]) => {
      value.map((item, i) => {
        const endTime = new Date(item.startTime);
        endTime.setMinutes(endTime.getMinutes() + 40);
        if (endTime < new Date()) value[i] = { userId: '', startTime: '' };
      });
      const newValue = { id: key, users: [...value] };
      newData.push(newValue);
    });
    console.log(newData[0]);
    return newData;
  }

  async reservedGame(reservedData: reservedDataType) {
    const gamesRef = doc(this.fb.db, 'game', 'gamesState');
    let nextData: gamesType;
    this.logsResolver.getTodayLog().then(({ todayLog }) => {
      todayLog.forEach((item) => {
        if (
          item.userId === reservedData.userId &&
          item.gameName === reservedData.name
        )
          throw new Error(`${reservedData.userId}님은 이미 사용하셨습니다`);
      });
    });
    this.getGames().then((data) => {
      data.forEach((item) => {
        const newData = { ...item };
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
        nextData = { ...nextData, [item.id]: newData };
      });
    });
    await setDoc(gamesRef, nextData);
    return '성공';
  }

  async multiReservedGame(data: multiGameDataType) {
    const gamesRef = doc(this.fb.db, 'game', 'gamesState');
    let playedUser: string[];
    this.logsResolver.getTodayLog().then(({ todayLog }) => {
      todayLog.forEach((log) => {
        data.userIds.forEach((id) => {
          if (log.userId === id && log.gameName === data.name)
            playedUser.push(id);
        });
      });
    });
    if (playedUser.length !== 0)
      throw new Error(`${playedUser}하루에 한 번만 하실 수 있습니다`);

    const startTime = String(new Date());
    let nextData: TgameData;
    this.getGames().then((gamesData) => {
      gamesData.forEach((item) => {
        const newData = { ...item };
        // 다른 게임에 예약돼있으면 지우기
        item.users.forEach((item2, i) => {
          data.userIds.forEach((id) => {
            if (item2.userId === id) {
              newData.users[i].userId = '';
              newData.users[i].startTime = '';
            }
          });
        });

        if (item.id === data.name) {
          let i = 0;
          data.select.forEach((selectData, i) => {
            if (selectData) {
              newData[i] = { userId: data.userIds[i], startTime: startTime };
              i++;
            }
          });
        }
        nextData = { ...nextData, [item.id]: newData };
      });
    });
    await setDoc(gamesRef, nextData);
    return '성공';
  }

  async boardGame(data: Omit<multiGameDataType, 'select'>) {
    let playedUser: string[];
    let allLogs1;
    this.logsResolver.getTodayLog().then(({ allLogs, todayLog }) => {
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
    this.usersResolver.getAllUsers().then((usersData) => {
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
    });
    const gameLogDoc = doc(this.fb.db, 'logs', 'gameLog2');
    await setDoc(gameLogDoc, { logs: allLogs1 });
    return filteredIds;
  }

  async cancelReserved(data: cancelType) {
    const newGamesData = [...data.gamesData];
    data.gamesData.forEach((item, i) => {
      if (item.id === data.gameName) {
        newGamesData[i].users = data.newData;
      }
    });
    let newd;
    newGamesData.forEach((item) => {
      newd = { ...newd, [item.id]: item.users };
    });
    const gamesRef = doc(this.fb.db, 'game', 'gamesState');
    await setDoc(gamesRef, newd);
    return newGamesData;
    // return "성공"
  }

}
