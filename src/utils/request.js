import network from '@system.network'
import fetch from '@system.fetch'
import errorCode from './error-code.js'
import gankApi from'./gank-api.js'

function getGankDailyData(year, month, day) {
    return getPromise(`${gankApi.GANK_BASE_URL}day/${year}/${month}/${day}`)
}

function getDayHistory() {
    return getPromise(`${gankApi.GANK_BASE_URL}${gankApi.GANK_DAY_HISTORY}`)
}

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

    return new Promise(function(resolve, reject){
        network.getType({
            success: function(data){
                if (data.type === 'none') {
                    console.error("getNetWorkType error: ERROR_NETWORK_NONE");
                    reject(ERROR_CODE.ERROR_NETWORK_NONE)
                } else {
                    console.error("getNetWorkType success: "+JSON.stringify(data));
                    resolve(data)
                }
            },
            fail: function(data){
                console.error("getNetWorkType error: fail");
                reject(data)
            }
        })
    }).then(function(value) {
        return new Promise(function(resolve, reject) {
            fetch.fetch({
                method: method,
                url:url,
                success: function(data){
                    
                    console.log(JSON.stringify(data))
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
    })
}

function getNetWorkTypePromise() {
    return new Promise(function(resolve, reject){
        network.getType({
            success: function(data){
                if (data.type === 'none') {
                    console.error("getNetWorkType error: ERROR_NETWORK_NONE");
                    reject(ERROR_CODE.ERROR_NETWORK_NONE)
                } else {
                    console.error("getNetWorkType success: "+JSON.stringify(data));
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
                console.log("fetch sucess")
                console.log(JSON.stringify(data))
                resolve(data)
            },
            fail: function(data, code) {
                console.log("fetch fail")
                reject(code)
            }
        })
    })
}

export default {
    getGankDailyData,
    getDayHistory,
    getGankData
}