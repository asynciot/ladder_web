import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './Roof.less';

@connect(({ device, global }) => ({ device, global }))
export default class Roof extends Component {
  componentDidMount() {}
  frontIn = [{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },];
  frontOut = [{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  }];
  endIn = [{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },];
  endOut = [{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },{
    label: '开门到位',
    active: false,
  },];
  render() {
    const { device, location } = this.props;
    const { isMobile } = this.props.global;
    return (
      <div className="content">
        <div className={styles.content}>
          {isMobile && (
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
                        <th rowSpan="2">输入</th>
                        <td className={styles.title}>前门</td>
                        <td className={styles.title}>后门</td>
                      </tr>
                      <tr>
                        <td>
                          <ul className={styles.list}>
                            {
                              this.frontIn.map(item => (
                                <li key={item.label}>{item.label}<i className={ item.active ? styles.active :'' } /></li>
                              ))
                            }
                          </ul>
                        </td>
                        <td>
                          <ul className={styles.list}>
                            {
                              this.endIn.map(item => (
                                <li key={item.label}>{item.label}<i className={ item.active ? styles.active :'' } /></li>
                              ))
                            }
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <th rowSpan="2">输出</th>
                        <td className={styles.title}>前门</td>
                        <td className={styles.title}>后门</td>
                      </tr>
                      <tr>
                        <td>
                          <ul className={styles.list}>
                            {
                              this.frontOut.map(item => (
                                <li key={item.label}>{item.label}<i className={ item.active ? styles.active :'' } /></li>
                              ))
                            }
                          </ul>
                        </td>
                        <td>
                          <ul className={styles.list}>
                            {
                              this.endOut.map(item => (
                                <li key={item.label}>{item.label}<i className={ item.active ? styles.active :'' } /></li>
                              ))
                            }
                          </ul>
                        </td>
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
