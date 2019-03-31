import {
	createElement
} from 'react';
import dynamic from 'dva/dynamic';
import {
	getMenuData
} from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
	// eslint-disable-next-line
	!app._models.some(({
		namespace
	}) => {
		return namespace === model.substring(model.lastIndexOf('/') + 1);
	})
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
	// () => require('module')
	// transformed by babel-plugin-dynamic-import-node-sync
	if (component.toString().indexOf('.then(') < 0) {
		models.forEach((model) => {
			if (modelNotExisted(app, model)) {
				// eslint-disable-next-line
				app.model(require(`../models/${model}`).default);
			}
		});
		return (props) => {
			if (!routerDataCache) {
				routerDataCache = getRouterData(app);
			}
			return createElement(component().default, {
				...props,
				routerData: routerDataCache,
			});
		};
	}
	// () => import('module')
	return dynamic({
		app,
		models: () => models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
		// add routerData prop
		component: () => {
			if (!routerDataCache) {
				routerDataCache = getRouterData(app);
			}
			return component().then((raw) => {
				const Component = raw.default || raw;
				return props => createElement(Component, {
					...props,
					routerData: routerDataCache,
				});
			});
		},
	});
};

function getFlatMenuData(menus) {
	let keys = {};
	menus.forEach((item) => {
		if (item.children) {
			keys[item.path] = { ...item
			};
			keys = { ...keys,
				...getFlatMenuData(item.children)
			};
		} else {
			keys[item.path] = { ...item
			};
		}
	});
	return keys;
}
export const getRouterData = (app) => {
	const routerConfig = {
		'/': {
			component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
		},
		'/home': {
			name: '首页',
			component: dynamicWrapper(app, [], () => import('../routes/Home')),
		},
		'/message': {
			name: '消息',
			component: dynamicWrapper(app, ['message'], () => import('../routes/Message/Index')),
		},
		'/radar/map': {
			name: '地图列表',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Map')),
		},
		'/radar/default': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/DefaultMap')),
		},
		'/radar/cabinet': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Map')),
		},
		'/radar/list': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/all': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/run': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/bug': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/loss': {
			name: '雷达',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/door/:id': {
			name: '运行状态',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Detail')),
		},
		'/radar/:id/info': {
			name: '运行状态',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Info')),
		},
		'/door/:id/realtime': {
			name: '控制器',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Realtime')),
		},
		'/door/:id/params/:type': {
			name: '菜单',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Params')),
		},
		'/door/:id/history/:type': {
			name: '控制器',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/History')),
		},
		'/company/door/:id/fault': {
			name: '历史故障',
			component: dynamicWrapper(app, [], () => import('../routes/Radar/DoorFault')),
		},
		'/company/:id/map': {
			name: '地图',
			component: dynamicWrapper(app, [], () => import('../routes/Radar/Map')),
		},
		'/events/:type/:id/': {
			name: '历史事件',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Event')),
		},
		'/ctrl/:id': {
			name: '运行状态',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/Ctrl')),
		},
		'/ctrl/:id/realtime': {
			name: '控制柜',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlRealtime')),
		},
		//     '/ctrl/:id/history/:type': {
		//       name: '控制柜',
		//       component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlHistory')),
		//     },
		'/company/debug/:id': {
			name: '内存查看',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Company/Debug')),
		},
		'/company/:id/call': {
			name: '呼梯',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CallLadder')),
		},
		'/ctrl/:id/params': {
			name: '菜单',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlParams')),
		},
		'/ctrl/:id/fault': {
			name: '历史故障',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlFault')),
		},
		'/ctrl/:id/register': {
			name: '控制柜',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Register')),
		},
		'/ctrl/:id/io': {
			name: '控制柜',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/IO')),
		},
		'/ctrl/:id/roof': {
			name: '控制柜',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Roof')),
		},
		'/ctrl/:id/version': {
			name: '控制柜',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Version')),
		},
		'/ctrl/:id/bug': {
			name: '控制柜',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Bug')),
		},
		'/ctrl/:id/driver': {
			name: '控制柜',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Driver')),
		},
		'/tech/code': {
			name: '技术',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Index')),
		},
		'/tech/manual': {
			name: '技术',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Manual')),
		},
		'/tech/reader/:id': {
			name: '说明书',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Reader')),
		},
		'/tech/other': {
			name: '技术',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Other')),
		},
		'/service': {
			name: '消息',
			component: dynamicWrapper(app, [], () => import('../routes/Service/Index')),
		},
		'/me': {
			name: '个人',
			component: dynamicWrapper(app, ['company', 'login'], () => import('../routes/Company/Index')),
		},
		'/company/new': {
			name: '新建群',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/NewGroup')),
		},
		'/company/join': {
			name: '加入群',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/JoinGroup')),
		},
		'/company/profile': {
			name: '个人信息',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/Profile')),
		},
		'/company/revise': {
			name: '修改信息',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Revise')),
		},
		'/company/statistics/:id': {
			name: '数据统计',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/Statistics')),
		},
		'/company/statistics/details/:id': {
			name: '数据统计',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/StatisticsDetail')),
		},
		'/company/data/details': {
			name: '统计详情',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/Details')),
		},
		'/company/device': {
			name: '设备关注',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/Device')),
		},
		'/company/device': {
			name: '设备管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Device')),
		},
		'/company/followdoor/all/': {
			name: '门机管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followdoor/online/': {
			name: '门机管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followdoor/offline/': {
			name: '门机管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followdoor/longoffline/': {
			name: '门机管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/all/': {
			name: '控制柜管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/online/': {
			name: '控制柜管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/offline/': {
			name: '控制柜管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/longoffline/': {
			name: '控制柜管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/edit-device/:IMEI/': {
			name: '编辑设备',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/EditDevice')),
		},
		'/company/manage-device': {
			name: '设备管理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/ManageDevice')),
		},
		'/company/message': {
			name: '消息处理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Message')),
		},
		'/company/work-order': {
			name: '工单处理',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/WorkOrder')),
		},
		'/order/:id': {
			name: '工单详情',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Fault')),
		},
		'/company/follow/:IMEI': {
			name: '关注设备',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Follow')),
		},
		'/exception/403': {
			component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
		},
		'/exception/404': {
			component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
		},
		'/exception/500': {
			component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
		},
		'/login/': {
			name: '登录',
			component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
		},
		'/register/': {
			name: '注册',
			component: dynamicWrapper(app, ['login'], () => import('../routes/User/Register')),
		},
		'/resetting/': {
			name: '忘记密码',
			component: dynamicWrapper(app, ['login'], () => import('../routes/User/Resetting')),
		},
		'/user': {
			component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
		},
		'/user/profile': {
			name: '个人信息',
			component: dynamicWrapper(app, ['user'], () => import('../routes/User/Profile')),
		},
		'/profile': {
			name: '个人信息',
			component: dynamicWrapper(app, ['user'], () => import('../routes/User/Profile')),
		},
		'/question': {
			name: '问题反馈',
			component: dynamicWrapper(app, [], () => import('../routes/Question/Index')),
		},
		'/test': {
			name: '测试',
			component: dynamicWrapper(app, [], () => import('../routes/Company/Test')),
		},
	};
	// Get name from ./menu.js or just set it in the router data.
	const menuData = getFlatMenuData(getMenuData());
	const routerData = {};
	Object.keys(routerConfig).forEach((item) => {
		const menuItem = menuData[item.replace(/^\//, '')] || {};
		routerData[item] = {
			...routerConfig[item],
			name: routerConfig[item].name || menuItem.name,
			authority: routerConfig[item].authority || menuItem.authority,
		};
	});
	return routerData;
};
