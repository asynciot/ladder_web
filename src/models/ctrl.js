import pathToRegexp from 'path-to-regexp';
import { notification } from 'antd';
import base64url from 'base64url';
import { stringify } from 'qs';
import StringMask from 'string-mask';
import { api } from '../utils/request';
import {
  getDeviceList,
  getDeviceInfo,
  getFileData,
  getLastWave,
	getFollowDevices,
	postMonitor,
} from '../services/api';
import { ctrlMenu } from '../ctrl.js';

const formatter = new StringMask('00');
let ws = null;
const wsApi = `${api.replace('http', 'ws')}/devices/socket`;
const wsDebug = 'ws://47.96.162.192:9006/device/Monitor/socket';

function array2obj(arr, key = null) {
  const obj = {};
  obj.updateTime = 0;
  arr.forEach((item) => {
    if (key) {
      obj[item[key]] = item;
    } else {
      obj[item.propertyName] = item;
      if (item.updateTime>obj.updateTime) {
        obj.updateTime = item.updateTime
      }
    }
  });
  return obj;
}

function buffer2hex(buffer) {
  const unit16array = [];
  buffer.forEach((e) => {
    const num = e.toString(16);
    unit16array.push(num.length === 1
      ? `0${num}`
      : num);
  });
  return unit16array;
}
function hex2b(hex) {
  let val = Number(`0x${hex}`).toString(2);
  while (val.length < 8) {
    val = '0'+ val
  }
  return val;
}
function parseMenu(buffer) {
  const arr = [];
  const hex = buffer2hex(buffer);
  const isOpen = { 0: '常开', 1:'常闭' };
  const isClosed = { 0: '关闭', 1:'开通' };
  const isRoof = { 
    '00': '未使用',
    '01':'门 1 开门按钮',
    '02': '门 1 关门按钮',
    '03': '司机开关门',
    '04': '独立按钮',
    '05': '直驶按钮',
    '06': '司机换向按钮',
    '07': '消防钥匙开关',
    '08': '门转开关',
    '09': '延时关门',
    '10': '门 2 开门按钮',
    '11': '门 2 关门按钮',
    '12': '医梯开关',
    '13': '服务层切换 1',
    '14': '服务层切换 2',
    '15': '服务层切换 3',
   };
   const isY = { 
    '00': '未使用',
    '01': '运行接触器',
    '02': '封星接触器',
    '03': '抱闸接触器',
    '04': '抱闸维持接触器',
    '05': '消防照明继电器',
    '06': '消防道基站',
    '07': '封门继电器',
    '08': '停电应急救援运行',
    '09': '门 1 开门输出',
    '10': '门 1 关门输出',
    '11': '门 2 开门输出',
    '12': '门 2 关门输出',
    '13': '救援蜂鸣输出 1',
   };
   const isY1 = { 
    '00': '未使用',
    '01': '输出上行到站钟',
    '02': '输出下行到站钟',
    '03': '上下行到站钟合并输出',
    '04': '超载蜂鸣',
    '05': '消防警铃',
   };
   const isCP8 = { 
    '00': '无信号输出',
    '01': '液晶输出',
    '02': '力必拓 IC 卡',
    '03': '金博 IC 卡',
   };
   const isAll = { 
    '00': '单梯',
    '01': '并联',
    '02': '群控',
   };
   const isMaster = { 
    '00': '副梯',
    'ff': '主梯',
   };
   const isClose = { 
    '00': '关闭',
    '01': '开通',
   };
   const isBox = { 
    '00': '单操纵箱',
    '01': '第二操纵箱作为残疾人操纵箱',
    '02': '第二操纵箱作为后门操纵箱',
   };
   const isLayer = { 
    '00': '单层站召唤',
    '01': '残疾人层站召唤开通',
    '02': '后门层站召唤开通',
   };
   const isWeight = { 
    '00': '无效',
    '01': '轿顶板',
    '02': '主板',
   };
   const isJoke = { 
    '00': '无效',
    '01': '称重判断',
    '02': '光幕判断',
    '03': '轻载开关判断',
   };
   const isArrive = { 
    '00': '到站钟一直开启',
    '01': '到站钟在设置的时间内开启',
    '02': '到站钟一直关闭',
   };
   const isVip = { 
    '00': '未开通',
    '01': '通过层站召唤按钮启用开通',
    '02': '通过层站召唤端子启用开通',
    '03': '通过 IO 板端口启用开通',
   };
   const fireSwitch = { 
    '00': '无效',
    '01': '层站召唤板端子输入',
    '02': 'IO 板端子输入',
   };
   const fireSet = { 
    '00': '启用消防电梯开关，消防员钥匙开关和消防联动开关输入无效',
    '01': '启用消防电梯开关和消防联动开关，消防员钥匙开关输入无效',
    '02': '启用消防电梯开关和消防员钥匙开关，消防联动开关无效',
    '03': '启用消防电梯开关、消防员钥匙开关、消防联动开关',
   };
   const fireMode = { 
    '00': '系统标配消防模式',
    '01': '香港消防模式',
   };
   const fireProcess = { 
    '00': '不检测抱闸行程开关',
    '01': '检测左右抱闸行程开关',
    '02': '检测左抱闸行程开关',
    '03': '检测右抱闸行程开关',
   };
   const fireAuto = { 
    '00': '启动运行部检测关门到位',
    '01': '启动运行检测关门到位，关门不到位禁止电梯 运行',
   };
  ctrlMenu.forEach((item) => {
    item
      .children
      .forEach((prop) => {
        arr.push(prop);
      });
  });
  arr.forEach((item, i) => {
    if (i < 11) {
      item.value = parseInt((hex[i * 2] + hex[i * 2 + 1]), 16);
      item.value = (item.value / item.num).toFixed(`${item.num}`.length - 1);
    } else if (i < 22) {
      item.value = parseInt(hex[i + 11], 16);
    } else if (i < 23) {
      item.value = parseInt((hex[i + 11] + hex[i + 12]), 16);
      // item.value = (item.value / item.num).toFixed(`${item.num}`.length - 1);
    } else if (i < 48) {
      let val = hex2b(hex[i + 12]);
      const a = val[0]
      val = val.substring(1, 8)
      let b = `${parseInt( val, 2)}`
      while(b.length < 2) {
        b = `0${b}`
      }
      item.value = `${b}${a}`
    } else if (i < 58) {
      item.value = isOpen[parseInt(hex[i + 12],16)];
    } else if (i < 66) {
      item.value = isRoof[hex[i + 12]];			
    } else if (i < 73) {
      item.value = isY[hex[i + 12]];
    } else if (i < 77) {
      item.value = isY1[hex[i + 12]];
    } else if (i < 78) {
      item.value = isCP8[hex[i + 12]];
    } else if (i < 79) {
      item.value = isAll[hex[i + 12]];
    } else if (i < 80) {
      item.value = isMaster[hex[i + 12]];
    } else if (i < 82) {
      item.value = isClose[hex[i + 12]];
    } else if (i < 83) {
      item.value = isBox[hex[i + 12]];
    } else if (i < 84) {
      item.value = isLayer[hex[i + 12]];
    } else if (i < 85) {
      item.value = isWeight[hex[i + 12]];
    } else if (i < 86) {
      item.value = isJoke[hex[i + 12]];
    } else if (i < 87) {
      item.value = isArrive[hex[i + 12]];
    } else if (i < 88) {
      item.value = parseInt(hex[i + 12], 16);
    } else if (i < 89) {
      item.value = isVip[hex[i + 12]];
    } else if (i < 90) {
      item.value = isClose[hex[i + 12]];
    } else if (i < 91) {
      item.value = fireSwitch[hex[i + 12]];
    } else if (i < 92) {
      item.value = fireSet[hex[i + 12]];
    } else if (i < 93) {
      item.value = fireMode[hex[i + 12]];
    } else if (i < 94) {
      item.value = fireProcess[hex[i + 12]];
    } else if (i < 95) {
      item.value = fireAuto[hex[i + 12]];
    } else if (i < 105) {
      item.value = isClosed[parseInt(hex[i + 12], 16)];
    } else if (i < 111) {
      item.value = isClose[hex[i + 12]];
    } else {
      item.value = hex[i + 12+2*(i - 111)] + hex[i + 12+2*(i - 111)+1] + hex[i + 12+2*(i - 111)+2];
    }
  });
  return ctrlMenu;
}
function parseBuffer(val) {
  if (val && val != 0) {
    let bit = (+val).toString(2);
    while (bit.length < 8) {
      bit = `0${bit}`;
    }
    return bit.split('');
  } else {
    return '00000000'.split('');
  }
}
function parseInfo(event, floors) {
  const name = [
    'closeBtn',
    'openBtn',
    'close',
    'open',
    'lock',
    'run',
    'toDown',
    'toUp',
    'group',
    'parallel',
    'single',
    'full',
    'over',
    'error',
    'lockbd',
    'fire',
    'driver',
    'check',
    'auto',
    'floor',
    'lastCode',
    'lastFloor',
    'lastTime',
  ];
  const obj = {};
  const model = { '01': '单梯', '10': '并联', '100': '群控', '000': '无' };
  const status = ['自动', '检修', '司机', '消防', '锁体', '故障', '超载', '满载'];
  const btn = { '00': '无', '01': '开门', 10: '关门' };
  let floor = '', lastCode = '', lastFloor = '', lastTime= '';
  event.forEach((item, index) => {
    if (index <= 7) {
      obj[name[index]] = parseInt(item);
    }
    if (index > 12 && index <= 23) {
      obj[name[index - 5]] = parseInt(item);
    }
    if (index>=24 && index<=31) {
      floor += `${item}`;
    }
    if (index>=32 && index<=39) {
      lastCode += `${item}`;
    }
    if (index>=40 && index<=47) {
      lastFloor += `${item}`;
    }
    if (index>=48 && index<=79) {
      lastTime += `${item}`;
    }
  });
  const statusBit = [obj.auto, obj.check, obj.driver, obj.fire, obj.lockbd, obj.error, obj.over, obj.full];
  obj.status = statusBit.map((item, index) => (item === 1 ? status[index] : '')).filter(item => item).toString();
  obj.model = model[`0${obj.single}`] || model[`${obj.parallel}0`] || model[`${obj.group}00`];
  obj.btn = btn[`${obj.closeBtn}${obj.openBtn}`];
  obj.floor = floors.length ? floors[floors.length-parseInt( floor, 2)-2]:parseInt( floor, 2);
  obj.lastCode = parseInt( floor, 2);
  obj.lastFloor = parseInt( floor, 2);
  obj.lastTime = parseInt( floor, 2);
  obj.upCall = []
  obj.downCall = []
  return obj;
}
function parseMsg(event, floors) {
  const name = [
    'closeBtn',
    'openBtn',
    'close',
    'open',
    'lock',
    'run',
    'toDown',
    'toUp',
    'group',
    'parallel',
    'single',
    'full',
    'over',
    'error',
    'lockbd',
    'fire',
    'driver',
    'check',
    'auto',
    'upCall',
    'downCall',
    'register',
    'floor',
    'height',
    'speed'
  ];
  const obj = {};
  const model = { '01': '单梯', '10': '并联', '100': '群控', '000': '无' };
  const status = ['自动', '检修', '司机', '消防', '锁体', '故障', '超载', '满载'];
  const btn = { '00': '无', '01': '开门', 10: '关门' };
  let upCall = [], downCall = [], register = [], real = '',height='', speed = '';
  
  event.forEach((item, index) => {
    if (index <= 7) {
      obj[name[index]] = parseInt(item);
    }
    if (index > 12 && index <= 23) {
      obj[name[index - 5]] = parseInt(item);
    }
    if (index>=24 && index<=87) {
      const idx = index - 24
      upCall[parseInt(idx/8)*8 + Math.abs(idx%8-8) -1] = item
    }
    if (index>=88 && index<=151) {
      const idx = index - 88
      downCall[parseInt(idx/8)*8 + Math.abs(idx%8-8) -1] = item
    }
    if (index>=152 && index<=215) {
      const idx = index - 152
      register[parseInt(idx/8)*8 + Math.abs(idx%8-8) -1] = item
    }
    if (index>=216 && index<=223) {
      real += String(item)
    }
    if (index>=224 && index<=247) {
      height += String(item)
    }
    if (index>=248 && index<=263) {
      speed += String(item)
    }
  });
  const statusBit = [obj.auto, obj.check, obj.driver, obj.fire, obj.lockbd, obj.error, obj.over, obj.full];
  obj.status = statusBit.map((item, index) => (item === 1 ? status[index] : '')).filter(item => item).toString();
  obj.model = model[`0${obj.single}`] || model[`${obj.parallel}0`] || model[`${obj.group}00`];
  obj.btn = btn[`${obj.closeBtn}${obj.openBtn}`];
  obj.upCall = upCall.map((item, index) => parseInt(item) == 1 ? index : null).filter(item=>item!=null).map(item=>floors[item-1]||'').filter(val=>val != '')
  obj.downCall = downCall.map((item, index) => parseInt(item) == 1 ? index : null).filter(item=>item!=null).map(item=>floors[item-1]||'').filter(val=>val != '')
  obj.register = register.map((item, index) => parseInt(item) == 1 ? index : null).filter(item=>item!=null).map(item=>floors[item-1]||'').filter(val=>val != '')
  obj.floor = floors[floors.length - parseInt(real, 2)]
  obj.height = (parseInt(height, 2)/1000).toFixed(2)
  obj.speed = (parseInt(speed, 2)/1000).toFixed(2)
  return obj;
}
export default {
  namespace: 'ctrl',
  state: {
    device: [],
    status: 0,
    list: [],
    menu: ctrlMenu,
    ws: null,
    debugWs: null,
    debugList: [],
    hbp: [],
    door: [],
    floorMax: 0,
    floors:[],
    event: {
    },
    eventList: [],
    property: {},
    wave: [],
    interval: 1000,
    waveList: [],
    view: 0,
    electric: null,
    option: localStorage.getItem('option') ? JSON.parse(localStorage.getItem('option')) : {},
    switchLoading: false,
    loadingMore: false,
  },
  effects: {
    *option({
      payload,
    }, { put }) {
      yield put({ type: 'changeOption', payload: payload.option });
    },
    *fetch({
      payload,
    }, { call, put, select }) {
      const option = yield select(state => state.ctrl.option);
      let params = payload;
      if (!payload.bounds && option.bounds) {
        params = {
          ...payload,
          ...option.bounds,
        };
      }
      const response = yield call(getDeviceList, params);
      if (response.code === 0) {
        const now = new Date().getTime();
        const list = response
          .data
          .list
          .map((item) => {
            if (!item.updateTime) {
              item.isLoss = true;
              return item;
            }
            if (now - item.updateTime > 120000) {
              item.isLoss = true;
            } else {
              item.isLoss = false;
            }
            if (item.deviceId.indexOf('test') !== -1) {
              item.isLoss = false;
              item.Alert = '0';
            }
            return item;
          });
        yield put({ type: 'queryList', payload: list });
      } else {
        // notification.error({   message: '错误',   description: '读取失败', });
      }
    },
//     *info({
//       payload,
//     }, { call, put }) {
//       const response = yield call(getDeviceInfo, payload.id);
//       if (response.code === 0) {
//         const property = array2obj(response.data.list);
//         let arr = [];
//         if (property.Event) {
//           const buffer = base64url.toBuffer(property.Event.value);
//           buffer.forEach((item) => {
//             arr = arr.concat(parseBuffer(item));
//           });
//           property.updateTime = property.Event.updateTime
//         }
//         const event = parseInfo(arr, []);
//         let floorMax = 0, floors = [];
//         if (property.MaxFloorNum && property.MaxFloorNum.value && parseInt(property.MaxFloorNum.value)!=0) {
//           floorMax = parseInt(property.MaxFloorNum.value);
//         }
//         if (property.FloorNames && property.FloorNames.value.match(/\d+/g)) {
//           const floorsStr = property.FloorNames.value;
//           const l = floorsStr.length/3;
//           for (let i = 0; i < l; i++) {
//             floors.push((`${floorsStr[i*3]}${floorsStr[i*3+1]}${floorsStr[i*3+2]}`).trim())
//           }
//         }else {
//           floors = new Array(floorMax).fill(0).map((item, index)=> 1+index)
//         }
//         event.floor = floors[event.floor-1];
//         yield put({
//           type: 'getInfo',
//           payload: {
//             device: property,
//             property,
//             event,
//             floors: floors.reverse(),
//             floorMax,
//           },
//         });
//       } else {
//         // notification.error({   message: '错误',   description: '读取失败', });
//       }
//     },
//     *socket({
//       payload,
//     }, { put, select }) {
//       const event = yield select(state => state.ctrl.event);
//       const data = {
//         deviceId: payload.id,
//         delay: 0,
//         interval: 100,
//         duration: 30,
//         monitorId: payload.monitorId,
//       };
//       event.startId = -1;
//       yield ws = new WebSocket(`${wsApi}?${stringify(data)}`);
//       yield put({ type: 'setWs',
//         payload: {
//           ws,
//           event,
//         } });
//     },
    *debug({
      payload,
    }, { put, select }) {
      const event = yield select(state => state.ctrl.event);
			const device_id = payload.id
			getFollowDevices({device_id}).then((res)=>{
				if(res.code == 0){
					const op = 'open';
					const IMEI = res.data.list[0].IMEI;
					const interval = 100;
					const threshold = 50;
					const duration = 30;
					const device_type = '240';
					const type = '1';
					const segment = payload.base;
					const address = payload.offsets;
					postMonitor({ op, IMEI, interval, threshold, duration, device_type, type, segment, address}).then((res) => {});
				}
			})
      const data = {
        deviceId: payload.id,
      };
      yield ws = new WebSocket(`${wsDebug}?${stringify(data)}`);
      yield put({ type: 'setDebugWs',
        payload: {
          ws,
        } });
    },
    *debugMs({ payload }, { put, select }) {
			console.log("yes")
      const debugList = yield select(state => state.ctrl.debugList);
      const property = payload.data;
      const start = parseInt(property.id);
      const count = parseInt(property.length);
      const end = debugList.length ? debugList[debugList.length - 1].startId : -1;
      if (start + count <= end) return;
      if (property.data) {
        const buffer = base64url.toBuffer(property.data);
				console.log(buffer)
        for (let index = 0; index < count; index++) {
          if ((start + index) > end) {
            const debugBuffer = buffer.slice(index * 8, (index + 1) * 8);
            let arr = [];
            debugBuffer.forEach((item) => {
              item = item.toString(16)
              item.length == 1 ? item = `0${item}`: null;
              arr = arr.concat(item);
            });
            const obj = {
              startId: start + index,
              data: arr,
            };
            debugList.push(obj);
          }
        }
      }
      yield put({
        type: 'getDebug',
        payload: {
          debugList: debugList,
        },
      });
    },
    *play({ payload }, { put, select }) {
      const property = yield select(state => state.ctrl.property);
      yield put({
        type: 'playEvent',
        payload: {
          event: payload.event,
          isConcat: payload.isConcat,
          eventList: payload.eventList,
          property: payload.property ?payload.property :property,
        },
      });
    },
    *message({ payload }, { put, select }) {
      const eventList = yield select(state => state.ctrl.eventList);
      const floors = yield select(state => state.ctrl.floors);
      const property = payload.data;
      const start = parseInt(property.StartId);
      const count = parseInt(property.Count);
      const end = eventList.length ? eventList[eventList.length - 1].startId : -1;
      if (start + count <= end) return;
      if (property.Events) {
        const buffer = base64url.toBuffer(property.Events);
        for (let index = 0; index < count; index++) {
          if ((start + index) > end) {
            const eventBuffer = buffer.slice(index * 33, (index + 1) * 33);
            let arr = [];
            eventBuffer.forEach((item) => {
              arr = arr.concat(parseBuffer(item));
            });
            const obj = parseMsg(arr, floors);
            obj.startId = start + index;
            eventList.push(obj);
          }
        }
      }
      yield put({
        type: 'getDoor',
        payload: {
          events: eventList,
        },
      });
    },
    *menu({
      payload,
    }, { call, put }) {
      const response = yield call(getFileData, payload.id);
      var arr = [];
			var a=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},];
      var buffer = [];
      if (response.code === 0) {
      	for(let i=0;i<response.data.totalNumber;i++){
      		if(response.data.list[i].type ==8196){
						a[0] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8197){
						a[1] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8198){
						a[2] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8199){
						a[3] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8200){
						a[4] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8201){
						a[5] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8202){
						a[6] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8203){
						a[7] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8204){
						a[8] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8205){
						a[9] = base64url.toBuffer(response.data.list[i].data);
      		}else if(response.data.list[i].type == 8206){
						a[10] = base64url.toBuffer(response.data.list[i].data);
      		}
      	}
				for(let i=0;i<11;i++){
					a[i] =Array.from(a[i])
					buffer = buffer.concat(a[i])
				}
      	yield put({ type: 'getMenu', payload: parseMenu(buffer, payload.type) });				
      }
    },
    *changeView({
      payload,
    }, { put }) {
      yield put({
        type: 'chgView',
        payload,
      });
    },
  },
  reducers: {
    chgView(state, { payload }) {
      return {
        ...state,
        view: payload,
      };
    },
    changeOption(state, { payload }) {
      localStorage.setItem('option', JSON.stringify(payload));
      return {
        ...state,
        option: payload,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
//     getInfo(state, { payload }) {
//       return {
//         ...state,
//         device: payload.device,
//         event: payload.event,
//         wave: state.wave.concat(payload.event),
//         property: payload.property,
//         floorMax: payload.floorMax,
//         floors: payload.floors,
//       };
//     },
    getDoor(state, action) {
      return {
        ...state,
        eventList: action.payload.events,
      };
    },
    getDebug(state, action) {
      return {
        ...state,
        debugList: action.payload.debugList,
      };
    },
    playEvent(state, action) {
      if (action.payload.isConcat) {
        return {
          ...state,
          event: action.payload.event,
          eventList: action.payload.eventList,
          property: action.payload.property
        };
      } else {
        return {
          ...state,
          event: action.payload.event,
          eventList: action.payload.eventList,
          property: action.payload.property
        };
      }
    },
    setWs(state, { payload }) {
      return {
        ...state,
        ws: payload.ws,
        event: payload.event,
        eventList: [],
      };
    },
    setDebugWs(state, { payload }) {
      return {
        ...state,
        debugWs: payload.ws,
        debugList: []
      };
    },
    getMenu(state, action) {
      return {
        ...state,
        menu: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/:name/:sub?/:sec?').exec(pathname);
        if (match && match[1] !== 'map' && match[1] !== 'list' && match[1] !== 'company') {
          dispatch({
            type: 'info',
            payload: {
              id: match[2],
            },
          });
        }
        if (match && match[3] === 'params') {
          dispatch({
            type: 'menu',
            payload: {
              id: match[2],
            },
          });
        }
      });
    },
  },
};
