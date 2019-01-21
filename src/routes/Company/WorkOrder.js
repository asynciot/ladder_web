import React, { Component } from 'react';
import { Icon, Button, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Modal, List,PullToRefresh } from 'antd-mobile';
import styles from './WorkOrder.less';
import { getFault, postFault, postFinish, deleteFault, getDispatch, } from '../../services/api';

var inte = null;
const Item = List.Item;
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
const faultCode = {
	'0': '暂无',
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
	'51': '开关门受阻',
	'52': '飞车保护',
	'54': '电机过载',
	'58': '输出过流',
	'66': '输入电压过低',
	'82': '输入电压过高',
}
const ListButton = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles['list-btn']}`}>
    <span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
      <Icon className={`${styles.edit} ${styles.icon}`} type="form" />
      <em>接单</em>
    </span>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.address ? restProps.address:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="arrow-down" />
			<em>设备地址</em>
		</span>
  </div>
);
const Finish = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.remove ? restProps.remove:''}>
			<Icon className={`${styles.delete} ${styles.icon}`} type="close" />
			<em>转办</em>
		</span>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.address ? restProps.address:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="arrow-down" />
			<em>设备地址</em>
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
		this.getFault('untreated')
		var _this =this
		inte = setInterval(function () {
			_this.getFault('untreated');
		}, 60000);
  }
	componentWillUnmount() {
		clearInterval(inte)
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
			getFault({ num: 10, page, state, islast:1 }).then((res) => {
				const list = res.data.list.map((item,index) => {
					const time = this.state.nowTime - item.createTime
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					if(item.device_type=='ctrl'){
						item.code = res.data.list[index].code.toString(16)
					}else{
						item.code = (item.code+50)
					}
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
	address = (item) =>{
		const id = item.device_id
		this.props.history.push({
			pathname:`/company/${item.device_id}/map`,
			state: { id }
		});
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
									<List.Item className={styles.item} key={index}  extra={<ListButton address={(event) => { this.address(item); }} edit={(event) => { this.deal(event,item,); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goFault(item)}>
											<tbody>
												<tr>
													<td className="tr">故障名称 ：</td>
													<td className="tl" style={{ width: '200px' }}>{faultCode[item.code]}</td>
												</tr>
												<tr>	
													<td className="tr">设备编号 ：</td>
													<td className="tl">{item.device_id}</td>
												</tr>
												<tr>
													<td className="tr">故障类型 ：</td>
													<td className="tl" style={{ width: '80px' }}>{names[item.type]}</td>
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
									<List.Item className={styles.item} key={index}  extra={<Finish address={(event) => { this.address(item) }} remove={(event) => { this.remove(event, item); }} />}>
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
