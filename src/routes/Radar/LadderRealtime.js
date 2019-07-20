import React, { Component } from 'react';
import { connect } from 'dva';
import base64url from 'base64url';
import { Row, Col, Button, Spin, DatePicker, Switch, } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import styles from './Realtime.less';
import echarts from 'echarts';
import {getEvent, getLadder, postMonitor, getFollowDevices, getDeviceList, getDoorRuntime, getFloorData, getCtrlRuntime,} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';

export default class extends Component {
	state = {
		id:0,
		IMEI:'',
		list:[],
		ctrl:{},
		door:{},
	}
	componentWillMount () {
		const id = this.props.match.params.id
		this.readLadder(id)
		setTimeout(()=>{
			this.getRuntime()
		},300)
		this.setState({
			id,
		})
		
	}
	componentWillUnmount() {
	}
	buffer2hex = (buffer) => {
		const unit16array = [];
		buffer.forEach((e) => {
			const num = e.toString(16);
			unit16array.push(num.length === 1
			  ? `0${num}`
			  : num);
		});
		return unit16array;
	}
	readLadder = (id) => {
		getLadder({id}).then(res=> {
			if (res.code == 0) {
				const list = res.data.list[0]
				this.setState({
					list,
				})
			}
		});
	}
	getRuntime = () => {
		const { show, list } = this.state
		getDoorRuntime({IMEI:list.door1,type:4096,num:1,page:1}).then(res=>{
			let buffer = base64url.toBuffer(res.data.list[0].data)
		})
	}
	render() {
		return (
			<div className="content tab-hide">
				
			</div>
		);
	}
}
