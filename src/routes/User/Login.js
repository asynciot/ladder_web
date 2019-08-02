import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert, LocaleProvider } from 'antd';
import styles from './Login.less';
import logo from '../../assets/logo-title.png';
import Background from '../../assets/back.png';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';
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
    checkBox:false,
	}
  left='<'
	right='>'
	componentWillMount() {
		if (window.localStorage.getItem("language")=='en'){
			this.language='English';
			this.username='username';
			this.password='password';
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
    changeLang = () => {
		if (this.language=='English'){
			this.language='简体中文';
			window.localStorage.setItem("language",'zh');
		}else{
			this.language='English';
			window.localStorage.setItem("language",'en');
		}
		window.location.reload()
	}
	showModal = (e) => {
		e.preventDefault();
		Modal.info({
			title: (window.localStorage.getItem("language")=='en') ? 'This is the agreement clause':'这个是协议条款',
			content: (
				<div>
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
  onchange = () => {
    const checkBox = !this.state.checkBox;
    this.setState({
      checkBox,
    })
  }
	test = () =>{
		this.state.checkList[0].op = !this.state.checkList[0].op
		window.localStorage.setItem('rem',this.state.checkList[0].op)
	}

  render() {
    const { form, login, submitting } = this.props;
    const {checkList} = this.state;
    const { getFieldDecorator } = form;
    const suffix = form.getFieldValue('username') ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    var la = window.localStorage.getItem("language");
    if(la == "zh" ){
    	la = zh;
    }else{
    	la = en;
    }
    return (
			<LocaleProvider locale={la}>
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
                        <div>{<FormattedMessage id="Username"/>}:</div>
                      </Col>
                      <Col span={18}>
                        {getFieldDecorator('username', {
                          initialValue:this.state.username,
                          rules: [{
                            required: true,message:(window.localStorage.getItem("language")=='en') ? 'Please input username':'请输入用户名',
                          }, {
                            // pattern: /^1\d{10}$/, message: '手机号格式错误！',
                          }],
                        })(
                          <Input
                            size="large"
                            prefix={<Icon type="user" className={styles.prefixIcon} />}
                            suffix={suffix}
                            placeholder={(window.localStorage.getItem("language")=='en') ? 'Username or phone':'用户名或手机'}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Row gutter={8}>
                      <Col span={6}>
                        <div>{<FormattedMessage id="Password"/>}:</div>
                      </Col>
                      <Col span={18}>
                        {getFieldDecorator('password', {
                          initialValue:this.state.password,
                          rules: [{
                            required: true, class: 'explain',message:(window.localStorage.getItem("language")=='en') ? 'Please input password':'请输入密码',
                          }],
                        })(
                          <Input
                            size="large"
                            type="password"
                            prefix={<Icon type="lock" className={styles.prefixIcon} />}
                            placeholder={(window.localStorage.getItem("language")=='en') ? 'Password':'密码'}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormItem>
                  <Row gutter={8} className={styles.textcenter}>
                    <Col span={1}>
                    </Col>
                    <Col span={5}>
                      <FormattedMessage id="Language" />
                    </Col>
                    <Col span={2} onClick={() => this.changeLang()} className={styles.pointer}>
                      {this.left}
                    </Col>
                    <Col span={6}>
                      {<FormattedMessage id='Lang'/>}
                    </Col>
                    <Col span={1} onClick={() => this.changeLang()} className={styles.pointer}>
                      {this.right}
                    </Col>
                    <Col span={9}>
                      {
                        checkList.map((item, index)=>(
                          <Checkbox defaultChecked={item.op} className={styles.pd} key={index} onChange={this.test}>{<FormattedMessage id="Remember"/>}</Checkbox>
                        ))
                      }
                    </Col>
                  </Row>
                </Col>
                <Col span={22} offset={1}>
                  <FormItem className={styles.additional}>
                    <Button size="large" loading={submitting} disabled={this.state.checkBox} className={styles.submit} type="primary" htmlType="submit">
                      {<FormattedMessage id="Login"/>}
                    </Button>
                    <div>
                      <Row gutter={2}>
                        <Col span={16}>
                          {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                          })(
                            <Checkbox value={this.state.checkBox} onChange={()=>{this.onchange()}}>{<FormattedMessage id="Agree To"/>} <i className={styles.deal} onClick={this.showModal}>《{<FormattedMessage id='Terms of Service'/>}》</i></Checkbox>
                          )}
                        </Col>
                        <Col span={3}>
                          <div>
                            <Link to="/register" className={styles.reg}>{<FormattedMessage id="Register"/>}</Link>
                          </div>
                        </Col>
                        <Col span={5}>
                          <div>
                            <a onClick={this.goresetting} className={styles.res}>{<FormattedMessage id="Forget"/>}</a>
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
      </LocaleProvider>
    );
  }
}
