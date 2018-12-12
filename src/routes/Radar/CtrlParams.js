import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Collapse } from 'antd';
import { List, Accordion } from 'antd-mobile';
import styles from './Params.less';
const columns = [
  {
    title: '属性',
    dataIndex: 'propertyName',
  }, {
    title: '值',
    dataIndex: 'value',
  },
];
const Panel = Collapse.Panel;
@connect(({ ctrl, global }) => ({
  ctrl, global,
}))
export default class Params extends Component {

  render() {
    const { ctrl: { menu }, location } = this.props;
    const { isMobile } = this.props.global;
    // const match = pathToRegexp('/door/:id/:name?').exec(location.pathname);
    // const id = match[1];
    // const name = match[2];
    return (
      <div className="content">
        <div className={styles.content}>
          <Row type="flex" justify="space-around" align="middle">
            <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 12 }}>
              <Accordion className="accordion">
                {
                  menu.map(data => (
                    <Accordion.Panel className={styles.panel} header={data.label} key={data.label}>
                      <List key={data.label}>
                        {
                          data.children.map((item, index) =>
                            <List.Item key={`${item.label}${index}`} extra={item.value}>
                              {`${+index+1}`.length == 2?`${+index+1}`:`0${+index+1}`}. {item.label}
                            </List.Item>
                          )
                        }
                      </List>
                    </Accordion.Panel>
                  ))
                }
              </Accordion>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
