import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Resetting.less';
import logo from '../../assets/logo-title.png';
import Background from '../../assets/back.png';
import { injectIntl, FormattedMessage } from 'react-intl';

var sectionStyle = {
	width:"100%",
	backgroundImage: `url(${Background})` 
};
const FormItem = Form.Item;
@connect(({ login, loading }) => ({
	login,
	submitting: loading.effects['login/retrieve'],
}))
@Form.create()
export default class Login extends Component {
	state = {
		count: 0,
		lg:0,
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
						type: 'login/retrieve',
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
		if (value && value !== form.getFieldValue('newpassword')) {
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
			<div className={styles.back} style={sectionStyle}>
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
											<div><FormattedMessage id="phone number"/>:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('mobile', {
													rules: [{
														required: true, message: <FormattedMessage id="Please input phone number"/>,
													}, {
														pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: <FormattedMessage id="illegal phone number"/>,
													}],
												})(<Input
													type="text"
													size="large"
													suffix={suffix}
													// placeholder="请输入手机号"
												/>)}
										</Col>
									</Row>
								</FormItem>
								<FormItem>
									<Row gutter={8}>
										<Col span={6}>
											<div><FormattedMessage id="verification"/>:</div>
										</Col>
										<Col span={13}>
											{getFieldDecorator('verifyCode', {
												rules: [{
													required: true, message: <FormattedMessage id="Please input verification code"/>,
												}],
											})(<Input
												type="text"
												size="large"
												// placeholder="请输入验证码"
											/>)}
										</Col>
										<Col span={5}>
											<Button
												disabled={count}
												className={styles.getCaptcha}
												size="large"
												onClick={() => this.onGetCaptcha()}
											>
												<FormattedMessage id={count ? `${count} s` : 'get code'}/>
											</Button>
										</Col>
									</Row>
								</FormItem>
								<FormItem>
									<Row gutter={8}>
										<Col span={6}>
											<div><FormattedMessage id="Password"/>:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('newpassword', {
												rules: [{ required: true, 
														  message: <FormattedMessage id="Password should not less than 6 characters"/> }],
														  min:6,
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
											<div><FormattedMessage id="Confirm password"/>:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('confirm', {
													rules: [
														{ required: true, message: <FormattedMessage id="Passwords does not match"/> },
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
												<FormattedMessage id="reset"/>
											</Button>
										</Col>
										<Col span={12}>
											<Button
												size="large"
												onClick={this.gologin}
												className={styles.submit}
												type="primary"
											>
												<FormattedMessage id="back"/>
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
														<Checkbox><FormattedMessage id="Agree to "/><i className={styles.deal} onClick={this.showModal} loading={this.state.loading}>《<FormattedMessage id="Terms of Service"/>》</i></Checkbox>
													)}
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
