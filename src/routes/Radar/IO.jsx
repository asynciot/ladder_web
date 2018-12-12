import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './IO.less';

@connect(({ device, global }) => ({ device, global }))
export default class IO extends Component {
  componentDidMount() {}

  in = [
    {
      label: 'X01',
      active: true,
    },
    {
      label: 'X02',
      active: false,
    },
    {
      label: 'X03',
      active: false,
    },
    {
      label: 'X04',
      active: false,
    },
    {
      label: 'X05',
      active: false,
    },
    {
      label: 'X06',
      active: true,
    },
    {
      label: 'X07',
      active: false,
    },
    {
      label: 'X08',
      active: false,
    },
    {
      label: 'X09',
      active: false,
    },
    {
      label: 'X10',
      active: false,
    },
    {
      label: 'X11',
      active: true,
    },
    {
      label: 'X12',
      active: false,
    },
    {
      label: 'X13',
      active: false,
    },
    {
      label: 'X14',
      active: false,
    },
    {
      label: 'X15',
      active: false,
    },
    {
      label: 'X16',
      active: false,
    },
    {
      label: 'X17',
      active: false,
    },
    {
      label: 'X18',
      active: false,
    },
    {
      label: 'X19',
      active: false,
    },
    {
      label: 'X20',
      active: false,
    },
    {
      label: 'X21',
      active: false,
    },
    {
      label: 'X22',
      active: true,
    },
    {
      label: 'X23',
      active: false,
    },
    {
      label: 'X24',
      active: false,
    },
    {
      label: 'PL',
      active: false,
    },
  ];
  out = [
    {
      label: 'Y01',
      active: false,
    },
    {
      label: 'Y02',
      active: false,
    },
    {
      label: 'Y03',
      active: false,
    },
    {
      label: 'Y04',
      active: true,
    },
    {
      label: 'Y05',
      active: false,
    },
    {
      label: 'Y06',
      active: false,
    },
    {
      label: 'Y07',
      active: true,
    },
    {
      label: 'Y08',
      active: false,
    },
  ];
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
                        <th>输入</th>
                        <td>
                          <ul className={styles.list}>
                            {
                              this.in.map(item => (
                                <li key={item.label}>{item.label}<i className={ item.active ? styles.active :'' } /></li>
                              ))
                            }
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <th>输出</th>
                        <td>
                          <ul className={styles.list}>
                            {
                              this.out.map(item => (
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
