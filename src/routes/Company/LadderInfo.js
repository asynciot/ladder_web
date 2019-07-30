import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Form, Col, Row, } from 'antd';
import { List, InputItem, DatePicker, Modal} from 'antd-mobile';
import styles from './EditDevice.less';
import { getLadder, getFollowDevices } from '../../services/api';
import pathToRegexp from 'path-to-regexp';
import { injectIntl, FormattedMessage, } from 'react-intl';
var _val1 = '';
var _val2 = '';

const alert = Modal.alert;
const state ={
	'online':'在线',
	'offline':'offline',
	'longoffline':'长期离线',
}
export default class extends Component {
	state = {
		ladder_name: '',
		list:[],
		la:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getInfo();
	}
	goDevice = (val,item) => {
		if (val == 0) {
			this.props.history.push({
				pathname:`/ctrl/${item}/realtime`,
			});
		} else {
			getFollowDevices({ num: 1, page:1, IMEI:item}).then((res) => {
				const id = res.data.list[0].device_id
				const type = res.data.list[0].device_model
				this.props.history.push({
					pathname:`/door/${id}/realtime`,
					state: { type }
				});
			});
		}
	}
	goLadder = () => {
		const id = this.state.list.id
		this.props.history.push({
			pathname:`/ladder/${id}`,
		});
	}
	getInfo = () => {
		const id = this.props.match.params.id
		getLadder({id}).then(res=> {
			if (res.code == 0) {
				var list = res.data.list[0]
				this.setState({
					list,
				})
			}
		});
	}
	render() {
		const list = this.state.list
		const la = window.localStorage.getItem("language")
		return (
			<div >
				<Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
					<InputItem
						value={list.name}
						disabled="true"
					>
						<FormattedMessage id="Device Name"/>
					</InputItem>
					<InputItem
						value={list.install_addr}
						disabled="true"
					>
						<FormattedMessage id="Install Address"/>
					</InputItem>
					<div onClick={()=>this.goDevice(0,list.ctrl_id)}>
						<InputItem
							value={list.ctrl}
							disabled="true"
							style={{color:'red'}}
						>
							<FormattedMessage id="Ctrl"/>
						</InputItem>
					</div>
					<div onClick={()=>this.goDevice(1,list.door1)}>
						<InputItem
							value={list.door1}
							disabled="true"
							style={{color:'red'}}
						>
							<FormattedMessage id="Door"/>
						</InputItem>
					</div>
					<div onClick={()=>this.goDevice(1,list.door2)}>
						<InputItem
							value={list.door2}
							disabled="true"
							style={{color:'red'}}
						>
							<FormattedMessage id="Door"/>
						</InputItem>
					</div>
					{/* <div onClick={()=>this.goLadder()}>
						<InputItem
							disabled="true"
							style={{color:'red'}}
						>
							电梯
						</InputItem>
					</div> */}
					{
						(this.state.la=="zh")?
						<InputItem
							value={state[list.state]}
							disabled="true"
						>
							<FormattedMessage id="State"/>
						</InputItem>
						:
						<InputItem
							value={list.state}
							disabled="true"
						>
							<FormattedMessage id="State"/>
						</InputItem>
					}
				</Form>
			</div>
		);
	}
}
