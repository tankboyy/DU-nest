import { Injectable } from '@nestjs/common';
import { inputAddLogDot, inputLogDto } from './logs.dto';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { UsersService } from '../users/users.service';
import { userDto } from '../users/users.dto';
import { firebaseConfig } from '../firebase';

@Injectable()
export class LogsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly fb: firebaseConfig,
  ) {}

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
      end: String(new Date()),
    },
  ) {
    const start = new Date(time.start);
    const end = new Date(time.end);
    start.setHours(start.getHours() + 9);
    end.setHours(end.getHours() + 9);
    const logsDoc = doc(this.fb.db, 'logs', 'gameLog2');
    const snapshot = await getDoc(logsDoc);
    const logsData = snapshot.data().logs;

    let newData: LogsService['logsType'][] = logsData.filter(
      (log: LogsService['logsType']) => {
        const now = new Date(new Date(log.currentTime).toUTCString());
        if (start <= now && now <= end) return log;
      },
    );

    return newData;
  }

  async getTodayLog(time = { start: new Date(), end: new Date() }) {
    time.start.setHours(9, 0, 0);
    time.end.setHours(time.end.getHours() + 9);

    let todayLog: LogsService['logsType'][];
    let allLogs: LogsService['logsType'][];
    this.getAllLogs().then((data) => {
      data.forEach((log) => {
        const middle = new Date(new Date(log.currentTime).toUTCString());
        middle.setHours(middle.getHours() + 9);
        if (time.start <= middle && middle <= time.end) todayLog.push(log);
      });
    });
    return { todayLog, allLogs };
  }

  async addLog(addLogInput: inputAddLogDot) {
    const logsDoc = doc(this.fb.db, 'logs', 'gameLog2');
    const snapshot = await getDoc(logsDoc);
    const logsData = snapshot.data().logs;

    this.usersService.getAllUsers().then((users: userDto[]) => {
      users.forEach((user) => {
        addLogInput.userId.forEach((id) => {
          if (user.userId === id) {
            const addData = {
              userName: user.userName,
              gameName: addLogInput.gameName,
              userId: id,
              currentTime: String(new Date()),
              userGender: user.userGender,
            };
            logsData.push(addData);
          }
        });
      });
    });
    await setDoc(logsDoc, logsData);
    return 'addLog!!';
  }
}
