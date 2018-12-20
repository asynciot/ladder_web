import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker,  } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './History.less';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import {getEvent,postMonitor,getFollowDevices,getDeviceList} from '../../services/api';
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
const tabs = [
  { title: '门' },
  { title: '分屏' },
  { title: '滤波' },
];
const randomHexColor = () => { // 随机生成十六进制颜色
  let hex = Math.floor(Math.random() * 11777216).toString(16); // 生成ffffff以内16进制数
  while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
    hex = `0${hex}`;
  }
  return `#${hex}`; // 返回‘#'开头16进制颜色
};
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

@connect(({ device }) => ({
  device,
}))
export default class DoorHistory extends Component {
  state = {
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
		openInarr:[],
		closeInarr:[],
		closeToarr:[],
		openToarr:[],
		currentarr:[],
		speedarr:[],
		events:{
			openIn:[],
			closeIn:[],
			current:[],
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
    sliderMax: 0,
    wave: [],
    startTime: 0,
    stop: 0,
  }
  componentWillMount() {
		this.setAnimation();
  }
	initWebsocket = () =>{ //初始化weosocket
		const { dispatch, location } = this.props;
		const {pick} = this.state;
		const match = pathToRegexp('/door/:id/realtime').exec(location.pathname);
		const device_id = match[1];
		getFollowDevices({device_id}).then((res)=>{
			if(res.code == 0){
				const op = 'open';
				const IMEI = res.data.list[0].IMEI;
				const interval = 1000;
				const threshold = 1;
				const reset = this.state.pick;
				const duration = reset[0];
				const device_type = '15';
				const type = '0';
				postMonitor({ op, IMEI, interval, threshold, duration, device_type, type,}).then((res) => {});				
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
		alert("请等待接收数据")
	}
	websocketonerror(e) { //错误
		console.log("WebSocket连接发生错误");
	}
	websocketonmessage(e){ //数据接收
	}
	closed(){//数据发送
		const op = "closed"
		postMonitor({ op, device_id,}).then((res) => {});
	}
	websocketclosed(){
	}
	onChange = async (val) => {		
		await this.setState({
			pick: val,
		});
		this.initWebsocket()
	}
	getData = (val) => {
		const {show} = this.state
		let buffer = []
		buffer = base64url.toBuffer(val.data);	//8位转流
		let count= 0
		var inte = setInterval(function () {
			if((count+8) <= buffer.length){
				show.openIn = buffer[count+0]&0x01
				show.closeIn = (buffer[count+0]&0x02)>>1						//获取关门信号
				show.openToOut = (buffer[count+0]&0x40)>>6					//获取开到位输出信号
				show.closeToOut = (buffer[count+0]&0x80)>>7					//获取关到位输出信号
				show.openTo =	(buffer[count+0]&0x04)>>2								//获取开到位输入信号
				show.closeTo = (buffer[count+0]&0x08)>>3								//获取关到位输入信号				
				show.door	= buffer[count+1]&0x01								//正在开门信号
				show.open	= (buffer[count+1]&0x02)>>1								//正在开门信号
				show.close =	(buffer[count+1]&0x04)>>2						//正在关门信号
				show.openKeep	= (buffer[count+1]&0x08)>>3						//开门到位维持信号
				show.closeKeep	= (buffer[count+1]&0x10)>>4						//关门到位维持信号
				show.stop	= (buffer[count+1]&0x20)>>5								//停止输出信号
				show.inHigh = (buffer[count+1]&0x40)>>6							//输入电压过高
				show.inLow = (buffer[count+1]&0x80)>>7									//输入电压过低
				show.outHigh = buffer[count+2]&&0x01						//输出过流
				show.motorHigh = (buffer[count+2]&0x02)>>1				//电机过载
				show.flySafe = (buffer[count+2]&0x04)>>2						//飞车保护
				show.closeStop = (buffer[count+2]&0x08)>>3					//开关门受阻
				show.position	= ((buffer[count+2]&0xf0)<<4)+(buffer[count+3]&0xff)		//获取位置信号
				show.current = (((buffer[count+4]&0xff)<<8)+(buffer[count+5]&0xff))/1000		//获取电流信号
				show.speed = (((buffer[count+6]&0xff)<<8)+(buffer[count+7]&0xff))/1000
				if(show.speed>32.767){
					show.speed = show.speed-65.535
				}					
				count+=8
			}
		}, this.state.interval);
		this.showChart()
	}
	showChart = () =>{
		const {openInarr,closeInarr,openToarr,closeToarr,currentarr,speedarr,} = this.state
		let OpenIn = echarts.init(document.getElementById('OpenIn'));
		let CloseIn = echarts.init(document.getElementById('CloseIn'));
		let Current = echarts.init(document.getElementById('Current'));
		let Speed = echarts.init(document.getElementById('Speed'));
		var _this = this
		
		var inte = setInterval(function () {
			if(_this.state.stop == 1){
				clearInterval(inte)
			}
			openInarr.push(_this.state.show.openIn)
			closeInarr.push(_this.state.show.closeIn)
			openToarr.push(_this.state.show.openTo)
			closeToarr.push(_this.state.show.closeTo)
			currentarr.push(_this.state.show.current)
			speedarr.push(_this.state.show.speed)
			if(openInarr.length > 10){
				openInarr.shift()
				closeInarr.shift()
				openToarr.shift()
				closeToarr.shift()
				currentarr.shift()
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
			CloseIn.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data:['开门到位信号','关门到位信号']
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
					name:'开门到位信号',
					type:'line',
					step: 'start',
					data:_this.state.openToarr,
				},{
					name:'关门到位信号',
					type:'line',
					step: 'start',
					data:_this.state.closeToarr,
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
		},1000)		
	}
	goEvent = item => () => {
		const { history } = this.props;
		const id = this.props.match.params.id;
		history.push(`/events/door/${item.id}/`);
	}
  timeTicket = null;
  setAnimation = () => {
		const { device: {doorWidth,} } = this.props;
		this.setState({
			leftAnimation: {
				left: `-${(this.state.show.position / this.state.doorWidth) * 50}%`,
				duration: 500,
			},
			rightAnimation: {
				right: `-${(this.state.show.position / this.state.doorWidth) * 50}%`,
				duration: 500,
			},
		});
	}
	goDetail = link => () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/door/${id}/${link}`);
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
  render() {
    const { device: { events, view, property }} = this.props;
    const id = this.props.match.params.id;
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
                  <p>门坐标 ：<i className={styles.status}>{this.state.show.position || this.state.show.position === 0 ? this.state.show.position : '无'}</i>
                  </p>
                  <p>门电流 ：<i className={styles.status}>{isNaN(this.state.show.current) ? '无' : `${this.state.show.current} A`}</i>
                  </p>
                  <p>门状态 ：<i className={styles.status}>{statusName || '无'}</i>
                  </p>
                  <p>开门次数 ：<i className={styles.status}>{this.state.show.times || '无'}</i>
                  </p>
                  <p>开门信号 ：<i className={styles.status}>{this.state.show.openIn ? '开' : '关'}</i>
                  </p>
                  <p>关门信号 ：<i className={styles.status}>{this.state.show.closeIn ? '开' : '关'}</i>
                  </p>
                  <p>开到位输出信号 ：<i className={styles.status}>{this.state.show.openToOut ? '开' : '关'}</i>
                  </p>
                  <p>关到位输出信号 ：<i className={styles.status}>{this.state.show.closeToOut ? '开' : '关'}</i>
                  </p>
                  <p style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                  >
                    <i style={{
                      flexShrink: 0,
                    }}
                    >报警 ：
                    </i>
                    <i className={styles.status}>{alertName(this.state.show)}</i>
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
                  <p />
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
                    style={{ left: '0%' }}
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
                    style={{ right: '-0%' }}
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
            			<div id = "CloseIn" style={{ width: 320 , height: 80 }}></div>
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
            <section onClick={this.goDetail(type == 2 ? 'params/2': 'params/1')}>参数</section>
            <section onClick={this.goQrcode}>二维码</section>
          </div>
        </div>
      </div>
    );
  }
}
