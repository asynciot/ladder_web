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
	1: 'O1',
	2: 'O2',
	3: 'O3',
}
const typeName = {
	'door':'door',
	'ctrl':'ctrl',
}
const CodeTransform = {
	'51':'04',
	'52':'07',
  '66':'08',
  '82':'03',
  '114':'LV',
  '178':'OV',
  '229':'MO',
}
const ListButton = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="form" />
			<em><FormattedMessage id="receive"/></em>
		</span>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.address ? restProps.address:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="arrow-down" />
			<em><FormattedMessage id="Address"/></em>
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
			<em><FormattedMessage id="Address"/></em>
		</span>
	</div>
);
export default class extends Component {
	state = {
		historyEvents: [],
		list:[],
		dispatchList:[],
		nowTime: new Date().getTime(),
		tab: 0,
		page: 1,
		total: 1,
		dispatchTotal:1,
		type:'',
		totalNumber:0,
		device_name:'',
	}
	tabs = [
		{ title: (window.localStorage.getItem("language")=='en') ? 'untreated' : '待接单', type:"untreated"},
		{ title: (window.localStorage.getItem("language")=='en') ? 'treated' : '急修中' , type:"treating"},
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
					const time = new Date().getTime() - item.createTime
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					const device_id = item.device_id
					this.setState({
						totalNumber:res.data.totalNumber,
					})
					getFollowDevices({num:1,page:1,device_id}).then((ind) => {
						device_name[index] = ind.data.list[0].device_name
						this.setState({
							device_name,
						});
					})
					if(item.device_type=='ctrl'){
						item.code = 'E'+res.data.list[index].code.toString(16)
					}else{
						item.code = CodeTransform[parseInt(res.data.list[index].code)+50]
					}
					return item;
				})
				this.setState({
					list,
				})
			}).catch((e => console.info(e)));
		}else{
			getDispatch({ num: 10, page, follow:'yes', state:'treating', isreg:"True"}).then((res) => {
				clearInterval(inte)
				const dispatchList = res.data.list.map((item,index) => {
					const time = new Date().getTime() - item.create_time
					item.create_time = moment(parseInt(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
					item.hour = parseInt((time)/(1000*3600))
					item.minute = parseInt(time%(1000*3600)/(1000*60))
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
					const device_id = item.device_id
					getFollowDevices({num:1,page:1,device_id}).then((ind) => {
						device_name[index] = ind.data.list[0].device_name
						this.setState({
							device_name,
						})
					})
					item.code = 'E'+res.data.list[index].code.toString(16)
					return item;
				})
				if(res.data.totalPage==0){
					this.setState({
						page:0,
					})
				}
				this.setState({
					dispatchList,
					totalNumber:res.data.totalNumber,
				})
			}).catch((e => console.info(e)));
		}
	}
	goFault = item => () =>{
		const id = item.id
		this.props.history.push({
			pathname:`/company/order/${item.id}`,
			state: { id }
		});
	}
	goFault1 = item => () =>{
		const id = item.id
		this.props.history.push({
			pathname:`/company/order/${item.order_id}`,
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
		const { historyEvents, list, dispatchList, device_name} = this.state;
    const la = window.localStorage.getItem("language");
		return (
			<div className="content">
				<Tabs
					tabs={this.tabs}
					initialPage={0}
					tabBarActiveTextColor="#1E90FF"
					tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
					onChange={(tab, index) => { this.setState({tab: tab.type, page: 1,total:1},()=>{this.getFault(tab.type);this.init(tab.type);});}}
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
                        {
                          la=="zh"?
                          <tbody>
                            <tr>
                              <a className={styles.text} style={{ width: '25%'}}><FormattedMessage id="Device Name"/>：</a>
                              <td className="tl">{device_name[index]}</td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '25%'}}><FormattedMessage id="fault code"/>：</a>
                               <td className="tl" style={{ width: '200px' }}>{item.code}<FormattedMessage id={item.code}/></td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '25%'}}><FormattedMessage id="type"/>：</a>
                              <td className="tl" style={{ width: '80px' }}><FormattedMessage id={'O'+item.type}/></td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '25%'}}><FormattedMessage id="Device Type"/>：</a>
                              <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '25%'}}><FormattedMessage id="report time"/>：</a>
                              <td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '25%'}}><FormattedMessage id="fault duration"/>：</a>
                              <td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
                            </tr>
                          </tbody>
                          :
                          <tbody>
                            <tr>
                              <a className={styles.text} style={{ width: '33%' }}><FormattedMessage id="Device Name"/>：</a>
                              <td className="tl">{device_name[index]}</td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '33%' }}><FormattedMessage id="fault code"/>：</a>
                              <td className="tl" style={{ width: '200px' }}><FormattedMessage id={item.code}/></td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '33%' }}><FormattedMessage id="type"/>：</a>
                              <td className="tl" style={{ width: '80px' }}><FormattedMessage id={'O'+item.type}/></td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '33%' }}><FormattedMessage id="Device Type"/>：</a>
                              <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '33%' }}><FormattedMessage id="report time"/>：</a>
                              <td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                            <tr>
                              <a className={styles.text} style={{ width: '33%' }}><FormattedMessage id="fault duration"/>：</a>
                              <td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
                            </tr>
                          </tbody>
                        }
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
								dispatchList.map((item, index) => (
									<List.Item className={styles.item} key={index}  extra={<Finish address={(event) => { this.address(item) }} remove={(event) => { this.remove(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goFault1(item)}>
											<tbody>
												<tr>
													<a className={styles.text}><FormattedMessage id="Device Name"/>：</a>
													<td className="tl">{device_name[index]}</td>
												</tr>
												<tr>
													<a className={styles.text}><FormattedMessage id="fault code"/>：</a>
													<td className="tl" style={{ width: '200px' }}><FormattedMessage id={item.code}/></td>
												</tr>
												<tr>
													<a className={styles.text}><FormattedMessage id="Accept Time"/> ：</a>
													<td className="tl">{item.create_time}</td>
												</tr>
												<tr>
													<a className={styles.text}><FormattedMessage id="order duration"/> ：</a>
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
