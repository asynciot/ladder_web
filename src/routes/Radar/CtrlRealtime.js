import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, Icon, DatePicker,  } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './CtrlRealtime.less';
import echarts from 'echarts';
import {getEvent, postMonitor, getFollowDevices, getDeviceList, getFloorData,} from '../../services/api';
const tabs = [
	{ title: '门' 	},
	{ title: '分屏' },
	{ title: '滤波' },
];
const timeList = [{
	label: '90s',
	value: '90',
},{
	label: '60s',
	value: '60',
}, {
	label: '30s',
	value: '30',
},];
const direction = {
	'01': 'arrow-up',
	'10': 'arrow-down',
	'00': '',
	'11': '',
}
const parseStatus= (event) => {
	let statusName = '无';
	if (event.status == 128) {
		statusName = '自动';
	}
	if (event.status ==64) {
		statusName = '检修';
	}
	if (event.status ==32) {
		statusName = '司机';
	}
	if (event.status ==16) {
		statusName = '消防';
	}
	if (event.status ==8) {
		statusName = '锁体';
	}
	if (event.status ==4) {
		statusName = '故障';
	}
	if (event.status ==2) {
		statusName = '超载';
	}
	if (event.status ==1) {
		statusName = '满载';
	}
	return statusName
}
const parseModel = (event) => {
	let statusName = '无';
	if (event.model == 128) {
		statusName = '单体';
	}
	if (event.model ==64) {
		statusName = '并联';
	}
	if (event.model ==32) {
		statusName = '群控';
	}
	return statusName
}
const randomHexColor = () => { // 随机生成十六进制颜色
	let hex = Math.floor(Math.random() * 11777216).toString(16); // 生成ffffff以内16进制数
	while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
		hex = `0${hex}`;
	}
	return `#${hex}`; // 返回‘#'开头16进制颜色
};

const getRecord = (offset) => {
	offset = offset || 0;
	return {
		time: new Date().getTime() + offset * 1000,
		value: Math.random() + 10,
	};
};
const data = [{
	time: 0,
	value: 0,
}];

@connect(({ ctrl }) => ({
  ctrl,
}))
export default class CtrlRealtime extends Component {
	state = {
		floor:[],
		leftAnimation: {
			left: '0%',
			duration: 100,
		},
		rightAnimation: {
			right: '0%',
			duration: 100,
		},
		pick: '',
		modal: false,
		src: '',
		sliderCurrent: 0,
		event:{
			run:[],
			lock:[],
			close:[],
			model:[],
			status:[],
			upCall:[],
			downCall:[],
			openBtn:[],
			closeBtn:[],
			floor:[],
			nums:[1,2,3,4,5,6,7,8,9,10],
		},
		show:{
			run:'',
			lock:'',
			close:'',
			model:'',
			status:'',
			upCall:'',
			downCall:'',
			openBtn:'',
			closeBtn:'',
			floor:'',
			nowtime:'',
			updateTime:'',
		},
		doorWidth: 4096,
		historyEvents:[],
		sliderMax: 0,
		wave: [],
		startTime: 0,
		stop: true,
		interval:500,
		run:[],
		lock:[],
		close:[],
	}
	componentWillMount() {
		this.getfloor()
	}
	componentDidMount() {
		this.getfloor()
	} 
	initWebsocket = () =>{ //初始化weosocket
		const { dispatch, location } = this.props;
		const {pick} = this.state;
		const match = pathToRegexp('/ctrl/:id/realtime').exec(location.pathname);
		const device_id = match[1];
		getFollowDevices({device_id}).then((res)=>{
			if(res.code == 0){
				const op = 'open';
				const IMEI = res.data.list[0].IMEI;
				const interval = 1000;
				const threshold = 1;
				const reset = this.state.pick;
				const duration = reset[0];
				const device_type = '240';
				const type = '0';
				postMonitor({ op, IMEI, interval, threshold, duration, device_type}).then((res) => {});
			}
		})
		const wsurl = 'ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+device_id;
		const websock = new WebSocket(wsurl);
		websock.onopen = this.websocketonopen;
		websock.onerror = this.websocketonerror;
		const _this = this;
		websock.onmessage= (e) =>{
			if(e.data=="closed"){
				alert("此次实时数据已结束")
				_this.state.stop = 1
			}else{
				var redata = JSON.parse(e.data)
				_this.getData(redata)
			}
		}
	}
	websocketonopen() {
		console.log("WebSocket连接成功");
		alert("请等待接收数据");
	}
	websocketonerror(e) { //错误
		console.log("WebSocket连接发生错误");
	}
	async closed(){//数据发送
		let res = await this.$api.monitor({
			IMEI:this.query.IMEI,
			op:'closed',
		});
	}
	websocketclosed(){
		console.log("1")
	}
	onChange = async (val) => {		
		await this.setState({
			pick: val,
		});
		this.initWebsocket()
	}
	getData = (val) => {
		const {show, floor} = this.state
		let buffer = []
		buffer = base64url.toBuffer(val.data);	//8位转流
		let count= 0
		var inte = setInterval(function () {
			if((count+33) <= buffer.length){
				show.upCall   = buffer[count+0]&0x01
				show.downCall = (buffer[count+0]&0x02)>>1
				show.run      = (buffer[count+0]&0x04)>>2					//获取运行信号
				show.lock     = (buffer[count+0]&0x08)>>3					//获取门锁信号
				show.openBtn  = (buffer[count+0]&0x40)>>6					//获取开门按钮信号
				show.closeBtn = (buffer[count+0]&0x80)>>7					//获取关门按钮信号
				show.close    = (buffer[count+0]&0x10)>>5					//获取关门信号
				show.model    = buffer[count+1]&0xff						//获取电梯模式
				show.status   = buffer[count+2]&0xff						//获取电梯状态				
				show.floor    = buffer[count+28]&0xff           //获取电梯当前楼层

				count+=33
			}
		}, this.state.interval);
		this.showChart()
	}
	getfloor = (val) => {
		const {show, } = this.state
		const { dispatch, location } = this.props;
		const {pick} = this.state;
		const match = pathToRegexp('/ctrl/:id/realtime').exec(location.pathname);
		const device_id = match[1];
		getFloorData({device_id}).then((res) => {
			if(res.code == 0){
				let buffer = [];
				let arr = [];
				let floor = [];
				buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
				buffer.forEach((item) => {
					arr.push(String.fromCharCode(item))
				})
				let high = arr.length/3;
				for(let i=0; i<high;i++){
					floor[high-1-i]=arr[i*3]+arr[i*3+1]+arr[i*3+2]
					if(floor[i] == 'GQQ'){
						floor[i] = '1'
					}
				}
				for(let i=0; i<high-2;i+=3){
					let a = floor[i]
					floor[i]=floor[i+2]
					floor[i+2] = a
					if(high%3==2){
						const last = floor[high-1]
						floor[high-1] = floor[high-2]
						floor[high-2] = last
					}
				}
				show.updateTime = res.data.list[0].t_update
				this.setState({
					floor,
				});
			}else{
				alert("获取楼层高度失败！")
			}
			
		});
	}
	showChart = () =>{
		const {event} = this.props;
		const {run,lock,close,} = this.state;
		let Run = echarts.init(document.getElementById('run'))
		let Lock = echarts.init(document.getElementById('lock'))
		let Close = echarts.init(document.getElementById('close'))
		var _this = this
		var inte = setInterval(function () {
			if(_this.state.stop == 1){
				clearInterval(inte)
			}
			run.push(_this.state.show.run)
			lock.push(_this.state.show.lock)
			close.push(_this.state.show.close)
			if(run.length > 10){
				run.shift()
				lock.shift()
				close.shift()
			}
			Run.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data:['运行信号']
				},
				grid: {					
					left: '3%',
					right: '4%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: _this.state.event.nums,
				},
				yAxis: {
					data:[0,1]
				},
				series: [{
					name:'运行信号',
					type:'line',
					step: 'start',
					data:_this.state.run
				}]
			});
			Lock.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data:['门锁信号']
				},
				grid: {					
					left: '3%',
					right: '4%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: _this.state.event.nums,
				},
				yAxis: {
					data:[0,1]
				},
				series: [{
					name:'门锁信号',
					type:'line',
					step: 'start',
					data:_this.state.lock
				}]
			});
			Close.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data:['关门信号']
				},
				grid: {					
					left: '3%',
					right: '4%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: _this.state.event.nums,
				},
				yAxis: {
					data:[0,1]
				},
				series: [{
					name:'关门信号',
					type:'line',
					step: 'start',
					data:_this.state.close
				}]
			});
		},1000)
	}
	goEvent = item => () => {
		const { history } = this.props;
		const id = this.props.match.params.id;
		history.push(`/events/ctrl/${item.id}/`);
	}
	timeTicket = null;

	goDetail = link => () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/ctrl/${id}/${link}`);
	}
	goQrcode = () => {
		const device_id = this.props.match.params.id;
		getDeviceList({device_id}).then((res)=>{
			const id = res.data.list[0].IMEI
			this.setState({
				src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://server.asynciot.com/company/follow/${id}`,
				modal: true,
			});
			console.log(this.state.src)
		})
	}
	goDebug = () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/company/debug/${id}`);
	}
	render() {
		let { ctrl: { event, view, device, floors, property, } } = this.props;
		const { floor} = this.state;
		const id = this.props.match.params.id;
		return (
			<div className="content tab-hide">
				<div className={styles.content}>
					<Modal
						visible={this.state.modal}
						transparent
						maskClosable={false}
						title="二维码"
						footer={[{ text: '确定', onPress: () => this.setState({modal: false}) }] }
						wrapProps={{ onTouchStart: this.onWrapTouchStart }}
					>
						<div className="qrcode">
							<Spin className="qrcode-loading"/>
							<img src={this.state.src} alt="code"/>
						</div>
					</Modal>
					<Row type="flex" justify="center" align="middle">
							<Col span={24}>
								<List style={{ backgroundColor: 'white' }} className="picker-list">
									<Picker
										title="实时时长"
										cols={1}
										data={timeList}
										value={this.state.pick}
										onOk={v => this.onChange(v)}
									>
										<List.Item arrow="horizontal">实时时长</List.Item>
									</Picker>
								</List>
							</Col>
					</Row>
					<div className={classNames(styles.tab, view == 0 ?'tab-active' : 'tab-notactive')}>
						<Row
							type="flex"
							justify="space-around"
							align="middle"
							className={styles.ladder}
						>
							<Col
								span={24}
								className={classNames(styles.door)}
							>
								<section>
									<p>运行信号 ：<i className={styles.status}>{this.state.show.run ? '运行':'停车'}</i>
									</p>
									{/* <p>速度 ：<i className={styles.status}>0.5m/s</i>
									</p> */}
									<p>门锁信号 ：<i className={styles.status}>{this.state.show.lock ? '通':'断'}</i>
									</p>
									<p>按钮信号 ：<i className={styles.status}>{this.state.show.btn}</i>
									</p>
									<p>开门信号 ：<i className={styles.status}>{this.state.show.open ? '动作':'不动作'}</i>
									</p>
									<p>关门信号 ：<i className={styles.status}>{this.state.show.close ? '动作':'不动作'}</i>
									</p>
									<p>电梯模式 ：<i className={styles.status}>{parseModel(this.state.show.model)}</i>
									</p>
									<p style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}
									>状态 ：<i className={styles.status}>{parseStatus(this.state.show.status)}</i>
									</p>
									<p
										style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}
									>
										最后更新时间 ：
										<i className={styles.status}>{moment(this.state.show.updateTime).format('YYYY-MM-DD HH:mm:ss')}</i>
									</p>
									{/* <p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}
									>
										电梯外已按向上楼层 ：
										<i className={styles.status}>-1 1 7</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}
									>
										电梯外已按向下楼层 ：
										<i className={styles.status}>-1 1 7</i>
									</p> */}
								</section>
							</Col>
						</Row>
						<div>
								<Col span={16}>
									<div className={styles.outer}>
										<div className={styles.inner}>
												<section></section>
												<section></section>
										</div>
									</div>
								</Col>
								<Col span={8}>	
									<div className={styles.info}>
										<p>
											<Icon className={styles.icon} type={direction[`${this.state.show.toDown}${this.state.show.toUp}`]} />
											<i>{this.state.show.floor}</i>
										</p>
										<ul>
											{
												floor.map((item,index) => (
													<li style={{ width: 40}} key={`${item}${index}`}>{item}</li>
												))
											}
										</ul>
									</div>
								</Col>	
						</div>
						<div className={styles.btns}>
							{/*<section onClick={() => this.props.history.push(`/company/statistics/details/${id}`)}>统计</section>*/}
							<section onClick={this.goDetail('params')}>参数</section>
							<section onClick={this.goQrcode}>二维码</section>
							<section onClick={this.goDebug}>调试</section>
						</div>
					</div>
					<div className={classNames(styles.tab, view == 1 ?'tab-active' : 'tab-notactive')}>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>	            
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "run" style={{ width: 320 , height: 80 }}></div>              
							</Col>	            	            
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "lock" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "close" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}
