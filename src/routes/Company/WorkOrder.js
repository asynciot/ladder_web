import React, { Component } from 'react';
import { Icon, Button, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Modal, List,PullToRefresh } from 'antd-mobile';
import styles from './WorkOrder.less';
import { getFault, postFault, postFinish, deleteFault, getDispatch, } from '../../services/api';


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
const typeName = {
	 'door':'控制器',
	 'ctrl':'控制柜',
}
const ListButton = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles['list-btn']}`}>
    <span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
      <Icon className={`${styles.edit} ${styles.icon}`} type="form" />
      <em>接单</em>
    </span>
  </div>
);
const Finish = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.remove ? restProps.remove:''}>
			<Icon className={`${styles.delete} ${styles.icon}`} type="close" />
			<em>转办</em>
		</span>
  </div>
);
export default class extends Component {
  state = {
    historyEvents: [],
		list:[],
    height: document.documentElement.clientHeight-150,
		nowTime: new Date().getTime(),
    refreshing: true,
    down: false,
    tab: 0,
    page: 1,
    total: 1,
  }
  componentWillMount() {
    this.getFault('untreated');
  }
  getFault = (state) => {
    let {page, total, historyEvents,refreshing} = this.state;
    if (page > total) {
      setTimeout(()=>{
        this.setState({ refreshing: false });
      }, 800)
      return
    }
		if(state == 'untreated'){
			getFault({ num: 10, page, state }).then((res) => {
				const list = res.data.list.map((item) => {
					const time = this.state.nowTime - item.createTime
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					item.code = res.data.list[res.data.list.length-1].code.toString(16)
					return item;
				})
				if(refreshing) {
					page++
				}
				this.setState({
					page,
					list,
					total: res.data.totalPage
				});
				setTimeout(()=>{
					this.setState({ refreshing: false });
				}, 800)
			}).catch((e => console.info(e)));
		}else{
			getDispatch({ num: 10, page, follow:'yes',}).then((res) => {
				const list = res.data.list.map((item) => {
					const time = this.state.nowTime - item.create_time
					item.create_time = moment(parseInt(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					return item;
				})
				if(refreshing) {
					page++
				}
				this.setState({
					page,
					list,
					total: res.data.totalPage
				});
				setTimeout(()=>{
					this.setState({ refreshing: false });
				}, 800)
			}).catch((e => console.info(e)));
		}	
  }
	goFault = item => () =>{
		this.props.history.push(`/company/order/${item.id}`);
	}
  deal = (e, detail) => {
		const order_id = detail.id
    alert('提示', desc[detail.state], [
      { text: '取消', style: 'default' },
      { text: '确认',
        onPress: () => {
          postFault({order_id}).then(() => {
            this.getFault(detail.state);
          });
        },
      },
    ]);
  }
	finish = (e,detail) => {
		alert('提示', '是否完成', [
			{ text: '取消', style: 'default' },
			{ text: '确认',
				onPress: () => {
					postFinish({ order_id: detail.id }).then((res) => {            
					});
					this.getFault(detail.state);
				},
			},
		]);
	}
	remove = (e,detail) => {
		alert('提示', '是否完成', [
			{ text: '取消', style: 'default' },
			{ text: '确认',
				onPress: () => {
					postFinish({ id: detail.id,result:'transfer' }).then((res) => {            
					});
					this.getFault(detail.state);
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
    const { historyEvents, list, } = this.state;
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
							<List>
								{
									list.map((item, index) => (
										<List.Item className={styles.item} key={index}  extra={<ListButton edit={(event) => { this.deal(event,item,); }} />}>
											<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goFault(item)}>
												<tbody>
													<tr>
														<td className="tr">故障代码 ：</td>
														<td className="tl" style={{ width: '100px' }}>E{item.code}</td>
														<td className="tl">设备编号 ：</td>
														<td className="tl">{item.device_id}</td>
													</tr>
													<tr>
														<td className="tr">故障类型 ：</td>
														<td className="tl" style={{ width: '100px' }}>{names[item.type]}</td>
														<td className="tl">设备类型 ：</td>
														<td className="tl">{typeName[item.device_type] ||''}</td>
													</tr>
													<tr>
														<td className="tr">故障时间 ：</td>
														<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
													</tr>
													<tr>
														<td className="tr">故障时长 ：</td>
														<td className="tl">{item.hour}小时{item.minute}分{item.second}秒</td>					
													</tr>
												</tbody>
											</table>
										</List.Item>
									))
								}
							</List>
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
              <List>
              	{
              		list.map((item, index) => (
              			<List.Item className={styles.item} key={index}  extra={<Finish remove={(event) => { this.remove(event, item); }} />}>
              				<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goFault(item)}>
              					<tbody>
              						<tr>
              							<td className="tr">故障代码 ：</td>
              							<td className="tl" style={{ width: '100px' }}>E{item.code}</td>
              							<td className="tl">设备编号 ：</td>
              							<td className="tl">{item.device_id}</td>
              						</tr>
              						<tr>
              							<td className="tr">故障类型 ：</td>
              							<td className="tl" style={{ width: '100px' }}>{names[item.type]}</td>
              							<td className="tl">设备类型 ：</td>
              							<td className="tl">{typeName[item.device_type] ||''}</td>
              						</tr>
              						<tr>
              							<td className="tr">接单时间 ：</td>
              							<td className="tl">{item.create_time}</td>
              						</tr>
              						<tr>
              							<td className="tr">接单时长 ：</td>
              							<td className="tl">{item.hour}小时{item.minute}分{item.second}秒</td>					
              						</tr>
              					</tbody>
              				</table>
              			</List.Item>
              		))
              	}
              </List>
            </PullToRefresh>
          </div>
        </Tabs>
      </div>
    );
  }
}
