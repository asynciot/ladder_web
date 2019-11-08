import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Carousel, WingBlank, List, Flex, Card, Modal, Badge} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault, postLocation, getFaultUntreted, getFollowDevices, getLadder, getLadderFault } from '../../services/api';
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
		messages: [],
		doorNum:0,
		ctrlNum:0,
		deviceNum:0,
		doorOffline:0,
		ctrlOffline:0,
		deviceOffline:0,
		deviceOnline:0,
		deviceLongoffline:0,
		devicesStatus: {
			dooronline:0,
			doorOffline:0,
			doorlongoffline:0,
			ctrlOnline:0,
			ctrlOffline:0,
			ctrllongoffline:0,
		},
		historyEvents: [],
		code:'',
		language:window.localStorage.getItem("language"),
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
		});
	}
	getDevicesStatus = () => {
		getDevicesStatus().then((res) => {
			if (res.code === 0) {
				this.setState({
					devicesStatus: res.data,
					doorNum: parseInt(res.data.dooronline)+parseInt(res.data.doorlongoffline),
					ctrlNum:parseInt(res.data.ctrlonline)+parseInt(res.data.ctrllongoffline),
				});
			}
			let num = parseInt(res.data.dooronline)+parseInt(res.data.doorlongoffline)+parseInt(res.data.ctrlonline)+parseInt(res.data.ctrllongoffline)
			if(num==0){
				if(this.state.language=="zh"){
					alert("请在个人界面使用关注设备，或使用微信扫一扫关注设备！")
				}else{
					alert("Please use the Focus Device in your personal interface, or use Wechat Scan to Focus!")
				}
			}
		});
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
				let code
				if(res.data.list[0]){
					code = res.data.list[0].code
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
			}
		});
		getFaultUntreted({ num: 10, page:1, islast:1, device_type:'door', type:1,}).then((res) => {
			const pos = res.data.list.map((item,index) => {
			})
			this.setState({
				doorOffline:res.data.totalNumber,
			});
		})
		getFaultUntreted({ num: 10, page:1, islast:1, device_type:'ctrl', type:1,}).then((res) => {
			const pos = res.data.list.map((item,index) => {
			})
			this.setState({
				ctrlOffline:res.data.totalNumber,
			});
		})
	}
	getDevice = (val,state) => {
		let { navs } = this.state;
		const page = val
		switchId = state
		switch(switchId){
			case 0:
				state = "";
				break;
			case 1:
				state = "online";
				break;
			case 2:
				state = "longoffline";
				break;
			case 3:
				state = "offline";
				break;
		}
		if(switchId==3){
			getLadderFault({ num: 1, page, follow:"yes"}).then((res)=>{
				const deviceOffline=res.data.totalNumber;
				this.setState({
					deviceOffline,
				});
			})
		}else{
			getLadder({ num: 1, page, state, follow:"yes"}).then((res) => {
				switch(state){
					case "":
						const deviceNum=res.data.totalNumber;
						this.setState({
							deviceNum,
						});
						break;
					case "online":
						const deviceOnline=res.data.totalNumber;
						this.setState({
							deviceOnline,
						});
						break;
					case "longoffline":
						const deviceLongoffline=res.data.totalNumber;
						this.setState({
							deviceLongoffline,
						});
						break;
				}
			});
		}
	}
	onpress = () =>{
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition((r)=>{
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				const lat = r.point.lat
				const lon = r.point.lng
				if (this.state.language=='en'){alert("Getting the current location")}
				if (this.state.language=='zh'){alert("正在获取当前位置")}
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
	toFollowdoorOffline = () => {
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
	toFollowctrlOnline = () => {
		const { history } = this.props;
		const device_type = "240";
		history.push({
			pathname: '/company/followctrl/online',
			state: { device_type }
		});
	}
	toFollowctrlOffline = () => {
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
		const {deviceNum, deviceOnline, deviceOffline, deviceLongoffline}=this.state;
		let option = {
			title: {
				text: deviceNum,
				subtext: this.state.language=="zh"? "电梯总量":"Ladder Number",
				x: '48%',
				y: '40%',
				textAlign:'center',
				textStyle: {
					fontSize:24,
					fontWeight:'bold',
					color: ['#333']
				},
				subtextStyle: {
					fontSize:12,
					color: '#666',
				},
			},
			legend: {
				orient: 'vertical',
				right: "0%",
				data:['在线:'+deviceOnline,'离线:'+deviceLongoffline]
			},
			series: [
				{
					type:'pie',
					radius: ['50%', '65%'],
					avoidLabelOverlap: false,
					hoverAnimation: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						}
					},
					data:[
						{value:deviceOnline, name:'在线:'+deviceOnline},
						{value:deviceLongoffline, name:'离线:'+deviceLongoffline}
					]
				}
			]
		};
		return option;
	}
	getOption1(){
		const {deviceNum, deviceOnline, deviceOffline, deviceLongoffline}=this.state;
		let option = {
			title: {
				text: deviceNum,
				subtext: this.state.language=="zh"? "电梯总量":"Ladder Number",
				x: '48%',
				y: '40%',
				textAlign:'center',
				textStyle: {
					fontSize:24,
					fontWeight:'bold',
					color: ['#333']
				},
				subtextStyle: {
					fontSize:12,
					color: '#666',
				},
			},
			legend: {
				orient: 'vertical',
				right: "0%",
				data:['故障:'+deviceOffline,]
			},
			series: [
				{
					type:'pie',
					radius: ['50%', '65%'],
					avoidLabelOverlap: false,
					hoverAnimation: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						}
					},
					data:[
						{value:deviceOffline, name:'故障:'+deviceOffline}
					]
				}
			]
		};
		return option;
	}
	render() {
		const imgList = [
			// background1,
			background2,
			background3,
			background4,
		]
		const { devicesStatus, historyEvents, doorNum, ctrlNum, total} = this.state;
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
						<FormattedMessage id="Device State"/>
					</div>
				</div>
				<div className={styles.aui_palace}>
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
												<FormattedMessage id="Number"/>
											</div>
											<div className={styles.aui_palace1_grid_main_bottom_right}>
												<div className={styles.aui_palace1_grid_main_bottom_right1}>
													{doorNum}
												</div>
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
												<FormattedMessage id="Number"/>
											</div>
											<div className={styles.aui_palace1_grid_main_bottom_right}>
												<div className={styles.aui_palace1_grid_main_bottom_right1}>
													{ctrlNum}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Flex.Item>
					</Flex>
					<List.Item>
						<Flex className={styles.aui_flex}>&nbsp;
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
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowdoorOffline}>
								<Badge className={styles.sup} text={this.state.doorOffline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
									</div>
								</Badge>
							</Flex.Item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowctrlOnline}>
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
							<Flex.Item className={styles.aui_flex_item} onClick={this.toFollowctrlOffline}>
								<Badge className={styles.sup} text={this.state.ctrlOffline} overflowCount={99}>
									<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
										<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
									</div>
								</Badge>
							</Flex.Item>
						</Flex>
						<Brief><ReactEcharts option={this.getOption()} theme="myTheme" notMerge={true} lazyUpdate={true} style={{ height: 250,width:'100%' }} /></Brief>,
			<Brief><ReactEcharts option={this.getOption1()} theme="myTheme" notMerge={true} lazyUpdate={true} style={{ height: 250,width:'100%' }} /></Brief>
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
