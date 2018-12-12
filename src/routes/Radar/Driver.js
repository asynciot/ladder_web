import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, List } from 'antd';
import styles from './Bug.less';

@connect(({ device, global }) => ({ device, global }))
export default class Driver extends Component {
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
                          <th className="tr">母线电压：</th>
                          <td className="tl">380.8V</td>
                        </tr>
                        <tr>
                          <th className="tr">输出电压：</th>
                          <td className="tl">175.6V</td>
                        </tr>
                        <tr>
                          <th className="tr">输出电流：</th>
                          <td className="tl">10.5A</td>
                        </tr>
                        <tr>
                          <th className="tr">输出转矩：</th>
                          <td className="tl">750.4N</td>
                        </tr>
                        <tr>
                          <th className="tr">输出功率：</th>
                          <td className="tl">1050W</td>
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
