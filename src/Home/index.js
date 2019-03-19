import fetch from '@system.fetch'
import prompt from '@system.prompt'
import request from '../utils/request.js'
import gankCategory from '../data/GankCategory.js'
import constans from '../data/Constants.js'

export default {
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    tabHeadList: [
      {title: gankCategory.CATEGORY_DAILY},
      {title: gankCategory.CATEGORY_ANDROID},
      {title: gankCategory.CATEGORY_IOS},
      {title: gankCategory.CATEGORY_WEB},
      {title: gankCategory.CATEGORY_APP},
      {title: gankCategory.CATEGORY_EXPAND_RES},
      {title: gankCategory.CATEGORY_REST_VIDEO},
    ],
    currentIndex: 0,
    list: ['A', 'B', 'C', 'D', 'E'],
    gankData:[],
    currentData:[],
    dailyData: [],
    dailyStatus: constans.STATUS_INIT_LOAD_LOADING,
  },
  onInit() {
    for(let x in this.tabHeadList){
      let t = this.tabHeadList[x].title
      this.gankData.push({name:t,value:new Array(),status:constans.STATUS_INIT_LOAD_LOADING});
    }

    this.changeTabIndex(0)
    this.$on('reload', this.reloadEventHandler);
    this.$on('loadMore', this.loadMoreEventHandler);
  },

  reloadEventHandler (evt) {
    console.log(JSON.stringify(evt))
    this.initData(this.currentIndex)
  },

  loadMoreEventHandler (evt) {
    console.log(JSON.stringify(evt))
    let title = evt.detail.title
    let pageIndex = evt.detail.page
    this.getData(title, pageIndex)
  },

  changeTabIndex(index) {
    const item = Object.assign({}, this.tabHeadList[index])
    if (!item.render) {
      this.initData(index)
    }
    item.render = true
    this.tabHeadList.splice(index, 1, item)


    for(let x in this.gankData){
      let name = this.gankData[x].name;
      console.log('init title =' +item.title+',name = '+ name)
      if(name === item.title){
        this.list = this.gankData[x].value;
        break;
      }
    }
  },
  onChangeTabIndex (evt) {
    this.currentIndex = evt.index
    this.changeTabIndex(evt.index)
  },
  renderTabContent (index) {
    return !!this.tabHeadList[index].render
  },
  initData(index) {
    let title = this.gankData[index].name
    this.getData(title,1)
  },
  getData(title,page) {
      let root = this
      console.log(`getData 当前显示 ${title}`)
      if (title === gankCategory.CATEGORY_DAILY) {
          console.log(`获取`+gankCategory.CATEGORY_DAILY)
          this.dailyStatus=constans.STATUS_INIT_LOAD_LOADING
          request.getGankToday()
          .then(function(value) {
              console.log(`拿到数据了：`)
              //console.log(JSON.stringify(value))
              let data = JSON.parse(value.data)

              root.setDailyData(data)
              root.dailyStatus = constans.STATUS_INIT_LOAD_SUCESS
            },
            function(error) {
              console.log(`getData +`+title+`error:`+error)
              root.dailyStatus = constans.STATUS_INIT_LOAD_ERROR
          })
      } else {
        this.setLoadStatus(title, constans.STATUS_INIT_LOAD_LOADING)
        request.getGankData(title, constans.COMMON_REQUEST_PAGE_SIZE, page)
          .then(function (value) {
            console.log(`拿到数据了：`)
            //console.log(JSON.stringify(value.data))
            let data = JSON.parse(value.data)
            //console.log(value.data.results)
            console.log('长度： ' + data.results.length)
            root.setData(title, data)
          },
            function (error) {
              console.error(`getData +` + title + `error:` + error)
              if (page === 1) {
                root.setLoadStatus(title, constans.STATUS_INIT_LOAD_ERROR)
              }
            })
      }
  },
  setData(title, data) {
    for(let x in this.gankData){
      let name = this.gankData[x].name;
      console.log('title =' +title+',name = '+ name)
      if(name === title){
        this.gankData[x].value = this.gankData[x].value.concat(data.results)
        this.gankData[x].status = constans.STATUS_INIT_LOAD_SUCESS
        // for(var t in data.results){
        //   console.log('t =' +t+',data = '+ data.results[t])
        //   this.gankData[x].value.push(data.results[t]);
        // }
        return;
      }
    }
  },
  setLoadStatus(title,status) {
    for(let x in this.gankData){
      let name = this.gankData[x].name;
      console.log('title =' +title+',name = '+ name)
      if(name === title){
        this.gankData[x].status = status
        // for(var t in data.results){
        //   console.log('t =' +t+',data = '+ data.results[t])
        //   this.gankData[x].value.push(data.results[t]);
        // }
        return;
      }
    }
  },
  setDailyData(data) {
    let tmp = [];
    
    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_BENEFIT) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_BENEFIT, value:data.results.福利});
    }
    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_ANDROID) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_ANDROID, value:data.results.Android});
    }
    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_IOS) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_IOS, value:data.results.iOS});
    }
    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_APP) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_APP, value:data.results.App});
    }
    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_VIDEO) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_VIDEO, value:data.results.休息视频});
    }

    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_EXPAND_RES) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_EXPAND_RES, value:data.results.拓展资源});
    }

    if (data.category.indexOf(gankCategory.HEADER_CATEGORY_RECOMMAND) > -1) {
      tmp.push({name:gankCategory.HEADER_CATEGORY_RECOMMAND, value:data.results.瞎推荐});
    }

    this.dailyData = tmp;
  }
}