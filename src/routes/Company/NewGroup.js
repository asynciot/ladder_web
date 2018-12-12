import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Icon,
  Select,
  Row,
  Col,
  Modal,
  Alert,
} from 'antd';
import styles from './NewGroup.less';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ company, loading }) => ({ company, submitting: loading.effects['company/new'] }))
@Form.create()
export default class NewGroup extends Component {
  state = {
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({
        force: true,
      }, (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'company/new',
            payload: {
              type: 1,
              ...values,
            },
          });
        }
      });
  }

  emitEmpty = () => {
    this
      .props
      .form
      .resetFields('username');
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{
        marginBottom: 24,
        }}
        message={message}
        type="error"
        showIcon
      />
    );
  }
  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>群类别:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('grouptype', {
                  initialValue: 'default',
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Select>
                    <Option value="default">维保单位群</Option>
                  </Select>
                )}
              </Col>
            </Row>
          </FormItem>
          {/* <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>群名称:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('groupname', {
                  rules: [
                    {
                      required: true,
                      message: '请输入群名称！',
                    },
                  ],
                })(<Input placeholder="群名称" />)}
              </Col>
            </Row>
          </FormItem> */}
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>申请人姓名:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('contactor', {
                  rules: [
                    {
                      message: '请输入姓名！',
                    },
                  ],
                })(<Input placeholder="姓名" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>联系电话:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      message: '请输入联系电话！',
                    },
                  ],
                })(<Input placeholder="联系电话" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>证件号码:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('idNumber', {
                  rules: [
                    {
                      message: '请输入证件号码！',
                    },
                  ],
                })(<Input placeholder="证件号码" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>单位名称:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入单位名称！',
                    },
                  ],
                })(<Input placeholder="单位名称" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>营业执照编号:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('certId', {
                  rules: [
                    {
                      message: '请输入营业执照编号！',
                    },
                  ],
                })(<Input placeholder="营业执照编号" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>单位所在地:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      message: '请输入单位所在地！',
                    },
                  ],
                })(<Input placeholder="单位所在地" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem className={styles.additional}>
            <Button
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
