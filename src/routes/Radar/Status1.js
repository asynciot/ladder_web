import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd';
import styles from './Status1.less';

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
  state = {
    floor: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2],
  }

  door = () => {
    const { history } = this.props;
    const { location } = this.props;
    const match = pathToRegexp('/radar/:id/:sub').exec(location.pathname);
    history.push(`/radar/${match[1]}/door`);
  }
  goDetail = link => () => {
    this.props.history.push(`/company/data/${link}`);
  }
  render() {
    const { floor } = this.state;
    return (
      <div className={styles.content}>
        <Row
          type="flex"
          justify="space-around"
          align="middle"
          className={styles.ladder}
        >
          <Col
            span={24}
            className={classNames(styles.door)}
          >
            <section>
              <p>运行信号 ：<i className={styles.status}>运行</i>
              </p>
              <p>速度 ：<i className={styles.status}>0.5m/s</i>
              </p>
              <p>门锁信号 ：<i className={styles.status}>通</i>
              </p>
              <p>当前楼层 ：<i className={styles.status}>3</i>
              </p>
              <p>开门信号 ：<i className={styles.status}>动作</i>
              </p>
              <p>关门信号 ：<i className={styles.status}>不动作</i>
              </p>
              <p>柜控制型号 ：<i className={styles.status}>群控</i>
              </p>
              <p>状态 ：<i className={styles.status}>自动</i>
              </p>
              <p style={{
                width: '100%',
              }}
              >
                电梯外已按向上楼层 ：
                <i className={styles.status}>-1 1 7</i>
              </p>
              <p style={{
                width: '100%',
              }}
              >
                电梯外已按向下楼层 ：
                <i className={styles.status}>-1 1 7</i>
              </p>
            </section>
          </Col>
        </Row>
        <div className={styles.doors}>
          <div className={styles.outer}>
            <div className={styles.inner}>
                <section></section>
                <section></section>
            </div>
          </div>
          <div className={styles.info}>
            <p>
              <Icon className={styles.icon} type="arrow-up" />
              <i>3</i>
            </p>
            <ul>
              {
                floor.map(item => (
                  <li>{item}</li>
                ))
              }
            </ul>
          </div>
        </div>
        <div className={styles.btns}>
          <section onClick={this.goDetail('statistics')}>统计</section>
          <section onClick={this.goDetail('details')}>参数</section>
        </div>
      </div>
    );
  }
}
