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
			const response = yield call(accountLogin, payload);
			const la = window.localStorage.getItem("language");
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
				if(la=="zh"){
					yield message.success(
						'登录成功',
						1,
						() => {
							localStorage.setItem('userId', response.account.id);
							window.location.reload();
						},
					);
				}else{
					yield message.success(
						'Login success',
						1,
						() => {
							localStorage.setItem('userId', response.account.id);
							window.location.reload();
						},
					);
				}
			} else {
				if(la == "zh"){
					message.error('登录失败');
				}else{
					message.error('Login failed');
				}
			}
		},
		*register({ payload }, { call, put }) {
			const params = Object.assign({ username: payload.username }, payload);
			const response = yield call(register, params);
			if (response.code === 0) {
				if(la == "zh"){
					const msg = message.success(
						'注册成功，正在登录...',
						0,
					);
				}else{
					const msg = message.success(
						'success，logining...',
						0,
					);
				}
				
				yield setTimeout(msg, 500);
				yield put({
					type: 'login',
					payload: {
						username: payload.username,
						password: payload.password,
					},
				});
			} else if (response.code === 613){
				if(la=="zh"){
					message.error('该账号已注册');
				}else{
					message.error('Account has been registered');
				}
				
			} else {
				if(la=="zh"){
					message.error('注册失败');
				}else{
					message.error('register failed');
				}
			} 
		},
		*retrieve({ payload }, { call, put }) {
			const params = Object.assign({ username: payload.username }, payload);
			const response = yield call(retrieve, params);
			if (response.code === 0) {
				if(la=="zh"){
					const msg = message.success(
						'密码修改成功，正在登录...',
						0,
					);
				}else{
					const msg = message.success(
						'success，login...',
						0,
					);
				}
				yield setTimeout(msg, 500);
				yield put({
					type: 'login',
					payload: {
						username: payload.username,
						password: payload.newpassword,
					},
				});
			}else {
				if(la=="zh"){
					message.error('密码修改失败');
				}else{
					message.error('failed');
				}
				
			}
		},
		*captcha({ payload }, { call, put }) {
			const response = yield call(getCaptcha, payload.mobile);
			if (response.code === 0) {
				if(la=="zh"){
					yield message.success('发送成功');
				}else{
					yield message.success('success');
				}
			} else {
				if(la=="zh"){
					message.error('发送失败');
				}else{
					message.error('failed');
				}
				
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
