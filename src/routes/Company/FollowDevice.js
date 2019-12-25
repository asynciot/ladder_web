import React, { Component } from 'react';
import { Row, Col, Button, Pagination, Icon, Input, List, LocaleProvider } from 'antd';
import { Tabs, Modal,} from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import styles from './FollowDevice.less';
import singalImg from '../../assets/signal.png';
import { getFollowDevices, getDevicesStatus, getFaultUntreted } from '../../services/api';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';
import { injectIntl, FormattedMessage } from 'react-intl';

const LANGUAGE = window.localStorage.getItem("language");
var switchId = 0;
const alert = Modal.alert;
const tabs = [
	{ title: (LANGUAGE=='en') ? 'All' : '全部', state: '' },
	{ title: (LANGUAGE=='en') ? 'Online' : '在线', state: 'online' },
	{ title: (LANGUAGE=='en') ? 'Fault' : '故障', state: 'offline' },
	{ title: (LANGUAGE=='en') ? 'Offline' : '离线', state: 'longoffline' },
];
const modelName = {
	'0':'HPC181',
	"1":'NSFC01-01B',
	"2":'NSFC01-02T',
}
const typeName ={
	'240':'ctrl',
	'15':'door',
}
const state ={
	'online':'online',
	'offline':'offline',
	'longoffline':'long offline',
}
const module = {
	'1':'Wifi',
	'3':'China Unicom',
	'6':'China Mobile',
}

const PlaceHolder = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);

const Signal = ({ className = '', ...restProps }) => {
	let width = 0;
	if (restProps.width > 0 && restProps.width <= 31) {
		width =  (restProps.width/31) * 17 + 3;
	}
	if (restProps.width >= 100 && restProps.width <= 196) {
		width =  ((restProps.width-100)/96) * 17 + 4;
	}
	return (
		<div className={`${className} ${styles.signal}`}>
			<div className={styles.cover}
			style={{ width: `${width}px`}}
			/>
			<img src={singalImg} alt="" />
		</div>
	)
};
const ListButton = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="form" />
			<em><FormattedMessage id="edit"/></em>
		</span>
	</div>
);

export default class extends Component {
	state = {
		list: [],
		codelist:[],
		asd:[],
		switchId:0,
		device_type: 0,
		type:0,
		src: '',
		code: false,
		device:'',
		search_info:'',
		iddr:'',
	}
	componentWillMount() {
		const { location } = this.props;
		const match = pathToRegexp('/company/:id/:state').exec(location.pathname);
		if(match[1]=="followdoor"){
			this.state.device =	"door"
		}else{
			this.state.device =	"ctrl"
		}
		const state =match[2]
		const type = location.state.device_type
		if(state=="all"){
			switchId = 0
		}else if(state=="online"){
			switchId = 1
		}else if(state=="offline"){
			switchId = 2
		}else if(state=="longoffline"){
			switchId = 3
		}
		this.state.switchId = switchId
		this.getDevice(type,1,switchId);
	}
	pageChange = (val) => {
		const { device_type,} =this.state
		const page = val
		if(this.state.search_info != "" || this.state.iddr != ""){
			this.search(page)
		}else{
			this.getDevice(device_type,val,this.state.switchId)
		}
	}
	getDevice = (device_type,val,state) => {
		let { navs } = this.state;
		const page = val;
		switchId = state;
		if(switchId == 0){
			state = "";
		}else if(switchId == 1){
			state = "online";
		}else if(switchId == 2){
			state = "offline";
		}else if(switchId == 3){
			state = "longoffline";
		}
		if(switchId == 2){
			this.getFault(page,device_type);
		}else{
			this.setState({
				device_type,
				state,
			});
			getFollowDevices({ num: 10, page, device_type, state,}).then((res) => {
				if (res.code === 0) {
					const now = new Date().getTime();
					const totalNumber = res.data.totalNumber
					const list = res.data.list.map((item) => {
						if(item.state=="longoffline"){
							item.rssi=0;
						}
						if(item.cellular==1){
							item.IMEI = item.IMEI.substr(0,12);
						}
						return item;
					});
					if(totalNumber==0){
						this.setState({
							page:0,
						});
					}else{
						this.setState({
							list,
							page,
							totalNumber,
						});
					}
				} else {
					this.setState({
						list: [],
					});
				}
			});
		}
	}
	getFault = (e,device_type) =>{
		const list=[]
		if(device_type=="15"){
			device_type='door'
		}else{
			device_type='ctrl'
		}
		getFaultUntreted({ num: 10, page:e, islast:1, device_type, type:1 }).then((res) => {
			const pos = res.data.list.map((item,index) => {
				if(device_type=='ctrl'){
					item.code = 'E'+res.data.list[index].code.toString(16)
				}else{
					item.code = parseInt(res.data.list[index].code)+50
				}
				this.getFollowDevices(item.device_id,index,list,item.code)
			})
			if(res.data.totalNumber==0){
				this.setState({
					page:0,
				});
			}else{
				this.setState({
					page:e,
					totalNumber:res.data.totalNumber,
				});
			}
		})
	}
	getFollowDevices = (e,index,list,code) =>{
		getFollowDevices({ num: 1, page:1, device_id:e}).then((res) => {
			if (res.code == 0) {
				const as = res.data.list.map((item) => {
					return item;
				});
				as[0].code = code
				if(list[0]==null){
					list[0]=as[0]
				}else{
					list.push(as[0])
				}
				this.setState({
					codelist:list,
				});
			}
		});
	}
	goDevice = item => () => {
		if (item.device_type === '15') {
			const type = item.device_model
			this.props.history.push({
				pathname:`/door/${item.device_id}/realtime`,
				state: { type }
			});
		} else {
			this.props.history.push({
				pathname:`/ctrl/${item.device_id}/realtime`,
			});
		}
	}
	edit = (e, detail) => {
		e.stopPropagation();
		e.preventDefault();
		this.props.history.push(`/company/edit-device/${detail.device_id}`);
	}
	goFollowList(item,val){
		const { history } = this.props;
		let state = 'all'
		if(val==1){
			state = "online"
		}else if(val==2){
			state = "offline"
		}else if(val==3){
			state = "longoffline"
		}
		let device_type = ''
		if(this.state.device=="ctrl"){
			device_type = "240"
		}else{
			device_type = "15"
		}
		history.push({
			pathname: `/company/follow${this.state.device}/${state}`,
			state: { device_type }
		});
	}
	onChange = (e) =>{
		let val = e.target.value
		this.setState({
			search_info:val,
		});
	}
	onChangel = (e) =>{
		let val = e.target.value
		this.setState({
			iddr:val,
		});
	}
	search = (page) =>{
		const search_info = this.state.search_info,
		install_addr = this.state.iddr,
		device_type = this.state.device_type,
		state = this.state.state;
		getFollowDevices({ num: 10, page, search_info, install_addr, register: 'registered', device_type, state }).then((res) => {
			if (res.code == 0) {
				const now = new Date().getTime();
				const totalNumber = res.data.totalNumber
				const list = res.data.list.map((item) => {
					if(item.state=="longoffline"){
						item.rssi=0;
					}
					return item;
				});
				if(totalNumber == 0){
					this.setState({
						list,
						totalNumber,
						page:0,
					});
				}else{
					this.setState({
						list,
						totalNumber,
						page,
					});
				}
			}
		})
	}
	render() {
		const ModelName = { 1: 'NSFC01-01B', 2: 'NSFC01-02T'};
		const { navs, list, switchId } = this.state;
		var la;
 		if(LANGUAGE == "zh" ){
			la = zh;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className={styles.content}>
					<Tabs
						tabs={tabs}
						swipeable={false}
						initialPage={this.state.switchId}
						tabBarActiveTextColor="#1E90FF"
						tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
						onChange={(tab, index) => { this.goFollowList(tab.device_type,index); }}
					>
						<div style={{ backgroundColor: '#fff' }}>
							<Row>
								<Col span={7} className={styles.Input}>
									<Input
										placeholder={(la==en)?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={7} className={styles.Input}>
									<Input
										placeholder={(la==en)?"Install Address":"项目名称"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button className={styles.Button} onClick={()=>this.search(1)} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
							</Row>
							<List
								className={styles.lis}
								itemLayout="horizontal"
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton edit={(event) => { this.edit(event, item); }} />]} className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
											la==en?
											<Col span={20}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
                                </Col>
                                <Col span={12}>
                                  <td className={styles.left} style={{width:'240px'}}>{item.install_addr}</td>
                                </Col>
                              </Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/>：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="State"/> ：</a>
																<td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
											:
											<Col span={20}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left2} style={{width:'220px'}}>{item.install_addr}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/>：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="State"/> ：</a>
																<td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
										}
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
							<Row>
								<Col span={7} className={styles.Input}>
									<Input
										placeholder={(la==en)?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={7} className={styles.Input}>
									<Input
										placeholder={(la==en)?"Install Address":"项目名称"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button className={styles.Button} onClick={()=>this.search(1)} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
							</Row>
							<List
								className={styles.lis}
								itemLayout="horizontal"
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton edit={(event) => { this.edit(event, item); }} />]} className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
											la==en?
											<Col span={20}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
														      <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
														    </Col>
														    <Col span={12}>
														      <td className={styles.left} style={{width:'240px'}}>{item.install_addr}</td>
														    </Col>
														  </Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/> ：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/> ：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="State"/> ：</a>
																<td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text3}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
											:
											<Col span={20}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left2} style={{width:'220px'}}>{item.install_addr}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/> ：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/> ：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="State"/> ：</a>
																<td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text3}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
										}
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
								itemLayout="horizontal"
								dataSource={this.state.codelist}
								renderItem={(item,index) => (
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
											la==en?
											<Col span={22}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
														      <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
														    </Col>
														    <Col span={12}>
														      <td className={styles.left} style={{width:'240px'}}>{item.install_addr}</td>
														    </Col>
														  </Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/> ：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/> ：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="State"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}><FormattedMessage id={item.code}/></td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={12}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={12}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text3}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
											:
											<Col span={22}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
															    <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
															  </Col>
															  <Col span={14}>
															    <td className={styles.left2} style={{width:'220px'}}>{item.install_addr}</td>
															  </Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/> ：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/> ：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="State"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}><FormattedMessage id={item.code}/></td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text3}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
										}
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
							<Row>
								<Col span={7} className={styles.Input}>
									<Input
										placeholder={(la==en)?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={7} className={styles.Input}>
									<Input
										placeholder={(la==en)?"Install Address":"项目名称"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button className={styles.Button} onClick={()=>this.search(1)} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
							</Row>
							<List
								className={styles.lis}
								itemLayout="horizontal"
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton edit={(event) => { this.edit(event, item); }} />]} className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
											la==en?
											<Col span={20}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
															<td className={styles.left} style={{width:'220px'}}>{item.install_addr}</td>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/>：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="State"/>  ：</a>
																<td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text3}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
											:
											<Col span={20}>
												<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
													<tbody>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left2} style={{width:'220px'}}>{item.install_addr}</td>
																</Col>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="type"/>：</a>
																<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{item.IMEI}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
																<td className="tl"><Signal width={item.rssi}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="model"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{modelName[item.device_model]}</td>
																</Col>
															</Col>
															<Col span={8}>
																<a className={styles.text}><FormattedMessage id="State"/> : </a>
																<td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</tr>
														<tr>
															<Col span={16}>
																<Col span={10}>
																	<a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
																</Col>
																<Col span={14}>
																	<td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
																</Col>
															</Col>
														</tr>
															<Col span={6}>
																<a className={styles.text3}><FormattedMessage id="Base Station"/> ：</a>
															</Col>
																<p className={styles.text2}>{item.cell_address}</p>
													</tbody>
												</table>
											</Col>
										}
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
