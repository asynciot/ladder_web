import React from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen } from 'enquire-js';
import { ContainerQuery } from 'react-container-query';
import styles from './UserLayout.less';
import { getRoutes } from '../utils/utils';
import MobileHeader from '../components/MobileHeader';

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
let isMobile;
enquireScreen((b) => {
	isMobile = b;
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
class UserLayout extends React.PureComponent {
	state = {
		isMobile,
		isWechat: isWechat(),
	};
	componentDidMount() {
		enquireScreen((mobile) => {
			this.setState({ isMobile: true, isWechat: isWechat() });
		});
	}
	getPageTitle() {
		const { routerData, location } = this.props;
		const { pathname } = location;
		let title = 'Ladder';
		if (routerData[pathname] && routerData[pathname].name) {
			title = routerData[pathname].name;
			if (window.localStorage.getItem("language") == 'en') {
				title = routerData[pathname].name2;
			}
		}else {
			const match = pathToRegexp('/:name/:sub?').exec(pathname);
			if (match && match[1]) {
				if (routerData[`/${match[1]}/`]) {
					title = routerData[`/${match[1]}/`].name;
					if (window.localStorage.getItem("language") == 'en') {
						title = routerData[`/${match[1]}/`].name2;
					}
				}
			}
		}
		return title;
	}
	render() {
		const { routerData, match } = this.props;
		const layout = (
			<div className={styles.container}>
				{
					this.state.isMobile && (
						<MobileHeader
							showMenu
							hasMenu={false}
							title={this.getPageTitle()}
						/>
					)
				}
				<Switch>
					{getRoutes(match.path, routerData).map(item =>
						(
							<Route
								key={item.key}
								path={item.path}
								component={item.component}
								exact={item.exact}
							/>
						)
					)}
					<Redirect exact from="/user" to="/user/login" />
				</Switch>
			</div>
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

export default UserLayout;
