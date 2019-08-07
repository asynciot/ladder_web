import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Register.less';
import logo from '../../assets/logo.png';
import Background from '../../assets/back.png';
import {getCaptcha, } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';

var sectionStyle = {
	width:"100%",
	backgroundImage: `url(${Background})`
};
const FormItem = Form.Item;
@connect(({ login, loading }) => ({
	login,
	submitting: loading.effects['login/register'],
}))
@Form.create()
export default class Login extends Component {
	state = {
		count: 0,
		language:window.localStorage.getItem("language")
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	onGetCaptcha = () => {
		const { form } = this.props;
		if (this.state.count !== 0)
			return;
		const mobile = form.getFieldValue('mobile')
		fetch('http://server.asynciot.com/common/sms/'+mobile, {
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
			},
			// body: formdata
		}).then(function(response){
		}).then(function(data){
		})
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
    if(this.state.language=="zh"){
      Modal.info({
      	title: '',
      	content: (
      		<div>
            <h4>网站注册服务条款</h4>
            <div>尊敬的用户，欢迎您注册成为本网站用户。在注册前请您仔细阅读如下服务条款：
                本服务协议双方为本网站与本网站用户，本服务协议具有合同效力。
                您确认本服务协议后，本服务协议即在您和本网站之间产生法律效力。请您务必在注册之前认真阅读全部服务协议内容，如有任何疑问，可向本网站咨询。
                无论您事实上是否在注册之前认真阅读了本服务协议，只要您点击协议正本下方的"注册"按钮并按照本网站注册程序成功注册为用户，您的行为仍然表示您同意并签署了本服务协议。</div>
            <h5>1．本网站服务条款的确认和接纳</h5>
            <div>本网站各项服务的所有权和运作权归本网站拥有。</div>
            <h5>2．用户必须：</h5>
            <p>(1)自行配备上网的所需设备， 包括个人电脑、调制解调器或其他必备上网装置。</p>
            <p>(2)自行负担个人上网所支付的与此服务有关的电话费用、 网络费用。</p>
            <h5>3．用户在本网站上交易平台上不得发布下列违法信息：</h5>
            <p>(1)反对宪法所确定的基本原则的；</p>
            <p>(2)危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
            <p>(3)损害国家荣誉和利益的；</p>
            <p>(4)煽动民族仇恨、民族歧视，破坏民族团结的；</p>
            <p>(5)破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
            <p>(6)散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
            <p>(7)散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
            <p>(8)侮辱或者诽谤他人，侵害他人合法权益的；</p>
            <p>(9)含有法律、行政法规禁止的其他内容的。</p>
            <h5>4．有关个人资料</h5>
            <p>用户同意：</p>
            <p>(1)提供及时、详尽及准确的个人资料。</p>
            <p>(2)同意接收来自本网站的信息。</p>
            <p>(3)不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。</p>
            <p>(4)本网站不公开用户的姓名、地址、电子邮箱和笔名，以下情况除外：</p>
            <p>（a）用户授权本网站透露这些信息。</p>
            <p>（b）相应的法律及程序要求本网站提供用户的个人资料。如果用户提供的资料包含有不正确的信息，本网站保留结束用户使用本网站信息服务资格的权利。</p>
            <h5>5. 用户在注册时应当选择稳定性及安全性相对较好的电子邮箱，并且同意接受并阅读本网站发往用户的各类电子邮件。如用户未及时从自己的电子邮箱接受电子邮件或因用户电子邮箱或用户电子邮件接收及阅读程序本身的问题使电子邮件无法正常接收或阅读的，只要本网站成功发送了电子邮件，应当视为用户已经接收到相关的电子邮件。电子邮件在发信服务器上所记录的发出时间视为送达时间。</h5>
            <h5>6．服务条款的修改</h5>
            <p>本网站有权在必要时修改服务条款，本网站服务条款一旦发生变动，将会在重要页面上提示修改内容。如果不同意所改动的内容，用户可以主动取消获得的本网站信息服务。如果用户继续享用本网站信息服务，则视为接受服务条款的变动。本网站保留随时修改或中断服务而不需通知用户的权利。本网站行使修改或中断服务的权利，不需对用户或第三方负责。</p>
            <h5>7．用户隐私制度</h5>
            <p>尊重用户个人隐私是本网站的一项基本政策。所以，本网站一定不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在本网站中的非公开内容，除非有法律许可要求或本网站在诚信的基础上认为透露这些信息在以下四种情况是必要的：</p>
            <p>(1)遵守有关法律规定，遵从本网站合法服务程序。</p>
            <p>(2)保持维护本网站的商标所有权。</p>
            <p>(3)在紧急情况下竭力维护用户个人和社会大众的隐私安全。</p>
            <p>(4)符合其他相关的要求。</p>
            <p>本网站保留发布会员人口分析资询的权利。</p>
            <h5>8．用户的帐号、密码和安全性</h5>
            <p>你一旦注册成功成为用户，你将得到一个密码和帐号。如果你不保管好自己的帐号和密码安全，将负全部责任。另外，每个用户都要对其帐户中的所有活动和事件负全责。你可随时根据指示改变你的密码，也可以结束旧的帐户重开一个新帐户。用户同意若发现任何非法使用用户帐号或安全漏洞的情况，请立即通告本网站。</p>
            <h5>9．拒绝提供担保</h5>
            <p>用户明确同意信息服务的使用由用户个人承担风险。 本网站不担保服务不会受中断，对服务的及时性，安全性，出错发生都不作担保，但会在能力范围内，避免出错。</p>
            <h5>10．有限责任</h5>
            <p>本网站对任何直接、间接、偶然、特殊及继起的损害不负责任，这些损害来自：不正当使用本网站服务，或用户传送的信息不符合规定等。这些行为都有可能导致本网站形象受损，所以本网站事先提出这种损害的可能性，同时会尽量避免这种损害的发生。</p>
            <h5>11．信息的储存及限制</h5>
            <p>本网站有判定用户的行为是否符合本网站服务条款的要求和精神的权利，如果用户违背本网站服务条款的规定，本网站有权中断其服务的帐号。</p>
            <h5>12．用户管理</h5>
            <p>用户必须遵循：</p>
            <p>(1)使用信息服务不作非法用途。</p>
            <p>(2)不干扰或混乱网络服务。</p>
            <p>(3)遵守所有使用服务的网络协议、规定、程序和惯例。用户的行为准则是以因特网法规，政策、程序和惯例为根据的。</p>
            <h5>13．保障</h5>
            <p>用户必须遵循：</p>
            <p>用户同意保障和维护本网站全体成员的利益，负责支付由用户使用超出服务范围引起的律师费用，违反服务条款的损害补偿费用，其它人使用用户的电脑、帐号和其它知识产权的追索费。</p>
            <h5>14．结束服务</h5>
            <p>用户或本网站可随时根据实际情况中断一项或多项服务。本网站不需对任何个人或第三方负责而随时中断服务。用户若反对任何服务条款的建议或对后来的条款修改有异议，或对本网站服务不满，用户可以行使如下权利：</p>
            <p>(1)不再使用本网站信息服务。</p>
            <p>(2)通知本网站停止对该用户的服务。</p>
            <p>结束用户服务后，用户使用本网站服务的权利马上中止。从那时起，用户没有权利，本网站也没有义务传送任何未处理的信息或未完成的服务给用户或第三方。</p>
            <h5>15．通告</h5>
            <p>所有发给用户的通告都可通过重要页面的公告或电子邮件或常规的信件传送。服务条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。</p>
            <h5>16．信息内容的所有权</h5>
            <p>本网站定义的信息内容包括：文字、软件、声音、相片、录象、图表；在广告中全部内容；本网站为用户提供的其它信息。所有这些内容受版权、商标、标签和其它财产所有权法律的保护。所以，用户只能在本网站和广告商授权下才能使用这些内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。</p>
            <h5>17．法律</h5>
            <p>本网站信息服务条款要与中华人民共和国的法律解释一致。用户和本网站一致同意服从本网站所在地有管辖权的法院管辖。如发生本网站服务条款与中华人民共和国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它条款则依旧保持对用户的约束力。</p>
          </div>
      	),
      	okText: (this.state.language=="zh")?'确定':"Ok",
      	onOk() {},
      });
    }else{
      Modal.info({
      	title: '',
      	content: (
      		<div>
            <h4>Terms of Service for Website Registration</h4>
            <div>Distinguished users, you are welcome to register as a user of this website. Before registration, please read the following terms of service carefully:
Both parties to this service agreement are the users of this website. This service agreement has the effect of contract.
After you confirm this service agreement, this service agreement will have legal effect between you and this website. Please read all the service agreements carefully before you register. If you have any questions, you can consult this website.
Whether you actually read the service agreement carefully before registration or not, as long as you click the "Registration" button below the original agreement and successfully register as a user according to the registration procedure of this website, your behavior still indicates that you agree to and sign the service agreement.</div>
            <h5>1．Confirmation and Acceptance of Terms of Service of this Website</h5>
            <div>Ownership and operation rights of all services of this website belong to this website.</div>
            <h5>2．Users must:</h5>
            <p>(1)Self-equipped with the necessary equipment for Internet access, including personal computers, modems or other necessary Internet access devices.</p>
            <p>(2)I shall bear the telephone fees and network fees related to this service paid by the individual on-line.</p>
            <h5>3．Users may not publish the following illegal information on the trading platform of this website:</h5>
            <p>(1)Opposing the basic principles laid down in the Constitution;</p>
            <p>(2)It endangers national security, discloses state secrets, subverts state power and undermines national unity.</p>
            <p>(3)Damaging the honor and interests of the state;</p>
            <p>(4)Incitement of national hatred, discrimination and destruction of national unity;</p>
            <p>(5)Destroying the state's religious policy and promoting cults and feudal superstitions;</p>
            <p>(6)Disseminating rumors, disturbing social order and destabilizing society;</p>
            <p>(7)Disseminating obscenity, pornography, gambling, violence, murder, terror or abetting crime;</p>
            <p>(8)Insulting or slandering others and infringing upon their legitimate rights and interests;</p>
            <p>(9)Containing other contents prohibited by laws and administrative regulations.</p>
            <h5>4.Relevant Personal Data</h5>
            <p>User agrees:</p>
            <p>(1)Provide timely, detailed and accurate personal data.</p>
            <p>(2)Agree to receive information from this website.</p>
            <p>(3)Continuous updating of registration data, in line with timely, detailed and accurate requirements. All original typed data will be referenced as registration data.</p>
            <p>(4) Users'names, addresses, e-mails and pen names are not disclosed on this website, except in the following cases:</p>
            <p>(a) The user authorizes this website to disclose such information.</p>
            <p>(b) The relevant laws and procedures require the website to provide users'personal data. If the information provided by the user contains incorrect information, the website reserves the right to terminate the user's qualification to use the information service of the website.</p>
            <h5>5.When registering, users should choose e-mailboxes with relatively good stability and security, and agree to accept and read all kinds of e-mails sent to users by this website. If the user fails to receive the e-mail from his own e-mail in time or because of the problem of the user's e-mail or the user's e-mail receiving and reading program itself, the e-mail can not be received or read properly, as long as the website successfully sends the e-mail, it should be considered that the user has received the relevant e-mail. The sending time recorded by e-mail on the sending server is regarded as the delivery time.</h5>
            <h5>6．Amendments to Terms of Service</h5>
            <p>This website has the right to modify the terms of service when necessary. Once the terms of service of this website change, it will prompt to modify the content on important pages. If you do not agree with the changed content, the user can cancel the information service of this website on his own initiative. If users continue to enjoy the information services of this website, they will be regarded as accepting changes in terms of service. This website reserves the right to modify or interrupt services at any time without informing users. This website exercises the right to modify or interrupt the service without responsibility to users or third parties.</p>
            <h5>7．User Privacy System</h5>
            <p>Respect for users'privacy is a basic policy of this website. Therefore, this website will not disclose, edit or disclose its registration information and the non-public content stored in this website without the authorization of legitimate users, unless there is a requirement for legal permission or the website considers it necessary to disclose these information in the following four situations on the basis of good faith:</p>
            <p>(1)Comply with the relevant laws and regulations, and comply with the legal service procedures of this website.</p>
            <p>(2)Maintain and maintain the trademark ownership of this website.</p>
            <p>(3)In emergencies, we strive to safeguard the privacy and security of users and the public.</p>
            <p>(4)It meets other relevant requirements.</p>
            <p>This website reserves the right of demographic analysis and inquiry of press conference members.</p>
            <h5>8．User Account, Password and Security</h5>
            <p> Once you register successfully as a user, you will get a password and account number. If you don't keep your account and password safe, you will take full responsibility. In addition, each user is fully responsible for all activities and events in his account. You can change your password at any time according to instructions, or you can close your old account and open a new one. Users agree that if any illegal use of user accounts or security vulnerabilities is found, please notify this website immediately. </p>
            <h5>9．Refusal to provide security</h5>
            <p> Users clearly agree that the use of information services is at their personal risk. This website does not guarantee that the service will not be interrupted. It does not guarantee the timeliness, security and the occurrence of errors of the service, but it will avoid errors within its capabilities. </p>
            <h5>10．limited liability</h5>
            <p>This website is not responsible for any direct, indirect, accidental, special and consequential damages arising from the improper use of the website services or the inconsistency of information transmitted by users. These actions may lead to damage to the image of the website, so the website advance the possibility of such damage, while trying to avoid the occurrence of such damage.</p>
            <h5>11．Storage and limitation of information</h5>
            <p>This website has the right to determine whether the user's behavior conforms to the requirements and spirit of the service terms of this website. If the user violates the service terms of this website, this website has the right to interrupt the account number of its service.</p>
            <h5>12．User Management</h5>
            <p>Users must follow:</p>
            <p>(1)Information services are not used illegally.</p>
            <p>(2)Do not interfere with or disrupt network services.</p>
            <p>(3)Comply with all network protocols, regulations, procedures and practices that use services. Users'codes of conduct are based on Internet regulations, policies, procedures and practices.</p>
            <h5>13．Guarantee</h5>
            <p>Users must follow:</p>
            <p>Users agree to safeguard and safeguard the interests of all members of this website. They are responsible for paying attorneys'fees caused by users' use beyond the scope of service, compensation for damages caused by violations of service terms, and recourse fees for other users'computers, accounts and other intellectual property rights.</p>
            <h5>14．End of Service</h5>
            <p>Users or this website may interrupt one or more services at any time according to the actual situation. This website does not need to be responsible to any individual or third party to interrupt service at any time. Users may exercise the following rights if they object to any proposals for terms of service or have objections to subsequent amendments to the terms of service or are not satisfied with the services of this website:</p>
            <p>(1)No longer use the information service of this website.</p>
            <p>(2)Notify this website to stop serving this user.</p>
            <p>After the end of the user service, the user's right to use the website service will be terminated immediately. Since then, users have no rights and the website has no obligation to transmit any unprocessed information or services to users or third parties.</p>
            <h5>15．Announcement</h5>
            <p>All notices sent to users can be transmitted by announcements on important pages or by e-mail or regular mail. Amendments to the terms of service, service changes, or announcements of other important events will take place in this form.</p>
            <h5>16．Ownership of information content</h5>
            <p>The information content defined by this website includes: text, software, sound, photos, videos, charts; all content in advertisements; other information provided by this website for users. All these contents are protected by copyright, trademark, label and other property ownership laws. Therefore, users can only use these content under the authorization of the website and advertisers, but can not copy, re-create these content, or create content-related products.</p>
            <h5>17．Law</h5>
            <p>The information service clauses of this website shall be consistent with the legal interpretation of the People's Republic of China. Users and the website agree to submit to the jurisdiction of the court in which the website is located. In case of conflict between the terms of service of this website and the laws of the People's Republic of China, these terms will be reinterpreted in full accordance with the provisions of the law, while other terms will remain binding on users.</p>
          </div>
      	),
      	okText: (this.state.language=="zh")?'确定':"Ok",
      	onOk() {},
      });
    }
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
											<div><FormattedMessage id="Username"/>:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('username', {
													rules: [{
														required: true,
														message: <FormattedMessage id="Username should not less than 6 characters"/>,
														min:6,
													}, {
                            pattern: /^[0-9a-zA-Z]+$/,
														message: <FormattedMessage id="Number and Letter"/>,
                          }],
												})(<Input
													type="text"
													size="large"
													suffix={suffix}
													placeholder={this.state.language=="zh"?"数字和字母":"Number and letter."}
												/>)}
										</Col>
									</Row>
								</FormItem>
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
														pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
														message: <FormattedMessage id="Illegal phone number"/>,
													}],
												})(<Input
													type="text"
													size="large"
													placeholder={this.state.language=="zh"?"请输入手机号":"Plese input phone"}
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
													required: true,
													message: <FormattedMessage id="Please input verification code"/>,
												}],
											})(<Input
												type="text"
												size="large"
												placeholder={this.state.language=="zh"?"请输入验证码":"Input verification code"}
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
											{getFieldDecorator('password', {
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
													placeholder={this.state.language=="zh"?"数字，字母，不允许空格":"Number,Letter,No space"}
											/>)}
										</Col>
									</Row>
								</FormItem>
								<FormItem>
									<Row gutter={8}>
										<Col span={6}>
											<div><FormattedMessage id="Confirm"/>:</div>
										</Col>
										<Col span={18}>
											{getFieldDecorator('confirm', {
													rules: [
														{ required: true, message: <FormattedMessage id="Passwords does not match"/>},
														{
															validator: this.compareToFirstPassword,
														},
													],
												})(<Input
														type="password"
														size="large"
														placeholder={this.state.language=="zh"?"请确认密码":"Plese confirm password"}
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
												<FormattedMessage id="Register"/>
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
												{getFieldDecorator('remember', {
														valuePropName: 'checked',
														initialValue: true,
													})(
														<Checkbox><FormattedMessage id="Agree To"/><i className={styles.deal} onClick={this.showModal} loading={this.state.loading}>《<FormattedMessage id="Terms of Service"/>》</i></Checkbox>
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
