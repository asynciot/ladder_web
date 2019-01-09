import { message } from 'antd';
import { queryUsers, queryCurrent, getUser, updateUser } from '../services/api';
import avatar from '../assets/avatar.jpg';

export default {
  namespace: 'user',
  state: {
    list: [],
    currentUser: {
      nicname: '',
      position: '',
      sex: '',
      companyName: '',
      mobile: '',
      portrait: '',
			id:'',
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      if (response.code === 0) {
//         if (!response.data.list[0].portrait) {
//           response.data.list[0].portrait = 'http://server.asynciot.com/getfile?filePath='+response.data.list[0].portrait;
// 				}
        yield put({
          type: 'saveCurrentUser',
          payload: response.data.list[0],
        });
      }
    },
    *updateUser({payload},{call, put, select}) {
      const user = yield select(state => state.user.currentUser);
      const data = Object.assign(updateUser, user);
      const response = yield call(data, payload);
	    if (response.code === 0) {
	    	yield put({
		      type: 'update',
		      payload: data,
        });
        yield put({
		      type: 'fetchCurrent',
		      payload: { id: data.id },
        });
        yield message.success(
          '修改成功',
          1,
        );
	    }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    update(state, action){
    	return{
    		...state,
        currentUser: action.payload,
    	};
    },
    saveCurrentUser(state, action) {
      if (action.payload.companyId) {
        localStorage.setItem('companyId', action.payload.companyId);
      } else if (action.payload.toJoinCompanyId) {
        localStorage.setItem('joinCompanyId', action.payload.companyId);
      }
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
