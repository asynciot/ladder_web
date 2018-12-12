import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, List } from 'antd';
import styles from './Bug.less';

@connect(({ device, global }) => ({ device, global }))
export default class Version extends Component {
  render() {
    const { device, location } = this.props;
    const { isMobile } = this.props.global;
    const match = pathToRegexp('/radar/:id/:name?').exec(location.pathname);
    return (
      <div className="content">
        <div className={styles.content}>
          {isMobile
            && (
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
                  <div className={styles.table}>
                    <table>
                      <tbody>
                        <tr>
                          <th className="tc" colSpan="2">软件信息</th>
                        </tr>
                        <tr>
                          <th className="tr">电梯控制软件：</th>
                          <td className="tl">01020304</td>
                        </tr>
                        <tr>
                          <th className="tr">电机控制软件：</th>
                          <td className="tl">01020304</td>
                        </tr>
                        <tr>
                          <th className="tr">通讯相关软件：</th>
                          <td className="tl">01020304</td>
                        </tr>
                        <tr>
                          <th className="tr">轿顶控制软件：</th>
                          <td className="tl">01020304</td>
                        </tr>
                        <tr>
                          <th className="tr">并联通信软件：</th>
                          <td className="tl">01020304</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            )
          }
        </div>
      </div>
    );
  }
}
