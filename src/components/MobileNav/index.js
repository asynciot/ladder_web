import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';

import { Icon } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const activeNav = (link, active) => {
  const pathName = pathToRegexp('/:name/:sec?/(.*)?').exec(link);
  if (pathName[2] === 'list') {
    return active === pathName[3] ? styles.active : '';
  }
  if (pathName[1] === 'radar') {
    return active === pathName[2] ? styles.active : '';
  }
  if (pathName[1] === 'tech') {
    return active === pathName[2] ? styles.active : '';
  }
  if (pathName[2] === 'statistics') {
    return active === pathName[3] ? styles.active : '';
  }
};

export default class MobileNav extends PureComponent {
  render() {
    const { navs, active } = this.props;
    const menu = navs.map((item) => {
      return (
        <Link className={classNames(styles.nav, activeNav(item.link, active))} to={item.link} key={item.label}>
          <p>
            {
              item.icon && (
                <Icon className={styles.icon} type={item.icon} />
              )
            }
            {item.label}&nbsp;
            { item.num == null ? '' : `( ${item.num} )` }
          </p>
        </Link>
      );
    });
    return (
      <div className={styles.menu}>
        {menu}
      </div>
    );
  }
}
