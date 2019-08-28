import React, { Component } from 'react';
import { Button, message, Form, Col, Row } from 'antd';
import { connect } from 'dva';
import { Modal, List, InputItem, LocaleProvider, Flex } from 'antd-mobile';
import { readCompany } from '../../services/api';
import styles from './GroupInfo.less';
import { injectIntl, FormattedMessage } from 'react-intl';
import pathToRegexp from 'path-to-regexp';
import en from 'antd-mobile/lib/locale-provider/en_US';

const alert = Modal.alert;
export default class extends Component {
	state = {
		language:window.localStorage.getItem("language"),
		list:[],
		submitting: false,
	}
	componentWillMount() {
		this.getGroup()
	}
	getGroup = () =>{
		const match = pathToRegexp('/company/groupinfo/:id').exec(location.pathname);
		const id = match[1]
		readCompany({ id, nums:1, page:1 }).then((res)=>{
			if(res.code==0){
				this.setState({
					list:res.data.list[0],
				})
			}
		})
	}
	remove = () => {
		const { dispatch, location, match } = this.props;
		const device_id =match.params.id
		if(this.state.la=="zh"){
			alert('提示', '是否取消关注', [
				{ text: '取消', style: 'default' },
				{ text: '确认',
					onPress: () => {
						deleteFollowInfo({ device_id}).then((res) => {
							if(res.code==0){
								alert("成功");
								this.props.history.goBack();
							}else{
								alert("成功");
							}
						});
					},
				},
			]);
		}else{
			alert('提示', 'Cancer Follow', [
				{ text: 'Cancer', style: 'default' },
				{ text: 'Ok',
					onPress: () => {
						deleteFollowInfo({ device_id}).then((res) => {
							if(res.code==0){
								if(this.state.la=="zh"){
									alert("成功");
								}else{
									alert("Success");
								}
								this.props.history.goBack();
							}else{
								if(this.state.la=="zh"){
									alert("失败");
								}else{
									alert("Error");
								}
							}
						});
					},
				},
			]);
		}
	}
	render() {
		const { language, list, submitting } = this.state;
		var la
		if(language=="zh"){
			la = undefined;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className={styles.content}>
					<div style={{ backgroundColor: '#fff' }}>
						
						<Form labelCol={{ span: 10 }} wrapperCol={{ span: 12 }}>
							<InputItem
								value={list.name}
								disabled="true"
							>
								<FormattedMessage id="Group Name"/>
							</InputItem>
							<InputItem
								value={list.number}
								disabled="true"
							>
								<FormattedMessage id="Group Number"/>
							</InputItem>
							<InputItem
								value={list.leader}
								disabled="true"
							>
								<FormattedMessage id="Group Creator"/>
							</InputItem>
							<Flex className={styles.bottom}>
								<Flex.Item>
									<Button size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
										<FormattedMessage id="modify"/>
									</Button>
								</Flex.Item>
								<Flex.Item>
									<Button size="large" loading={submitting} style={{ width: '100%' }} type="danger" onClick={() => this.remove()}>
										<FormattedMessage id="remove follow"/>
									</Button>
								</Flex.Item>
							</Flex>
						</Form>
					</div>
				</div>
			</LocaleProvider>
		);
	}
}
