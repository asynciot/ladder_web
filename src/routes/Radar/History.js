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
import {getEvent,getDeviceList} from '../../services/api';
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
      duration: 5000,
    },
    rightAnimation: {
      right: '0%',
      duration: 5000,
    },
    pick: '',
    modal: false,
    src: '',
    sliderCurrent: 0,
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
			nums:[],
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
    sliderMax: 0,
    wave: [],
    startTime: 0,
    stop: true,
		interval:500,
		doorWidth:4096,
  }
  componentWillMount() {
		this.getHistory()
  }
	componentWillUpdate(){
		
	}
	getHistory = () => {
		const { dispatch, location, } = this.props;
		const { show,events} = this.state;
		const match = pathToRegexp('/door/:IMEI/history/:id').exec(location.pathname);
		const id = match[2];
		getEvent({id}).then((res) => {
			this.setState({
				historyEvents: res.data.list,				
			});
			if (res.code == 0) {
				let response = res.data.list[0]
				show.nowtime = response.time
				if(res.data.list[0].interval !=null ){					
					this.state.interval = res.data.list[0].interval
				}
				let buffer = []
				buffer = base64url.toBuffer(response.data);	//8位转流
				console.log(buffer)
				for(let i=0 ; i<response["length"] ; i++){
					show.openIn = events.openIn[i] = (buffer[i*8]&0x80)>>7						//获取开门信号
					show.closeIn = events.closeIn[i] = (buffer[i*8]&0x40)>>6						//获取关门信号
					show.openTo =	events.openTo[i] = (buffer[i*8+0]&0x20)>>5						//获取开到位输入信号
					show.closeTo = events.closeTo[i] = (buffer[i*8+0]&0x10)>>4						//获取关到位输入信号
					show.openDecelerate =	events.openDecelerate[i] = (buffer[i*8+0]&0x08)>>3				//开减速输入信号 
					show.closeDecelerate = events.closeDecelerate[i] = (buffer[i*8+0]&0x04)>>2			//关减速输入信号
					show.openToOut = events.openToOut[i] = (buffer[i*8]&0x02)>>1				//获取开到位输出信号
					show.closeToOut = events.closeToOut[i] = (buffer[i*8]&0x01)			//获取关到位输出信号			
					show.door	= events.door[i] = (buffer[i*8+1]&0x80)>>7										//门光幕信号
					show.open	= events.open[i] = (buffer[i*8+1]&0x40)>>6						    //正在开门信号
					show.close =	events.close[i] = (buffer[i*8+1]&0x20)>>5						  //正在关门信号
					show.openKeep	= events.openKeep[i] = (buffer[i*8+1]&0x10)>>4				//开门到位维持信号
					show.closeKeep	= events.closeKeep[i] = (buffer[i*8+1]&0x08)>>3			//关门到位维持信号
					show.stop	= events.stop[i] = (buffer[i*8+1]&0x04)>>2					      //停止输出信号
					show.inHigh = events.inHigh[i] = (buffer[i*8+1]&0x02)>>1						//输入电压过高
					show.inLow = events.inLow[i] = (buffer[i*8+1]&0x01)							//输入电压过低
					show.outHigh = events.outHigh[i] = (buffer[i*8+2]&0x80)>>7					      //输出过流
					show.motorHigh = events.motorHigh[i] = (buffer[i*8+2]&0x40)>>6			//电机过载
					show.flySafe = events.flySafe[i] = (buffer[i*8+2]&0x20)>>5					//飞车保护
					show.closeStop = events.closeStop[i] = (buffer[i*8+2]&0x10)>>4			//开关门受阻
					show.position	= events.position[i] = ((buffer[i*8+2]&0x0f)<<8)+(buffer[i*8+3]&0xff)					//获取位置信号
					show.current = events.current[i] = (((buffer[i*8+4]&0xff)<<8)+(buffer[i*8+5]&0xff))/1000		//获取电流信号
					events.speed[i] = (((buffer[i*8+6]&0xff)<<8)+(buffer[i*8+7]&0xff))/1000
					events.nums[i] = i
					if(events.speed[i]>32.767){
						events.speed[i] = events.speed[i]-65.535
						show.speed = events.speed[i]
					}
				}
				this.setState({
					show,
					events,
				});
				setTimeout(() => {
					this.showChart()
				},this.state.interval)				
			}
		}).catch((e => console.info(e)));
		this.forceUpdate();
	}
	showChart = () =>{
		const {events} = this.props;
		let OpenIn = echarts.init(document.getElementById('OpenIn'));
		let OpenTo = echarts.init(document.getElementById('OpenTo'));
		let CloseIn = echarts.init(document.getElementById('CloseIn'));
		let Decelerate = echarts.init(document.getElementById('Decelerate'));
		let Current = echarts.init(document.getElementById('Current'));
		let Speed = echarts.init(document.getElementById('Speed'));
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
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开门信号',
				type:'line',
				step: 'start',
				data:this.state.events.openIn,
			},{
				name:'关门信号',
				type:'line',
				step: 'start',
				data:this.state.events.closeIn,				
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
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开到位输入信号',
				type:'line',
				step: 'start',
				data:this.state.events.OpenTo,
			},{
				name:'关到位输入信号',
				type:'line',
				step: 'start',
				data:this.state.events.closeTo,				
			}]
		})
		CloseIn.setOption({
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
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开门到位输出信号',
				type:'line',
				step: 'start',
				data:this.state.events.openToOut,
			},{
				name:'关门到位输出信号',
				type:'line',
				step: 'start',
				data:this.state.events.closeToOut,
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
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开减速输入信号',
				type:'line',
				step: 'start',
				data:this.state.events.openDecelerate,
			},{
				name:'关减速输入信号',
				type:'line',
				step: 'start',
				data:this.state.events.closeDecelerate,
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
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'电流',
				type:'line',
				step: 'start',
				data:this.state.events.current,
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
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'速度',
				type:'line',
				step: 'start',
				data:this.state.events.speed,
			}]
		})
		var _this = this
		function ss(i){
			_this.state.show.openIn  = _this.state.events.openIn[i]					//获取开门信号
			_this.state.show.closeIn = _this.state.events.closeIn[i]				//获取关门信号
			_this.state.show.openToOut = _this.state.events.openToOut[i]				//获取开到位输出信号
			_this.state.show.closeToOut = _this.state.events.closeToOut[i]				//获取关到位输出信号
			_this.state.show.openDecelerate =	_this.state.events.openDecelerate[i] 				//开减速输入信号 
			_this.state.show.closeDecelerate = _this.state.events.closeDecelerate[i]			//关减速输入信号
			_this.state.show.closeTo = _this.state.events.closeTo[i]				//获取关到位输入信号				
			_this.state.show.openTo =	_this.state.events.openTo[i]				//获取开到位输入信号
			_this.state.show.door	= _this.state.events.door[i]					//门光幕信号
			_this.state.show.open	= _this.state.events.open[i]					//正在开门信号
			_this.state.show.close =	_this.state.events.close[i]				//正在关门信号
			_this.state.show.openKeep	= _this.state.events.openKeep[i]				//开门到位维持信号
			_this.state.show.closeKeep = _this.state.events.closeKeep[i]				//关门到位维持信号
			_this.state.show.stop	= _this.state.events.stop[i]					//停止输出信号
			_this.state.show.inHigh = _this.state.events.inHigh[i]					//输入电压过高
			_this.state.show.inLow = _this.state.events.inLow[i]					//输入电压过低
			_this.state.show.outHigh = _this.state.events.outHigh[i]				//输出过流
			_this.state.show.motorHigh = _this.state.events.motorHigh[i]				//电机过载
			_this.state.show.flySafe = _this.state.events.flySafe[i]				//飞车保护
			_this.state.show.position	= _this.state.events.position[i]				//获取位置信号
			_this.state.show.closeStop = _this.state.events.closeStop[i]				//开关门受阻
			_this.state.show.current = _this.state.events.current[i]			//获取电流信号
			_this.state.show.speed = _this.state.events.speed[i]
		}
		OpenIn.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		OpenTo.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		Current.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		Decelerate.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		CloseIn.on('click',function (params){					
			var i = params.name;//横坐标的值
			ss(i)
		});
		Speed.on('click',function (params){					
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
		const type = 'door'
		history.push(`/events/${item.type}/${item.id}/`);
	}
	goDetail = link => () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/door/${id}/params`);
	}
  goQrcode = () => {
    const id = this.props.match.params.id;
    this.setState({
      src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://server.asynciot.com/company/follow/${id}`,
      modal: true,
    });    
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
							<List style={{ backgroundColor: 'white' }} className="picker-list" onClick={() => this.props.history.push(`/events/door/${id}`)}>
								<List.Item arrow="horizontal" onClick={() => this.props.history.push(`/events/door/${id}`)}>历史事件</List.Item>
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
                  <p>门坐标 ：<i className={styles.status}>{this.state.show.position || this.state.show.position === 0 ? this.state.show.position : '0'}</i>
                  </p>
                  <p>门电流 ：<i className={styles.status}>{`${this.state.show.current} A`}</i>
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
                    <i className={styles.status}>{moment(this.state.show.nowtime).format('YYYY-MM-DD HH:mm:ss')}</i>
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
            			<div id = "CloseIn" style={{ width: 320 , height: 80 }}></div>
            	</Col>
            </Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>	              
									<div id = "Decelerate" style={{ width: 320 , height: 80 }}></div>
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
