import {createElement} from 'react';
import dynamic from 'dva/dynamic';
import {getMenuData} from './menu';

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
			name2: 'Home',
			component: dynamicWrapper(app, [], () => import('../routes/Home')),
		},
		'/radar/map': {
			name: '地图列表',
			name2: 'Map List',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Map')),
		},
		'/radar/default': {
			name: '雷达',
			name2: 'Radar',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/DefaultMap')),
		},
		'/radar/cabinet': {
			name: '雷达',
			name2: 'Radar',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Map')),
		},
		'/radar/list': {
			name: '雷达',
			name2: 'Radar',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/all': {
			name: '雷达',
			name2: 'Radar',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/run': {
			name: '雷达',
			name2: 'Radar',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/radar/list/loss': {
			name: '雷达',
			name2: 'Radar',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/List')),
		},
		'/door/:id': {
			name: '运行状态',
			name2: 'Operation State',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Detail')),
		},
		'/door/:id/realtime': {
			name: '控制器',
			name2: 'Door',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Realtime')),
		},
		'/door/:id/params/:type': {
			name: '菜单',
			name2: 'Menu',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Params')),
		},
		'/door/:id/history/:type': {
			name: '控制器',
			name2: 'Door',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/History')),
		},
		'/ladder/:id': {
			name: '电梯',
			name2: 'Ladder',
			component: dynamicWrapper(app, [], () => import('../routes/Radar/LadderRealtime')),
		},
		'/company/door/:id': {
			name: '历史故障',
			name2: 'History Fault',
			component: dynamicWrapper(app, [], () => import('../routes/Radar/DoorFault')),
		},
		'/company/:id/map': {
			name: '地图',
			name2: 'Map',
			component: dynamicWrapper(app, [], () => import('../routes/Radar/Map')),
		},
		'/events/:type/:id/': {
			name: '历史事件',
			name2: 'History Event',
			component: dynamicWrapper(app, ['device'], () => import('../routes/Radar/Event')),
		},
		'/ctrl/:id': {
			name: '运行状态',
			name2: 'Operation State',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/Ctrl')),
		},
		'/ctrl/:id/realtime': {
			name: '控制柜',
			name2: 'Ctrl',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlRealtime')),
		},
		'/company/debug/:id': {
			name: '内存查看',
			name2: 'Memory Debugging',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Company/Debug')),
		},
		'/company/:id/call': {
			name: '呼梯',
			name2: 'Call',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/Call')),
		},
		'/ctrl/:id/params': {
			name: '菜单',
			name2: 'Menu',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlParams')),
		},
		'/ctrl/:id/fault': {
			name: '历史故障',
			name2: 'History Fault',
			component: dynamicWrapper(app, ['ctrl'], () => import('../routes/Radar/CtrlFault')),
		},
		'/tech/code': {
			name: '技术',
			name2: 'Tech',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Index')),
		},
		'/tech/manual': {
			name: '技术',
			name2: 'Tech',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Manual')),
		},
		'/tech/reader/:id': {
			name: '说明书',
			name2: 'Instructions',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Reader')),
		},
		'/tech/other': {
			name: '技术',
			name2: 'Tech',
			component: dynamicWrapper(app, ['tech'], () => import('../routes/Tech/Other')),
		},
		'/me': {
			name: '个人',
			name2: 'Person',
			component: dynamicWrapper(app, ['company', 'login'], () => import('../routes/Company/Index')),
		},
		'/company/revise': {
			name: '修改信息',
			name2: 'Revise',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Revise')),
		},
		'/company/statistics/:id': {
			name: '数据统计',
			name2: 'Statistics',
			component: dynamicWrapper(app, ['company'], () => import('../routes/Company/Statistics')),
		},
		'/company/ladder/all': {
			name: '电梯管理',
			name2: 'Manage Elevator',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Ladder')),
		},
		'/company/ladder/online': {
			name: '电梯管理',
			name2: 'Manage Elevator',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Ladder')),
		},
		'/company/ladder/longoffline': {
			name: '电梯管理',
			name2: 'Manage Elevator',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Ladder')),
		},
		'/company/ladder/:id': {
			name: '电梯信息',
			name2: 'Elevator Information',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/LadderInfo')),
		},
		'/company/followdoor/all/': {
			name: '门机管理',
			name2: 'Manage Door',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followdoor/online/': {
			name: '门机管理',
			name2: 'Manage Door',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followdoor/offline/': {
			name: '门机管理',
			name2: 'Manage Door',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followdoor/longoffline/': {
			name: '门机管理',
			name2: 'Manage Door',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/all/': {
			name: '控制柜管理',
			name2: 'Manage Ctrl',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/online/': {
			name: '控制柜管理',
			name2: 'Manage Ctrl',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/offline/': {
			name: '控制柜管理',
			name2: 'Manage Ctrl',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/followctrl/longoffline/': {
			name: '控制柜管理',
			name2: 'Manage Ctrl',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/FollowDevice')),
		},
		'/company/edit-device/:id/': {
			name: '编辑设备',
			name2: 'Edit Device',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/EditDevice')),
		},
		'/company/message': {
			name: '消息处理',
			name2: 'Manage Message',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Message')),
		},
		'/company/work-order': {
			name: '工单处理',
			name2: 'Manage Order',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/WorkOrder')),
		},
		'/company/order/:id': {
			name: '工单详情',
			name2: 'Order Details',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Fault')),
		},
		'/company/order/code/:id': {
			name: '故障详情',
			name2: 'Fault Details',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/OrderCode')),
		},
		'/company/follow/:IMEI': {
			name: '关注设备',
			name2: 'Follow',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Follow')),
		},
		'/company/add': {
			name: '加入群组',
			name2: 'Add Group',
			component: dynamicWrapper(app, ['company', 'user'], () => import('../routes/Company/Organize')),
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
			name2: 'Login',
			component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
		},
		'/register/': {
			name: '注册',
			name2: 'Register',
			component: dynamicWrapper(app, ['login'], () => import('../routes/User/Register')),
		},
		'/resetting/': {
			name: '忘记密码',
			name2: 'Resetting',
			component: dynamicWrapper(app, ['login'], () => import('../routes/User/Resetting')),
		},
		'/user': {
			component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
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
