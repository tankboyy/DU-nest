import { Injectable } from '@nestjs/common';
import { inputUserDto, userDto } from './users.dto';
import { arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";

@Injectable()
export class UsersService {

  constructor(private readonly fb: firebaseConfig) {}


  async getAllUsers(): Promise<userDto[]> {

    const usersRef = doc(this.fb.db, 'users', 'usersData');
    const usersSnap = await getDoc(usersRef);
    return usersSnap.data().data;
  }


  async getUser(userId: string) {
    let usersArr: userDto[];
    await this.getAllUsers()
      .then((data) => {
        usersArr = data.filter((item) => item.userName === userId);
      })
      .catch((err) => console.log(err));
    return usersArr.flat();
  }

  async idCheck(userId: string) {
    let idsArr: userDto[] = [];
    await this.getAllUsers().then((data) => {
      data.filter((item: userDto) => {
        if (item.userName.includes(userId)) idsArr.push(item);
      });
    });
    return idsArr.length === 0 ? `${userId}` : `${userId}${idsArr.length}`;
  }

  async addUser(userData: userDto) {
    console.log(userData, 'service');
    const created = String(new Date());
    const userPw = `${userData.userBirthDay.split('-')[1]}${
      userData.userBirthDay.split('-')[2]
    }`;
    const friends: string[] = [];
    const usersRef = doc(this.fb.db, 'users', 'usersData');
    await updateDoc(usersRef, {
      data: arrayUnion({
        ...userData,
        created,
        userPw,
        friends,
      }),
    });
    return '성공';
  }

  async updateUser(userData: userDto) {
    const usersRef = doc(this.fb.db, 'users', 'usersData');
    let newData: userDto[];
    this.getAllUsers().then((users) => {
      if (!userData.userNumber) userData.userNumber = '';
      users.splice(userData.id - 1, 1, userData);
      newData = users;
    });
    await setDoc(usersRef, { data: newData });
  }

  async deleteUser(userIndex: number) {
    const usersRef = doc(this.fb.db, 'users', 'usersData');

    this.getAllUsers().then(async (users) => {
      const deletedUserData = users.splice(userIndex - 1, 1)[0];
      deletedUserData.deletedTime = String(new Date());

      const deleteUsersRef = doc(this.fb.db, 'users', 'deleteUsers');
      const deleteUsersSnap = await getDoc(deleteUsersRef);
      const deleteUsersData = deleteUsersSnap.data()!.data;
      const newDData = [...deleteUsersData, deletedUserData]
      await Promise.all([setDoc(deleteUsersRef, { data: newDData }), setDoc(usersRef, {data: users})])
      return deletedUserData
    });
  }
}
