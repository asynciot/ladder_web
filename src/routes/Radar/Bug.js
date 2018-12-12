import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, List,Spin } from 'antd';
import styles from './Bug.less';

@connect(({ device, global }) => ({ device, global }))
export default class Bug extends Component {
  state = {
    data: [{
      id: '01',
      code: '过流',
      floor: 5,
      time: '2018-03-27 01:01:01',
    }, {
      id: '02',
      code: '过流',
      floor: 5,
      time: '2018-03-27 01:01:01',
    }],
    loading: false,
    hasMore: true,
  }

  render() {
    const { device, location } = this.props;
    const { isMobile } = this.props.global;
    const match = pathToRegexp('/radar/:id/:name?').exec(location.pathname);
    return (
      <div className="content">
        <div className={styles.content}>
          {isMobile
            ? (
              <Row type="flex" justify="space-around" align="middle">
                <Col
                  xs={{
                  span: 22,
                }}
                  sm={{
                  span: 14,
                }}
                  md={{
                  span: 12,
                }}
                >
                  <List
                    className={styles.list}
                    dataSource={this.state.data}
                    renderItem={item => (
                    <List.Item className={styles['list-item']} key={item.id}>
                      <div className={styles['list-content']}>
                        <div className={styles['item-title']}>
                          <p>故障记录{item.id}</p>
                        </div>
                        <div className={styles['item-content']}>
                          <p>故障代码：{item.code}</p>
                          <p>故障楼层：{item.floor}</p>
                          <p>故障时间：{item.time}</p>
                        </div>
                      </div>
                    </List.Item>
                  )}
                  >
                    {this.state.loading && this.state.hasMore && <Spin className="demo-loading" />}
                  </List>
                </Col>
              </Row>
            )
            : (
              <Row type="flex" justify="space-around" align="middle">
                <Col
                  xs={{
                  span: 24,
                }}
                  sm={{
                  span: 16,
                }}
                  md={{
                  span: 14,
                }}
                >
                </Col>
              </Row>
            )
}
        </div>
      </div>
    );
  }
}
