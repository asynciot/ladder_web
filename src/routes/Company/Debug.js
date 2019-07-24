import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { message } from 'antd';
import { Row, Col, Button, Checkbox, Switch } from 'antd';
import { List, InputItem, Picker } from 'antd-mobile';
import base64url from 'base64url';
import classNames from 'classnames';
import StringMask from 'string-mask';
import styles from './Debug.less';
import { injectIntl, FormattedMessage } from 'react-intl';

const Item = List.Item;
const pattern =  /^[0-9a-fA-f]+$/
const formatter = new StringMask('AA,AA,AA,AA,AA,AA,AA,AA,AA,AA,AA,AA,AA,AA,AA,AA');

function str2format (val, len, format) {
	while(val.length < len) {
		val += ' '
	}
	if(val && val != '') {
		return format.apply(val)
	}else {
		return format.apply(address)
	}
}
let play = null;
const timeList = [{
	label: '90s',
	value: 90,
},{
	label: '60s',
	value: 60,
}, {
	label: '120s',
	value: 120,
}];
const defaultDebug = ['','','','','','','','',];
@connect(({ ctrl, global, user }) => ({ 
	ctrl,
	global,
	currentUser: user.currentUser,
 }))
export default class Debug extends Component {
	state = {
		debugList:[],
		disabled: false,
		checked: false,
		base: ['','','',''],
		offsets: ['','','','','','','','','','','','','','','','',],
		switch: false,
		debug: ['','','','','','','','',],
		pick: [120],
		offsetIdx:[],
	}
	componentDidMount() {
	}
	onTimeChange = (val) => {
		this.setState({
			pick: val,
		});
	}
	onChange = (e) => {
		let offsets = [];
		let arr = this.state.offsets
		if(e.target.checked) {
			let offsetsVal = '';
			if (arr[1] != '' || arr[0]!= '') {
				arr[1] == '' ? arr[1] = '00' : null;
				arr[0] == '' ? arr[0] = '00' : null;
			}
			const first = arr[0] + arr[1];
			let num = Number(`0x${first}`);
			offsetsVal = first;
			if (first == '') {
				arr = this.state.offsets.map((item, index)=> {
					if(index >= 2){
						item = '00'
					}
					return item
				})
			}else {
				if (first != 'ffff') {
					let i = 1;
					while(i< 8) {
						num++;
						let str = num.toString(16)
						while(str.length < 4){
							str = '0'+ str;
						}
						offsetsVal += str;
						i++;
					}
					arr = formatter.apply(offsetsVal).split(',')
				}
				this.setState({
					offsets: arr,
				})
			}
		} else {
			arr = this.state.offsets.map((item, index)=> {
				item = ''
				return item
			})
		}
		this.setState({
			offsets: arr,
			checked: e.target.checked,
			disabled: e.target.checked,
		})
	}

	inputChange = (e, val, index) => {
		if(this.state.base[0].length==1){
			document.getElementById("fir").focus()
		}
		if(this.state.base[1].length==1){
			document.getElementById("sec").focus()
		}
		if(this.state.base[2].length==1){
			document.getElementById("thr").focus()
		}
		if(this.state.offsets[0].length==1){
			document.getElementById("fif").focus()
		}
		if(pattern.test(e.target.value) || e.target.value == '') {
			let arr = this.state[val]
			arr[index] = e.target.value
			this.setState({
				val: arr,
			})
		}
	}
	inputOffset =  (e, val, index) => {
		let arr = this.state[val]
		if (val == 'offsets' && index <= 1 && this.state.checked) {
			let offsetsVal = '';
			if (arr[1] != '' || arr[0]!= '') {
				arr[1] == '' ? arr[1] = '00' : null;
				arr[0] == '' ? arr[0] = '00' : null;
			}
			const first = arr[0] + arr[1];
			let num = Number(`0x${first}`);
			offsetsVal = first;
			if (first == '') {
				return;
			}else {
				if (first != 'ffff') {
					let i = 1;
					while(i< 8) {
						num++;
						let str = num.toString(16)
						while(str.length < 4){
							str = '0'+ str;
						}
						offsetsVal += str;
						i++;
					}
					arr = formatter.apply(offsetsVal).split(',')
				}
				this.setState({
					offsets: arr,
				})
			}
		}
	}
	offsetsChange = (e) => {
		this.setState({
			offsets: e.target.value,
		})
	}
	search = (val) => {
		let isNotFull = false
		let { dispatch, match: { params: { id }}, ctrl: { debugWs}, currentUser} = this.props;
		let { base, checked, offsets } = this.state;
		let baseVal = '', offsetsVal = '';
		let offsetIdx = [];
		base.forEach((item, index) => {
			if ((+index+1)%2 == 0) {
				if (base[index-1] != '' || base[index] != '') {
					base[index-1] == '' ? base[index-1] = '00' : null;
					base[index] == '' ? base[index] = '00' : null;
					baseVal += (base[index-1] +','+ base[index]+',');
				}
			}
		})
		if (!checked) {
			offsets.forEach((item, index) => {
				
				if ((+index+1)%2 == 0) {
					if (offsets[index-1] == '' && offsets[index] ) {
						isNotFull = true
					}
					if (offsets[index-1]  && offsets[index]  == '') {
						isNotFull = true
					}
				}
				if (item!= '') {
					const val = Math.ceil((+index+1)/2);
					let i = offsetIdx.findIndex(idx=>val == idx)
					if (i == -1) {
						offsetIdx.push(val)
					}
					offsetsVal += item
				}
			})
		}else {
			if (offsets[1] != '' || offsets[0]!= '') {
				offsets[1] == '' ? offsets[1] = '00' : null;
				offsets[0] == '' ? offsets[0] = '00' : null;
			}
			const first = offsets[0];
			let num = Number(`0x${first}`);
			offsetsVal = first;
			if (first == '') {
				return message.warn('请输入偏移量')
			}else {
				if (first != 'ffff') {
					let i = 1;
					while(i< 16) {
						offsetsVal +=','+offsets[i];
						i++;
					}
				}
			}
		}
		if (baseVal == '' || baseVal.length < 8) {
			return message.warn('请输入段地址')
		}
		if (offsetsVal == '' || isNotFull) {
			return message.warn('请输入完整偏移量')
		}
		this.setState({
			offsets,
			base,
			offsetIdx,
		})
		if (val) {
			const random = parseInt(Math.random() * 1000);
			this.setState({
				switch: val,
				debug: ['','','','','','','','',],
			})
			dispatch({
				type: 'ctrl/debug',
				payload: {
					id,
					userId: currentUser.id,
					monitorId: random,
					base: baseVal,
					offsets: offsetsVal,
				},
			}).then(() => {
				debugWs = this.props.ctrl.debugWs;
				setTimeout(()=> {
					this.setState({
						switch: false,
					})
					if (debugWs) {
						debugWs.close();
					}
				}, this.state.pick[0]*1000)
				if (debugWs) {
					debugWs.onerror = (error) => {
						if (error.data && JSON.parse(error.data).code == 677) {
							message.error('内存诊断正在使用中');
						}else {
							message.error('内存诊断失败');
						}
						clearInterval(play)
						this.setState({
							switch: false,
						})
					}
					debugWs.onmessage = (msg) => {
						try {
							if (JSON.parse(msg.data).code == 677) {
								message.error('内存诊断正在使用中');
								ws.close()
							}else if (JSON.parse(msg.data).data) {
								console.log(JSON.parse(msg.data))
								this.debugMs(JSON.parse(msg.data))						
							}
						} catch (e) {
							console.error(e);
						}
					}				
					debugWs.onopen = () => {
						play = setInterval(() => {
							this.playData();
						}, 100);
					}
					debugWs.onclose = () => {
						clearInterval(play)
					}
				}
			});
		}else {
			this.setState({
				switch: val,
			})
			clearInterval(play)
			debugWs.close();
		}
	}
	debugMs = (val) => {
		const property = val;
		const start = parseInt(property.id);
		const count = parseInt(property.length);
		const end = this.state.debugList.length ? this.state.debugList[this.state.debugList.length - 1].startId : -1;
		if (property.data) {
			const buffer = base64url.toBuffer(property.data);			
			for (let index = 0; index < count; index++) {
				if ((start + index) > end) {
					const debugBuffer = buffer.slice(index * 8, (index + 1) * 8);
					let arr = [];
					debugBuffer.forEach((item) => {
						item = item.toString(16)
						item.length == 1 ? item = `0${item}`: null;
						arr = arr.concat(item);
					});
					const obj = {
						startId: start + index,
						data: arr,
					};
					this.state.debugList.push(obj);
				}
			}
		}
	}
	playData() {
		const {  dispatch } = this.props;
		const {debugList} = this.state
		let debug= null;
		const lastId = debugList.length ? debugList[debugList.length - 1].startId : 0;
		debug = debugList.shift();
		if (debug) {
			let data = ['','','','','','','','',];
			if (!this.state.checked && this.state.offsetIdx.length) {
				this.state.offsetIdx.forEach((item, index)=>{
					data[item-1] = debug.data[index]
				})
				this.setState({
					debug: data,
				})
			}else {
				this.setState({
					debug: debug.data,
				})
			}
		}
	}
	render() {
		const { ctrl, location } = this.props;
		const { base, checked, disabled, offsets, debug } = this.state;
		return (
			<div className="content">
				<div className={styles.content}>
					<List>
						<Item>
							<FormattedMessage id="Segment Address"/>:
							<ul className={classNames(styles.ul, styles.addr)}>
								<li>
									<input maxLength="2"  disabled={this.state.switch} className={styles.input} type="text" value={base[0]} onChange={(e) =>this.inputChange(e, 'base', 0)}/>
								</li>
								<li>:</li>
								<li>
									<input maxLength="2" id="fir" disabled={this.state.switch} className={styles.input} type="text" value={base[1]} onChange={(e) =>this.inputChange(e, 'base', 1)}/>
								</li>
							</ul>
							<ul className={classNames(styles.ul, styles.addr)}>
								<li>
									<input maxLength="2" id="sec" disabled={this.state.switch} className={styles.input} type="text" value={base[2]} onChange={(e) =>this.inputChange(e, 'base', 2)}/>
								</li>
								<li>:</li>
								<li>
									<input maxLength="2" id="thr" disabled={this.state.switch} className={styles.input} type="text" value={base[3]} onChange={(e) =>this.inputChange(e, 'base', 3)}/>
								</li>
							</ul>
						</Item>
						<Picker
							title="实时时长"
							cols={1}
							data={timeList}
							disabled={true}
							value={this.state.pick}
							onOk={v => this.onTimeChange(v)}
						>
							<List.Item arrow="horizontal"><FormattedMessage id="Debug Duration"/></List.Item>
						</Picker>
						<Item>
							<label htmlFor="check" className={styles.check}>
								<Checkbox id="Check" disabled={this.state.switch} onChange={this.onChange} className={styles.pas}><FormattedMessage id="Continuous"/></Checkbox>
							</label>
							<span className={styles.switch}>
								<Switch
									style={{ marginLeft: '2.5px' }}
									checkedChildren="开"
									unCheckedChildren="关"
									onChange={this.search}
									checked={this.state.switch}
									defaultChecked={this.state.switch}
								/>
							</span>
						</Item>
					</List>
					<Row style={{ paddingTop: '20px'}}>
						<Col xs={{ span: 22, offset: 2 }} sm={{ span: 18 }} md={{ span: 16 }}>
							<ul className={styles.ul}>
								<li>
									<input maxLength="2" id="fou" disabled={this.state.switch} className={styles.input} type="text" value={offsets[0]} onChange={(e) =>this.inputChange(e, 'offsets', 0)} onBlur={(e) =>this.inputOffset(e, 'offsets', 0)}/>
								</li>
								<li>:</li>
								<li>
									<input maxLength="2" id="fif" disabled={this.state.switch} className={styles.input} type="text" value={offsets[1]} onChange={(e) =>this.inputChange(e, 'offsets', 1)} onBlur={(e) =>this.inputOffset(e, 'offsets', 1)}/>
								</li>
							</ul>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[2]} onChange={(e) =>this.inputChange(e, 'offsets', 2)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[3]} onChange={(e) =>this.inputChange(e, 'offsets', 3)}/>
								</li>
							</ul>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[4]} onChange={(e) =>this.inputChange(e, 'offsets', 4)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[5]} onChange={(e) =>this.inputChange(e, 'offsets', 5)}/>
								</li>
							</ul>
						</Col>
						<Col xs={{ span: 22, offset: 2 }} sm={{ span: 18 }} md={{ span: 16 }}>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[6]} onChange={(e) =>this.inputChange(e, 'offsets', 6)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[7]} onChange={(e) =>this.inputChange(e, 'offsets', 7)}/>
								</li>
							</ul>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[8]} onChange={(e) =>this.inputChange(e, 'offsets', 8)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[9]} onChange={(e) =>this.inputChange(e, 'offsets', 9)}/>
								</li>
							</ul>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[10]} onChange={(e) =>this.inputChange(e, 'offsets', 10)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[11]} onChange={(e) =>this.inputChange(e, 'offsets', 11)}/>
								</li>
							</ul>
						</Col>
						<Col style={{ marginBottom: 0 }} xs={{ span: 22, offset: 2 }} sm={{ span: 18 }} md={{ span: 16 }}>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[12]} onChange={(e) =>this.inputChange(e, 'offsets', 12)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[13]} onChange={(e) =>this.inputChange(e, 'offsets', 13)}/>
								</li>
							</ul>
							<ul className={styles.ul}>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[14]} onChange={(e) =>this.inputChange(e, 'offsets', 14)}/>
								</li>
								<li>:</li>
								<li>
									<input disabled={disabled || this.state.switch} maxLength="2" className={styles.input} type="text" value={offsets[15]} onChange={(e) =>this.inputChange(e, 'offsets', 15)}/>
								</li>
							</ul>
						</Col>
					</Row>
					<Row style={{ paddingTop: '16px', margin: '16px', border: '1px solid #ccc', borderRadius: '4px'}}>
						<Col style={{ marginBottom: 0 }} xs={{ span: 24, offset: 1 }} sm={{ span: 18 }} md={{ span: 16 }}>
							<ul className={classNames(styles.ul, styles.detail)}>
								<li>{debug[0]}</li>
								<li></li>
								<li>{debug[1]}</li>
							</ul>
							<ul className={styles.ul}>
								<li>{debug[2]}</li>
								<li></li>
								<li>{debug[3]}</li>
							</ul>
						</Col>
						<Col style={{ marginBottom: 0 }} xs={{ span: 24, offset: 1 }} sm={{ span: 18 }} md={{ span: 16 }}>
							<ul className={classNames(styles.ul, styles.detail)}>
								<li>{debug[4]}</li>
								<li></li>
								<li>{debug[5]}</li>
							</ul>
							<ul className={styles.ul}>
								<li>{debug[6]}</li>
								<li></li>
								<li>{debug[7]}</li>
							</ul>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
