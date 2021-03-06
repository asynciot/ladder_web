import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Form, Col, Row, } from 'antd';
import { List, InputItem, DatePicker, Modal, LocaleProvider} from 'antd-mobile';
import styles from './EditDevice.less';
import { putFollowInfo, getDevices, deleteFollowInfo } from '../../services/api';
import pathToRegexp from 'path-to-regexp';
import { injectIntl, FormattedMessage } from 'react-intl';
import en from 'antd-mobile/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');
var _val1 = '';
var _val2 = '';

const alert = Modal.alert;
export default class extends Component {
	state = {
		device_name: '',
		install_addr:'',
		submitting: false,
		list:[],
		la:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getInfo();
	}
	getInfo() {
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/edit-device/:id').exec(location.pathname);
		const device_id = this.state.device_id = match[1]
		getDevices({device_id}).then(res=> {
			if (res.code == 0) {
				var list = res.data.list[0]
				const install_addr = res.data.list[0].install_addr
				const device_name = res.data.list[0].device_name
				let maintenance_nexttime
				let inspection_nexttime
				let maintenance_remind
				let inspection_remind
				if(res.data.list[0].maintenance_nexttime!=null){
					maintenance_nexttime = new Date(parseInt(res.data.list[0].maintenance_nexttime))
				}
				if(res.data.list[0].inspection_nexttime!=null){
					inspection_nexttime = new Date(parseInt(res.data.list[0].inspection_nexttime))
				}
				if(res.data.list[0].maintenance_remind!=null){
					maintenance_remind = res.data.list[0].maintenance_remind/(24*3600*1000)
				}
				if(res.data.list[0].inspection_remind!=null){
					inspection_remind = res.data.list[0].inspection_remind/(24*3600*1000)
				}
				this.setState({
					list,
					install_addr,
					device_name,
					maintenance_nexttime,
					inspection_nexttime,
					maintenance_remind,
					inspection_remind,
				})
			}
		});
	}
	remind = () =>{
		var val1 = document.getElementById('1').value
		var val2 = document.getElementById('2').value
		const len1 =val1.length
		const len2 =val2.length
		if(isNaN(val1)||isNaN(val2)){
			val1 = _val1
			val2 = _val2
			if(this.state.la=="zh"){
				alert("只允许输入数字")
			}else{
				alert("Only number!")
			}
		}else if(len1>3 || len2>3){
			val1 = _val1
			val2 = _val2
			if(this.state.la=="zh"){
				alert("不可超过三位数字")
			}else{
				alert("No more than three!")
			}
		}else{
			_val1 = val1
			_val2 = val2
		}
		this.setState({
			maintenance_remind: _val1,
			inspection_remind: _val2,
		});
	}
	onAddr = (val) => {
		this.setState({
			install_addr: val,
		});
	}
	onName = (val) => {
		this.setState({
			device_name: val,
		});
	}
	submit = () => {
		const time1 = this.state.maintenance_remind*24*3600*1000
		const time2 = this.state.inspection_remind*24*3600*1000
		const maintenance_nexttime = new Date(this.state.maintenance_nexttime).getTime();
		const inspection_nexttime = new Date(this.state.inspection_nexttime).getTime();
		putFollowInfo({
			device_id: this.state.device_id,
			device_name: this.state.device_name,
			install_addr: this.state.install_addr,
			maintenance_nexttime: maintenance_nexttime,
			inspection_nexttime: inspection_nexttime,
			maintenance_remind: time1,
			inspection_remind: time2,
		}).then((res) => {
			if (res.code === 0) {
				if(this.state.la=="zh"){
					message.success('修改成功', 1, () => {
						this.props.history.goBack();
					});
				}else{
					message.success('Success', 1, () => {
						this.props.history.goBack();
					});
				}
			} else {
				if(this.state.la=="zh"){
					message.error('修改失败');
				}else{
					message.error('Error');
				}
			}
		});
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
	onStart = (val) => {
		this.setState({
			maintenance_nexttime: val,
		});
	}
	onEnd = (val) => {
		this.setState({
			inspection_nexttime: val,
		});
	}
	render() {
		const { submitting } = this.state;
		const list = this.state.list
		var la
		if(window.localStorage.getItem("language")=="zh"){
			la = undefined;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div>
					<Form labelCol={{ span: 10 }} wrapperCol={{ span: 12 }}>
						<InputItem
							onChange={value => this.onAddr(value)}
							value={this.state.install_addr}
							labelNumber={7}
						>
							<FormattedMessage id="Install Address"/>
						</InputItem>
						<InputItem
							onChange={value => this.onName(value)}
							value={this.state.device_name}
							className={styles.center}
							labelNumber={7}
						>
							<FormattedMessage id="Device Name"/>
						</InputItem>
						<DatePicker
							value={this.state.maintenance_nexttime}
							onChange={this.onStart}
						>
							<List.Item arrow="horizontal"><FormattedMessage id="next maintenance"/></List.Item>
						</DatePicker>
						<InputItem
							id='1'
							onChange={value => this.remind()}
							labelNumber={7}
							value={this.state.maintenance_remind}
						>
							<FormattedMessage className={styles.fontsize} id="early remind Days"/>
						</InputItem>
						<DatePicker
							value={this.state.inspection_nexttime}
							onChange={this.onEnd}
						>
							<List.Item arrow="horizontal"><FormattedMessage id="next yearly check"/></List.Item>
						</DatePicker>
						<InputItem
							id='2'
							onChange={value => this.remind()}
							value={this.state.inspection_remind}
							labelNumber={7}
						>
							<FormattedMessage id="early remind Days"/>
						</InputItem>
						<Row gutter={5}>
							<Col span={12}>
								<Button size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
									<FormattedMessage id="modify"/>
								</Button>
							</Col>
							<Col span={12}>
								<Button size="large" loading={submitting} style={{ width: '100%' }} type="danger" onClick={() => this.remove()}>
									<FormattedMessage id="remove follow"/>
								</Button>
							</Col>
						</Row>
					</Form>
				</div>
			</LocaleProvider>
		);
	}
}
