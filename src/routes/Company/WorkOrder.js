import React, { Component } from 'react';
import { Icon, Button, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Modal, List,PullToRefresh } from 'antd-mobile';
import styles from './WorkOrder.less';
import { getFault, postFault, postFinish, deleteFault, getDispatch, getFollowDevices} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
var inte = null;
const Item = List.Item;
const format = "YYYY-MM-DD HH:mm";
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
	'door':'door',
	'ctrl':'ctrl',
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
}
const ListButton = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="form" />
			<em><FormattedMessage id="order"/></em>
		</span>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.address ? restProps.address:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="arrow-down" />
			<em><FormattedMessage id="install address"/></em>
		</span>
	</div>
);
const Finish = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.remove ? restProps.remove:''}>
			<Icon className={`${styles.delete} ${styles.icon}`} type="close" />
			<em><FormattedMessage id="transfer"/></em>
		</span>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.address ? restProps.address:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="arrow-down" />
			<em><FormattedMessage id="install address"/></em>
		</span>
	</div>
);
export default class extends Component {
	state = {
		historyEvents: [],
		list:[],
		list1:[],
		nowTime: new Date().getTime(),
		tab: 0,
		page: 1,
		total: 1,
		type:'',
		totalNumber:0,
		device_name:'',
	}
	tabs = [
		{ title: '待接单', type: 'untreated', count: 0 },
		{ title: '急修中', type: 'treated', count: 0 },
		// { title: '已完成', type: 2, count: 0 },
	];
	componentWillMount() {
		this.getFault('untreated')
		inte = setInterval(() => {
			this.getFault('untreated');
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
	init = (val) => {
		clearInterval(inte)
		inte = setInterval(() => {
			this.getFault(val);
		}, 60000);
	}
	getFault = (state) => {
		let {page, total, historyEvents} = this.state;
		this.state.type = state
		let device_name = []
		if(state == 'untreated'){
			getFault({ num: 10, page, state, islast:1 }).then((res) => {
				const list = res.data.list.map((item,index) => {
					const time = this.state.nowTime - item.createTime
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					const device_id = item.device_id
					getFollowDevices({num:1,page:1,device_id}).then((ind) => {
						device_name[index] = ind.data.list[0].device_name
						this.setState({
							device_name,
						});
					})
					if(item.device_type=='ctrl'){
						item.code = 'E'+res.data.list[index].code.toString(16)
					}else{
						item.code = 'dE'+res.data.list[index].code.toString(16)
					}
					this.setState({
						totalNumber:res.data.totalNumber,
					})
					return item;
				})
				this.setState({
					list,
					total: res.data.totalPage
				})
			}).catch((e => console.info(e)));
		}else{
			getDispatch({ num: 10, page, follow:'yes', state:'untreated', isreg:"True"}).then((res) => {
				clearInterval(inte)
				const list1 = res.data.list.map((item,index) => {
					const time = this.state.nowTime - item.create_time
					item.create_time = moment(parseInt(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					this.setState({
						totalNumber:res.data.totalNumber,
					})
					const device_id = item.device_id
					getFollowDevices({num:1,page:1,device_id}).then((ind) => {
						device_name[index] = ind.data.list[0].device_name
						this.setState({
							device_name,
						})
					})
					return item;
				})
				this.setState({
					list1,
					total:res.data.totalPage,
				})
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
		const { historyEvents, list, list1, device_name} = this.state;
		return (
			<div className="content">
				<Tabs
					tabs={this.tabs}
					initialPage={0}
					tabBarActiveTextColor="#1E90FF"
					tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
					onChange={(tab, index) => { this.setState({tab: tab.type, page: 1,total:1},()=>{this.getFault(tab.type);this.init(tab.type);});}}
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
													<td className="tr"><FormattedMessage id="device name"/> ：</td>
													<td className="tl">{device_name[index]}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="fault code"/> ：</td>
													<td className="tl" style={{ width: '200px' }}>{item.code}    <FormattedMessage id={item.code}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="fault"/><FormattedMessage id="type"/> ：</td>
													<td className="tl" style={{ width: '80px' }}><FormattedMessage id={'O'+item.type}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="device type"/> ：</td>
													<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="report time"/> ：</td>
													<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="fault duration"/> ：</td>
													<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
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
								<Col span={18}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							{
								list1.map((item, index) => (
									<List.Item className={styles.item} key={index}  extra={<Finish address={(event) => { this.address(item) }} remove={(event) => { this.remove(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goFault1(item)}>
											<tbody>
												<tr>
													<td className="tr"><FormattedMessage id="order ID"/> ：</td>
													<td className="tl" style={{ width: '100px' }}>{item.order_id}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="device name"/> ：</td>
													<td className="tl">{device_name[index]}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="maintenance type"/> ：</td>
													<td className="tl" style={{ width: '100px' }}>{names[item.order_type]}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="accept time"/> ：</td>
													<td className="tl">{item.create_time}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="order duration"/> ：</td>
													<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
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
