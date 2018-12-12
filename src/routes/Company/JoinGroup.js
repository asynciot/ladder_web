import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Alert,
} from 'antd';
import styles from './NewGroup.less';

const { TextArea } = Input;
const FormItem = Form.Item;
@connect(({ company, loading }) => ({ company, submitting: loading.effects['company/join'] }))
@Form.create()
export default class JoinGroup extends Component {
  state = {
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this
      .props
      .form
      .validateFields({
        force: true,
      }, (err, values) => {
        if (!err) {
          this
            .props
            .dispatch({
              type: 'company/join',
              payload: {
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
    // const suffix = form.getFieldValue('username')
    //   ? <Icon type="close-circle" onClick={this.emitEmpty} />
    //   : null;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>单位群编号:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('companyId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入单位群编号！',
                    },
                  ],
                })(<Input placeholder="单位群编号" />)}
              </Col>
            </Row>
          </FormItem>
          {/* <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>或单位群名称:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('companyName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入单位群名称！',
                    },
                  ],
                })(<Input placeholder="单位群名称" />)}
              </Col>
            </Row>
          </FormItem> */}
          <FormItem>
            <Row gutter={8}>
              <Col span={7}>
                <div>申请理由:</div>
              </Col>
              <Col span={17}>
                {getFieldDecorator('groupname', {
                  rules: [
                    {
                      required: true,
                      message: '请输入申请理由！',
                    },
                  ],
                })(<TextArea rows={4} placeholder="申请理由" />)}
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
              提交申请
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
