import pathToRegexp from 'path-to-regexp';
import { queryMessage, rejectApply, acceptApply } from '../services/api';

export default {
  namespace: 'message',

  state: {
    list: [],
  },

  effects: {
    *fetch({
      payload,
    }, { call, put }) {
      const res = yield call(queryMessage, payload);
      if (res.code === 0) {
        yield put({
          type: 'list',
          payload: res.data.list,
        });
      }
    },
    *reject({
      payload,
    }, { call, put }) {
      const res = yield call(rejectApply, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetch',
          payload: {
            page: 1,
            num: 20,
          },
        });
      }
    },
    *accept({
      payload,
    }, { call, put }) {
      const res = yield call(acceptApply, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetch',
          payload: {
            page: 1,
            num: 20,
          },
        });
      }
    },
  },

  reducers: {
    list(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/message/:sub?').exec(pathname);
        if (match) {
          dispatch({
            type: 'fetch',
            payload: {
              page: 1,
              num: 20,
            },
          });
        }
      });
    },
  },
};
