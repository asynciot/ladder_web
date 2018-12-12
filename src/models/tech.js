import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { errorCode } from '../services/api';

export default {
  namespace: 'tech',

  state: {
    model: [],
    list: [],
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(errorCode, payload);
      if (response.code === 0 && payload === undefined) {
        const model = response.data.list.map(item => ({
          label: item.ctrlType,
          value: item.ctrlType,
        }));
        yield put({
          type: 'queryResult',
          payload: {
            model,
          },
        });
      }
      if (response.code === 0 && payload && payload.type) {
        yield put({
          type: 'queryResult',
          payload: {
            list: response.data.list,
          },
        });
      }
      if (response.code === 0 && payload && payload.name) {
        yield put({
          type: 'queryResult',
          payload: {
            list: response.data.list,
          },
        });
      }
      if (response.code !== 0) {
        yield put({
          type: 'queryResult',
          payload: {
            list: [],
          },
        });
      }
    },
  },

  reducers: {
    queryResult(state, { payload }) {
      if (payload.model) {
        return {
          ...state,
          model: payload.model,
        };
      }
      if (payload.list) {
        return {
          ...state,
          list: payload.list,
        };
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/tech/:sub?/:sec?').exec(pathname);
        if (match && match[1] === 'code') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
};
