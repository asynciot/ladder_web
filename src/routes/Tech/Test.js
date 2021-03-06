import React, { Component } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import pathToRegexp from 'path-to-regexp';
import styles from './Manual.less';
import MobileNav from '../../components/MobileNav';

export default class Tech extends Component {
  state = {
    navs: [{
      label: '产品说明书',
      link: '/tech/manual',
    }, {
      label: '其他相关资料',
      link: '/tech/other',
    }],
  }
  componentDidMount() {
  }
  onClick = (link) => {
    this.props.history.push(`/tech/reader/${link}`);
    // window.location.href = link;
  }
  render() {
    const { location } = this.props;
    const currentPath = pathToRegexp('/tech/:name').exec(location.pathname);
    const active = currentPath[1];
    return (
      <div className="content">
        <MobileNav
          key="nav"
          active={active}
          navs={this.state.navs}
        />
        <div className={styles.content}>
          <List style={{ backgroundColor: 'white' }}>
            {

            }
          </List>
        </div>
      </div>
    );
  }
}
