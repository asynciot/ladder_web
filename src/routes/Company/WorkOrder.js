import React, { Component } from 'react';
import { Icon, Button, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Modal, List,PullToRefresh } from 'antd-mobile';
import styles from './WorkOrder.less';
import { getFault, postFault } from '../../services/api';

const Item = List.Item;
const Brief = Item.Brief;
const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);
const format = "YYYY-MM-DD HH:mm";
const tabs = [
  { title: '待接单', type: 'untreated', count: 0 },
  { title: '急修中', type: 'treated', count: 0 },
  // { title: '已完成', type: 2, count: 0 },
];
const alert = Modal.alert;
const desc = {
  'untreated': '是否接单',
  'treated': '是否完成',
};
const names = {
  0: '电话报修',
  1: '人工报修',
  2: '自动报修',
}
export default class extends Component {
  state = {
    historyEvents: [],
    height: document.documentElement.clientHeight-150,
    refreshing: true,
    down: false,
    tab: 0,
    page: 1,
    total: 1,
  }
  componentWillMount() {
    this.getFault('untreated');
  }
  getFault = (status) => {
    let {page, total, historyEvents,refreshing} = this.state;
    console.log(page,total);
    if (page > total) {
      setTimeout(()=>{
        this.setState({ refreshing: false });
      }, 800)
      return
    }
    getFault({ num: 10, page, status }).then((res) => {
      if(refreshing) {
        page++
      }
      const events = res.data.list.filter(item => item.status === status)
      this.setState({
        historyEvents: page>2 ? historyEvents.concat(events) :events,
        page,
        total: res.data.totalPage
      });
      setTimeout(()=>{
        this.setState({ refreshing: false });
      }, 800)
    }).catch((e => console.info(e)));
  }

  deal = (detail) => {
    alert('提示', desc[detail.status], [
      { text: '取消', style: 'default' },
      { text: '确认',
        onPress: () => {
          postFault(detail.id).then(() => {
            this.getFault(detail.status);
          });
        },
      },
    ]);
  }
	tabChange = (tab, index) => {
		this.setState({
			view: index,
		});
	}
  render() {
    const { historyEvents } = this.state;
    return (
      <div className="content">
        <Tabs
          tabs={tabs}
          initialPage={0}
          tabBarActiveTextColor="#1E90FF"
          tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
          onChange={(tab, index) => { this.setState({tab: tab.type, refreshing: true, page: 1,total:1},()=>{this.getFault(tab.type);} );  }}
          // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <div>
            <PullToRefresh
              damping={60}
              ref={el => this.ptr = el}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
              indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
              direction={this.state.down ? 'down' : 'up'}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true },()=>{
                  this.getFault(this.state.tab)
                });
              }}
            >						
              {
                historyEvents.length ? historyEvents.map(
                  item => (
                    <List key={item.id} renderHeader={() => `工单编号: ${item.id}`} className="order-list">
                      <List.Item extra={<span onClick={() => this.deal(item)} className={styles.deal}>点击处理</span>}>
                        <div>名称 : <span>{names[item.event]}</span></div>
                        <div>型号 : <span>{item.deviceNo ? item.deviceNo : '无'}</span></div>
                        <div>错误码 : <span>{item.errCode ? item.errCode : '无'}</span></div>
                        <div>地址 : <span>{item.address?item.address:'无'}</span></div>
                        <div>创建时间 : <span>{moment(item.createTime).format(format)}</span></div>
                      </List.Item>
                    </List>
                  )
                ) : (
                  <List>
                    <List.Item>
                      <Brief>暂无工单</Brief>
                    </List.Item>
                  </List>
                )
              }
            </PullToRefresh>
          </div>
          <div>
            <PullToRefresh
                damping={60}
                ref={el => this.ptr = el}
                style={{
                  height: this.state.height,
                  overflow: 'auto',
                }}
                indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true },()=>{
                    this.getFault(this.state.tab)
                  });
                }}
              >
              {
                historyEvents.length ? historyEvents.map(
                  item => (
                    <List key={item.id} renderHeader={() => `工单编号: ${item.id}`} className="order-list">
                      <List.Item extra={<span onClick={() => this.deal(item)} className={styles.deal}>点击处理</span>}>
                        <div>名称 : <span>{names[item.event]}</span></div>
                        <div>型号 : <span>{item.deviceNo}</span></div>
                        <div>错误码 : <span>{item.errCode}</span></div>
                        <div>地址 : <span>{item.address?item.address:'无'}</span></div>
                        <div>创建时间 : <span>{moment(item.createTime).format(format)}</span></div>
                      </List.Item>
                    </List>
                  )
                ) : (
                  <List>
                    <List.Item>
                      <Brief>暂无工单</Brief>
                    </List.Item>
                  </List>
                )
              }
            </PullToRefresh>
          </div>
          {/*<div>
            <PullToRefresh
              damping={60}
              ref={el => this.ptr = el}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
              indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
              direction={this.state.down ? 'down' : 'up'}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true },()=>{
                  this.getFault(this.state.tab)
                });
              }}
            >
              {
                historyEvents.length ? historyEvents.map(
                  item => (
                    <List key={item.id} renderHeader={() => `工单编号: ${item.id}`} className="order-list">
                      <List.Item>
                        <div>名称 : <span>{names[item.event]}</span></div>
                        <div>型号 : <span>{item.deviceNo}</span></div>
                        <div>错误码 : <span>{item.errCode}</span></div>
                        <div>地址 : <span>{item.address?item.address:'无'}</span></div>
                        <div>创建时间 : <span>{moment(item.createTime).format(format)}</span></div>
                        <div>完成时间 : <span>{item.solveTime?moment(item.solveTime).format(format):'无'}</span></div>
                      </List.Item>
                    </List>
                  )
                ) : (
                  <List>
                    <List.Item>
                      <Brief>暂无工单</Brief>
                    </List.Item>
                  </List>
                )
              }
            </PullToRefresh>
          </div>*/}
        </Tabs>
      </div>
    );
  }
}
