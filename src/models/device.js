import pathToRegexp from 'path-to-regexp';
import { notification } from 'antd';
import base64url from 'base64url';
import { stringify } from 'qs';
import { api } from '../utils/request';
import {
	getDeviceList,
	getDeviceInfo,
	getFileData,
} from '../services/api';
import { menuT, menuB } from '../menu.js';

let ws = null;
const wsApi = `${api.replace('http', 'ws')}/devices/socket`;

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
function parseMenu(buffer, type) {
  const arr = [];
  const hex = buffer2hex(buffer);
  let menu = type == 1 ? menuT : menuB
  menu.forEach((item) => {
    item
      .children
      .forEach((prop) => {
        arr.push(prop);
      });
  });
  arr.forEach((item, i) => {
    if (type == 1) {
      if (i < 86) {
        item.value = parseInt((hex[i * 2] + hex[i * 2 + 1]), 16);
        item.value = (item.value / item.num).toFixed(`${item.num}`.length - 1);
      } else {
        item.value = parseInt(hex[i + 86], 16);
      }
    }else {
      item.value = parseInt((hex[i * 2] + hex[i * 2 + 1]), 16);
      item.value = (item.value / item.num).toFixed(`${item.num}`.length - 1);
    }
    
  });
  return menu;
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

function parseEvent(event) {
  const name = [
    'openIn',
    'closeIn',
    'openTo',
    'closeTo',
    'openSlow',
    'closeSlow',
    'openToOut',
    'closeToOut',
    'door',
    'open',
    'close',
    'openKeep',
    'closeKeep',
    'stop',
    'inHigh',
    'inLow',
    'outHigh',
    'motorHigh',
    'flySafe',
    'closeStop',
  ];
  const obj = {};
  let position = '';
  let current = '';
  let speed = '';
  event.forEach((item, index) => {
    if (name[index]) {
      obj[name[index]] = parseInt(item);
    } else if (index > 19 && index <= 31) {
      position += `${item}`;
    } else if (index > 31 && index <= 47) {
      current += `${item}`;
    } else if (index > 47 && index <= 63) {
      speed += `${item}`;
    }
  });
  obj.position = parseInt(position, 2);
  obj.current = (parseInt(current, 2) / 1000).toFixed(3);
  obj.speed = ((parseInt(speed, 2) << 16 >> 16) / 1000).toFixed(3);
  
  return obj;
}
export default {
  namespace: 'device',
  state: {
    device: [],
    status: 0,
    list: [],
    menu: menuT,
    ws: null,
    hbp: [],
    door: [],
    doorWidth: 4096,
    event: {},
	events:{
		openIn:[],
		closeIn:[],
		current:[],
		openToOut:[],
		openTo:[],
		closeToOut:[],
		closeTo:[],
		door:[],
		open:[],
		close:[],
		openKeep:[],
		closeKeep:[],
		stop:[],
		inHigh:[],
		inLow:[],
		outHigh:[],
		motorHigh:[],
		flySafe:[],
		closeStop:[],
		position:[],
		speed:[],
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
    deviceInfo:{
    	deviceid:'',
    }
  },
  effects: {
    *option({payload,}, { put }) {
      yield put({ type: 'changeOption', payload: payload.option });
    },
    *fetch({payload,}, { call, put, select }) {
        const now = new Date().getTime();
    },
    *socket({ payload, }, { put, select }) {
      const event = yield select(state => state.device.event);
      const data = {
        deviceId: payload.id,
        delay: 0,
        interval: 100,
        duration: 30,
        monitorId: payload.monitorId,
      };
      event.startId = -1;
      yield ws = new WebSocket(`${wsApi}?${stringify(data)}`);
      yield put({ type: 'setWs',
        payload: {
          ws,
          event,
        } });
    },
    *play({ payload }, { put, select }) {
      const property = yield select(state => state.device.property);
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
    *menu({
      payload,
    }, { call, put }) {
      const response = yield call(getFileData, payload.id);
			var arr = '';
			var buf = ['','','','','',''];
			var buffer = [];
      if (response.code === 0) {
				for(let i=0;i<response.data.totalNumber;i++){
					if(response.data.list[i].type ==4099){
						buf[0] = response.data.list[i].data;
					}else if(response.data.list[i].type == 4100){
						buf[1] = response.data.list[i].data;
					}else if(response.data.list[i].type == 4101){
						buf[2] = response.data.list[i].data;
					}else if(response.data.list[i].type == 4102){
						buf[3] = response.data.list[i].data;
					}else if(response.data.list[i].type == 4103){
						buf[4] = response.data.list[i].data;
					}else if(response.data.list[i].type == 4104){
						buf[5] = response.data.list[i].data;
					}
				}
				arr = buf[0]+buf[1]+buf[2]+buf[3]+buf[4]+buf[5]				
				buffer = base64url.toBuffer(arr)
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
		getHbp(state, action) {
		  return {
			...state,
			hbp: action.payload,
		  };
		},
		queryList(state, action) {
		  return {
			...state,
			list: action.payload,
		  };
		},
		getInfo(state, { payload }) {
		  return {
			...state,
			device: payload.device,
			event: payload.event,
			wave: state.wave.concat(payload.event),
			property: payload.property,
			doorWidth: payload.doorWidth,
		  };
		},
		getDoor(state, action) {
		  return {
			...state,
			eventList: action.payload.events,
		  };
		},
		playEvent(state, action) {
		  if (action.payload.isConcat) {
			return {
			  ...state,
			  event: action.payload.event,
			  wave: state.wave.concat(action.payload.event),
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
		getMenu(state, action) {
		  return {
			...state,
			menu: action.payload,
		  };
		},
		getElectric(state, action) {
		  return {
			...state,
			electric: action.payload,
		  };
		},
		getWave(state, action) {
		  return {
			...state,
			wave: action.payload.list,
			interval: action.payload.interval,
		  };
		},
		getWaveList(state, action) {
		  return {
			...state,
			waveList: action.payload,
		  };
		},
		follow(state, action){
			return{
				...state,
			currentUser: action.payload,
			};
		},
	  },
	  subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(({ pathname }) => {
			const match = pathToRegexp('/:name/:sub?/:sec?/:end?').exec(pathname);
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
				  type: match[4],
				},
			  });
			}
			if (match && match[3] === 'history') {
			  dispatch({
				type: 'waveList',
				payload: {
				  id: match[2],
				  refresh: false,
				},
			  });
			}
		  });
		},
	},
};
