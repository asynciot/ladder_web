import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Switch, } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './Realtime.less';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import {getEvent, postMonitor, getFollowDevices, getDeviceList, getDoorData} from '../../services/api';

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

const alert = Modal.alert;
const alertName = (show) => {
  if (show.isLoss) {
    return '无';
  }
  let str = '';
  if (show.inHigh) {
    str += ' 输入电压过高 ';
  }
  if (show.inLow) {
    str += ' 输入电压过低 ';
  }
  if (show.outHigh) {
    str += ' 输出过流 ';
  }
  if (show.motorHigh) {
    str += ' 电机过载 ';
  }
  if (show.flySafe) {
    str += ' 飞车保护 ';
  }
  if (show.closeStop) {
    str += ' 开关门受阻 ';
  }
  if (str === '') {
    str = '运行正常';
  }
  return str;
};
var inte =null;
var websock = '';
const data = [{
  time: 0,
  value: 0,
}];
@connect(({ device, user }) => ({
  device,
	currentUser: user.currentUser
}))
export default class DoorHistory extends Component {
  state = {
	charts:true,
    leftAnimation: {
		left: '0%',
		duration: 1000,
    },
    rightAnimation: {
		right: '0%',
		duration: 1000,
    },
	switch:false,
    pick: '',
    modal: false,
	type:'',
    src: '',
	doorWidth:4096,
	change:false,
	openInarr:[],
	openToarr:[],
	openDeceleratearr:[],
	closeDeceleratearr:[],
	closeInarr:[],
	closeToarr:[],
	openToOutarr:[],
	closeToOutarr:[],
	positionarr:[],
	currentarr:[],
	speedarr:[],
	events:{
		openIn:[],
		closeIn:[],
		current:[],
		openDecelerate:[],
		closeDecelerate:[],
		openToOut:[],
		openTo:[],
		closeToOut:[],
		closeTo:[],
		door:[],
		open:[],
		close:[],
		openKeep:[],
		closeKeep:[],
		stop:[],
		inHigh:[],
		inLow:[],
		outHigh:[],
		motorHigh:[],
		flySafe:[],
		closeStop:[],
		position:[],
		speed:[],
		nums:[1,2,3,4,5,6,7,8,9,10],
	},
	show:{
		openIn:'',
		closeIn:'',
		current:'',
		openDecelerate:'',
		closeDecelerate:'',
		openToOut:'',
		openTo:'',
		closeToOut:'',
		closeTo:'',
		door:'',
		open:'',
		close:'',
		openKeep:'',
		closeKeep:'',
		stop:'',
		inHigh:'',
		inLow:'',
		outHigh:'',
		motorHigh:'',
		flySafe:'',
		closeStop:'',
		position:'',
		speed:'',
		nowtime:'',
	},
	historyEvents:[],
	id:0,
  }
  componentWillMount() {
		const {location} = this.props;
		this.state.id = this.props.match.params.id
		this.getType()
		this.getBaseData()
		this.initWebsocket()
  }
	componentWillUnmount() {
		this.state.charts = false;
		clearInterval(inte)
		websock.close()
	}
	initWebsocket = () =>{ //初始化weosocket
		const { currentUser } = this.props;
		const device_id = this.state.id
		const userId = currentUser.id
		const wsurl = 'ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+device_id+'&userId='+userId;
		websock = new WebSocket(wsurl);
		websock.onopen = this.websocketonopen;
		websock.onerror = this.websocketonerror;
		const _this = this;
		websock.onmessage= (e) =>{
			if(e.data=="closed"){
				alert("数据传输结束")
				this.state.switch = false;
				_this.state.stop = 1
				websock.close()
				this.forceUpdate()
			}else{
				var redata = JSON.parse(e.data)
				_this.getData(redata)
			}
		}
		websock.onclose = this.websocketclosed;
	}
	websocketonopen() {
		console.log("WebSocket连接成功");
	}
	websocketonerror(e) { //错误
		console.log("WebSocket连接发生错误");
	}
	websocketclosed(){
		console.log("WebSocket连接关闭");
	}
	onChange = async (val) => {
		this.state.switch = !this.state.switch
		this.forceUpdate()
		if(this.state.switch == true){
			this.initWebsocket()
			const device_id = this.state.id
			getFollowDevices({device_id}).then((res)=>{
				if(res.code == 0){
					const op = 'open';
					const IMEI = res.data.list[0].IMEI;
					const interval = 1000;
					const threshold = 2;
					const duration = 600;
					const device_type = '15';
					const type = '0';
					postMonitor({ op, IMEI, interval, threshold, duration, device_type, type,}).then((res) => {});
					alert("请不要离开当前页面，等待数据传输");
				}else if(res.code == 670){
					alert("当前设备已被人启动监控")
				}
			})
		}else{
			websock.close()
			this.forceUpdate()
		}
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
	getType = () =>{
		const device_id = this.state.id
		getFollowDevices({ num: 1, page:1, device_type:15, device_id }).then((res) => {
			this.state.type = res.data.list[0].device_model
		})
	}
	getBaseData = () => {
		const {show} = this.state
		const device_id = this.state.id
		getDoorData({device_id,type:4096,num:1,page:1}).then((res) => {
			let buffer = []
			buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
			show.openIn = (buffer[0]&0x80)>>7 									//获取开门输入信号
			show.closeIn = (buffer[0]&0x40)>>6						//获取关门输入信号
			show.openTo =	(buffer[0]&0x20)>>5								//获取开到位输入信号
			show.closeTo = (buffer[0]&0x10)>>4								//获取关到位输入信号	
			show.openDecelerate =	(buffer[0]&0x08)>>3				//开减速输入信号 
			show.closeDecelerate = 	(buffer[0]&0x04)>>2		//关减速输入信号
			show.openToOut = (buffer[0]&0x02)>>1					//获取开到位输出信号
			show.closeToOut = buffer[0]&0x01					//获取关到位输出信号			
			show.door	= (buffer[1]&0x80)>>7								//门光幕信号
			show.open	= (buffer[1]&0x40)>>6								//正在开门信号
			show.close =	(buffer[1]&0x20)>>5						//正在关门信号
			show.openKeep	= (buffer[1]&0x10)>>4						//开门到位维持信号
			show.closeKeep	= (buffer[1]&0x08)>>3						//关门到位维持信号
			show.stop	= (buffer[1]&0x04)>>2								//停止输出信号
			show.inHigh = (buffer[1]&0x02)>>1							//输入电压过高
			show.inLow = 	buffer[1]&0x01								//输入电压过低
			show.outHigh = (buffer[2]&0x80)>>7						//输出过流
			show.motorHigh = (buffer[2]&0x40)>>6				//电机过载
			show.flySafe = (buffer[2]&0x20)>>5						//飞车保护
			show.closeStop = (buffer[2]&0x10)>>4					//开关门受阻
			show.position	= ((buffer[2]&0x0f)<<8)+(buffer[3]&0xff)		//获取位置信号
			show.current = (((buffer[4]&0xff)<<8)+(buffer[5]&0xff))/1000		//获取电流信号
			show.speed = (((buffer[6]&0xff)<<8)+(buffer[7]&0xff))/1000
			if(show.speed>32.767){
				show.speed = show.speed-65.535
			}
			show.updateTime = res.data.list[0].t_update
		});
		if(this.state.type == '1'){
			getDoorData({device_id,num:1,page:1,type:4100}).then((res) => {
				let buffer = []
				buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
				const hex = this.buffer2hex(buffer)
				this.state.doorWidth =parseInt((hex[26] + hex[27]), 16);
			});
		}else{
			getDoorData({device_id,num:1,page:1,type:4101}).then((res) => {
				let buffer = []
				buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
				const hex = this.buffer2hex(buffer)
				this.state.doorWidth =parseInt((hex[14] + hex[15]), 16);
			});
		}
		this.forceUpdate();
	}
	getData = (val) => {
		const {show} = this.state
		let buffer = []
		buffer = base64url.toBuffer(val.data);	//8位转流
		let count= 0
		const _this = this
		inte = setInterval(function () {
			if((count+8) <= buffer.length){
				show.openIn = (buffer[count+0]&0x80)>>7							//获取开门输入信号
				show.closeIn = (buffer[count+0]&0x40)>>6						//获取关门信号
				show.openTo =	(buffer[count+0]&0x20)>>5						//获取开到位输入信号
				show.closeTo = (buffer[count+0]&0x10)>>4						//获取关到位输入信号	
				show.openDecelerate =	(buffer[count+0]&0x08)>>3				//开减速输入信号 
				show.closeDecelerate = (buffer[count+0]&0x04)>>2				//关减速输入信号
				show.openToOut = (buffer[count+0]&0x02)>>1						//获取开到位输出信号
				show.closeToOut = buffer[count+0]&0x01							//获取关到位输出信号			
				show.door	= (buffer[count+1]&0x80)>>7							//正在门光幕
				show.open	= (buffer[count+1]&0x40)>>6							//正在开门信号
				show.close =	(buffer[count+1]&0x20)>>5						//正在关门信号
				show.openKeep	= (buffer[count+1]&0x10)>>4						//开门到位维持信号
				show.closeKeep	= (buffer[count+1]&0x08)>>3						//关门到位维持信号
				show.stop	= (buffer[count+1]&0x04)>>2							//停止输出信号
				show.inHigh = (buffer[count+1]&0x02)>>1							//输入电压过高
				show.inLow = 	buffer[count+1]&0x01							//输入电压过低
				show.outHigh = (buffer[count+2]&0x80)>>7						//输出过流
				show.motorHigh = (buffer[count+2]&0x40)>>6						//电机过载
				show.flySafe = (buffer[count+2]&0x20)>>5						//飞车保护
				show.closeStop = (buffer[count+2]&0x10)>>4						//开关门受阻
				show.position	= ((buffer[count+2]&0x0f)<<8)+(buffer[count+3]&0xff)		//获取位置信号
				show.current = (((buffer[count+4]&0xff)<<8)+(buffer[count+5]&0xff))/1000		//获取电流信号
				show.speed = (((buffer[count+6]&0xff)<<8)+(buffer[count+7]&0xff))/1000
				if(show.speed>32.767){
					show.speed = (show.speed-65.535).toFixed(2)
				}
				_this.state.openInarr.push(show.openIn)
				_this.state.openToarr.push(show.openTo)
				_this.state.openToOutarr.push(show.openToOut)
				_this.state.openDeceleratearr.push(show.openDecelerate)
				_this.state.closeDeceleratearr.push(show.closeDecelerate)
				_this.state.closeInarr.push(show.closeIn)
				_this.state.closeToarr.push(show.closeTo)
				_this.state.closeToOutarr.push(show.closeToOut)
				_this.state.positionarr.push(show.position)
				_this.state.currentarr.push(show.current)
				_this.state.speedarr.push(show.speed)
				count+=8
				if(_this.state.charts){
					_this.showChart()
					_this.forceUpdate();
				}
			}
		}, this.state.interval/2);
	}
	showChart = () =>{
		const {openInarr, closeInarr, openToarr, closeToarr, positionarr, currentarr, speedarr,
		openToOutarr, openDeceleratearr, closeDeceleratearr, closeToOutarr
		} = this.state
		let OpenIn = echarts.init(document.getElementById('OpenIn'));
		let OpenTo = echarts.init(document.getElementById('OpenTo'));
		let Decelerate = echarts.init(document.getElementById('Decelerate'));
		let CloseTo = echarts.init(document.getElementById('CloseTo'));
		let Position = echarts.init(document.getElementById('Position'));
		let Current = echarts.init(document.getElementById('Current'));
		let Speed = echarts.init(document.getElementById('Speed'));
		var _this = this
		if(openInarr.length > 10){
			openInarr.shift()
			closeInarr.shift()
			openToarr.shift()
			closeToarr.shift()
			openToOutarr.shift()
			currentarr.shift()
			positionarr.shift()
			speedarr.shift()
		}
		OpenIn.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开门信号','关门信号']
			},
			grid: {					
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开门信号',
				type:'line',
				step: 'start',
				data:_this.state.openInarr,
			},{
				name:'关门信号',
				type:'line',
				step: 'start',
				data:_this.state.closeInarr,				
			}]
		})
		OpenTo.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开到位输入信号','关到位输入信号']
			},
			grid: {					
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开到位输入信号',
				type:'line',
				step: 'start',
				data:_this.state.openToarr,
			},{
				name:'关到位输入信号',
				type:'line',
				step: 'start',
				data:_this.state.closeToarr,				
			}]
		})
		CloseTo.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开门到位输出信号','关门到位输出信号']
			},
			grid: {					
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开门到位输出信号',
				type:'line',
				step: 'start',
				data:_this.state.openToOutarr,
			},{
				name:'关门到位输出信号',
				type:'line',
				step: 'start',
				data:_this.state.closeToOutarr,
			}]
		})
		Decelerate.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开减速输入信号','关减速输入信号']
			},
			grid: {					
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开减速输入信号',
				type:'line',
				step: 'start',
				data:_this.state.events.openDeceleratearr,
			},{
				name:'关减速输入信号',
				type:'line',
				step: 'start',
				data:_this.state.closeDeceleratearr,
			}]
		})
		Position.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['门坐标']
			},
			grid: {					
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'门坐标',
				type:'line',
				step: 'start',
				data:_this.state.positionarr,
			}]
		})
		Current.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['电流']
			},
			grid: {					
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'电流',
				type:'line',
				step: 'start',
				data:_this.state.currentarr,
			}]
		})
		Speed.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['速度']
			},
			grid: {					
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:_this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'速度',
				type:'line',
				step: 'start',
				data:_this.state.speedarr,
			}]
		})
	}
	goEvent = item => () => {
		const { history } = this.props;
		const id = this.state.id;
		history.push(`/events/door/${item.id}/`);
	}
	timeTicket = null;

	goDetail = link => () => {
		const id = this.state.id;
		const type = this.props.location.state.type
		this.props.history.push(`/door/${id}/params/${type}`);
	}
	goQrcode = () => {
		const device_id = this.state.id;
		getDeviceList({device_id}).then((res)=>{
			const id = res.data.list[0].IMEI
			this.setState({
				src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://server.asynciot.com/company/follow/${id}`,
				modal: true,
			});
		})
	}
	gohistory = () => {
		const id = this.state.id;
		this.props.history.push(`/company/door/${id}/fault`);
	}
	render() {
		const { device: { events, view, property, updateTime, }} = this.props;
		const id = this.state.id;
		const width = parseInt((window.innerWidth - 100) / 2);
		let type = null
		if (property.Model) {
			property.Model.value == "NSFC01-02T" ? type = 1 : type = 2
		} else {
			type = 1
		}
		let statusName = '无';
		if (this.state.show.openKeep) {
			statusName = '开门到位维持';
		}
		if (this.state.show.closeKeep) {
			statusName = '关门到位维持';
		}
		if (this.state.show.open) {
			statusName = '正在开门';
		}
		if (this.state.show.close) {
			statusName = '正在关门';
		}
		if (this.state.show.stop) {
			statusName = '停止输出';
		}
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
						<Col span={18}>
							<p className={styles.shishi}>实时监控:</p>
						</Col>
						<Col span={6}>
							<Switch
							  checkedChildren="开"
							  unCheckedChildren="关"
							  onChange={this.onChange}
							  checked={this.state.switch}
							  defaultChecked={this.state.switch}
							/>
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
									<p>门坐标 ：<i className={styles.status}>{this.state.show.position || this.state.show.position === 0 ? this.state.show.position : '0'}</i>
									</p>
									<p>门电流 ：<i className={styles.status}>{this.state.show.current} A</i>
									</p>
									{/*<p>开门次数 ：<i className={styles.status}>{this.state.show.times || '无'}</i>
									</p>*/}
									<p>开门信号 ：<i className={styles.status}>{this.state.show.openIn ? '开' : '关'}</i>
									</p>
									<p>关门信号 ：<i className={styles.status}>{this.state.show.closeIn ? '开' : '关'}</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}>门状态 ：<i className={styles.status}>{statusName || '无'}</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}>开到位输出信号 ：<i className={styles.status}>{this.state.show.openToOut ? '开' : '关'}</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}>关到位输出信号 ：<i className={styles.status}>{this.state.show.closeToOut ? '开' : '关'}</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}
									>
										<i style={{flexShrink: 0,}}>报警 ：</i>
										<i className={styles.status}>{alertName(this.state.show)}</i>
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
								</section>
							</Col>
						</Row>
						<Row
							type="flex"
							justify="space-around"
							align="middle"
							className={styles.ladder}
						>
							<Col
								span={21}
							>
								<div className={styles.shaft}>
									<section>
										<div />
									</section>
									<section className={styles.noborder}>
										<div />
									</section>
									<div className={styles.shaftinfo}>
										<p>关到位输入
											<i
												className={classNames(styles.signal, this.state.show.closeTo
												? styles.ready
												: '')}
											/>
										</p>
										<p>开到位输入
											<i
												className={classNames(styles.signal, this.state.show.openTo
												? styles.ready
												: '')}
											/>
										</p>
									</div>
								</div>
									<div className={styles.doors}>
									  <TweenOne
										animation={this.state.leftAnimation}
										// updateReStart={false}
										style={{ left: `-${(this.state.show.position / this.state.doorWidth) * 50}%` }}
										className={styles.doorbox}
									  />
										<section className={styles.doorstitle}>
											<div
												className={this.state.show.door
												? styles.screen
												: ''}
											/>
											<p>光幕信号</p>
										</section>
										<TweenOne
											animation={this.state.rightAnimation}
											style={{ right: `-${(this.state.show.position / this.state.doorWidth) * 50}%` }}
											className={styles.doorbox}
										/>
									</div>
								</Col>
							</Row>
					</div>
					<div className={classNames(styles.tab, view == 1 ?'tab-active' : 'tab-notactive')}>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>	            
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
											<div id = "OpenIn" style={{ width: 320 , height: 80 }}></div>              
							</Col>	            	            
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>	            
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "OpenTo" style={{ width: 320 , height: 80 }}></div>              
							</Col>	            	            
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "CloseTo" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "Decelerate" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "Position" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row> 
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "Current" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row> 
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "Speed" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row>
					</div>
					<div className={styles.btns}>
						{/*<section onClick={() => this.props.history.push(`/company/statistics/details/${id}`)}>统计</section>*/}
						<section onClick={this.goDetail(type == 2 ? 'params/2': 'params/1')}>菜单</section>
						<section onClick={this.goQrcode}>二维码</section>
						<section onClick={this.gohistory}>历史故障</section>
					</div>
				</div>
			</div>
		);
	}
}
