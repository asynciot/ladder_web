import React, { Component } from 'react';
import { Carousel, WingBlank, List, Flex, Card,} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination, } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault, } from '../../services/api';
import background1 from '../../assets/menu-bg.png';
import background3 from '../../assets/bg-menu.jpg';
import background2 from '../../assets/menu-bg1.jpg';
import background4 from '../../assets/service-img4.jpg';
const Item = List.Item;
const Brief = Item.Brief;
const names = {
  0: '电话报修',
  1: '人工报修',
  2: '自动报修',
}
const typeName ={
  'ctrl':'控制柜',
  'door':'控制器',
}
const code = {
	'01': '过流',
	'02': '母线过压',
	'03': '母线欠压',
	'04': '输入缺相',
	'05': '输出缺相',
	'06': '输出过力矩',
	'07': '编码器故障',
	'08': '模块过热',
	'09': '运行接触器故障',
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
}
export default class Home extends Component {
  state = {
    data: [],
    imgHeight: 176,
    messages: [],
		doornum:0,
		ctrlnum:0,
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
    }).catch((e => console.info(e)));
  }
  getFault = () => {
    getFault({ num: 10, page: 1, state:"untreated"}).then((res) => {
      if (res.code === 0) {
				const code = res.data.list[0].code
				if(device_type=="ctrl"){
					this.setState({
						historyEvents: res.data.list,
						total:res.data.totalNumber,
						code: code.toString(16)
					});
				}else{
					this.setState({
						historyEvents: res.data.list,
						total:res.data.totalNumber,
						code: 0,
					});
				}
        
      }
    }).catch((e => console.info(e)));
  }
  toMessagesPage = () => {
    const { history } = this.props;
    history.push('/company/message');
  }
  toDevicesStatusPage = () => {
    const { history } = this.props;
    history.push('/company/device');
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
		const vcode = 0;
		const device_type = "15";
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
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowDoorOffline = () => {
		const { history } = this.props;
		const vcode = 2;
		const device_type = "15";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowDoorLongOffline = () => {
		const { history } = this.props;
		const vcode = 3;
		const device_type = "15";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowCtrlPage = () => {
		const { history } = this.props;
		const vcode = 0;
		const device_type = "240";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowCtrlOnline = () => {
		const { history } = this.props;
		const vcode = 1;
		const device_type = "240";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowCtrlOffline = () => {
		const { history } = this.props;
		const vcode = 2;
		const device_type = "240";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
		});
	}
	toFollowCtrlLongOffline = () => {
		const { history } = this.props;
		const vcode = 3;
		const device_type = "240";
		history.push({
			pathname: '/company/followdevice',
			state: { vcode,device_type }
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
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
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
						<Item
							arrow="horizontal"
							multipleLine
							platform="android"
						>
							<Row gutter={20}>
								<Col span={6}>
									<Card className={styles.gridcontent} onClick={this.toFollowDoorPage}>
										<div className={styles.gridright}>													
											<div className={styles.gridnum4}>
												{doornum}
											</div>
											控制器
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card onClick={this.toFollowDoorOnline}>
										<div className={styles.gridright}>													
											<div className={styles.gridnum1}>
												{devicesStatus.dooronline}
											</div>
											在线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card onClick={this.toFollowDoorOffline}>
										<div className={styles.gridright}>													
											<div className={styles.gridnum2}>
												{devicesStatus.dooroffline}
											</div>
											离线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card onClick={this.toFollowDoorLongOffline}>
										<div className={styles.gridright}>													
											<div className={styles.gridnum3}>
												{devicesStatus.doorlongoffline}
											</div>
											长期离线
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
											控制柜
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card onClick={this.toFollowCtrlOnline}>
										<div className={styles.gridright}>													
											<div className={styles.gridnum1}>
												{devicesStatus.ctrlonline}
											</div>
											在线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card onClick={this.toFollowCtrlOffline}>
										<div className={styles.gridright}>
											<div className={styles.gridnum2}>
												{devicesStatus.ctrloffline}
											</div>
											离线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card onClick={this.toFollowCtrlLongOffline}>
										<div className={styles.gridright}>
											<div className={styles.gridnum3}>
												{devicesStatus.ctrllongoffline}
											</div>
											长期离线
										</div>
									</Card>
								</Col>
							</Row>
						</Item>
						<Item
							arrow="horizontal"
							multipleLine
							onClick={this.toMessagesPage}
						>
							{
								this.state.messages[0] && this.state.messages[0].content ?
									<span>最新消息 <Brief>{this.state.messages[0].content}</Brief></span> :
									<span>没有消息</span>
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
										工单状态
										<Brief>待处理<span>{len}</span></Brief>
										<Brief>最新工单</Brief>
										<Brief>
											<Flex>
												<Flex.Item>名称:<span className={styles.tips}>{names[item.type]}</span></Flex.Item>
												<Flex.Item>型号:<span className={styles.tips}>{typeName[item.device_type] ||''}</span></Flex.Item>
											</Flex>
										</Brief>
										<Brief>故障名称:<span className={styles.tips}>{code[this.state.code]}</span></Brief>
									</span>
								)) : (
									<span>
										工单状态
										<Brief>暂无工单</Brief>
									</span>
								)
							}
						</Item>
					</List>
				</div>
      </div>
    );
  }
}
