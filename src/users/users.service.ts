import { Injectable } from '@nestjs/common';
import { inputUserDto, loginType, Tuser, userDto } from './users.dto';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase';

@Injectable()
export class UsersService {
	constructor(private readonly fb: firebaseConfig) {
	}

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

	async idCheck(userId: {userId: string}) {
		const idsArr: userDto[] = [];
		const Id = userId.userId

		await this.getAllUsers().then((data) => {
			data.forEach((item: userDto) => {
				if (item.userName.includes(Id)) {
					console.log(item.userName);
					idsArr.push(item);
				}
			});
		});
		return idsArr.length === 0 ? `${Id}` : `${Id}${idsArr.length}`;
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
		await setDoc(usersRef, {data: newData});
	}

	async login(loginData: loginType) {
		console.log(loginData);
		const usersRef = doc(this.fb.db, 'users', 'usersData');
		const usersSnap = await getDoc(usersRef);
		const usersData = usersSnap.data().data;

		let user = {};

		usersData.map((userData: Tuser) => {
			if (userData.userId === loginData.data.userId) {
				if (userData.userPw === loginData.data.userPw) user = userData;
				else if (userData.userPw !== loginData.data.userPw)
					throw new Error('비밀번호가 일치하지 않습니다.');
			}
		});

		if (Object.keys(user).length === 0)
			throw new Error('일치하는 아이디가 없습니다.');
		return user;
	}

	async deleteUser(userIndex: number) {
		const usersRef = doc(this.fb.db, 'users', 'usersData');

		this.getAllUsers().then(async (users) => {
			const deletedUserData = users.splice(userIndex - 1, 1)[0];
			deletedUserData.deletedTime = String(new Date());

			const deleteUsersRef = doc(this.fb.db, 'users', 'deleteUsers');
			const deleteUsersSnap = await getDoc(deleteUsersRef);
			const deleteUsersData = deleteUsersSnap.data().data;
			const newDData = [...deleteUsersData, deletedUserData];
			await Promise.all([
				setDoc(deleteUsersRef, {data: newDData}),
				setDoc(usersRef, {data: users}),
			]);
			return deletedUserData;
		});
	}
}
