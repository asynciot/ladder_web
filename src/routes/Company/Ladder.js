import React, { Component } from 'react';
import { Row, Col, Button, Pagination, Input, List, LocaleProvider } from 'antd';
import { Tabs, Flex, Badge, Modal } from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import styles from './Ladder.less';
import singalImg from '../../assets/signal.png';
import { getLadder,} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';
var switchId = 0;
const alert = Modal.alert;
const tabs2 = [
	{ title: (window.localStorage.getItem("language")=='zh')?'全部':'All', state: '' },
	{ title: (window.localStorage.getItem("language")=='zh')?'在线':'Online', state: 'online' },
	{ title: (window.localStorage.getItem("language")=='zh')?'离线':'Offline', state: 'longoffline' },
];
const state ={
	'online':'online',
	'offline':'offline',
	'longoffline':'long offline',
}
const Signal = ({ className = '', ...restProps }) => {
	let width = 1;
	if (restProps.width >= 0 && restProps.width <= 31) {
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
export default class extends Component {
	state = {
		list: [],
		switchId:0,
		search_info:'',
		iddr:'',
	}
	componentWillMount() {
		if(state=="all"){
			switchId = 0
		}else if(state=="online"){
			switchId = 1
		}else if(state=="longoffline"){
			switchId = 3
		}
		this.state.switchId = switchId
		this.getDevice(1,switchId);
	}
	pageChange = (val) => {
		this.getDevice(val,switchId)
	}
	getDevice = (val,state) => {
		let { navs } = this.state;
		const page = val
		switchId = state
		if(switchId == 0){
			state = ""
		}else if(switchId == 1){
			state = "online"
		}else if(switchId == 2){
			state = "longoffline"
		}
		getLadder({ num: 10, page, state, follow:"yes"}).then((res) => {
			if (res.code === 0) {
				const list = res.data.list.map((item) => {
					return item;
				});
				if(res.data.totalNumber==0){
					this.setState({
						list,
						page:0,
						totalNumber:res.data.totalNumber,
					});
				}else{
					this.setState({
						list,
						page,
						totalNumber:res.data.totalNumber,
					});
				}
			} else {
				this.setState({
					list: [],
				});
			}
		});
	}
	goLadder = (item) => {
		const type = item.device_model
		this.props.history.push({
			pathname:`/company/ladder/${item.id}`,
		});
	}
	edit = (e, detail) => {
		e.stopPropagation();
		e.preventDefault();
		this.props.history.push(`/company/edit-ladder/${detail.id}`);
	}
	goFollowList(val){
		const { history } = this.props;
		let state = 'all'
		if(val==1){
			state = "online"
		}else if(val==2){
			state = "longoffline"
		}
		history.push({
			pathname: `/company/ladder/${state}`,
		});
		this.getDevice(1,val)
	}
	onChange = (e) =>{
		this.setState({
			search_info:e.target.value,
		});
	}
	onChangel = (e) =>{
		this.setState({
			iddr:e.target.value,
		});
	}
	search = () =>{
		const search_info = this.state.search_info
		const install_addr = this.state.iddr
		getLadder({ num: 10, page:1, search_info, install_addr,}).then((res) => {
			if (res.code === 0) {
				const totalNumber = res.data.totalNumber
				const list = res.data.list.map((item) => {
					return item;
				});
				this.setState({
					list,
					totalNumber,
				});
			} else {
				this.setState({
					list: [],
				});
			}
		});
	}
	render() {
		const { navs, list, switchId } = this.state;
		var la = window.localStorage.getItem("language");
		if(la == "zh" ){
			la = zh;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className="content">
					<Tabs
						tabs={tabs2}
						initialPage={this.state.switchId}
						tabBarActiveTextColor="#1E90FF"
						tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
						onChange={(tab, index) => { this.goFollowList(index); }}
					>
						<div style={{ backgroundColor: '#fff' }}>
							<Row className={styles.page}>
								<Col span={8} style={{ margin:'5px' }}>
									<Input
										placeholder={(la==en)?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={8} style={{ margin:'5px' }}>
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
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item className={styles.item} key={index} onClick={()=>{this.goLadder(item)}}>
										<Col span={24}>
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
																<td className={styles.left}>{item.name ? item.name : <FormattedMessage id="None"/>}</td>
															</Col>
														</Col>
													</tr>
													<tr>
														<Col span={16}>
															<Col span={10}>
																<a className={styles.text}><FormattedMessage id="Ctrl"/> ：</a>
															</Col>
															<Col span={14}>
																<td className={styles.left}>{item.ctrl ||''}</td>
															</Col>
														</Col>
														<Col span={8}>
															<Col span={18}>
																<a className={styles.text2}><FormattedMessage id="RSSI"/> ：</a>
															</Col>
															<Col span={6}>
																<td className={styles.left3}><Signal width={item.rssi}/></td>
															</Col>
														</Col>
													</tr>
													<tr>
														<Col span={16}>
															<Col span={10}>
																<a className={styles.text}><FormattedMessage id="Door"/> ：</a>
															</Col>
															<Col span={14}>
																<td className="tl">{item.door1}</td>
															</Col>
														</Col>
														<Col span={8}>
															<Col span={18}>
																<a className={styles.text2}><FormattedMessage id="State"/> ：</a>
															</Col>
															<Col span={6}>
																<td className={styles.left3}><FormattedMessage id={state[item.state] ||'None'}/></td>
															</Col>
														</Col>
													</tr>
												</tbody>
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
