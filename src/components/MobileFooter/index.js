import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Layout, Icon } from 'antd';
import classname from 'classnames';
import pathToRegexp from 'path-to-regexp';
import styles from './index.less';

const { Footer } = Layout;

function activeClass(current, path) {
  const currentName = pathToRegexp('/:name/(.*)?').exec(current);
  const pathName = pathToRegexp('/:name/:sub?').exec(path);
  if (pathName && currentName) {
    return currentName[1] === pathName[1] ? styles.active : '';
  } else {
    return '';
  }
}

export default class MobileFooter extends PureComponent {
  state = {
    navs: [
      // {
      //   label: '雷达',
      //   icon: 'environment-o',
      //   link: '/radar/map',
      // },
      // {
      //   label: '消息',
      //   icon: 'message',
      //   link: '/message',
      // },
      // {
      //   label: '技术',
      //   icon: 'book',
      //   link: '/tech/code',
      // },
      // {
      //   label: '我的',
      //   icon: 'user',
      //   link: '/company/group',
      // },
      {
        label: '首页',
        icon: 'home',
        link: '/home',
      },
      // {
      //   label: '电商',
      //   icon: 'shopping-cart',
      //   link: 'https://h5.youzan.com/v2/feature/fEh4xJSkS7',
      // },
      {
        label: '我的',
        icon: 'user',
        link: '/me',
      },
    ],
  }
  render() {
    const { current } = this.props;
    const nav = this.state.navs.map((item) => {
      if (item.link.indexOf('http') !== -1) {
        return (
          <a
            className={classname(styles.nav)}
            href={item.link}
            key={item.label}
          >
            <Icon className={styles.icon} type={item.icon} />
            {/* <img src={item.icon} alt={item.label} /> */}
            <p>{item.label}</p>
          </a>
        );
      }
      return (
        <Link
          className={classname(styles.nav, activeClass(current, item.link))}
          to={item.link}
          key={item.label}
        >
          <Icon className={styles.icon} type={item.icon} />
          {/* <img src={item.icon} alt={item.label} /> */}
          <p>{item.label}</p>
        </Link>
      );
    });
    return (
      <Footer className={styles.footer}>
        {nav}
      </Footer>
    );
  }
}
