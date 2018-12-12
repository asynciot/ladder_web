import React, { Component } from 'react';
import { connect } from 'dva';
import { Picker, List, InputItem } from 'antd-mobile';
import { Row, Col, Button, Form, Select, Input } from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './Index.less';
import MobileNav from '../../components/MobileNav';

const Option = Select.Option;
const FormItem = Form.Item;
const options = [
  {
    label: 'NSFC01-02T',
    value: 'NSFC01-02T',
  }, {
    label: 'NSFC02-02T',
    value: 'NSFC02-02T',
  },
];
@connect(({ tech }) => ({
  tech,
}))
@Form.create()
export default class Tech extends Component {
  state = {
    navs: [{
      label: '产品说明书',
      link: '/tech/manual',
    }, {
      label: '其他相关资料',
      link: '/tech/other',
    }],
    name: '',
    activeIdx: null,
    solution: {},
  }
  componentDidMount() {
  }
  onSelect(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'tech/query',
      payload: {
        type: e[0],
      },
    });
    this.setState({
      model: e,
      name: '',
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'tech/query',
      payload: {
        name: this.state.name,
      },
    });
  }
  input = (val) => {
    this.setState({
      name: val,
    });
  }
  showSolution = (val, idx) => {
    this.setState({
      solution: val,
      activeIdx: idx,
    });
  }
  render() {
    const { tech: { model, list }, form, isMobile, location } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 7 },
        md: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 15 },
        md: { span: 13 },
      },
    };
    const currentPath = pathToRegexp('/tech/:name').exec(location.pathname);
    const active = currentPath[1];
    return (
      <div className="content">
        <MobileNav
          active={active}
          key="nav"
          navs={this.state.navs}
        />
        <div className={styles.content}>
          {
            isMobile ? (
              <div>
                <List style={{ backgroundColor: 'white' }} className="picker-list">
                  <Picker
                    title="控制器型号"
                    cols={1}
                    data={model}
                    value={this.state.model}
                    onOk={v => this.onSelect(v)}
                    // onDismiss={e => console.log('dismiss', e)}
                  >
                    <List.Item arrow="horizontal">控制器型号</List.Item>
                  </Picker>
                  <InputItem
                    className="tr"
                    placeholder="故障代码值"
                    value={this.state.name}
                    clear
                    onChange={(v) => { this.input(v)}}
                    // onBlur={(v) => { this.searchInput(v)}}
                  >
                  故障代码值
                  </InputItem>
                </List>
                <Row type="flex" justify="space-around" align="middle" style={{ margin: '16px 0' }}>
                  <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }}>
                    <Button onClick={this.handleSubmit} type="primary" style={{ width: '100%' }} >查询</Button>
                  </Col>
                </Row>
              </div>
              ) : (
                <Form onSubmit={this.handleSubmit}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 18 }}>
                      <FormItem label="控制器型号：" {...formItemLayout}>
                        <Select defaultValue="NSFC01-02T" style={{ width: '100%' }} onChange={this.onChange}>
                          <Option value="NSFC01-02T">NSFC01-02T</Option>
                          <Option value="NSFC01-03T">NSFC01-03T</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 18 }}>
                      <FormItem label="故障代码值：" {...formItemLayout}>
                        {getFieldDecorator('username', {
                          rules: [{
                            message: '请输入故障代码值！',
                          }],
                        })(
                          <Input
                            placeholder="代码值"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 16 }}>
                      <FormItem className="tc">
                        <Button type="primary" htmlType="submit" >查询</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
            )
          }
          <Row type="flex" justify="space-around" align="middle" className={styles.tech}>
            <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }}>
              <p className={styles.tips}>注：可点击下列故障代码查询故障处理方法</p>
            </Col>
            <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 18 }}>
              <table border="0" cellSpacing="0" cellPadding="0" className={styles.table}>
                <thead>
                  <tr>
                    <td width="100">查询记录</td>
                    <td>故障处理方法</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    list.length === 0 && (
                      <tr>
                        <td>无</td>
                        <td className={styles.desc} rowSpan={list.length}>无</td>
                      </tr>
                    )
                  }
                  {
                    list.length !== 0 && (
                      <tr>
                        <td className={this.state.activeIdx === 0 ? styles.active : ''} onClick={() => this.showSolution(list[0], 0)}>{list[0].name}</td>
                        <td className={styles.desc} rowSpan={list.length}>
                          <dl>
                            <dt>故障说明：</dt>
                            <dd>{this.state.solution.description ? this.state.solution.description : '无'}</dd>
                          </dl>
                          <dl>
                            <dt>故障原因：</dt>
                            <dd>{this.state.solution.reason ? this.state.solution.reason : '无'}</dd>
                          </dl>
                          <dl>
                            <dt>处理方法：</dt>
                            <dd>{this.state.solution.solution ? this.state.solution.solution : '无'}</dd>
                          </dl>
                        </td>
                      </tr>
                    )
                  }
                  {
                    [].concat(list).splice(1, list.length - 1).map((item, index) => (
                      <tr key={item.id}>
                        <td className={this.state.activeIdx === (index + 1) ? styles.active : ''} onClick={() => this.showSolution(item, index + 1)}>{item.name}</td>
                      </tr>
                    ))
                  }
                  {/* <tr>
                    <td className={styles.active}>历史记录</td>
                  </tr> */}
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
