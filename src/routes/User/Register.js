import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Register.less';
import logo from '../../assets/logo-title.png';

const FormItem = Form.Item;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/register'],
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { form } = this.props;
    if (this.state.count !== 0) return;
    this.props.dispatch({
      type: 'login/captcha',
      payload: {
        mobile: form.getFieldValue('mobile'),
      },
    });
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  showModal = (e) => {
    e.preventDefault();
    Modal.info({
      title: '这个是协议条款',
      content: (
        <div>
          <p>这个是协议条款</p>
          <p>这个是协议条款</p>
        </div>
      ),
      okText: '确定',
      onOk() {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'login/register',
            payload: {
              ...values,
            },
          });
        }
      }
    );
  }
	gologin = () => {
		const { history } = this.props;
		history.push('/login');
	};
  emitEmpty = () => {
    this.props.form.resetFields('mobile');
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一样!');
    } else {
      callback();
    }
  }
  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }
  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count } = this.state;
    const suffix = form.getFieldValue('mobile') ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Row className={styles.panel} gutter={8}>
            <Col span={22} offset={1}>
	      			<img className={styles.logo} src={logo} alt="logo" />
	        	</Col>
            <Col span={22} offset={1}>
							<FormItem>
								<Row gutter={8}>
									<Col span={6}>
										<div>用户名:</div>
									</Col>
									<Col span={18}>
										{getFieldDecorator('username', {
												rules: [{
													required: true, message: '请输入用户名!',
												}],
											})(<Input
												type="text"
												size="large"
												suffix={suffix}
												placeholder="请输入用户名"
											/>)}
									</Col>
								</Row>
							</FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>手机号码:</div>
                  </Col>
                  <Col span={18}>
                    {getFieldDecorator('mobile', {
		              			rules: [{
		              				required: true, message: '请输入手机号!',
		              			}, {
                          pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式错误！',
                        }],
		              		})(<Input
                        type="text"
                        size="large"
                        suffix={suffix}
                        placeholder="请输入手机号"
		              		/>)}
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>验证码:</div>
                  </Col>
                  <Col span={13}>
                    {getFieldDecorator('verifyCode', {
                      rules: [{
                        required: true, message: '请输入验证码!',
                      }],
                    })(<Input
                      type="text"
                      size="large"
                      placeholder="请输入验证码"
                    />)}
                  </Col>
                  <Col span={5}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={() => this.onGetCaptcha()}
                    >
                      {count ? `${count} s` : '获取'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>设置密码:</div>
                  </Col>
                  <Col span={18}>
                    {getFieldDecorator('password', {
	              			rules: [{ required: true, message: '请输入密码!' }],
	              		})(<Input
                        type="password"
                        size="large"
                        placeholder="请输入密码"
	              		/>)}
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>重复密码:</div>
                  </Col>
                  <Col span={18}>
                    {getFieldDecorator('confirm', {
		              			rules: [
                          { required: true, message: '请确认密码!' },
                          {
                            validator: this.compareToFirstPassword,
                          },
                        ],
		              		})(<Input
                          type="password"
                          size="large"
                          placeholder="请确认密码"
		              		/>)}
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col span={22} offset={1}>
              <FormItem className={styles.additional}>
								<Row gutter={5}>
									<Col span={12}>
										<Button
											size="large"
											loading={submitting}
											className={styles.submit}
											type="primary"
											htmlType="submit"
										>
											注册
										</Button>
									</Col>
									<Col span={12}>
										<Button
											size="large"
											onClick={this.gologin}
											className={styles.submit}
											type="primary"
										>
												返回
										</Button>
									</Col>
								</Row>
                <div>
                  <Row gutter={8}>
                    <Col span={16}>
                      {getFieldDecorator('remember', {
													valuePropName: 'checked',
													initialValue: true,
												})(
                          <Checkbox>同意 <i className={styles.deal} onClick={this.showModal} loading={this.state.loading}>《服务条款》</i></Checkbox>
												)}
                    </Col>
                  </Row>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
