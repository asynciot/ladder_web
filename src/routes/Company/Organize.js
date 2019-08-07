import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'dva';
import { Tabs, Flex, ImagePicker, List, InputItem } from 'antd-mobile';
import { Button, message } from 'antd';
import base64url from 'base64url';
import qrcode from 'qrcode.js';
import pathToRegexp from 'path-to-regexp';
import styles from './Follow.less';
import camera from '../../assets/camera.png';
import { joinGroup } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
const tabs = [
	{ title: '输入群号' },
	// { title: '上传二维码' },
	
];

@connect(({ submit, user, loading }) => ({
	submit,
	currentUser: user.currentUser,
	submitting: loading.effects['user/updateUser'],
}))
export default class extends Component {
	state = {
		number:'',
		view: 0,
		language:window.localStorage.getItem("language"),
	}
	onChange = (value) => {
		this.setState({
			number: value,
		});
	}
	submit = () => {
		joinGroup({
			number: this.state.number,
		}).then((res) => {
			if (res.code === 0) {
				if(this.state.language=="zh"){
					message.success('加入成功');
				}else{
					message.success('Success');
				}
				this.props.history.push(`/home`);
			}else {
				if(this.state.language=="zh"){
					return message.error('加入失败');
				}else{
					return message.error('Error');
				}
			}
		});
	}
	tabChange = (tab, index) => {
		this.setState({
			view: index,
		});
	}
	render() {
		const { submitting } = this.props;
		return (
			<div className="content">
			 <Tabs
					tabs={tabs}
					initialPage={this.state.view}
					onChange={this.tabChange}
					tabBarActiveTextColor="#1E90FF"
					tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
				>
					<div style={{ backgroundColor: '#fff' }}>
						<List>
							<InputItem
								onChange={this.onChange}
								value={this.state.number}
								placeholder={this.state.language=="zh"? "请输入群组号" : "Input Group Number"}
							>
								<FormattedMessage id="Group Number"/>
							</InputItem>
							<List.Item>
								<Button disabled={!this.state.number} size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
									<FormattedMessage id="OK"/>
								</Button>
							</List.Item>
						</List>
					</div>
				</Tabs>
			</div>
		);
	}
}
