import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Carousel, WingBlank, List, Flex, Card, Modal, Badge} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault, postLocation, getFaultUntreted, getFollowDevices, getLadder, getLadderFault, getLadderCount } from '../../services/api';
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
export default class Home extends Component {
	state = {
		data: [],
		messages: [],
		doorNum:0,
		ctrlNum:0,
		deviceNum:0,
		dooroffline:"0",
		ctrloffline:"0",
		deviceOffline:0,
		deviceOnline:0,
		deviceLongoffline:0,
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
		this.getDevice();
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
		getLadderFault().then((res) => {
			this.setState({
				LadderOffline:res.data.totalNumber+"",
			})
		})
		getFault({ num: 1, page: 1, state:"untreated", islast:1, type:1, }).then((res) => {
			if (res.code === 0) {
				if(res.data.list[0]!=null){
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
			}
		});
		getFaultUntreted({ num: 10, page:1, islast:1, device_type:'door', type:1,}).then((res) => {
			this.setState({
				dooroffline:res.data.totalNumber+"",
			})
		})
		getFaultUntreted({ num: 10, page:1, islast:1, device_type:'ctrl', type:1,}).then((res) => {
			this.setState({
				ctrloffline:res.data.totalNumber+"",
			})
		})
	}
	getDevice = (val,state) => {
		getLadderCount().then((res)=>{
			this.setState({
				deviceOnline:res.data.online,
				deviceOffline:res.data.offline,
				deviceLongoffline:res.data.longoffline,
				deviceNum:parseInt(res.data.online)+parseInt(res.data.longoffline),
				LadderOnline:res.data.online,
				LadderOffline:res.data.offline,
				LadderLongoffline:res.data.longoffline,
				LadderNum:parseInt(res.data.online)+parseInt(res.data.longoffline),
			});
		})
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
	DrawOnline(){
		const {deviceNum, deviceOnline, deviceOffline, deviceLongoffline}=this.state;
		let option = {
			title: {
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
			color: ['#3fb1e3','#66747b'],
			series: [
				{
					type:'pie',
					//radius: ['50%', '65%'],
					avoidLabelOverlap: false,
					hoverAnimation: false,
					label: {
						normal: {
							formatter: '{d}%',
						}
					},
					data:[
						{value:deviceOnline, name:'在线:'+deviceOnline,state:"online"},
						{value:deviceLongoffline, name:'离线:'+deviceLongoffline,state:"longoffline"}
					]
				}
			]
		};


		return option;
	}
	DrawOrder(){
		const {deviceNum, deviceOnline, deviceOffline, deviceLongoffline}=this.state;
		const Normal = deviceNum-deviceOffline;
		let option = {
			title: {
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
				data:['故障:'+deviceOffline,'正常:'+Normal]
			},
			color:['red','#6be6c1'],
			series: [
				{
					type:'pie',
					//radius: ['50%', '65%'],
					avoidLabelOverlap: false,
					hoverAnimation: false,
					label: {
						normal: {
							formatter: '{d}%',
						}
					},
					data:[
						{value:deviceOffline, name:'故障:'+deviceOffline},
						{value:Normal, name:'正常:'+Normal}
					],
				}
			]
		};
		return option;
	}
	goLadder = (val) => {
		const { history } = this.props;
		switch(val){
			case 1:
				history.push('/company/ladder/all');
				break;
			case 2:
				history.push('/company/ladder/online');
				break;
			case 3:
				history.push('/company/ladder/longoffline');
				break;
		}
	}
	Draw = (val) => {
		switch(val){
			case 1:
				getLadderCount().then((res)=>{
					if (res.code === 0) {
						this.setState({
							deviceOnline:res.data.online,
							deviceOffline:res.data.offline,
							deviceLongoffline:res.data.longoffline,
							deviceNum:parseInt(res.data.online)+parseInt(res.data.longoffline),
						});
					}
				})
				break;
			case 2:
				getDevicesStatus().then((res) => {
					if (res.code === 0) {
						this.setState({
							deviceOnline:res.data.dooronline,
							deviceLongoffline:res.data.doorlongoffline,
							deviceNum:parseInt(res.data.dooronline)+parseInt(res.data.doorlongoffline),
						});
					}
				});
				getFaultUntreted({ num: 10, page:1, islast:1, device_type:'door', type:1,}).then((res) => {
					const pos = res.data.list.map((item,index) => {
					})
					this.setState({
						dooroffline:res.data.totalNumber+"",
						deviceOffline:res.data.totalNumber,
					});
				})
				break;
			case 3:
				getDevicesStatus().then((res) => {
					if (res.code === 0) {
						this.setState({
							deviceOnline:res.data.ctrlonline,
							deviceLongoffline:res.data.ctrllongoffline,
							deviceNum:parseInt(res.data.ctrlonline)+parseInt(res.data.ctrllongoffline),
						});
					}
				});
				getFaultUntreted({ num: 10, page:1, islast:1, device_type:'ctrl', type:1,}).then((res) => {
					const pos = res.data.list.map((item,index) => {
					})
					this.setState({
						ctrloffline:res.data.totalNumber+"",
						deviceOffline:res.data.totalNumber,
					});
				})
				break;
		}
	}
	onChartClick(params){
		const { history } = this.props;
		history.push('/company/ladder/'+params.data.state);
	}
	render() {
		const imgList = [
			// background1,
			background2,
			background3,
			background4,
		]
		const { devicesStatus, historyEvents, doorNum, ctrlNum, deviceNum, total, deviceOffline, deviceOnline, deviceLongoffline, LadderNum, LadderLongoffline, LadderOffline, LadderOnline} = this.state;
		let notClosedEvents = historyEvents.filter(item => item.state );
		const len = total
		len > 1 ? notClosedEvents = [notClosedEvents[0]]:null;

		let onEvents={
			'click': this.onChartClick.bind(this)
		}
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
					<Row className={styles.aui_flex}>
						<Col span={12} onClick={() => this.Draw(1)}>
							<div className={styles.aui_palace1}>
								<div className={styles.aui_palace1_left}>
									<div className={styles.aui_palace1_grid_icon}>
										<img src={require('../../assets/icon/elevatorCtr.png')} />
									</div>
								</div>
								<div className={styles.aui_palace1_right}>
									<div className={styles.aui_palace1_grid_main}>
										<div className={styles.aui_palace1_grid_main_top}>
											<FormattedMessage id="Manage Elevator"/>
										</div>
										{
											this.state.language == "zh" ?
											<div className={styles.aui_palace1_grid_main_bottom}>
												<div className={styles.aui_palace1_grid_main_bottom_left}>
													<FormattedMessage id="Number"/>
												</div>
												<div className={styles.aui_palace1_grid_main_bottom_right}>
													<div className={styles.aui_palace1_grid_main_bottom_right1}>
														{LadderNum}
													</div>
												</div>
											</div>
											:
											<div className={styles.aui_palace1_grid_main_bottom}>
												<div className={styles.aui_palace1_grid_main_bottom_left}>
													<FormattedMessage id="Number"/>
												</div>
												<div className={styles.aui_palace1_grid_main_bottom_right}>
													<div className={styles.aui_palace1_grid_main_bottom_right2}>
														{LadderNum}
													</div>
												</div>
											</div>
										}
									</div>
								</div>
							</div>
						</Col>
						<Col span={3} className={styles.aui_flex_item} onClick={()=>this.goLadder(2)}>
							<Badge className={styles.sup} text={LadderOnline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/cloud.png')} />
								</div>
							</Badge>
						</Col>
						<Col span={3} className={styles.aui_flex_item} onClick={()=>this.goLadder(3)}>
							<Badge className={styles.sup} text={LadderLongoffline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/nosign.png')} />
								</div>
							</Badge>
						</Col>
						<Col span={2} className={styles.aui_flex_item} onClick={()=>this.goLadder(1)}>
							<Badge className={styles.sup} text={LadderOffline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
								</div>
							</Badge>
						</Col>
					</Row>
					<Row className={styles.aui_flex}>
						<Col span={12} onClick={()=>this.Draw(2)}>
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
										{
											this.state.language == "zh" ?
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
											:
											<div className={styles.aui_palace1_grid_main_bottom}>
												<div className={styles.aui_palace1_grid_main_bottom_left}>
													<FormattedMessage id="Number"/>
												</div>
												<div className={styles.aui_palace1_grid_main_bottom_right}>
													<div className={styles.aui_palace1_grid_main_bottom_right2}>
														{doorNum}
													</div>
												</div>
											</div>
										}
									</div>
								</div>
							</div>
						</Col>
						<Col span={3}  className={styles.aui_flex_item} onClick={this.toFollowDoorOnline}>
							<Badge className={styles.sup} text={devicesStatus.dooronline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/cloud.png')} />
								</div>
							</Badge>
						</Col>
						<Col span={3} className={styles.aui_flex_item} onClick={this.toFollowDoorLongOffline}>
							<Badge className={styles.sup} text={devicesStatus.doorlongoffline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/nosign.png')} />
								</div>
							</Badge>
						</Col>
						<Col span={2} className={styles.aui_flex_item} onClick={this.toFollowdoorOffline}>
							<Badge className={styles.sup} text={this.state.dooroffline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
								</div>
							</Badge>
						</Col>
					</Row>
					<Row className={styles.aui_flex}>
						<Col span={12} onClick={()=>this.Draw(3)}>
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
										{
											this.state.language == "zh" ?
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
											:
											<div className={styles.aui_palace1_grid_main_bottom}>
												<div className={styles.aui_palace1_grid_main_bottom_left}>
													<FormattedMessage id="Number"/>
												</div>
												<div className={styles.aui_palace1_grid_main_bottom_right}>
													<div className={styles.aui_palace1_grid_main_bottom_right2}>
														{ctrlNum}
													</div>
												</div>
											</div>
										}
									</div>
								</div>
							</div>
						</Col>
						<Col span={3} className={styles.aui_flex_item} onClick={this.toFollowctrlOnline}>
							<Badge className={styles.sup} text={devicesStatus.ctrlonline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/cloud.png')} />
								</div>
							</Badge>
						</Col>
						<Col span={3} className={styles.aui_flex_item} onClick={this.toFollowCtrlLongOffline}>
							<Badge className={styles.sup} text={devicesStatus.ctrllongoffline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/nosign.png')} />
								</div>
							</Badge>
						</Col>
						<Col span={2} className={styles.aui_flex_item} onClick={this.toFollowctrlOffline}>
							<Badge className={styles.sup} text={this.state.ctrloffline} overflowCount={99}>
								<div style={{ width: '26px', height: '26px', display: 'inline-block' }} >
									<img className={styles.aui_flex_item_icon} src={require('../../assets/icon/break.png')} />
								</div>
							</Badge>
						</Col>
					</Row>
					<List.Item>
						<Brief>
							<ReactEcharts
								option={this.DrawOnline()}
								theme="myTheme"
								notMerge={true}
								lazyUpdate={true}
								style={{ height: 250,width:'100%' }}
								onEvents={onEvents}
							/>
						</Brief>,
						<Brief>
							<ReactEcharts
								option={this.DrawOrder()}
								theme="myTheme"
								notMerge={true}
								lazyUpdate={true}
								style={{ height: 250,width:'100%' }}
							/>
						</Brief>
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
										<FormattedMessage id={item.device_type}/>{"  "}
										<FormattedMessage id={'O'+item.type}/>{"  "}
										<FormattedMessage id={this.state.code}/>
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
