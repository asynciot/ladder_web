import React, { Component } from 'react';
import { Carousel, WingBlank, List, Flex, Card, Modal} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination, } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault, postLocation } from '../../services/api';
import background1 from '../../assets/menu-bg.png';
import background3 from '../../assets/bg-menu.jpg';
import background2 from '../../assets/menu-bg1.jpg';
import background4 from '../../assets/service-img4.jpg';
import BMap  from 'BMap';
import { injectIntl, FormattedMessage } from 'react-intl';

const alert = Modal.alert;
var inte = null;
const Item = List.Item;
const Brief = Item.Brief;
const typeName ={
  'ctrl':'控制柜',
  'door':'控制器',
}
const faultCode = {
	'1': '过流',
	'2': '母线过压',
	'3': '母线欠压',
	'4': '输入缺相',
	'5': '输出缺相',
	'6': '输出过力矩',
	'7': '编码器故障',
	'8': '模块过热',
	'9': '运行接触器故障',
	'10': '抱闸接触器故障',
	'11': '封星继电器故障',
	'12': '抱闸开关故障',
	'13': '运行中安全回路断开',
	'14': '运行中门锁断开',
	'15': '门锁短接故障',
	'16': '层站召唤通讯故障',
	'17': '轿厢通讯故障',
	'18': '并联通讯故障',
	'19': '开门故障',
	'20': '关门故障',
	'21': '开关门到位故障',
	'22': '平层信号异常',
	'23': '终端减速开关故障',
	'24': '下限位信号异常',
	'25': '上限位信号异常',
	'26': '打滑故障',
	'27': '电梯速度异常',
	'28': '电机反转故障',
	'31': '停车速度检测',
	'33': '马达过热故障',
	'34': '制动力严重不足',
	'35': '制动力不足警告',
	'36': 'UCMP故障',
	'37': 'IPM故障',
	'38': '再平层开关异常',
	'40': '驱动保护故障',
	'41': '平层位置异常',
	'51': '开关门受阻',
	'52': '飞车保护',
	'66': '电机过载',
	'82': '输出过流',
	'114': '输入电压过低',
	'178': '输入电压过高',
	'179': '电流过高',
}
export default class Home extends Component {
	state = {
		data: [],
		imgHeight: 176,
		messages: [],
		doornum:0,
		ctrlnum:0,
		dooroffline:0,
		ctrloffline:0,
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
		this.getdata();
		var _this =this
		inte = setInterval(function () {
			_this.getdata()
		}, 60000);
	}
	componentWillUnmount() {
		clearInterval(inte)
	}
	getdata = () => {
		this.getMessages();
		this.getDevicesStatus();
		this.getFault();
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
				alert("请在个人界面使用关注设备，或使用微信扫一扫关注设备！")
			}
		}).catch((e => console.info(e)));
	}
	getFault = () => {
		getFault({ num: 1, page: 1, state:"untreated", islast:1}).then((res) => {
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
		getFault({ num: 10, page:1, islast:1, device_type:'door', state:'untreated' }).then((res) => {
			const pos = res.data.list.map((item,index) => {
			})
			this.setState({
				dooroffline:res.data.totalNumber,
			});
		})
		getFault({ num: 10, page:1, islast:1, device_type:'ctrl', state:'untreated' }).then((res) => {
			const pos = res.data.list.map((item,index) => {
			})
			this.setState({
				ctrloffline:res.data.totalNumber,
			});
		})
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
	render() {		
		const imgList = [
			// background1,
			background2,
			background3,
			background4,
		]
		const { devicesStatus, historyEvents, doornum, ctrlnum, total } = this.state;
		let notClosedEvents = historyEvents.filter(item => item.state );
		const len = total
		len > 1 ? notClosedEvents = [notClosedEvents[0]]:null
		return (
			<div className="content">
				<Carousel
					autoplay={false}
					infinite
				>
					{imgList.map((item, index) => {
						return (
							<a key={index} className={styles.link} href="javascript:;">
								<img className={styles.img} src={item} />
							</a>
						);
					})}
				</Carousel>
				<div className={styles.pre}>
					<List className="list">
						<Row gutter={20}>
							<Col span={6}>
								<Card className={styles.gridcontent} onClick={this.toFollowDoorPage}>
									<div className={styles.gridright}>													
										<div className={styles.gridnum4}>
											{doornum}
										</div>
										<FormattedMessage id="Door"/>
									</div>
								</Card>
							</Col>
							<Col span={6}>
								<Card onClick={this.toFollowDoorOnline}>
									<div className={styles.gridright}>													
										<div className={styles.gridnum1}>
											{devicesStatus.dooronline}
										</div>
										<FormattedMessage id="online"/>
									</div>
								</Card>
							</Col>
							<Col span={6}>
								<Card onClick={this.toFollowDoorOffline}>
									<div className={styles.gridright}>													
										<div className={styles.gridnum2}>
											{this.state.dooroffline}
										</div>
										<FormattedMessage id="fault"/>
									</div>
								</Card>
							</Col>
							<Col span={6}>
								<Card onClick={this.toFollowDoorLongOffline}>
									<div className={styles.gridright}>													
										<div className={styles.gridnum3}>
											{devicesStatus.doorlongoffline}
										</div>
										<FormattedMessage id="offline"/>
									</div>
								</Card>
							</Col>
						</Row>
						<Row gutter={20}>
							<Col span={6}>
								<Card onClick={this.toFollowCtrlPage}>
									<div className={styles.gridright}>													
										<div className={styles.gridnum4}>
											{ctrlnum}
										</div>
										<FormattedMessage id="Ctrl"/>
									</div>
								</Card>
							</Col>
							<Col span={6}>
								<Card onClick={this.toFollowCtrlOnline}>
									<div className={styles.gridright}>													
										<div className={styles.gridnum1}>
											{devicesStatus.ctrlonline}
										</div>
										<FormattedMessage id="online"/>
									</div>
								</Card>
							</Col>
							<Col span={6}>
								<Card onClick={this.toFollowCtrlOffline}>
									<div className={styles.gridright}>
										<div className={styles.gridnum2}>
											{this.state.ctrloffline}
										</div>
										<FormattedMessage id="fault"/>
									</div>
								</Card>
							</Col>
							<Col span={6}>
								<Card onClick={this.toFollowCtrlLongOffline}>
									<div className={styles.gridright}>
										<div className={styles.gridnum3}>
											{devicesStatus.ctrllongoffline}
										</div>
										<FormattedMessage id="offline"/>
									</div>
								</Card>
							</Col>
						</Row>
						<Item
							arrow="horizontal"
							multipleLine
							onClick={this.toMessagesPage}
						>
							{
								this.state.messages[0] && this.state.messages[0].content ?
									<span><FormattedMessage id="Hot News"/> <Brief>{this.state.messages[0].content}</Brief></span> :
									<span><FormattedMessage id="No News"/></span>
							}
						</Item>
						<Item
							arrow="horizontal"
							multipleLine
							onClick={this.toHistoryEventPage}
						>
							{
								len ?
								notClosedEvents.map(item => (
									<span className={styles.msg} key={item.id}>
										<FormattedMessage id="Order State"/>
										<Brief><FormattedMessage id="To be treated"/>:<span>{len}</span></Brief>
										<Brief><FormattedMessage id="Latest Order"/></Brief>
										<Brief>
											<Flex>
												<Flex.Item><FormattedMessage id="type"/>:<span className={styles.tips}><FormattedMessage id={'O'+item.type}/></span></Flex.Item>
												<Flex.Item><FormattedMessage id="model"/>:<span className={styles.tips}><FormattedMessage id={item.device_type}/></span></Flex.Item>
											</Flex>
										</Brief>
										<Brief><FormattedMessage id="fault"/>:<span className={styles.tips}><FormattedMessage id={this.state.code}/></span></Brief>
									</span>
								)) : (
									<span>
										<FormattedMessage id="Order State"/>
										<Brief><FormattedMessage id="No Order"/></Brief>
									</span>
								)
							}
						</Item>
					</List>
					{/*
						<Button onClick={this.onpress} type="primary" style={{ width: '100%' }}><FormattedMessage id="Location clock"/></Button>
					*/}	
				</div>
			</div>
		);
	}
}
