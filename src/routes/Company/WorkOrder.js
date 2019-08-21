import React, { Component } from 'react';
import { Icon, Button, Row, Col, Pagination, List, LocaleProvider } from 'antd';
import { Tabs, Flex, Modal, PullToRefresh } from 'antd-mobile';
import styles from './WorkOrder.less';
import { getFault, postFault, postFinish, deleteFault, getDispatch, getFollowDevices} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';

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
		code:[],
		nowTime: new Date().getTime(),
		tab: 0,
		page: 1,
		total: 1,
		dispatchTotal:1,
		type:'',
		totalNumber:0,
		device_name:'',
		language:window.localStorage.getItem("language"),
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
		let type = []
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
				if(res.data.totalNumber==0){
					this.setState({
						totalNumber:0,
						page:0,
					})
				}
				this.setState({
					list,
				})
			}).catch((e => console.info(e)));
		}else{
			getDispatch({ num: 10, page, state:'treating', isreg:"True"}).then((res) => {
				clearInterval(inte)
				const dispatchList = res.data.list.map((item,index) => {
					const time = new Date().getTime() - item.create_time
					item.create_time = moment(parseInt(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
					item.hour = parseInt((time)/(1000*3600));
					item.minute = parseInt(time%(1000*3600)/(1000*60));
					item.second = parseInt(time%(1000*3600)%(1000*60)/1000);
					const device_id = item.device_id;
					getFollowDevices({num:1,page:1,device_id}).then((ind) => {
						device_name[index] = ind.data.list[0].device_name
						type[index] = ind.data.list[0].device_type
						this.setState({
							device_name,
							type,
						})
					})
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
			})
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
		const { language } = this.state;
		const order_id = detail.id;
		if(language=="zh"){
			alert('提示', desc[detail.state], [
				{ text: '取消', style: 'default' },
				{ text: '确认',
					onPress: () => {
						postFault({order_id}).then((res) => {
							if(res.code == 0){
								if(language=="zh"){
									alert("接单成功！")
								}else{
									alert("Success")
								}
							}else{
								if(language=="zh"){
									alert("接单失败！")
								}else{
									alert("Error")
								}
							}
							this.getFault(detail.state)
						});
					},
				},
			]);
		}else{
			alert('提示', desc[detail.state], [
				{ text: 'cancel', style: 'default' },
				{ text: 'ok',
					onPress: () => {
					  postFault({order_id}).then(() => {
						this.getFault(detail.state)
					  });
					},
				},
			]);
		}
	}
	address = (item) =>{
		const id = item.device_id
		this.props.history.push({
			pathname:`/company/${item.device_id}/map`,
			state: { id }
		});
	}
	remove = (e,detail) => {
		if(this.state.language=="zh"){
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
		}else{
			alert('提示', 'Finish?', [
				{ text: 'cancel', style: 'default' },
				{ text: 'ok',
					onPress: () => {
						postFinish({ id: detail.id,result:'transfer' }).then((res) => {
							this.getFault("")
						});
					},
				},
			]);
		}
	}
	render() {
		const { historyEvents, list, dispatchList, device_name, code, language} = this.state;
		var la;
		if(language == "zh" ){
			la = zh;
		}else{
			la = en;
		}
		if(dispatchList.length!=0){
			dispatchList.map((item,index)=>{
				if(this.state.type[index] == '240'){
					code[index] = 'E'+item.code.toString(16)
				}else{
					code[index] = CodeTransform[parseInt(item.code)+50]
				}
			})
		}
		return (
			<LocaleProvider locale={la}>
				<div className="content">
					<Tabs
						tabs={this.tabs}
						initialPage={0}
						tabBarActiveTextColor="#1E90FF"
						tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
						onChange={(tab, index) => { this.setState({tab: tab.type, page: 1,total:1},()=>{this.getFault(tab.type);this.init(tab.type);});}}
					>
						<div  style={{ backgroundColor: '#fff' }}>
							<List
								className={styles.lis}
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton address={(event) => { this.address(item); }} edit={(event) => { this.deal(event,item,); }} />]} className={styles.item} key={index} onClick={this.goFault(item)}>
										<Col span={20}>	
											<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" >
												{
													language=="zh"?
													<tbody>
														<tr>
															<a className={styles.text}><FormattedMessage id="fault code"/>：</a>
															<td className={styles.left2} style={{ width: '210px' }}><FormattedMessage id={item.code}/></td>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{device_name[index]}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="type"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl" style={{ width: '80px' }}><FormattedMessage id={'O'+item.type}/></td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Type"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="report time"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="fault duration"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
																</Col>
															</Col>
														</tr>
													</tbody>
													:
													<tbody>
														<tr>
															<a className={styles.text}><FormattedMessage id="fault code"/>：</a>
															<td className={styles.left} style={{ width: '210px' }}><FormattedMessage id={item.code}/></td>
														</tr>
														<tr>
															<Col span={18}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{device_name[index]}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={18}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="type"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl" style={{ width: '80px' }}><FormattedMessage id={'O'+item.type}/></td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={18}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Type"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={18}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="report time"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={18}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="fault duration"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
																</Col>
															</Col>
														</tr>
													</tbody>
												}
											</table>
										</Col>
									</List.Item>
								)}
							/>
							<Row className={styles.page}>
								<Col span={24} className={styles.center2}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
						</div>
						<div style={{ backgroundColor: '#fff' }}>
							<List
								className={styles.lis}
								dataSource={dispatchList}
								renderItem={(item,index) => (
									<List.Item actions={[<Finish address={(event) => { this.address(item) }} remove={(event) => { this.remove(event, item); }} />]} className={styles.item} key={index} onClick={this.goFault1(item)}>
										<Col span={20}>	
											<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" >
												{
													language=="zh"?
													<tbody>
													{
														code[index]?
														(	
															<tr>
																<a className={styles.text}><FormattedMessage id="fault code"/>：</a>
																<td className={styles.left} style={{ width: '200px' }}><FormattedMessage id={code[index]}/></td>
															</tr>
														):(
															<div></div>
														)
													}
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/>：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{device_name[index]}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Accept Time"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{item.create_time}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="order duration"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
																</Col>
															</Col>
														</tr>
													</tbody>
													:
													<tbody>
													{
														code[index]?
														(	
															<tr>
																<a className={styles.text}><FormattedMessage id="fault code"/>：</a>
																<td className={styles.left} style={{ width: '200px' }}><FormattedMessage id={code[index]}/></td>
															</tr>
														):(
															<div></div>
														)
													}
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/>：</a>
																</Col>
																<Col span={12}>
																	<td className="tl">{device_name[index]}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Accept Time"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className="tl">{item.create_time}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="order duration"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
																</Col>
															</Col>
														</tr>
													</tbody>
												}
											</table>
										</Col>
									</List.Item>
								)}
							/>
							<Row className={styles.page}>
								<Col span={24} className={styles.center2}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
						</div>
					</Tabs>
				</div>
			</LocaleProvider>
		);
	}
}
