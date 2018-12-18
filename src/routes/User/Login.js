import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Login.less';
import logo from '../../assets/logo-title.png';
import Background from '../../assets/back.png';

var sectionStyle = {
	width:"100%",
  backgroundImage: `url(${Background})` 
};
const FormItem = Form.Item;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
            type: 'login/login',
            payload: {
              ...values,
            },
          });
        }
      }
    );
  }

  emitEmpty = () => {
    this.props.form.resetFields('username');
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
    const { form, login, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count } = this.state;
    const suffix = form.getFieldValue('username') ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
			<div className={styles.back} style={sectionStyle}>
				<div className={styles.main}>
					<Form onSubmit={this.handleSubmit}>
						{
							login.status === 'error' &&
							login.submitting === false &&
							this.renderMessage('密码错误')
						}
						<Row className={styles.panel} gutter={8}>
							<Col span={22} offset={1}>
								<img className={styles.logo} src={logo} alt="logo" />
							</Col>
							<Col span={22} offset={1}>
								<FormItem>
									<Row gutter={8}>
										<Col span={4}>
											<div>账号:</div>
										</Col>
										<Col span={20}>
											{getFieldDecorator('username', {
												rules: [{
													required: true, message: '请输入手机号或个人编号！',
												}, {
													// pattern: /^1\d{10}$/, message: '手机号格式错误！',
												}],
											})(
												<Input
													size="large"
													prefix={<Icon type="mobile" className={styles.prefixIcon} />}
													suffix={suffix}
													placeholder="手机号或个人编号"
												/>
											)}
										</Col>
									</Row>
								</FormItem>
								<FormItem>
									<Row gutter={8}>
										<Col span={4}>
											<div>密码:</div>
										</Col>
										<Col span={20}>
											{getFieldDecorator('password', {
												rules: [{
													required: true, class: 'explain', message: '请输入密码！',
												}],
											})(
												<Input
													size="large"
													type="password"
	//                      prefix={<Icon type="mail" className={styles.prefixIcon} />}
													placeholder="密码"
												/>
											)}
										</Col>
									</Row>
								</FormItem>
							</Col>
							<Col span={22} offset={1}>
								<FormItem className={styles.additional}>
									<Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
										登录
									</Button>
									<div>
										<Row gutter={8}>
											<Col span={14}>
												{getFieldDecorator('remember', {
													valuePropName: 'checked',
													initialValue: true,
												})(
													<Checkbox>同意 <i className={styles.deal} onClick={this.showModal}>《服务条款》</i></Checkbox>
												)}
											</Col>
											<Col span={4}>
												<div>
													<Link to="/register" className={styles.reg}>注册</Link>
												</div>
											</Col>
											<Col span={6}>
												<div>
													<Link to="/register" className={styles.reg}>忘记密码</Link>
												</div>	
											</Col>
										</Row>
									</div>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</div>
			</div>	
    );
  }
}
