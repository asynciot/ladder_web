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
import styles from './CtrlHistory.less';
import echarts from 'echarts';
import {getEvent,getDeviceList} from '../../services/api';
const tabs = [
  { title: '门' },
  { title: '分屏' },
  { title: '滤波' },
];
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
export default class CtrlHistory extends Component {
  state = {
		floor: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2],
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
			nums:[],
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
		},
		doorWidth: 4096,
		historyEvents:[],
    sliderMax: 0,
    wave: [],
    startTime: 0,
    stop: true,
		interval:500,
  }
  componentWillMount() {
		this.getHistory()
  }
	componentWillUpdate(){
		this.showChart()
	}
	getHistory = () => {
		const { dispatch, location, property, } = this.props;
		const { show,event} = this.state;
		const match = pathToRegexp('/ctrl/:IMEI/history/:id').exec(location.pathname);
		const id = match[2];
		getEvent({id}).then((res) => {
			this.setState({
				historyEvents: res.data.list,				
			});
			if (res.code === 0) {
				let response = res.data.list[0]
				show.nowtime = response.time
				if(res.data.list[0].interval !=null ){					
					interval = res.data.list[0].interval
				}
				let buffer = []
				buffer = base64url.toBuffer(response.data);	//8位转流
				for(let i=0 ; i<response["length"] ; i++){
					show.upCall   = event.upCall[i] = buffer[i*8]&0x01
					show.downCall = event.downCall[i] = (buffer[i*8]&0x02)>>1
					show.run      = event.run[i] = (buffer[i*8]&0x04)>>2				//获取运行信号
					show.lock     = event.lock[i] = (buffer[i*8]&0x08)>>3					//获取门锁信号
					show.openBtn  = event.openBtn[i] = (buffer[i*8]&0x40)>>6				//获取开门按钮信号
					show.closeBtn = event.closeBtn[i] = (buffer[i*8]&0x80)>>7					//获取关门按钮信号
					show.close    = event.close[i] = (buffer[i*8]&0x10)>>5					//获取关门信号
					show.model    = event.model[i] =  buffer[i*8+1]&0xff						//获取电梯模式
					show.status   = event.status[i] = buffer[i*8+2]&0xff						//获取电梯状态					
					event.floor[i] = buffer[i*8+3]&0xff
					if(event.floor[i]>=this.state.floor.length){
						show.floor = this.state.floor.length-1
					}
				}
				this.setState({
					show,
					event,
					interval,
				});
				setTimeout(() => {
					this.showChart()
				},this.state.interval)				
			}
		}).catch((e => console.info(e)));
	}
	showChart = () =>{
		const {event} = this.props;
		let run = echarts.init(document.getElementById('run'))
		let lock = echarts.init(document.getElementById('lock'))
		let close = echarts.init(document.getElementById('close'))
		run.setOption({
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
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'运行信号',
				type:'line',
				step: 'start',
				data:this.state.event.run
			}]
		});
		lock.setOption({
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
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'门锁信号',
				type:'line',
				step: 'start',
				data:this.state.event.lock
			}]
		});
		close.setOption({
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
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'关门信号',
				type:'line',
				step: 'start',
				data:this.state.event.close
			}]
		});
		var _this = this
		function ss(i){
			_this.state.show.run = _this.state.event.run[i]
			_this.state.show.lock = _this.state.event.lock[i]
			_this.state.show.openBtn = _this.state.event.openBtn[i]
			_this.state.show.closeBtn = _this.state.event.closeBtn[i]
			_this.state.show.close = _this.state.event.close[i]
			_this.state.show.model = _this.state.event.model[i]
			_this.state.show.status = _this.state.event.status[i]
			_this.state.show.upCall = _this.state.event.upCall[i]
			_this.state.show.downCall = _this.state.event.downCall[i]
		}
		run.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		lock.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		close.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)	
		});
	}
  onChange = (val) => {
		this.setState({
			pick: val,
		});
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
		})
	}
	goDebug = () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/company/debug/${id}`);
	}
  render() {
  	let { ctrl: { event, view, device, floors, property} } = this.props;
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
							<List style={{ backgroundColor: 'white' }} className="picker-list" onClick={() => this.props.history.push(`/events/ctrl/${id}`)}>
								<List.Item arrow="horizontal" onClick={() => this.props.history.push(`/events/ctrl/${id}`)}>历史事件</List.Item>
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
  									<i className={styles.status}>{moment(property.updateTimee).format('YYYY-MM-DD HH:mm:ss')}</i>
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
										<i>{floor[this.state.show.floor]}</i>
									</p>
									<ul>
										{
											floor.map((item,index) => (
												<li style={{ width: 50}} key={`${item}${index}`}>{item}</li>
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
