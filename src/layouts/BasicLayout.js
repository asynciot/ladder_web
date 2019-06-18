import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import pathToRegexp from 'path-to-regexp';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData, getMobileData } from '../common/menu';
import MobileHeader from '../components/MobileHeader';
import MobileFooter from '../components/MobileFooter';
import styles from './BasicLayout.less';
import logo from '../assets/logo-menu.png';
import { injectIntl, FormattedMessage } from 'react-intl';
const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
	if (item && item.children) {
		if (item.children[0] && item.children[0].path) {
			redirectData.push({ from: `/${item.path}`, to: `/${item.children[0].path}` });
			item
				.children
				.forEach((children) => {
					getRedirect(children);
				});
		}
	}
};
getMenuData().forEach(getRedirect);

const query = {
	'screen-xs': {
		maxWidth: 575,
	},
	'screen-sm': {
		minWidth: 576,
		maxWidth: 767,
	},
	'screen-md': {
		minWidth: 768,
		maxWidth: 991,
	},
	'screen-lg': {
		minWidth: 992,
		maxWidth: 1199,
	},
	'screen-xl': {
		minWidth: 1200,
	},
};

let isMobile = true;
enquireScreen((b) => {
	isMobile = true;
});

const isWechat = () => {
	const ua = window.navigator.userAgent.toLowerCase();
	// mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
};

class BasicLayout extends React.PureComponent {
	static childContextTypes = {
		location: PropTypes.object,
		breadcrumbNameMap: PropTypes.object,
	}
	state = {
		isMobile,
		isWechat: isWechat(),
	};
	getChildContext() {
		const { location, routerData } = this.props;
		return { location, breadcrumbNameMap: routerData };
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'user/fetchCurrent',
			payload: {
				id: localStorage.getItem('userId'),
			},
		});
		enquireScreen((mobile) => {
			this.setState({ isMobile: true, isWechat: isWechat() });
			dispatch({ type: 'global/isMobile', payload: true });
		});
	}
	getPageTitle() {
		const { routerData, location } = this.props;
		const { pathname } = location;
		let title = '';

		if (routerData[pathname] && routerData[pathname].name) {
			title = routerData[pathname].name;
		} else {
			const match = pathToRegexp('/:name/:id/:sub?/:end?').exec(pathname);
			if (match && match[3]) {
				let path = `/${match[1]}/:id/${match[3]}`;
				if (match[2] === 'statistics' || match[2] === 'follow' || match[2] === 'door' || match[2] === 'speed' || match[2] === 'electric'|| match[2] === 'params') {
					path = `/${match[1]}/${match[2]}/:id`;
				}
				if (match[3] === 'params') {
					match[4] ? path = `/${match[1]}/:id/${match[3]}/:type`: path = `/${match[1]}/:id/${match[3]}`;
				}
				if (match[2] === 'debug') {
					path = `/${match[1]}/${match[2]}/:id`;
				}
				if (match[3] === "details") {
					path = `/${match[1]}/${match[2]}/${match[3]}/:id`;
				}
				if (match[2] === "message") {
					path = `/${match[1]}/${match[2]}/:type`
				}
				if (match[2] === "follow") {
					path = `/${match[1]}/${match[2]}/:IMEI`
				}
				if (match[2] === "followdoor") {
					path = `/company/followdoor/all/`
				}
				if (match[2] === "followctrl") {
					path = `/company/followctrl/all/`
				}
				if (match[2] === "edit-device") {
					path = `/company/edit-device/:IMEI/`
				}
				if (match[1] === "events") {
					path = `/events/:type/:id/`
				}
				if (match[2] === "ladder") {
					path = `/company/ladder/:id`
				}
				if (routerData[path]) {
					title = routerData[path].name;
					if (window.localStorage.getItem("language") == 'en') {title = routerData[path].name2;}
				}
			}
		}
		return title;
	}
	handleMenuClick = ({ key }) => {
		if (key === 'logout') {
			this
				.props
				.dispatch({ type: 'login/logout' });
		}
		if (key === 'profile') {
			this
				.props
				.history
				.push('/profile');
		}
	}
	handleMenuCollapse = (collapsed) => {
		this
			.props
			.dispatch({ type: 'global/changeLayoutCollapsed', payload: collapsed });
	}
	render() {
		const {
			currentUser,
			collapsed,
			fetchingNotices,
			notices,
			match,
			routerData,
			location,
			dispatch,
		} = this.props;
		let isDefault = false;
		const name = pathToRegexp('/:id/:sub?/:name?').exec(location.pathname);
		if (name && name[2] === 'default') {
			isDefault = true;
		}
		const layout = (
			<Layout>
				<Layout>
					{
						<MobileHeader
							showMenu
							collapsed={collapsed}
							onCollapse={this.handleMenuCollapse}
							onMenuClick={this.handleMenuClick}
							{...this.props}
							title={this.getPageTitle()}
						></MobileHeader>
					}
					<Layout className={classNames(styles.content, isDefault ? styles['no-bottom'] : '')}>
						<Content>
							<Switch>
								{getRoutes(match.path, routerData).map(item => (
									<AuthorizedRoute
										isMobile={this.state.isMobile}
										key={item.key}
										path={item.path}
										component={item.component}
										exact={item.exact}
										authority={item.authority}
										redirectPath="/exception/403"
									/>
								))
								}
								{redirectData.map(item => <Redirect key={item.from} exact from={item.from} to={item.to} />)
								}
								<Redirect exact from="/" to="/home" />
								<Route render={NotFound} />
							</Switch>
						</Content>
					</Layout>
					{(this.state.isMobile && !isDefault) && (<MobileFooter current={location.pathname} />)
					}
				</Layout>
			</Layout>
		);

		return (
			<DocumentTitle title={this.getPageTitle()}>
				<ContainerQuery query={query}>
					{params => <div className={classNames(params, styles.container)}>{layout}</div>}
				</ContainerQuery>
			</DocumentTitle>
		);
	}
}

export default connect(({ user, global, loading }) => ({ currentUser: user.currentUser, collapsed: global.collapsed, isMobile: global.collapsed, fetchingNotices: loading.effects['global/fetchNotices'], notices: global.notices }))(BasicLayout);
