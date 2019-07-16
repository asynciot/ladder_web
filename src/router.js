import React from 'react';
import { Router, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd-mobile/lib/locale-provider/en_US';

import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

import { injectIntl, FormattedMessage } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { AppContainer } from 'react-hot-loader'
import { addLocaleData, IntlProvider } from 'react-intl';
import zh_CN from "./locales/zh-CN"     // import defined messages in Chinese
import en_US from "./locales/en-US"     // import defined messages in English

addLocaleData([...en, ...zh]);  // 引入多语言环境的数据

const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});


function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
	let lang=window.localStorage.getItem("language")
	if(lang == null) {
		lang='zh';
		window.localStorage.setItem("language",'zh')
	}
	let messages = {}
  messages['en'] = en_US;
  messages['zh'] = zh_CN;
  return (
		<IntlProvider locale={lang} messages={messages[lang]}>
			<LocaleProvider locale={zhCN}>
				<Router history={history}>
					<Switch>
						<AuthorizedRoute
							path="/login"
							render={props => <UserLayout {...props} />}
							authority="guest"
							redirectPath="/"
						/>
						<AuthorizedRoute
							path="/register"
							render={props => <UserLayout {...props} />}
							authority="guest"
							redirectPath="/"
						/>
						<AuthorizedRoute
							path="/resetting"
							render={props => <UserLayout {...props} />}
							authority="guest"
							redirectPath="/"
						/>
						<AuthorizedRoute
							path="/user"
							render={props => <UserLayout {...props} />}
							authority={['admin', 'user']}
							redirectPath="/login/"
						/>
						<AuthorizedRoute
							path="/"
							render={props => <BasicLayout {...props} />}
							authority={['admin', 'user']}
							redirectPath="/login/"
						/>
					</Switch>
				</Router>
			</LocaleProvider>
		</IntlProvider>
  );
}

export default RouterConfig;
