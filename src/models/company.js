import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { newGroup, joinGroup, readGroup, readCompany, unreadMessage } from '../services/api';

export default {
  namespace: 'company',

  state: {
    group: [],
    list: [],
    company: {},
    unread: 0,
    currentCompany: {
    	errorNumber: '120',
    	alertNumber: '3000',
    	errorMachine: '86',
    	alertMachine: '1800',
    	errorControl: '34',
    	alertControl: '1200',
    },
  },

  effects: {
    *fetch({
      payload,
    }, { call, put, select }) {
      let group = yield select(state => state.company.group);
      const res = yield call(readGroup);
      const id = localStorage.getItem('companyId');
      if (res.code === 0) {
        res.list.forEach((item) => {
          if (item.id !== id) {
            if (group[0]) {
              group[0].children.push({
                label: item.nicname,
                id: item.id,
              });
            }
          }
        });
        yield put({
          type: 'list',
          payload: group,
        });
      }
    },
    *unreadCount({ payload }, { call, put }) {
      const res = yield call(unreadMessage);
      if (res.code === 0) {
        yield put({
          type: 'changeUnreadCount',
          payload: res.count,
        });
      }
    },
    *company({
      payload,
    }, { call, put }) {
      const res = yield call(readCompany, payload);
      if (res.code === 0) {
        const group = [{
          label: res.data.list[0].name,
          id: res.data.list[0].id,
          children: [],
        }];
        yield put({
          type: 'list',
          payload: group,
        });
      }
    },
    *join({
      payload,
    }, { call, put }) {
      const res = yield call(joinGroup, payload);
      if (res.code === 0) {
        yield message.success(
          '已提交加入申请',
          1,
          () => {
            window.history.back();
          },
        );
      }
    },
    *new({
      payload,
    }, { call }) {
      const res = yield call(newGroup, payload);
      if (res.code === 0) {
        yield message.success(
          '已提交创建申请',
          1,
          () => {
            window.history.back();
          },
        );
      }
    },
  },

  reducers: {
    list(state, action) {
      return {
        ...state,
        group: action.payload,
      };
    },
    changeUnreadCount(state, action) {
      return {
        ...state,
        unread: action.payload,
      };
    },
    currentCompany(state, action) {
      return {
        ...state,
        group: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/company/:sub?').exec(pathname);
        if (match && match[1] === 'group') {
          dispatch({
            type: 'company',
            payload: {
              id: localStorage.getItem('companyId'),
              page: 1,
              num: 1,
            },
          }).then(() => {
            dispatch({
              type: 'fetch',
              payload: {
                page: 1,
                num: 20,
              },
            });
            dispatch({
              type: 'unreadCount',
            });
          });
        }
      });
    },
  },
};
