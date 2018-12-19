import React from 'react';
import { Router, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
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
  );
}

export default RouterConfig;
