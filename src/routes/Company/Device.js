import React, { Component } from 'react';
import { Icon } from 'antd';
import { Tabs, Flex, Badge, List, Modal } from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import { injectIntl, FormattedMessage } from 'react-intl';
import MobileNav from '../../components/MobileNav';
import styles from './Device.less';
import singalImg from '../../assets/signal.png';
import { getDevices, deleteFollowInfo } from '../../services/api';
const alert = Modal.alert;
const tabs = [
	{ title: '全部', device_type: '' },
	{ title: '控制器', device_type: '15' },
	{ title: '控制柜', device_type: '240' },
];
const typeName ={
	'240':'ctrl',
	'15':'door',
}
const state ={
	'online':'online',
	'offline':'offline',
	'longoffline':'long offline',
}
const alertName = (event) => {
	if (event.isLoss) {
		return '无';
	}
	let str = '';
	if (event.inHigh) {
		str += ' 输入电压过高 ';
	}
	if (event.inLow) {
		str += ' 输入电压过低 ';
	}
	if (event.outHigh) {
		str += ' 输出过流 ';
	}
	if (event.motorHigh) {
		str += ' 电机过载 ';
	}
	if (event.flySafe) {
		str += ' 飞车保护 ';
	}
	if (event.closeStop) {
		str += ' 开关门受阻 ';
	}
	if (str === '') {
		str = '运行正常';
	}
	return str;
};
const PlaceHolder = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);
function parseBuffer(val) {
	if (val && val != 0) {
		let bit = (+val).toString(2);
		while (bit.length < 8) {
			bit = `0${bit}`;
		}
		return bit.split('');
	} else {
		return '00000000'.split('');
	}
}
function parseInfo(event) {
	const name = [
		'closeBtn',
		'openBtn',
		'close',
		'open',
		'lock',
		'run',
		'toDown',
		'toUp',
		'group',
		'parallel',
		'single',
		'full',
		'over',
		'error',
		'lockbd',
		'fire',
		'driver',
		'check',
		'auto',
		'floor',
		'lastCode',
		'lastFloor',
		'lastTime',
	];
	const obj = {};
	const model = { '01': '单梯', '10': '并联', '100': '群控', '000': '无' };
	const status = ['自动', '检修', '司机', '消防', '锁体', '故障', '超载', '满载'];
	const btn = { '00': '无', '01': '开门', 10: '关门' };
	let floor = '', lastCode = '', lastFloor = '', lastTime= '';
	event.forEach((item, index) => {
		if (index <= 7) {
			obj[name[index]] = parseInt(item);
		}
		if (index > 11 && index <= 23) {
			obj[name[index - 5]] = parseInt(item);
		}
		if (index>=24 && index<=31) {
			floor += `${item}`;
		}
		if (index>=32 && index<=39) {
			lastCode += `${item}`;
		}
		if (index>=40 && index<=47) {
			lastFloor += `${item}`;
		}
		if (index>=48 && index<=79) {
			lastTime += `${item}`;
		}
	});
	const statusBit = [obj.auto, obj.check, obj.driver, obj.fire, obj.lockbd, obj.error, obj.over, obj.full];
	obj.status = statusBit.map((item, index) => (item === 1 ? status[index] : '')).filter(item => item).toString();
	obj.model = model[`0${obj.single}`] || model[`${obj.parallel}0`] || model[`${obj.group}00`];
	obj.btn = btn[`${obj.closeBtn}${obj.openBtn}`];
	obj.floor = parseInt( floor, 2);
	obj.lastCode = parseInt( floor, 2);
	obj.lastFloor = parseInt( floor, 2);
	obj.lastTime = parseInt( floor, 2);
	return obj;
}
function parseEvent(event) {
	const name = [
		'openIn',
		'closeIn',
		'openTo',
		'closeTo',
		'openSlow',
		'closeSlow',
		'openToOut',
		'closeToOut',
		'door',
		'open',
		'close',
		'openKeep',
		'closeKeep',
		'stop',
		'inHigh',
		'inLow',
		'outHigh',
		'motorHigh',
		'flySafe',
		'closeStop',
	];
	const obj = {};
	let position = '';
	let current = '';
	let speed = '';
	event.forEach((item, index) => {
		if (name[index]) {
			obj[name[index]] = parseInt(item);
		} else if (index > 19 && index <= 31) {
			position += `${item}`;
		} else if (index > 31 && index <= 47) {
			current += `${item}`;
		} else if (index > 47 && index <= 63) {
			speed += `${item}`;
		}
	});
	obj.position = parseInt(position, 2);
	obj.current = (parseInt(current, 2) / 1000).toFixed(3);
	obj.speed = ((parseInt(speed, 2) << 16 >> 16) / 1000).toFixed(3);
	obj.status = alertName(obj)
	return obj;
}
const Signal = ({ className = '', ...restProps }) => {
	let width = 1;
	if (restProps.width >= 0 && restProps.width <= 31) {
		width =  (restProps.width/31) * 17 + 3;
	}
	if (restProps.width >= 99 && restProps.width <= 191) {
		width =  ((restProps.width-99)/92) * 17 + 4;
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
		{/* <span style={{ display: 'block', marginBottom: 6, textAlign: 'center'}} onClick={restProps.qrcode ? restProps.qrcode:''}>
			<Icon className={`${styles.qrcode} ${styles.icon}`} type="qrcode" />
		</span> */}
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
			<Icon className={`${styles.edit} ${styles.icon}`} type="form" />
			<em>编辑</em>
		</span>
		<span onClick={restProps.remove ? restProps.remove:''}>
			<Icon className={`${styles.delete} ${styles.icon}`} type="close" />
			<em>删除</em>
		</span>
	</div>
);

const statusName = (item) => {
	let alert = '';
	const bit = item.Alert;
	if (item.isLoss) {
		return '失联';
	}
	if (!bit) {
		return '无';
	}
	if (bit == '0') {
		alert = '运行正常';
		return alert;
	}
	let hex = (+bit).toString(2);
	while (hex.length < 8) {
		hex = `0${hex}`;
	}
	hex = hex.split('').reverse();
	hex.forEach((item, index) => {
		if (item == '1') {
			alert += `${status[index]}
			`;
		}
	});
	return alert;
};
export default class extends Component {
	state = {
		totalList: [],
		list: [],
		switchIdx: 0,
		type: 0,
		src: '',
		code: false,
		navs: {
			all: 0,
			ok: 0,
			fault: 0,
			missing: 0,
		},
	}
	componentWillMount() {
		this.getDevice();
	}

	getDevice = (device_type) => {
		let { navs } = this.state;
		this.setState({
			device_type,
		});
		getDevices({ device_type, num: 10, page: 1 }).then((res) => {
			if (res.code === 0) {
				const now = new Date().getTime();
				const list = res.data.list.map((item) => {
					if (!item.updateTime) {
						item.isLoss = true;
					} else if (now - item.updateTime > 120000) {
						item.isLoss = true;
						item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm')
					} else {
						item.isLoss = false;
						item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm')
					}
					let arr = [];
					if (item.Event) {
							const buffer = base64url.toBuffer(item.Event);
								buffer.forEach((item) => {
									arr = arr.concat(parseBuffer(item));
							});
						if (item.device_type == '15') {
							item.event = parseEvent(arr);
							item.event.status == '运行正常' ? item.Alert = 0 : item.Alert = 1;
						}else if (item.device_type == '240') {
							item.event = parseInfo(arr);
							item.event.status == '自动' ? item.Alert = 0 : item.Alert = 1;
						} else {
							item.Alert = 0
							item.event = {
								status: '运行正常'
							}
						}
					}else {
						item.Alert = 0
						item.isLoss ? item.event = {} : item.event = {
							status: '运行正常'
						}
					}
					return item;
				});
				
				navs.all = list.length;
				navs.ok = (list.filter(item => item.state  === 'online') || []).length;
				navs.fault = (list.filter(item => item.state === 'offline') || []).length;
				navs.missing = (list.filter(item => item.state === 'longoffline') || []).length;
				this.setState({
					switchIdx: 0,
					navs,
					totalList: list,
					list,
				});
			} else {
				navs = {
					all: 0,
					ok: 0,
					fault: 0,
					missing: 0,
				};
				this.setState({
					switchIdx: 0,
					navs,
					totalList: [],
					list: [],
				});
			}
		});
	}
	goDevice = item => () => {
		if (item.device_type === '15') {
			this.props.history.push(`/door/${item.IMEI}/realtime`);
		} else {
			this.props.history.push(`/ctrl/${item.IMEI}/realtime`);
		}
	}

	switchList = (switchIdx) => {
		const { totalList } = this.state;
		this.setState({
			switchIdx,
		});
		switch (parseInt(switchIdx)) {
			case 0:
				this.setState({
					list: totalList,
				});
				break;
			case 1:
				this.setState({
					list: totalList.filter(item => item.state  === "online"),
				});
				break;
			case 2:
				this.setState({
					list: totalList.filter(item => item.state  === "offline"),
				});
				break;
			case 3:
				this.setState({
					list: totalList.filter(item => item.state  === "longoffline"),
				});
				break;
			default:
				this.setState({
					list: totalList,
				});
				break;
		}
	}
	edit = (e, detail) => {
		e.stopPropagation();
		e.preventDefault();
		if (detail.cell_address == undefined || !detail.cell_address) {
			this.props.history.push(`/company/edit-device/${detail.IMEI}/undefined`);
		}else {
			this.props.history.push(`/company/edit-device/${detail.IMEI}/${detail.cell_address}`);
		}
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
					deleteFollowInfo({ id: detail.id }).then((res) => {
						this.getDevice(this.state.device_type).then((res) => {
							this.switchList(this.state.switchIdx);
						});
					});
				},
			},
		]);
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
					tabs={tabs}
					initialPage={0}
					tabBarActiveTextColor="#1E90FF"
					tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
					onChange={(tab, index) => { this.getDevice(tab.device_type); }}
					// onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
				>
					<div style={{ backgroundColor: '#fff' }}>
						<Flex>
							<Flex.Item onClick={() => this.switchList(0)}><PlaceHolder className={switchIdx === 0 ? styles.active : ''}><FormattedMessage id="All"/> {navs.all}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(1)}><PlaceHolder className={switchIdx === 1 ? styles.active : ''}><FormattedMessage id="online"/> {navs.ok}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(2)}><PlaceHolder className={switchIdx === 2 ? styles.active : ''}><FormattedMessage id="offline"/> {navs.fault}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(3)}><PlaceHolder className={switchIdx === 3 ? styles.active : ''}><FormattedMessage id="long offline"/> {navs.missing}</PlaceHolder></Flex.Item>
						</Flex>
						<List>
							{
								list.map((item, index) => (
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton qrcode={(event) => { this.qrcode(event, item); }} remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<td className="tr"><FormattedMessage id="Base Station"/> ：</td>
													<td className="tl" style={{ width: '260px' }}>{item.cell_address}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="Device Name"/> ：</td>
													<td className="tl">{item.device_name ? item.device_name : ' '}</td>
													<td className="tl"><FormattedMessage id="type"/> ：</td>
													<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="Device IMEI"/> ：</td>
													<td className="tl">{item.IMEI}</td>
													<td className="tl"><FormattedMessage id="RSSI"/> ：</td>
													<td className="tl"><Signal width={item.RSSI}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="model"/> ：</td>
													<td className="tl">{item.device_model ? item.device_model : ' '}</td>
													<td className="tr"><FormattedMessage id="State"/> ：</td>
													<td className="tl"><FormattedMessage id={state[item.state] ||''}/></td>
												</tr>
											</tbody>
										</table>
									</List.Item>
								))
							}
						</List>
					</div>
					<div style={{ backgroundColor: '#fff' }}>
						<Flex>
							<Flex.Item onClick={() => this.switchList(0)}><PlaceHolder className={switchIdx === 0 ? styles.active : ''}><FormattedMessage id="All"/> {navs.all}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(1)}><PlaceHolder className={switchIdx === 1 ? styles.active : ''}><FormattedMessage id="online"/> {navs.ok}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(2)}><PlaceHolder className={switchIdx === 2 ? styles.active : ''}><FormattedMessage id="offline"/> {navs.fault}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(3)}><PlaceHolder className={switchIdx === 3 ? styles.active : ''}><FormattedMessage id="long offline"/> {navs.missing}</PlaceHolder></Flex.Item>
						</Flex>
						<List>
							{
								list.map((item, index) => (
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
														<td className="tr"><FormattedMessage id="Base Station"/> ：</td>
														<td className="tl" style={{ width: '260px' }}>{item.cell_address}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="Device Name"/> ：</td>
													<td className="tl">{item.device_name ? item.device_name : ' '}</td>
													<td className="tl"><FormattedMessage id="Device Type"/> ：</td>
													<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="Device IMEI"/> ：</td>
													<td className="tl">{item.IMEI}</td>
													<td className="tl"><FormattedMessage id="RSSI"/> ：</td>
													<td className="tl"><Signal width={item.RSSI}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="model"/> ：</td>
													<td className="tl">{item.device_model ? item.device_model : ' '}</td>
													<td className="tr"><FormattedMessage id="State"/> ：</td>
													<td className="tl"><FormattedMessage id={state[item.state] ||''}/></td>
												</tr>
											</tbody>
										</table>
									</List.Item>
								))
							}
						</List>
					</div>
					<div style={{ backgroundColor: '#fff' }}>
						<Flex>
							<Flex.Item onClick={() => this.switchList(0)}><PlaceHolder className={switchIdx === 0 ? styles.active : ''}><FormattedMessage id="All"/> {navs.all}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(1)}><PlaceHolder className={switchIdx === 1 ? styles.active : ''}><FormattedMessage id="online"/> {navs.ok}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(2)}><PlaceHolder className={switchIdx === 2 ? styles.active : ''}><FormattedMessage id="offline"/> {navs.fault}</PlaceHolder></Flex.Item>
							<Flex.Item onClick={() => this.switchList(3)}><PlaceHolder className={switchIdx === 3 ? styles.active : ''}><FormattedMessage id="long offline"/> {navs.missing}</PlaceHolder></Flex.Item>
						</Flex>
						<List>
							{
								list.map((item, index) => (
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<td className="tr"><FormattedMessage id="base station "/> ：</td>
													<td className="tl" style={{ width: '260px' }}>{item.cell_address}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="Device Name"/> ：</td>
													<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													<td className="tl"><FormattedMessage id="type"/> ：</td>
													<td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="Device IMEI"/> ：</td>
													<td className="tl">{item.IMEI}</td>
													<td className="tl"><FormattedMessage id="RSSI"/> ：</td>
													<td className="tl"><Signal width={item.RSSI}/></td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="model"/> ：</td>
													<td className="tl">{item.device_model ? item.device_model : '无'}</td>
													<td className="tr"><FormattedMessage id="State"/> ：</td>
													<td className="tl"><FormattedMessage id={state[item.state] ||''}/></td>
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
