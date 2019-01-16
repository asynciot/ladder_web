import { message } from 'antd';
import { accountLogin, accountLogout, register, getCaptcha, retrieve } from '../services/api';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      console.log(1);
      
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority: 'admin',
          },
        });
        yield message.success(
          '登录成功',
          1,
          () => {
            localStorage.setItem('userId', response.account.id);
            window.location.reload();
          },
        );
      } else {
        message.error('登录失败');
      }
    },
    *register({ payload }, { call, put }) {
      const params = Object.assign({ username: payload.username }, payload);
      const response = yield call(register, params);
      if (response.code === 0) {
        const msg = message.success(
          '注册成功，正在登录...',
          0,
        );
        yield setTimeout(msg, 500);
        yield put({
          type: 'login',
          payload: {
            username: payload.username,
            password: payload.password,
          },
        });
      } else if (response.code === 613){
        message.error('该账号已注册');
      } else {
        message.error('注册失败');
      } 
    },
		*retrieve({ payload }, { call, put }) {
			const params = Object.assign({ username: payload.username }, payload);
			const response = yield call(retrieve, params);
			if (response.code === 0) {
				const msg = message.success(
					'密码修改成功，正在登录...',
					0,
				);
				yield setTimeout(msg, 500);
				yield put({
					type: 'login',
					payload: {
						username: payload.username,
						password: payload.newpassword,
					},
				});
			}else {
				message.error('密码修改失败');
			}
		},
    *captcha({ payload }, { call, put }) {
      const response = yield call(getCaptcha, payload.mobile);
      if (response.code === 0) {
        yield message.success('发送成功');
      } else {
        message.error('发送失败');
      }
    },
    *logout({ payload }, { call, put }) {
      yield call(accountLogout, {});
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      localStorage.removeItem('companyId');
      window.location.reload();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
