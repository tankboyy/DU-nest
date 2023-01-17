import { Injectable } from '@nestjs/common';
import axios from "axios";
import { load } from "cheerio"
import puppeteer from "puppeteer"

type arrType = {
	[key: string]: undefined[] | string
}

@Injectable()
export class ApiService {

	async getC() {
		const rooms = [
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=multipurposeRoom&mId=0402010100',
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010200',
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=sportActivityRoom&mId=0402010300',
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=musicPracticeRoom&mId=0402010400',
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=careerJobExpRoom&mId=0402010500',
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=eduCultureExpRoom&mId=0402010600',
			'https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=glassCreationRoom&mId=0402010700'
		]


		const datas = [];

		const getUrlData = async (url: string) => {
			const browser = await puppeteer.launch({
				headless: true,
				args: [`--window-size=1920,1080`],
				defaultViewport: {
					width: 1920,
					height: 1080
				}
			});
			const page = await browser.newPage();
			await page.goto(url, {
				waitUntil: 'networkidle2',
			});
			await page.waitForSelector('.btn_L')
			await page.click('img[src="/culturehome/img/application/btn_calendar01.gif"]');
			await page.waitForSelector('.btn_L')

			let asd
			await page.evaluate(() => document.querySelector('*').outerHTML)
				.then(data => {
					asd = getData(data)
				})
			await browser.close();
			return asd
		}
		const getData = (data) => {
			const filterData: arrType = {}
			const $ = load(data)
			const datas = $(".table_schedule > tbody > tr > td");
			datas.map((idx, node) => {
				const data = $(node)
				if (data.find('.num').text() === '') return
				const newData = data.find('li').text().replace(/\t/g, '').replace(/\n/g, '')
				if (newData === '') return
				filterData[data.find('.num').text()] = newData
			})
			const roomName = $(".box_4depth > .list04 > .on > a").text()
			return [roomName, filterData]
		}


		// for (let urlIndex = ; urlIndex < 8; urlIndex++) {
		// 	const url =
		// 		`https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010${urlIndex}00`
		// 	getUrlData(url).then(data => {
		// 		console.log(data)
		// 	})
		// }

		let returnArr = ['zzz']

		await Promise.all([
				getUrlData(rooms[0]),
				getUrlData(rooms[1]),
				getUrlData(rooms[2]),
				getUrlData(rooms[3]),
				getUrlData(rooms[4]),
				getUrlData(rooms[5]),
				getUrlData(rooms[6])
			]).then(data =>{
				returnArr = data
		})
		return returnArr



		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010100'))
		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010200'))
		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010300'))
		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010400'))
		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010500'))
		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010600'))
		// console.log(getUrlData('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010700'))


		// await page.waitForSelector('.list04')
		// await page.click('a[href="/culturehome/contents.do?mId=0402010200"]');
		//
		// await page.goto('https://www.osan.go.kr/culturehome/facilitiesRent/calForm.do?kind=clubRoom&mId=0402010200', {
		// 	waitUntil: 'networkidle2',
		// })
		// await page.waitForSelector('.btn_L')
		// await page.click('img[src="/culturehome/img/application/btn_calendar01.gif"]');
		// await page.waitForSelector('.btn_L')
		//
		//
		// // await page.pdf({path: '/Users/ksj/pro/aa.pdf', format: 'a4'});
		//
		// await page.evaluate(() => document.querySelector('*').outerHTML)
		// 	.then(data => {
		// 		datas.push(getData(data))
		// 	})


		// await page.pdf({ path: '/Users/ksj/pro/aa.pdf', format: 'a4' });


	}
}
