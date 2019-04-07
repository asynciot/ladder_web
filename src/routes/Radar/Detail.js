import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Menu, Dropdown, Icon } from 'antd';
import { routerRedux, Route, Switch } from 'dva/router';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import styles from './Device.less';
import { getRoutes } from '../../utils/utils';
import LadderLayout from '../../layouts/LadderLayout';

const TabPane = Tabs.TabPane;
const menu = [{
  label: '门',
  view: 0,
}, {
  label: '分屏',
  view: 1,
}, 
// {
//   label: '控制柜',
//   view: 2,
// },
];
const activeNav = (data, idx) => {
  return data === idx ? styles.active : '';
};
const menus = [{
  name: '实时',
  link: 'realtime',
}, {
  name: '历史',
  link: 'history',
}];
@connect(({ device }) => ({
  device,
}))
export default class Device extends Component {
  state = {
    menuName: '实时',
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    const pathName = pathToRegexp('/door/:id/:name?/:end?').exec(location.pathname);
    pathName[2] == 'params' ? '' : this.setState({
      // menuName: menus.filter(item => item.link === pathName[2])[0].name,
    });
  }
  handleMenuClick = (e) => {
    const { dispatch, match } = this.props;
    this.setState({
      menuName: menus.filter(item => item.link === e.key)[0].name,
    });
		if(e.key == "realtime"){
			dispatch(routerRedux.replace(`/door/${match.params.id}/${e.key}`));
			dispatch({
				type: 'door/changeView',
				payload: 0,
			});
		}else if(e.key == "history"){
			dispatch(routerRedux.replace(`/events/door/${match.params.id}`));
			dispatch({
				type: 'door/changeView',
				payload: 0,
			});
		}			
  }
  changeView = (item) => {
		const { dispatch, match } = this.props;
		if(item.view==2){
			dispatch(routerRedux.replace(`/events/door/${match.params.id}`));
		}
    dispatch({
      type: 'device/changeView',
      payload: item.view,
    });
  }
  render() {
    const { isMobile, match, routerData, device: { view } } = this.props;
    const routes = getRoutes(match.path, routerData);
    const pathName = pathToRegexp('/door/:id/:name?/:end?').exec(location.pathname);
    const menuList = (
      <Menu style={{ textAlign: 'center' }} onClick={this.handleMenuClick}>
        {
          menus.filter(item => item.link !== pathName[2]).map((item, idx) => (
            <Menu.Item key={item.link}>
              {item.name}
            </Menu.Item>
          ))
        }
      </Menu>
    );
    // const activeKeyProps = {
    //   defaultActiveKey: pathName[2],
    //   activeKey: pathName[2],
    // };
    return (
      <LadderLayout
        isMobile={isMobile}
        match={match}
      >
        {
          pathName[2] !== 'params' && (
            <div className={classNames(styles.menu)}>
              <Dropdown overlay={menuList} placement="bottomCenter" trigger={['click']}>
                <a className={styles.dropdown} href="#">
                  {this.state.menuName} <Icon type="down" />
                </a>
              </Dropdown>
              {
                menu.map(item => (
                  <section
                    key={item.view}
                    onClick={() => this.changeView(item)}
                    className={classNames(styles.nav, activeNav(item.view, view))}
                  >
                    {item.label}
                  </section>
                ))
              }
            </div>
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
