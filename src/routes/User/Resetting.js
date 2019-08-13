import React, { Component } from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert, message, LocaleProvider } from 'antd';
import styles from './Resetting.less';
import logo from '../../assets/logo.png';
import Background from '../../assets/back.png';
import { injectIntl, FormattedMessage } from 'react-intl';
import { retrieve } from '../../services/api';
import ModalTest from './ModalTest.js'; 
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';

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
		language:window.localStorage.getItem("language"),
		visible:false,
		item:true,
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
		this.setState({
			visible: true,
		});
	}
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.setFieldsValue({
			remember:true,
		})
		this.setState({
			item:true,
			visible: false,
		});
	}
	handleCancel = (e) => {
		e.preventDefault();
		this.props.form.setFieldsValue({
			remember:false,
		})
		this.setState({
			item:false,
			visible: false,
		});
		this.forceUpdate();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields({ force: true },
			(err, values) => {
				if (!err) {
					const mobile = values.mobile
					const newpassword = values.newpassword
					const verifyCode = values.verifyCode
					retrieve({ mobile, newpassword, verifyCode}).then((res)=>{
						if(res.code==0){
							if(window.localStorage.getItem("language")=='zh'){
								message.success('修改成功');
							}else{
								message.success('Success');
							}
						}else{
							if(window.localStorage.getItem("language")=='zh'){
								message.success('修改失败');
							}else{
								message.success('Error');
							}
						}
					})
				}
			}
		);
	}
	onChange = () => {
		const item = !this.state.item;
		this.setState({
			item:item,
		})
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
			if(this.state.language=="zh"){
				callback('两次密码输入不一样!');
			}else{
				callback('Inconsistent passwords!');
			}
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
		const { count, language, visible } = this.state;
		const suffix = form.getFieldValue('mobile') ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
		var la
		if(language == "zh" ){
			la = zh
		}else{
			la = en
		}
		return (
			<LocaleProvider locale={la}>
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
															pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: <FormattedMessage id="Illegal phone number"/>,
														}],
													})(<Input
														type="text"
														size="large"
														// suffix={suffix}
														placeholder={language=="zh"?"请输入手机号":"Plese input phone"}
													/>)}
											</Col>
										</Row>
									</FormItem>
									<FormItem>
										<Row gutter={8}>
											<Col span={6}>
												<div><FormattedMessage id="Verification"/>:</div>
											</Col>
											<Col span={12}>
												{getFieldDecorator('verifyCode', {
													rules: [{
														required: true, message: <FormattedMessage id="Please input verification code"/>,
													}],
												})(<Input
													type="text"
													size="large"
													placeholder={language=="zh"?"请输入验证码":"Input verification code"}
												/>)}
											</Col>
											<Col span={6}>
												<Button
													disabled={count}
													className={styles.getCaptcha}
													size="large"
													onClick={() => this.onGetCaptcha()}
												>
													<FormattedMessage id={count ? `${count} s` : 'Get Code'}/>
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
													rules: [{
														required: true,
														message: <FormattedMessage id="Password should not less than 6 characters"/>,
														min:6,
													}, {
														pattern: /^[0-9a-zA-Z]+$/,
														message: <FormattedMessage id="Number and Letter"/>,
													}],
													})(<Input
														type="password"
														size="large"
														placeholder={language=="zh"?"数字和字母":"Number and letter."}
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
															placeholder={language=="zh"?"请确认密码":"Plese confirm password"}
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
													disabled={!this.state.item}
													type="primary"
													htmlType="submit"
												>
													<FormattedMessage id="Reset"/>
												</Button>
											</Col>
											<Col span={12}>
												<Button
													size="large"
													onClick={this.gologin}
													className={styles.submit}
													type="primary"
												>
													<FormattedMessage id="Back"/>
												</Button>
											</Col>
										</Row>
										<div>
											<Row gutter={8}>
												<Col span={16}>
													{
														getFieldDecorator('remember', {
															valuePropName: 'checked',
															initialValue: true,
														})(
															<Checkbox onChange={this.onChange}>
																<FormattedMessage id="Agree To"/>
																<i className={styles.deal} onClick={this.showModal} loading={this.state.loading}>
																	《<FormattedMessage id="Terms of Service"/>》
																</i>
																<Modal 
																	title={language=="zh"? "网站注册服务条款": "Terms of Service for Website Registration"}
																	visible={visible}
																	onOk={this.handleOk}
																	onCancel={this.handleCancel}
																>
																	<ModalTest/>
																</Modal>
															</Checkbox>
														)
													}
												</Col>
											</Row>
										</div>
									</FormItem>
								</Col>
							</Row>
						</Form>
					</div>
				</div>
			</LocaleProvider>
		);
	}
}
