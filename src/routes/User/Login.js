import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Login.less';
import logo from '../../assets/logo-title.png';
import Background from '../../assets/back.png';
import { FormattedMessage  } from 'react-intl';
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
		checkList:[{
			op:false,
		}],
		username:'',
		password:'',
  }
  	left='<'
	right='>'
	language='简体中文'
	username='账号'
	password='密码'
	rem='记住密码'
	login='登录'
	register='注册'
	forget='忘记密码'
	agree='同意'
	term='服务条款'
	num='手机号或个人编号'
	input='请输入'
	componentWillMount() {
		if (window.localStorage.getItem("language")=='en'){
			this.language='English';
			this.username='username';
			this.password='password';
			this.rem='Remember';
			this.login='Login';
			this.register='Register'
			this.forget='Forgot?'
			this.agree='Agree to'
			this.term='Terms of Service'
			this.num='Phone or Personal ID'
			this.input='Please input '
		}
		this.state.checkList[0].op = window.localStorage.getItem("rem")
		this.forceUpdate()
		if(this.state.checkList[0].op == "true"){
			this.state.checkList[0].op = true
			const u = window.localStorage.getItem("u")
			const p = window.localStorage.getItem("p")
			this.state.username = u
			this.state.password = p
		}else{
			this.state.checkList[0].op = false
			window.localStorage.setItem('u','')
			window.localStorage.setItem('p','')
		}
	}
	componentDidMount() {
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
    changeLang = () => {
		if (this.language=='简体中文'){
			this.language='English';
			this.username='Username';
			this.password='Password';
			this.rem='Remember';
			this.login='Login';
			this.register='Register'
			this.forget='Forgot?'
			this.agree='Agree to'
			this.term='Terms of Service'
			this.num='Phone or Personal ID'
			this.input='Please input '
			window.localStorage.setItem("language",'en');
		}else if (this.language=='English'){
			this.language='简体中文';
			this.username='账号';
			this.password='密码';
			this.rem='记住密码';
			this.login='登录';
			this.register='注册'
			this.forget='忘记密码'
			this.agree='同意'
			this.term='服务条款'
			this.num='手机号或个人编号'
			this.input='请输入'
			window.localStorage.setItem("language",'zh');
		}
		this.forceUpdate()
	}
	showModal = (e) => {
		e.preventDefault();
		Modal.info({
			title: (window.localStorage.getItem("language")=='en') ? 'This is the agreement clause':'这个是协议条款',
			content: (
				<div>
					<p>这个是协议条款</p>
					<p>这个是协议条款</p>
				</div>
			),
			okText: (window.localStorage.getItem("language")=='en') ? 'OK':'确定',
			onOk() {},
		});
	}
	handleSubmit = (e) => {
		const { form } = this.props
		if(this.state.checkList[0].op == true){
			window.localStorage.setItem('u',form.getFieldValue('username'))
			window.localStorage.setItem('p',form.getFieldValue('password'))
		}
		e.preventDefault();
		form.validateFields({ force: true },
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
	goresetting = () => {
		const { history } = this.props;
		history.push('/resetting');
	};
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
	test = () =>{
		this.state.checkList[0].op = !this.state.checkList[0].op
		window.localStorage.setItem('rem',this.state.checkList[0].op)
	}

  render() {
    const { form, login, submitting } = this.props;
	const {checkList} = this.state
    const { getFieldDecorator } = form;
    const suffix = form.getFieldValue('username') ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
			<div className={styles.back} style={sectionStyle}>
				<div className={styles.main}>
					<Form onSubmit={this.handleSubmit}>
						{
							login.status === 'error' &&
							login.submitting === false &&
							this.renderMessage((window.localStorage.getItem("language")=='en') ? 'Password error':'密码错误')
						}
						<Row className={styles.panel} gutter={8}>
							<Col span={22} offset={1}>
								<img className={styles.logo} src={logo} alt="logo" />
							</Col>
							<Col span={22} offset={1}>
								<FormItem>
									<Row gutter={8}>
										<Col span={6}>
											<div>{this.username}:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('username', {
												initialValue:this.state.username,
												rules: [{
													required: true, message: this.input+this.num,
												}, {
													// pattern: /^1\d{10}$/, message: '手机号格式错误！',
												}],
											})(
												<Input
													size="large"
													prefix={<Icon type="user" className={styles.prefixIcon} />}
													suffix={suffix}
													placeholder={this.num}
												/>
											)}
										</Col>
									</Row>
								</FormItem>
								<FormItem>
									<Row gutter={8}>
										<Col span={6}>
											<div>{this.password}:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('password', {
												initialValue:this.state.password,
												rules: [{
													required: true, class: 'explain', message: this.input+this.password,
												}],
											})(
												<Input
													size="large"
													type="password"
													prefix={<Icon type="lock" className={styles.prefixIcon} />}
													placeholder={this.password}
												/>
											)}
										</Col>
									</Row>
								</FormItem>
								<Row gutter={8} className={styles.textcenter}>
									<Col span={1}>
									</Col>
									<Col span={5}>
										Language:
									</Col>
									<Col span={2} onClick={() => this.changeLang()} className={styles.pointer}>
										{this.left}
									</Col>
									<Col span={6}>
										{this.language}
									</Col>
									<Col span={1} onClick={() => this.changeLang()} className={styles.pointer}>
										{this.right}
									</Col>
									<Col span={9}>
										{
											checkList.map((item, index)=>(
												<Checkbox defaultChecked={item.op} className={styles.pd} key={index} onChange={this.test}>{this.rem}</Checkbox>
											))
										}
									</Col>
								</Row>
							</Col>
							<Col span={22} offset={1}>
								<FormItem className={styles.additional}>
									<Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
										{this.login}
									</Button>
									<div>
										<Row gutter={2}>
											<Col span={16}>
												{getFieldDecorator('remember', {
													valuePropName: 'checked',
													initialValue: true,
												})(
													<Checkbox>{this.agree} <i className={styles.deal} onClick={this.showModal}>《{this.term}》</i></Checkbox>
												)}
											</Col>
											<Col span={3}>
												<div>
													<Link to="/register" className={styles.reg}>{this.register}</Link>
												</div>
											</Col>
											<Col span={5}>
												<div>
													<a onClick={this.goresetting} className={styles.res}>{this.forget}</a>
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
