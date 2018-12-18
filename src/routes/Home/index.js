import React, { Component } from 'react';
import { Carousel, WingBlank, List, Flex } from 'antd-mobile';
import styles from './index.less';
import { getBanners, getMessages, getDevicesStatus, getFault } from '../../services/api';

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
    devicesStatus: {
      dooronline:'0',
      dooroffline:'0',
			doorlongoffline:'0',
			ctrlonline:'0',
			ctrloffline:'0',
			ctrllongoffline:'0',
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
    history.push('/company/message/all');
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
    const { devicesStatus, historyEvents } = this.state;
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
					<a
						href="#"
						style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
					>
						<img
							src='../../../assets/menu-bg.jpg'
							alt=""
							style={{ width: '100%', verticalAlign: 'top' }}
						/>
					</a>
        </Carousel>
        <List className="list">
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
						onClick={this.toFollowDevicesPage}
						platform="android"
					>
						关注列表
						<Brief>控制器</Brief>
						<Brief>
							<Flex>
								<Flex.Item>在线<span className={styles.tips}>{devicesStatus.dooronline}</span></Flex.Item>
								<Flex.Item>离线<span className={styles.tips}>{devicesStatus.dooroffline}</span></Flex.Item>
								<Flex.Item>长期离线<span className={styles.tips}>{devicesStatus.doorlongoffline}</span></Flex.Item>
							</Flex>
						</Brief>
						<Brief>控制柜</Brief>
						<Brief>
							<Flex>
								<Flex.Item>在线<span className={styles.tips}>{devicesStatus.ctrlonline}</span></Flex.Item>
								<Flex.Item>离线<span className={styles.tips}>{devicesStatus.ctrloffline}</span></Flex.Item>
								<Flex.Item>长期离线<span className={styles.tips}>{devicesStatus.ctrllongoffline}</span></Flex.Item>
							</Flex>
						</Brief>
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
    );
  }
}
