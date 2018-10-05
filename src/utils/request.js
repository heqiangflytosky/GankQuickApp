import network from '@system.network'
import fetch from '@system.fetch'
import errorCode from './error-code.js'
import gankApi from'./gank-api.js'

/**
 * 获取特定日期网站数据
 * @param {*} year 
 * @param {*} month 
 * @param {*} day 
 */
function getGankDailyData(year, month, day) {
    return getPromise(`${gankApi.GANK_BASE_URL}day/${year}/${month}/${day}`)
}

/**
 * 获取发过干货日期接口
 */
function getDayHistory() {
    return getPromise(`${gankApi.GANK_BASE_URL}${gankApi.GANK_DAY_HISTORY}`)
}

/**
 * 获取最新一天的干货
 */
function getGankToday() {
    return getPromise(`${gankApi.GANK_BASE_URL}${gankApi.GANK_TODAY}`)
}

/**
 * 获取分类数据的数据
 * @param {*} category 分类
 * @param {*} pageCount 每页数据个数
 * @param {*} page 第几页
 */
function getGankData(category, pageCount, page) {
    return getPromise(`${gankApi.GANK_BASE_URL}data/${category}/${pageCount}/${page}`)
}

function getPromise(url) {
    return httpRequestPromise('GET', url)
}

function httpRequestPromise(method, url) {
    console.log(url)
    // 这种方式不行，不会按先后顺序执行
    //return getNetWorkTypePromise().then(fetchDataPromise(method, url))
    return getNetWorkTypePromise().then(function(value){
        return fetchDataPromise(method, url)
    })
}

function getNetWorkTypePromise() {
    return new Promise(function(resolve, reject){
        network.getType({
            success: function(data){
                if (data.type === 'none') {
                    console.error("getNetWorkType error: ERROR_NETWORK_NONE");
                    reject(errorCode.ERROR_NETWORK_NONE)
                } else {
                    console.log("getNetWorkType success: "+JSON.stringify(data));
                    resolve(data)
                }
            },
            fail: function(data){
                console.error("getNetWorkType error: fail");
                reject(data)
            }
        })
    })
}

function fetchDataPromise(method, url) {
    return new Promise(function(resolve, reject) {
        fetch.fetch({
            method: method,
            url:url,
            success: function(data){
                //console.log(JSON.stringify(data))
                if (data.code === 200) {
                    console.log("fetch sucess")
                    resolve(data)
                } else {
                    console.log("fetch error")
                    reject(data.code)
                }
                
            },
            fail: function(data, code) {
                console.log("fetch fail")
                reject(code)
            }
        })
    })
}

function getGankDailyRecommandData() {
    return getDayHistory()
    .then(function(value) {
        return new Promise(function(resolve, reject) {
            var data = JSON.parse(value.data)
            console.log('最新日期： '+data.results[0])
            var dateStr = data.results[0];
            // 格式 2018-09-19
            var date = new Date(Date.parse(dateStr.replace(/-/g,  "/")));
            var s = date.toJSON()

            var paraData = {};
            paraData.year = date.getFullYear()
            paraData.month = date.getMonth()+1
            paraData.date = date.getDate()
            console.log('年： '+paraData.year+'月： '+paraData.month+'日： '+paraData.date)
            resolve(paraData)
        })
      })
      .then(function(value) {
        return new Promise(function(resolve, reject) {
            console.log('日期： year = '+value.year+", month = "+value.month+", date = "+value.date)
            getGankDailyData(value.year,value.month,value.date)
            .then(function(value) {
                //var data = JSON.parse(value.data)
                resolve(value)
              })
        })
      })
}

export default {
    //getGankDailyRecommandData,
    getDayHistory,
    getGankToday,
    getGankData
}