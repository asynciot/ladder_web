import React, { Component } from 'react';
import { Row, Col, Button, Spin, DatePicker, Pagination, Icon, Input,} from 'antd';
import { Tabs, Flex, Badge, List, Modal,} from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import styles from './FollowDevice.less';
import singalImg from '../../assets/signal.png';
import { getLadder,} from '../../services/api';

var switchIdx = 0;
const alert = Modal.alert;
const tabs2 = [
	{ title: '全部', state: '' },
	{ title: '在线', state: 'online' },
	{ title: '离线', state: 'longoffline' },
];
const state ={
	'online':'在线',
	'offline':'故障',
	'longoffline':'离线',
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
const ListButton = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="form" />
			<em>编辑</em>
		</span>
	</div>
);
export default class extends Component {
	state = {
		list: [],
		switchIdx:0,
		search_info:'',
		iddr:'',
	}
	componentWillMount() {
		if(state=="all"){
			switchIdx = 0
		}else if(state=="online"){
			switchIdx = 1
		}else if(state=="longoffline"){
			switchIdx = 3
		}
		this.state.switchIdx = switchIdx
		this.getDevice(1,switchIdx);
	}
	pageChange = (val) => {
		this.getDevice(val,switchIdx)
	}
	getDevice = (val,state) => {
		let { navs } = this.state;
		const page = val
		switchIdx = state
		if(switchIdx == 0){
			state = ""
		}else if(switchIdx == 1){
			state = "online"
		}else if(switchIdx == 2){
			state = "longoffline"
		}
		getLadder({ num: 10, page, state}).then((res) => {
			if (res.code === 0) {
				const list = res.data.list.map((item) => {
					return item;
				});
				this.setState({
					list,
					page,
					totalNumber:res.data.totalNumber,
				});
			} else {
				this.setState({
					list: [],
				});
			}
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
		const { navs, list, switchIdx } = this.state;
		return (
			<div className="content">
				<Tabs
				  tabs={tabs2}
				  initialPage={this.state.switchIdx}
				  tabBarActiveTextColor="#1E90FF"
				  tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
				  onChange={(tab, index) => { this.goFollowList(index); }}
				>
					<div style={{ backgroundColor: '#fff' }}>
						<List className={styles.lis}>
							<Row className={styles.page}>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder="设备编号或串号"
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder="安装地址"
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} >搜索</Button>
								</Col>
								<Col span={24} className={styles.center}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							{
								list.length ?
								list.map((item, index) => (
									<List.Item className={styles.item} key={index} extra={<ListButton edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<Col span={12}>
														<td className="tr">别名 ：</td>
														<td className="tl">{item.name ? item.name : '无'}</td>
													</Col>
												</tr>
												<tr>
													<a className={styles.text}>安装地址 ：</a>
													<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<Col span={12}>	
														<a className={styles.text}>控制柜 ：</a>
														<td className="tl">{item.ctrl ||''}</td>
													</Col>
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">门机 ：</td>
														<td className="tl">{item.door1}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">信号：</td>
														<td className="tl"><Signal width={item.rssi}/></td>
													</Col>
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">门机 ：</td>
														<td className="tl">{item.door2}</td>
													</Col>
													<Col span={12}>
														<td className="tl">状态 ：</td>
														<td className="tl">{state[item.state] ||''}</td>
													</Col>
												</tr>
											</tbody>
										</table>
									</List.Item>
								)):
								<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
									<Col span={24} className={styles.center}>
										<td></td>
										<td className="tl" style={{margin:'5px',}}>暂无数据</td>
									</Col>
								</table>
							}
						</List>
					</div>
				</Tabs>
			</div>
		);
	}
}
