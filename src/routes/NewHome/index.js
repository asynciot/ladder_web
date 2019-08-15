import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Carousel, WingBlank, List, Flex, Card, Modal, Badge} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault, postLocation, getFaultUntreted, getFollowDevices, getLadder } from '../../services/api';
import background3 from '../../assets/bg2.jpg';
import background2 from '../../assets/bg1.jpg';
import background4 from '../../assets/bg3.jpg';
import BMap  from 'BMap';
import { injectIntl, FormattedMessage } from 'react-intl';
import ReactEcharts from 'echarts-for-react';
import echartTheme from '../../assets/echartsTheme/walden.js';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入饼图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} placeholder`} {...restProps}>Block</div>
);

const alert = Modal.alert;
var INTE = null;
const Item = List.Item;
const Brief = Item.Brief;
var switchId = 0;
export default class Home extends Component {
	state = {
		data: [],
		imgHeight: 176,
		messages: [],
		doornum:0,
		ctrlnum:0,
		devicenum:0,
		dooroffline:0,
		ctrloffline:0,
		deviceoffline:0,
		deviceonline:0,
		devicelongoffline:0,
		devicesStatus: {
			dooronline:0,
			dooroffline:0,
			doorlongoffline:0,
			ctrlonline:0,
			ctrloffline:0,
			ctrllongoffline:0,
		},
		historyEvents: [],
		code:'',
	}
	componentWillMount() {
		echarts.registerTheme('myTheme',echartTheme);
		this.getdata();
		INTE = setInterval(()=>{
			this.getdata()
		},60000);
	}
	componentWillUnmount() {
		clearInterval(INTE)
	}
	getdata = () => {
		this.getMessages();
		this.getDevicesStatus();
		this.getFault();
		this.getDevice(1,0);
		this.getDevice(1,1);
		this.getDevice(1,2);
		this.getDevice(1,3);
	}
	getMessages = () => {
		getMessages({ num: 1, page: 1 }).then((res) => {
			if (res.code === 0) {
				this.setState({
					messages: res.data.list,
				});
			}
		}).catch((e => console.info(e)));
	}
	getDevicesStatus = () => {
		getDevicesStatus().then((res) => {
			if (res.code === 0) {
				this.setState({
					devicesStatus: res.data,
					doornum: parseInt(res.data.dooronline)+parseInt(res.data.dooroffline)+parseInt(res.data.doorlongoffline),
					ctrlnum:parseInt(res.data.ctrlonline)+parseInt(res.data.ctrloffline)+parseInt(res.data.ctrllongoffline),
				});
			}
			let num = parseInt(res.data.dooronline)+parseInt(res.data.dooroffline)+parseInt(res.data.doorlongoffline)+parseInt(res.data.ctrlonline)+parseInt(res.data.ctrloffline)+parseInt(res.data.ctrllongoffline)
			if(num==0){
        if(window.localStorage.getItem("language")=="zh"){
          alert("请在个人界面使用关注设备，或使用微信扫一扫关注设备！")
        }else{
          alert("Please use the Focus Device in your personal interface, or use Wechat Scan to Focus!")
        }
			}
		}).catch((e => console.info(e)));
	}
	getFault = () => {
		getFault({ num: 1, page: 1, state:"untreated", islast:1}).then((res) => {
				const list = res.data.list.map((item,index) => {
				const device_id = item.device_id
				getFollowDevices({num:1,page:1,device_id}).then((ind) => {
					this.state.historyEvents[0].addr=ind.data.list[0].install_addr;
					const historyEvents = this.state.historyEvents;
					this.setState({
						historyEvents,
					});
				})

				return item;
			})
			if (res.code === 0) {
				let code = res.data.list[0].code
				if(res.data.list[0].device_type=="ctrl"){
					this.setState({
						historyEvents: res.data.list,
						total:res.data.totalNumber,
						code:"E"+code.toString(16)
					});
				}else{
					code = (code+50)
					this.setState({
						historyEvents: res.data.list,
						total:res.data.totalNumber,
						code,
					});
				}
			}
		}).catch((e => console.info(e)));
		getFaultUntreted({ num: 10, page:1, islast:1, device_type:'door' }).then((res) => {
			const pos = res.data.list.map((item,index) => {
			})
			this.setState({
				dooroffline:res.data.totalNumber,
			});
		})
		getFaultUntreted({ num: 10, page:1, islast:1, device_type:'ctrl' }).then((res) => {
			const pos = res.data.list.map((item,index) => {
			})
			this.setState({
				ctrloffline:res.data.totalNumber,
			});
		})
	}
	getDevice = (val,state) => {
		let { navs } = this.state;
		const page = val
		switchId = state
		if(switchId == 0){
			state = ""
		}else if(switchId == 1){
			state = "online"
		}else if(switchId == 2){
			state = "longoffline"
		}else if(switchId == 3){
			state = "offline"
		}
		getLadder({ num: 10, page, state, follow:"yes"}).then((res) => {
			if(state==""){
				this.state.devicenum=res.data.totalNumber;
				const devicenum=this.state.devicenum;
				this.setState({
					devicenum,
				});
			}
			if(state=="online")
			{
				this.state.deviceonline=res.data.totalNumber;
				const deviceonline=this.state.deviceonline;
				this.setState({
					deviceonline,
				});
			}
			if(state=="longoffline"){
				this.state.devicelongoffline=res.data.totalNumber;
				const devicelongoffline=this.state.devicelongoffline;
				this.setState({
					devicelongoffline,
				});
			}
			if(state=="offline"){
				this.state.deviceoffline=res.data.totalNumber;
				const deviceoffline=this.state.deviceoffline;
				this.setState({
					deviceoffline,
				});
			}
		});
	}
	onpress = () =>{
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				console.log('您的位置：'+r.point.lng+','+r.point.lat);
				const lat = r.point.lat
				const lon = r.point.lng
				if (window.localStorage.getItem("language")=='en'){alert("Getting the current location")}
				if (window.localStorage.getItem("language")=='zh'){alert("正在获取当前位置")}
				postLocation({ lat, lon,}).then((res) => {
				})
			}
			else {
				alert('failed'+this.getStatus());
			}
		});
	}
	toMessagesPage = () => {
		const { history } = this.props;
		history.push('/company/message');
	}
	toFollowDevicePage = () => {
		const { history } = this.props;
		const vcode = 0;
		const device_type = "";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowDoorPage = () => {
		const { history } = this.props;
		const device_type = "15";
		history.push({
			pathname: '/company/followdoor/all',
			state: { device_type }
		});
	}
	toFollowDoorOnline = () => {
		const { history } = this.props;
		const vcode = 1;
		const device_type = "15";
		history.push({
			pathname: '/company/followdoor/online',
			state: { device_type }
		});
	}
	toFollowDoorOffline = () => {
		const { history } = this.props;
		const vcode = 2;
		const device_type = "15";
		history.push({
			pathname: '/company/followdoor/offline',
			state: { device_type }
		});
	}
	toFollowDoorLongOffline = () => {
		const { history } = this.props;
		const vcode = 3;
		const device_type = "15";
		history.push({
			pathname: '/company/followdoor/longoffline',
			state: { device_type }
		});
	}
	toFollowCtrlPage = () => {
		const { history } = this.props;
		const device_type = "240";
		history.push({
			pathname: '/company/followctrl/all',
			state: { device_type }
		});
	}
	toFollowCtrlOnline = () => {
		const { history } = this.props;
		const device_type = "240";
		history.push({
			pathname: '/company/followctrl/online',
			state: { device_type }
		});
	}
	toFollowCtrlOffline = () => {
		const { history } = this.props;
		const device_type = "240";
		history.push({
			pathname: '/company/followctrl/offline',
			state: { device_type }
		});
	}
	toFollowCtrlLongOffline = () => {
		const { history } = this.props;
		const device_type = "240";
		history.push({
			pathname: '/company/followctrl/longoffline',
			state: { device_type }
		});
	}
	toHistoryEventPage = () => {
		const { history } = this.props;
		history.push('/company/work-order');
	}
	getOption(){
		const {devicenum, deviceonline, deviceoffline, devicelongoffline}=this.state;
		let option={};
		if(devicenum!=0){
		option={

			title: {
				text: devicenum,
				subtext: '电梯总量',
				x: '29%',
				y: 'center',
				textAlign:'center',
				textStyle: {
					fontSize:30,
					fontWeight:'bold',
					color: ['#333']
				},
				subtextStyle: {
					fontSize:14,
					color: '#666',
				},
			},
			legend: {
				show:true,
				orient: 'vertical',
				top: "middle",
				right: "10%",
				icon: 'circle'

			},
			polar: {
				center: ['30%', '50%'],
				radius: '400%' //图形大小
			},
			angleAxis: {
				show: false,
				startAngle: 90,
				min: 0,
				max: 100
			},
			radiusAxis: {
				type: 'category',
				show: false,
				data: ["在线", "离线", "故障"]
			},
			series: [

				{
					type: "bar",
					name: "在线 "+deviceonline+"个",
					coordinateSystem: "polar",
					barWidth: 20, //宽度
					barCategoryGap: "40%",
					// data: ["76.25","47.09","22.09"],
					data: ["100"],
				},
				{
					type: "bar",
					name: "离线 "+devicelongoffline+"个",
					coordinateSystem: "polar",
					barWidth: 20,
					barCategoryGap: "40%",
					// data: ["14.09","55.09","27.09"]
					data: ["0"]
				},
				{
					type: "bar",
					name: "故障 "+deviceoffline+"个",
					coordinateSystem: "polar",
					barWidth: 20,
					barCategoryGap: "40%",
					// data: ["9.66","23.09","53.09"]
					data: ["0"]
				}
			]
		}
		}
		return option;
	}
	
	render() {
		const imgList = [
			// background1,
			background2,
			background3,
			background4,
		]
		const { devicesStatus, historyEvents, doornum, ctrlnum, total} = this.state;
		let notClosedEvents = historyEvents.filter(item => item.state );
		const len = total
		len > 1 ? notClosedEvents = [notClosedEvents[0]]:null
		return (
			<div className={styles.content}>
				<Carousel
					autoplay={true}
					infinite
          autoplayInterval={10000}
				>
					{imgList.map((item, index) => {
						return (
							<a key={index} className={styles.link} href="javascript:;">
								<img className={styles.img} src={item} />
							</a>
						);
					})}
				</Carousel>
				<div className={styles.aui_title}>
					<div className={styles.title}>
						器件列表
					</div>
				</div>
				
				<Flex className={styles.aui_flex}>
					<Flex.Item onClick={this.toFollowDoorPage}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/door.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Door"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											信号
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right1}>
												正常
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{doornum}
										</div>
									</div>
								</div>
							</div>
						</div>
					</Flex.Item>
					<Flex.Item onClick={this.toFollowCtrlPage}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/ctrl.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Ctrl"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											信号
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right1}>
												正常
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{ctrlnum}
										</div>
									</div>
								</div>
							</div>							
						</div>
					</Flex.Item>
				</Flex>
				{/* <Flex className={styles.aui_flex}>
					<Flex.Item onClick={this.toFollowDoorOnline}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/door.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Door"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											状态
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right2}>
												<FormattedMessage id="online"/>
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{devicesStatus.dooronline}
										</div>
									</div>
								</div>
							</div>						
						</div>
					</Flex.Item>
					<Flex.Item onClick={this.toFollowCtrlOnline}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/ctrl.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Ctrl"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											状态
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right2}>
												<FormattedMessage id="online"/>
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{devicesStatus.ctrlonline}
										</div>
									</div>
								</div>
							</div>						
						</div>
					</Flex.Item>
				</Flex> */}
				{/* <Flex className={styles.aui_flex}>
					<Flex.Item onClick={this.toFollowDoorOffline}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/door.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Door"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											状态
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right3}>
												<FormattedMessage id="fault"/>
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{this.state.dooroffline}
										</div>
									</div>
								</div>
							</div>						
						</div>
					</Flex.Item>
					<Flex.Item onClick={this.toFollowCtrlOffline}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/ctrl.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Ctrl"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											状态
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right3}>
												<FormattedMessage id="fault"/>
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{this.state.ctrloffline}
										</div>
									</div>
								</div>
							</div>						
						</div>
					</Flex.Item>
				</Flex> */}
				{/* <Flex className={styles.aui_flex}>
					<Flex.Item onClick={this.toFollowDoorLongOffline}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/door.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Door"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											状态
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right4}>
												<FormattedMessage id="offline"/>
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{devicesStatus.doorlongoffline}
										</div>
									</div>
								</div>
							</div>						
						</div>
					</Flex.Item>
					<Flex.Item onClick={this.toFollowCtrlLongOffline}>
						<div className={styles.aui_palace1}>
							<div className={styles.aui_palace1_left}>
								<div className={styles.aui_palace1_grid_icon}>
									<img src={require('../../assets/icon/ctrl.jpg')} />
								</div>
							</div>
							<div className={styles.aui_palace1_right}>
								<div className={styles.aui_palace1_grid_main}>
									<div className={styles.aui_palace1_grid_main_top}>
										<FormattedMessage id="Ctrl"/>
									</div>
									<div className={styles.aui_palace1_grid_main_bottom}>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											状态
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											<div className={styles.aui_palace1_grid_main_bottom_right4}>
												<FormattedMessage id="offline"/>
											</div>
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_left}>
											数量
										</div>
										<div className={styles.aui_palace1_grid_main_bottom_right}>
											{devicesStatus.ctrllongoffline}
										</div>
									</div>
								</div>
							</div>						
						</div>
					</Flex.Item>
				</Flex> */}
				
				<div className={styles.aui_title}>
					<div className={styles.title}>
						设备状态
					</div>
				</div>
				
				<div className={styles.aui_palace}>
				    <List.Item>
						<Flex className={styles.aui_flex}>
							<Flex.Item  className={styles.aui_flex_item} onClick={this.toFollowDoorOnline}>
								<Badge className={styles.sup} text={devicesStatus.dooronline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/cloud.png')} />
									</div>
								</Badge>
							</Flex.Item>
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowDoorLongOffline}>
								<Badge className={styles.sup} text={devicesStatus.doorlongoffline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/nosign.png')} />
									</div>
								</Badge>
							</Flex.Item>
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowDoorOffline}>
								<Badge className={styles.sup} text={this.state.dooroffline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
									</div>
								</Badge>
							</Flex.Item>
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowCtrlOnline}>
								<Badge className={styles.sup} text={devicesStatus.ctrlonline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/cloud.png')} />
									</div>
								</Badge>
							</Flex.Item>
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowCtrlLongOffline}>
								<Badge className={styles.sup} text={devicesStatus.ctrllongoffline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/nosign.png')} />
									</div>
								</Badge>
							</Flex.Item>
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowCtrlOffline}>
								<Badge className={styles.sup} text={this.state.ctrloffline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
									</div>
								</Badge>
							</Flex.Item>
						</Flex>
						<Brief><ReactEcharts option={this.getOption()} theme="myTheme" notMerge={true} lazyUpdate={true} style={{ height: 300,width:'100%' }} /></Brief>
					</List.Item>
				</div>
				
				<div className={styles.aui_title}>
					<div className={styles.title}>
						<FormattedMessage id="Order State"/>
					</div>
				</div>
				
				<div className={styles.aui_palace}>
						<List.Item
							arrow="horizontal"
							onClick={this.toHistoryEventPage}
							extra={<Badge className={styles.sup} text={len} overflowCount={99} />}
						>
							{
								len ?
								notClosedEvents.map(item => (
									<span className={styles.msg} key={item.id}>
										
											{item.addr}<FormattedMessage id={item.device_type}/>
											&nbsp;&nbsp;
											<FormattedMessage id={'O'+item.type}/>
											
									</span>
								)) : (
									<span>
										<FormattedMessage id="No Order"/>
									</span>
								)
							}
						</List.Item>

				</div>
			</div>
		);
	}
}
