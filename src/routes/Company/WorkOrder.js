import React, { Component } from 'react';
import { Icon, Button, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Modal, List,PullToRefresh } from 'antd-mobile';
import styles from './WorkOrder.less';
import { getFault, postFault, postFinish, deleteFault, getDispatch, } from '../../services/api';


const Item = List.Item;
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
		nowTime: new Date().getTime(),
    tab: 0,
    page: 1,
    total: 1,
		type:'',
		totalNumber:0,
  }
  componentWillMount() {
    this.getFault('untreated');
  }
	pageChange = (val) => {
		const {type} =this.state
		this.state.page = val
		this.getFault(type)
	}
  getFault = (state) => {
    let {page, total, historyEvents} = this.state;
		this.state.type = state
		if(state == 'untreated'){
			getFault({ num: 10, page, state }).then((res) => {
				const list = res.data.list.map((item,index) => {
					const time = this.state.nowTime - item.createTime
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)					
					item.code = res.data.list[index].code.toString(16)
					this.state.totalNumber=res.data.totalNumber
					return item;
				})
				this.setState({
					list,
					total: res.data.totalPage
				});
			}).catch((e => console.info(e)));
		}else{
			getDispatch({ num: 10, page, follow:'yes', state:'untreated'}).then((res) => {
				const list = res.data.list.map((item) => {
					const time = this.state.nowTime - item.create_time
					item.create_time = moment(parseInt(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					this.state.totalNumber=res.data.totalNumber
					return item;
				})
				this.setState({
					list,
					total: res.data.totalPage,
				});
			}).catch((e => console.info(e)));
		}	
  }
	goFault = item => () =>{
		const id = item.id
		this.props.history.push({
			pathname:`/order/${item.id}`,
			state: { id }
		});
	}
	goFault1 = item => () =>{
		const id = item.id
		this.props.history.push({
			pathname:`/order/${item.order_id}`,
			state: { id }
		});
	}
  deal = (e, detail) => {
		const order_id = detail.id
    alert('提示', desc[detail.state], [
      { text: '取消', style: 'default' },
      { text: '确认',
        onPress: () => {
          postFault({order_id}).then(() => {
            this.getFault(detail.state)
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
						this.getFault(detail.state)
					});
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
						this.getFault("")
					});
				},
			},
		]);
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
          onChange={(tab, index) => { this.setState({tab: tab.type, page: 1,total:1},()=>{this.getFault(tab.type);} );  }}
          // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <div>
						<List>
							<Row className={styles.page}>
								<Col span={6}>
								</Col>
								<Col span={18} >
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
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
          </div>
          <div>
						<List>
							<Row className={styles.page}>
								<Col span={6}>
								</Col>
								<Col span={18} >
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							{
								list.map((item, index) => (
									<List.Item className={styles.item} key={index}  extra={<Finish remove={(event) => { this.remove(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goFault1(item)}>
											<tbody>
												<tr>
													<td className="tr">订单编号 ：</td>
													<td className="tl" style={{ width: '100px' }}>{item.order_id}</td>
													<td className="tl">设备编号 ：</td>
													<td className="tl">{item.device_id}</td>
												</tr>
												<tr>
													<td className="tr">故障类型 ：</td>
													<td className="tl" style={{ width: '100px' }}>{names[item.order_type]}</td>
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
          </div>
        </Tabs>
      </div>
    );
  }
}
