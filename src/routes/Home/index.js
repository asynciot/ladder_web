import React, { Component } from 'react';
import { Carousel, WingBlank, List, Flex, Card,} from 'antd-mobile';
import { Row, Col, Button, Spin, DatePicker, Pagination, } from 'antd';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault } from '../../services/api';
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
  }
  componentWillMount() {
    this.getdata();
  }
	getdata = () => {
		this.getMessages();
		this.getDevicesStatus();
		this.getFault();
	}
//   getBanners = () => {
//     getBanners({ num: 10, page: 1 }).then((res) => {
//       if (res.code === 0) {
//         this.setState({
//           data: res.data.list,
//         });
//         this.getMessages();
//         this.getDevicesStatus();
//         this.getHistoryEvent();
//       }
//     }).catch((e => console.info(e)));
//   }
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
    getFault({ num: 10, page: 1 }).then((res) => {
      if (res.code === 0) {
        this.setState({
          historyEvents: res.data.list,
        });
      }
    }).catch((e => console.info(e)));
  }
  toMessagesPage = () => {
    const { history } = this.props;
    history.push('/company/message/unfinished');
  }
  toDevicesStatusPage = () => {
    const { history } = this.props;
    history.push('/company/device');
  }
	toFollowDevicesPage = () => {
		const { history } = this.props;
		history.push('/company/followdevice');
	}
  toHistoryEventPage = () => {
    const { history } = this.props;
    history.push('/company/work-order');
  }
  render() {		
		const imgList = [
				background1,
				background2,
				background3,
				background4,
		]
    const { devicesStatus, historyEvents, doornum, ctrlnum, } = this.state;
    let notClosedEvents = historyEvents.filter(item => item.status === 0);
    notClosedEvents.length > 1 ? notClosedEvents = [notClosedEvents[0]]:null
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
							onClick={this.toFollowDevicesPage}
							platform="android"
						>
							<Row gutter={20}>
								<Col span={6}>
									<Card className={styles.gridcontent}>
										<div className={styles.gridright}>													
											<div className={styles.gridnum4}>
												{doornum}
											</div>
											控制器
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card>
										<div className={styles.gridright}>													
											<div className={styles.gridnum1}>
												{devicesStatus.dooronline}
											</div>
											在线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card>
										<div className={styles.gridright}>													
											<div className={styles.gridnum2}>
												{devicesStatus.dooroffline}
											</div>
											离线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card>
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
									<Card>
										<div className={styles.gridright}>													
											<div className={styles.gridnum4}>
												{ctrlnum}
											</div>
											控制柜
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card>
										<div className={styles.gridright}>													
											<div className={styles.gridnum1}>
												{devicesStatus.ctrlonline}
											</div>
											在线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card>
										<div className={styles.gridright}>
											<div className={styles.gridnum2}>
												{devicesStatus.ctrloffline}
											</div>
											离线
										</div>
									</Card>
								</Col>
								<Col span={6}>
									<Card>
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
								notClosedEvents.length ?
								notClosedEvents.map(item => (
									<span className={styles.msg} key={item.id}>
										工单状态
										<Brief>待处理<span>{notClosedEvents.length}</span></Brief>
										<Brief>最新工单</Brief>
										<Brief>
											<Flex>
												<Flex.Item>名称:<span className={styles.tips}>{names[item.event]}</span></Flex.Item>
												<Flex.Item>型号:<span className={styles.tips}>{item.deviceNo ? item.deviceNo : '无'}</span></Flex.Item>
											</Flex>
										</Brief>
										<Brief>错误码<span className={styles.tips}>{item.errCode ? item.errCode : '无'}</span></Brief>
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
