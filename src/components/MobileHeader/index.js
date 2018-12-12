import React, { PureComponent } from 'react';
import { Layout, Icon } from 'antd';
import classnames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

const { Header } = Layout;
let isBack = false;

function changeBack(path) {
  const match = pathToRegexp('/:name?/:id?/:sub?/:end?').exec(path);
  if (match && match[2]) {
    isBack = true;
  } else {
    isBack = false;
  }
}
export default class MobileHeader extends PureComponent {
  state = {
    // isBack: false,
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  back = () => {
    const { history, location } = this.props;
    const match = pathToRegexp('/:name/:id?/:sub?/:end?').exec(location.pathname);
    if (match && match[2]) {
      history.goBack();
    }
  }

  link = (link) => {
    this.props.history.replace(link);
  }

  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { title, showMenu, location } = this.props;
    if (location) {
      changeBack(location.pathname);
    }
    return (
      <Header className={styles.header}>
        {
          isBack ? (
            <Icon
              className={styles.menu}
              type="arrow-left"
              onClick={this.back}
            />
          ) : (
            <p
              className={styles.spacemenu}
            />
          )
        }
        <i className={classnames(styles.title, showMenu ? '' : styles.nomenu)}>{title}</i>
        {/* {
          title === '我的' && (
            <Icon className={styles.setting} type="setting" />
          )
        } */}
        {
          title === '设备管理' && (
            <Icon className={styles.setting} type="global" onClick={() => this.link('/radar/map')} />
          )
        }
        {
          title === '地图列表' && (
            <Icon className={styles.setting} type="profile" onClick={() => this.link('/company/device')} />
          )
        }
      </Header>
    );
  }
}
