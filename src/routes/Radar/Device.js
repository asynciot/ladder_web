import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { routerRedux, Route, Switch } from 'dva/router';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import styles from './Device.less';
import { getRoutes } from '../../utils/utils';
import LadderLayout from '../../layouts/LadderLayout';

const TabPane = Tabs.TabPane;
const menu = [
  {
    label: '电梯状态',
    link: 'status',
  },
  {
    label: '登记信息',
    link: 'register',
  },
  {
    label: 'I/O板状态',
    link: 'io',
  },
  {
    label: '矫顶板状态',
    link: 'roof',
  },
  {
    label: '菜单配置',
    link: 'menu',
  },
  {
    label: '故障记录',
    link: 'bug',
  },
  {
    label: '软件版本',
    link: 'version',
  },
  {
    label: '驱动信息',
    link: 'driver',
  },
];
const activeNav = (link, path) => {
  const pathName = pathToRegexp('/radar/:id/(.*)?').exec(path);
  return link === pathName[2] ? styles.active : '';
};
@connect(({ device }) => ({
  device,
}))
export default class Device extends Component {
  componentDidMount() {
  }
  onChange = () => {

  }
  goSubRoute = (link) => {
    const { dispatch, match } = this.props;
    dispatch(routerRedux.push(`${match.url}/${link}`));
  }
  render() {
    const { isMobile, match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);
    const pathName = pathToRegexp('/radar/:id/(.*)?').exec(location.pathname);
    const activeKeyProps = {
      defaultActiveKey: pathName[2],
      activeKey: pathName[2],
    };
    return (
      <LadderLayout
        isMobile={isMobile}
        match={match}
      >
        {
          isMobile ? (
            <div className={classNames(styles.menu)}>
              {
                menu.map(item => (
                  <section
                    key={item.link}
                    onClick={() => this.goSubRoute(item.link)}
                    className={classNames(styles.nav, activeNav(item.link, location.pathname))}
                  >
                    {item.label}
                  </section>
                ))
              }
            </div>
          ) : (
            <Tabs {...activeKeyProps} onChange={this.goSubRoute} style={{ padding: '0 8px 0' }}>
              {
                menu.map(item => <TabPane tab={item.label} key={item.link} />)
              }
            </Tabs>
          )
        }
        <Switch>
          {
            routes.map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }
        </Switch>
      </LadderLayout>
    );
  }
}
