import React, { Component } from 'react';
import { Carousel, WingBlank, List, Flex, Card, Modal} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination, } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault, postLocation, getFaultUntreted } from '../../services/api';
import background1 from '../../assets/menu-bg.png';
import background3 from '../../assets/bg2.jpg';
import background2 from '../../assets/bg1.jpg';
import background4 from '../../assets/bg3.jpg';
import BMap  from 'BMap';
import { injectIntl, FormattedMessage } from 'react-intl';

const alert = Modal.alert;
var INTE = null;
const Item = List.Item;
const Brief = Item.Brief;
const CodeTransform = {
	'51':'04',
	'52':'07',
	'66':'08',
	'82':'03',
	'114':'LV',
	'178':'OV',
	'229':'MO',
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
	// onpress = () =>{
	// 	var geolocation = new BMap.Geolocation();
	// 	geolocation.getCurrentPosition(function(r){
	// 		if(this.getStatus() == BMAP_STATUS_SUCCESS){
	// 			console.log('您的位置：'+r.point.lng+','+r.point.lat);
	// 			const lat = r.point.lat
	// 			const lon = r.point.lng
	// 			if (window.localStorage.getItem("language")=='en'){alert("Getting the current location")}
	// 			if (window.localStorage.getItem("language")=='zh'){alert("正在获取当前位置")}
	// 			postLocation({ lat, lon,}).then((res) => {
	// 			})
	// 		}
	// 		else {
	// 			alert('failed'+this.getStatus());
	// 		}
	// 	});
	// }
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
						{/* <Item
							arrow="horizontal"
							multipleLine
							onClick={this.toMessagesPage}
						>
							{
								this.state.messages[0] && this.state.messages[0].content ?
									<span><FormattedMessage id="Hot News"/> <Brief>{this.state.messages[0].content}</Brief></span> :
									<span><FormattedMessage id="No News"/></span>
							}
						</Item> */}
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
										<Brief><FormattedMessage id="fault"/>:<span className={styles.tips}>{CodeTransform[this.state.code]}<FormattedMessage id={this.state.code}/></span></Brief>
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
