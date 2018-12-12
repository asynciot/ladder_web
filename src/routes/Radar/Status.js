import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import classNames from 'classnames';
import { Row, Col, Modal } from 'antd';
import styles from './Status.less';

const btns = [
  {
    label: '自动',
    enable: true,
  },
  {
    label: '检修',
    enable: false,
  },
  {
    label: '司机',
    enable: false,
  },
  {
    label: '消防',
    enable: false,
  },
  {
    label: '锁梯',
    enable: false,
  },
  {
    label: '故障',
    enable: false,
  },
  {
    label: '超载',
    enable: false,
  },
  {
    label: '满载',
    enable: false,
  },
];
@connect(({ device }) => ({
  device,
}))
export default class Status extends Component {
  door = () => {
    const { history } = this.props;
    const { location } = this.props;
    const match = pathToRegexp('/radar/:id/:sub').exec(location.pathname);
    history.push(`/radar/${match[1]}/door`);
  }
  render() {
    return (
      <div className={styles.content}>
        <Row type="flex" justify="space-around" align="middle" className={styles.ladder}>
          <Col xs={{ span: 12 }} md={{ span: 8, offset: 4 }}>
            <p className={styles.speed}>速度 ：1.25 m/s</p>
          </Col>
        </Row>
        <Row type="flex" justify="space-around" align="middle" className={styles.ladder}>
          <Col xs={{ span: 4 }} md={{ span: 4, offset: 4 }}>
            <div className={styles.status}>
              {
                btns.map(item => (
                  <section key={item.label}>
                    <p>{item.label}</p>
                    <i className={classNames(styles.btn, item.enable ? styles.red : '')} />
                  </section>
                ))
              }
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 8 }}>
            <div onClick={this.door} className={styles.door}>
              <section></section>
              <section></section>
            </div>
          </Col>
          <Col xs={{ span: 4 }} md={{ span: 4 }}>
            <div className={styles.floor}>
              <p>↑ ↓</p>
              <p>1 4</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
