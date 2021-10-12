import {remote} from 'webdriverio'
import nodeFetch from 'node-fetch'
import { CookieJar } from 'tough-cookie';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import cheerio from 'cheerio'
import async from 'async'
import nodeSchedule from 'node-schedule'

const jar = new CookieJar();

const httpAgent = new HttpCookieAgent({ jar });
const httpsAgent = new HttpsCookieAgent({ jar });

var $
var last_price = 0
var last_volume = 0
var prev_last_price = 0
var prev_last_volume =0
var position = 0
var cost = 0
var criteria = 0
var profit_req = 0
var cutLoss_req = 0
var profit = 0
var trades = 0

// ;(async () => {
//     const browser = await remote({
//         maxSessions: 10,
//         maxInstances: 10,
//         capabilities: {
//             browserName: 'chrome',
//             pageLoadStrategy: 'eager',
//             'goog:chromeOptions': { 
//                     args: [
//                         // "--headless", 
//                         "user-agent=...",
//                         "--disable-gpu",
//                         // "--window-size=1024,768"
//                         "--ChromeOSMemoryPressureHandling",
//                         "--incognito",
//                     ]
//             }
//         }
//     })
//     await browser.reloadSession()

//     var abortEle = async (url) => {
//         var mock1 = await browser.mock(url)
//         mock1.abort('Failed')
//     }

//     await abortEle(/.+.css/)
//     await abortEle(/.+.woff/)
//     await abortEle(/.+.svg/)
//     await abortEle(/.+.js/)
//     await abortEle(/.+.gif.+/)
//     await abortEle(/.+.gif/)
//     await abortEle(/.+.png.+/)
//     await abortEle(/.+.png/)
//     await abortEle(/.+.PNG.+/)
//     await abortEle(/.+.PNG/)
//     await abortEle(/.+.jpg.+/)
//     await abortEle(/.+.jpg/)
//     await abortEle(/.+s.yimg.com\/.+/)
//     await abortEle(/.+atwola.+/)
//     await abortEle(/.+chart_oneminute.php.+/)

//     await browser.url('https://www.etnet.com.hk/www/tc/home/index.php')

//     // await apiLink.click()

//     // await browser.saveScreenshot('./screenshot.png')
//     // await browser.deleteSession()
//     btn = await browser.$$('a[href="../futures/index.php"]')[1]
//     var a = await btn.getText()
// })()

var actionFetch = async() => {
    await nodeFetch("https://www.etnet.com.hk/www/tc/home/index.php", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            agent: httpsAgent
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    })
    .then(async ETNETReponse => {
        return await ETNETReponse.text()
    })
    .then(async done1 => {
        // console.log(done1)
        $ = cheerio.load(done1)
        console.log(parseInt($('#HomeHKIndex > ul > li:eq(6)').text().replace(',','')))
        console.log(`The current time is : ${new Date().toString()}`)
        await actionFetch()
    })
    .catch(async err => {
        console.error(err)
    })
}

var Fetch3x = async () => {
    profit_req = 5
    criteria = 10
    cutLoss_req = criteria * 3
    await nodeFetch("https://www.3x.com.tw/FRAME/DataBank/index.php?d=2021-10-12&p=HSIV&t=09:00-23:30", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1"
        },
        "method": "GET",
        "mode": "cors",
        agent: httpsAgent
    })
    .then(async Fetch3XResponse => {
        return await Fetch3XResponse.text()
    })
    .then(async done1 => {
        $ = cheerio.load(done1)
        if(done1.includes('對不起，嚴格禁止使用機器人，您刷新太快，請放慢腳步')){
            // await Fetch3x()
        }
        else {
            var tmp_element_length = $('#FORM_ZONE_C_BARBK_MAIN_B').length
            var tmp_last_price = $(`#FORM_ZONE_C_BARBK_MAIN_B:eq(${tmp_element_length - 1})`)
            var tmp_last_volume = $(`#FORM_ZONE_C_BARBK_MAIN_C:eq(${tmp_element_length - 1})`)
            var tmp_last_time = $(`#FORM_ZONE_C_BARBK_MAIN_A:eq(${tmp_element_length - 1})`)
            var tmp_prev_last_price = $(`#FORM_ZONE_C_BARBK_MAIN_B:eq(${tmp_element_length - 2})`)
            var tmp_prev_last_volume = $(`#FORM_ZONE_C_BARBK_MAIN_C:eq(${tmp_element_length - 2})`)
            console.log(`The last time is : ${tmp_last_time.text()}`)
            console.log(`The last price is : ${tmp_last_price.text().split(',')[2]}`)
            console.log(`The last volume is : ${tmp_last_volume.text()}`)
            console.log(`The previous last price is : ${tmp_prev_last_price.text().split(',')[2]}`)
            console.log(`The previous last volume is : ${tmp_prev_last_volume.text()}`)
            console.log(`The current time is : ${new Date().toString("yyyy-MM-dd HH:mm:ss")}`)
            prev_last_price = tmp_prev_last_price.text().split(',')[2]
            prev_last_volume = tmp_prev_last_volume.text()
            last_price = tmp_last_price.text().split(',')[2]
            last_volume = tmp_last_volume.text()
            if(position == 0 && (last_price - prev_last_price) / (last_volume) > criteria && last_price != prev_last_price && prev_last_price > 0 && last_price > 0){
                position = 1
                cost = last_price
                trades ++
            }
            else if(position == 0 && (last_price - prev_last_price) / (last_volume) < -1 *criteria && last_price != prev_last_price && prev_last_price > 0 && last_price > 0){
                position = -1
                cost = last_price
                trades ++
            }
            else if(position == 1 && (last_price - cost) > profit_req){
                position = 0
                profit += (last_price - cost)
            }
            else if(position == -1 && (cost - last_price) > profit_req){
                position = 0
                profit += (cost - last_price)
            }
            else if(position == 1 && (last_price - cost) < -1 * cutLoss_req){
                position = 0
                profit += (last_price - cost)
            }
            else if(position == -1 && (cost - last_price) < -1 * cutLoss_req){
                position = 0
                profit += (cost - last_price)
            }
            console.log(`The current position is :${position}`)
            // console.log(`The evaluation is : ${(last_price - prev_last_price) / (last_volume)}`)
            console.log(`The current profit is : ${profit}`)
        }
        // await Fetch3x()
        // console.log(`Data Length is : ${last_element_length}`)
    })
    .catch(async err => {
        console.error(err)
    })
}

// actionFetch()
// Fetch3x()

nodeSchedule.scheduleJob('* * * * * *', async() => {
    await Fetch3x()
})