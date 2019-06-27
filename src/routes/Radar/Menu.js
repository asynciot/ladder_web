import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Collapse } from 'antd';
import { List, Accordion } from 'antd-mobile';
import styles from './Menu.less';
import { injectIntl, FormattedMessage } from 'react-intl';
const Panel = Collapse.Panel;
const columns = [
  {
    title: '属性',
    dataIndex: 'propertyName',
  }, {
    title: '值',
    dataIndex: 'value',
  },
];

@connect(({ device, global }) => ({
  device, global,
}))
export default class Params extends Component {

  render() {
    const { device: { menu }, location } = this.props;
    const { isMobile } = this.props.global;
    const match = pathToRegexp('/ctrl/:id/:name?').exec(location.pathname);
    const id = match[1];
    const name = match[2];
    return (
      <div className="content">
        <div className={styles.content}>
          {
            isMobile ? (
              <Row type="flex" justify="space-around" align="middle">
                <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 12 }}>
                  <Accordion className="accordion">
                    {
                      menu.map(data => (
                        <Accordion.Panel className={styles.panel} header={`${data.label}.0 菜单`} key={data.label}>
                          <List key={data.label}>
                            {
                              data.children.map((item, index) =>
                                <List.Item key={`${item.label}${index}`} extra={item.value}>{item.label}</List.Item>
                              )
                            }
                          </List>
                        </Accordion.Panel>
                      ))
                    }
                  </Accordion>
                </Col>
              </Row>
            ) : (
              <Row type="flex" justify="space-around" align="middle">
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 14 }}>
                  <Collapse className="accordion">
                    {
                      menu.map(data => (
                        <Panel header={`${data.label}.0 菜单`} key={data.label}>
                          <List key={data.label}>
                            {
                              data.children.map((item, index) =>
                                <List.Item key={`${item.label}${index}`} extra={item.value}>{item.label}</List.Item>
                              )
                            }
                          </List>
                        </Panel>
                      ))
                    }
                  </Collapse>
                </Col>
              </Row>
            )
          }
        </div>
      </div>
    );
  }
}
