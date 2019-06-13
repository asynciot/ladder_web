import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Revise.less';
import { injectIntl, FormattedMessage } from 'react-intl';
const FormItem = Form.Item;

@connect(({ submit, user, loading }) => ({
	submit,
	currentUser: user.currentUser,
	submitting: loading.effects['user/updateUser'],
}))
@Form.create()

export default class Profile extends Component {

	emitEmpty = () => {
		this.props.form.resetFields('username');
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields({ force: true },
			(err, values) => {
				if (!err) {
					this.props.dispatch({
						type: 'user/updateUser',
						payload: {
						  ...values,
						},
					});
				}
			}
		);
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
		const { form, submitting, currentUser } = this.props;
		const { getFieldDecorator } = form;
		return (
			<div className={styles.main}>
				<Form onSubmit={this.handleSubmit}>
					<div className={styles.content}>
						<section className={styles.info}>
							<FormItem>
								<Row gutter={8}>
									<Col span={6}>
										<div><FormattedMessage id="nickname"/>:</div>
									</Col>
									<Col span={18}>
										{getFieldDecorator('nickname', {
											initialValue: currentUser.nickname || '',
												rules: [{
													required: true,class:'explain', message: '请输入昵称',
												}],
										})(<Input placeholder="昵称" ></Input>)
										}
									</Col>
								</Row>
							</FormItem>
						</section>
						<section className={styles.info}>
							<FormItem>
								<Row gutter={8}>
									<Col span={6}>
										<div><FormattedMessage id="phone number"/>:</div>
									</Col>
									<Col span={18}>
										{getFieldDecorator('mobile', {
											initialValue:currentUser.mobile || '',
											rules: [{
												required: true,class:'explain', message: <FormattedMessage id="Please input phone number"/>,
											}],
										})(<Input placeholder="手机号码"></Input>)}
									</Col>
								</Row>
							</FormItem>
						</section>
						<section className={styles.info}>
							{getFieldDecorator('id', {
								initialValue:currentUser.id || '',
								rules: [{
								}],
							})}
						</section>
						<FormItem className={styles.additional}>
							<Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
								<FormattedMessage id="submit"/>
							</Button>
						</FormItem>
					</div>
				</Form>    
			</div>
		)
	}
}
