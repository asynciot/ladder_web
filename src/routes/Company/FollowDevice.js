import React, { Component } from 'react';
import { Row, Col, Button, Spin, DatePicker, Pagination, Icon, Input,} from 'antd';
import { Tabs, Flex, Badge, List, Modal,} from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import styles from './FollowDevice.less';
import singalImg from '../../assets/signal.png';
import { getFollowDevices, getDevicesStatus, getFault } from '../../services/api';

var switchIdx = 0;
const alert = Modal.alert;
const tabs = [
	{ title: '全部', device_type: '' },
	{ title: '门机', device_type: '15' },
	{ title: '控制柜', device_type: '240' },
];
const tabs2 = [
	{ title: '全部', state: '' },
	{ title: '在线', state: 'online' },
	{ title: '故障', state: 'offline' },
	{ title: '离线', state: 'longoffline' },
];
const modelName = {
	'0':'无',
	"1":'NSFC01-01B',
	"2":'NSFC01 -02T',
}
const typeName ={
	'240':'控制柜',
	'15':'门机',
}
const state ={
	'online':'在线',
	'offline':'故障',
	'longoffline':'离线',
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
const PlaceHolder = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);


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
		device_type: 0,
		type:0,
		src: '',
		code: false,
		device:'',
		search_info:'',
		iddr:'',
	}
	async componentWillMount() {
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
			switchIdx = 0
		}else if(state=="online"){
			switchIdx = 1
		}else if(state=="offline"){
			switchIdx = 2
		}else if(state=="longoffline"){
			switchIdx = 3
		}
		this.state.switchIdx = switchIdx
		await this.getDevice(type,1,switchIdx);
	}
	pageChange = (val) => {
		const { device_type,} =this.state
		this.getDevice(device_type,val,switchIdx)
	}
	getDevice = (device_type,val,state) => {
		let { navs } = this.state;
		const page = val
		switchIdx = state
		if(switchIdx == 0){
			state = ""
		}else if(switchIdx == 1){
			state = "online"
		}else if(switchIdx == 2){
			state = "offline"
		}else if(switchIdx == 3){
			state = "longoffline"
		}
		if(switchIdx == 2){
			this.getFault(page,device_type)
		}else{
			this.setState({
				device_type
			});
			getFollowDevices({ num: 10, page, device_type, state, register:'registered',}).then((res) => {
				if (res.code === 0) {
					const now = new Date().getTime();
					const totalNumber = res.data.totalNumber
					const list = res.data.list.map((item) => {
					return item;
				});
				this.setState({
					list,
					page,
					totalNumber,
				});
				} else {
					this.setState({
						list: [],
					});
				}
			});
		}
	}
	getFault = (e,device_type) =>{
		const _this = this
		let list=[]
		if(device_type=="15"){
			device_type='door'
		}else{
			device_type='ctrl'
		}
		getFault({ num: 10, page:e, islast:1, device_type, state:'untreated' }).then((res) => {
			const pos = res.data.list.map((item,index) => {
				if(device_type=='ctrl'){
					item.code = res.data.list[index].code.toString(16)
				}else{
					item.code = (item.code+50)
				}
				_this.getFollowDevices(item.device_id,index,list,item.code)
			})
			this.setState({
				list,
				page:e,
				totalNumber:res.data.totalNumber,
			});
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
					list,
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
//     if (detail.install_addr == undefined || !detail.install_addr) {
//       this.props.history.push(`/company/edit-device/${detail.device_id}/undefined`);
//     }else {
		this.props.history.push(`/company/edit-device/${detail.device_id}`);
    // }
	}
	qrcode = (e, detail) => {
		e.stopPropagation();
		e.preventDefault();
		this.setState({
			src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${detail.deviceId}`,
			code: true,
		});
	}
	remove = (e, detail) => {
		e.stopPropagation();
		e.preventDefault();
		alert('提示', '是否取消关注', [
			{ text: '取消', style: 'default' },
			{ text: '确认',
				onPress: () => {
					deleteFollowInfo({ device_id: detail.device_id }).then((res) => {});
				},
			},
		]);
		this.forceUpdate()
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
		this.getDevice(device_type,1,val)
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
	search = () =>{
		const search_info = this.state.search_info
		const install_addr = this.state.iddr
		getFollowDevices({ num: 10, page:1, search_info, install_addr, register: 'registered', }).then((res) => {
			if (res.code === 0) {
				const now = new Date().getTime();
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
		const ModelName = { 1: 'NSFC01-01B', 2: 'NSFC01-02T'};
		const { navs, list, switchIdx } = this.state;
		return (
			<div className="content">
				<Modal
				  visible={this.state.code}
				  transparent
				  maskClosable={false}
				  title="二维码"
				  footer={[{ text: 'Ok', onPress: () => this.setState({code: false}) }] }
				  wrapProps={{ onTouchStart: this.onWrapTouchStart }}
				>
				  <div style={{ width: '100%', overflow: 'scroll' }}>
					<img src={this.state.src} alt="code"/>
				  </div>
				</Modal>
				<Tabs
				  tabs={tabs2}
				  initialPage={this.state.switchIdx}
				  tabBarActiveTextColor="#1E90FF"
				  tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
				  onChange={(tab, index) => { this.goFollowList(tab.device_type,index); }}
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
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton  remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<a className={styles.text}>安装地址 ：</a>
													<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">别名 ：</td>
														<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">类型：</td>
														<td className="tl">{typeName[item.device_type] ||''}</td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">串号 ：</td>
														<td className="tl">{item.IMEI}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">信号：</td>
														<td className="tl"><Signal width={item.rssi}/></td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">型号 ：</td>
														<td className="tl">{modelName[item.device_model]}</td>
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
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton  remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<a className={styles.text}>安装地址 ：</a>
													<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">别名 ：</td>
														<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">类型：</td>
														<td className="tl">{typeName[item.device_type] ||''}</td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">串号 ：</td>
														<td className="tl">{item.IMEI}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">信号：</td>
														<td className="tl"><Signal width={item.rssi}/></td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">型号 ：</td>
														<td className="tl">{modelName[item.device_model]}</td>
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
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton  remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<a className={styles.text}>安装地址 ：</a>
													<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">别名 ：</td>
														<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">类型：</td>
														<td className="tl">{typeName[item.device_type] ||''}</td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">串号 ：</td>
														<td className="tl">{item.IMEI}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">信号：</td>
														<td className="tl"><Signal width={item.rssi}/></td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">型号 ：</td>
														<td className="tl">{modelName[item.device_model]}</td>
													</Col>
												</tr>
												<tr>
													<Col span={24}>
														<td className="tl">状态 ：</td>
														<td className="tl">{faultCode[item.code]}</td>
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
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton  remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<a className={styles.text}>安装地址 ：</a>
													<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">别名 ：</td>
														<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">类型：</td>
														<td className="tl">{typeName[item.device_type] ||''}</td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">串号 ：</td>
														<td className="tl">{item.IMEI}</td>
													</Col>
													<Col span={12}>	
														<td className="tl">信号：</td>
														<td className="tl"><Signal width={item.rssi}/></td>
													</Col>	
												</tr>
												<tr>
													<Col span={12}>
														<td className="tr">型号 ：</td>
														<td className="tl">{modelName[item.device_model]}</td>
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
