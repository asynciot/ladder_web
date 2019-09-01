import React, { Component } from 'react';
import { connect } from 'dva';
import base64url from 'base64url';
import { Button, message, Form, Col, Row, } from 'antd';
import { List, InputItem, DatePicker, Modal, Tabs, LocaleProvider, Picker} from 'antd-mobile';
import styles from './EditDevice.less';
import { getLadder, getFollowDevices, getFloorData } from '../../services/api';
import pathToRegexp from 'path-to-regexp';
import { injectIntl, FormattedMessage, } from 'react-intl';

const state ={
	from: '',
	to: '',
	view: 0,
	pick:'',
	'online':'在线',
	'offline':'offline',
	'longoffline':'长期离线',
}
const tabs = [
	// { title:'事件列表', key:'t1'},
	{ title:'电梯信息'},
	// { title:'电梯故障', key:'t3'},
	{ title:'呼梯'},
]
@connect(({ submit, user, loading }) => ({
	submit,
	submitting: loading.effects['user/updateUser'],
}))
export default class extends Component {
	state = {
		ladder_name: '',
		list:[],
		la:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getInfo();
	}
	componentDidMount() {
		this.forceUpdate()
	}
	getFloor(val){
		getFloorData({device_id:val,}).then((res) => {
			if(res.code == 0){
				let buffer = [];
				let arr = [];
				buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
				buffer.forEach((item) => {
					arr.push(String.fromCharCode(item))
				})
				let high = arr.length/3
				let floor = [{
					label:'',
					value:'',
				}]
	
				for(let i=0; i<high;i++){
					if(i==0){
						floor[0].label=arr[i*3]+arr[i*3+1]+arr[i*3+2]
						floor[0].value=i+1
					}else{
						let floor1 = {
							label:'',
							value:'',
						}
						floor1.label=arr[i*3]+arr[i*3+1]+arr[i*3+2]
						floor1.value=i+1
						floor.push(floor1)
					}
				}
				this.setState({
					floor,
				})
			}
		})
		this.forceUpdate()
	}
	onChange = (value) => {
		this.setState({
			from: value,
		});
	}
	onChangel = (value) => {
		this.setState({
			to: value,
		});
	}
	submit = () => {
		const from = this.state.from[0]
		const to = this.state.to[0]
		postCall({IMEI: this.state.list.ctrl, from, to}).then((res) => {
		});
	}
	goDevice = (val,item) => {
		if (val == 0) {
			this.props.history.push({
				pathname:`/ctrl/${item}/realtime`,
			});
		} else {
			getFollowDevices({ num: 1, page:1, IMEI:item}).then((res) => {
				const id = res.data.list[0].device_id
				const type = res.data.list[0].device_model
				this.props.history.push({
					pathname:`/door/${id}/realtime`,
					state: { type }
				});
			});
		}
	}
	goLadder = () => {
		const id = this.state.list.id
		this.props.history.push({
			pathname:`/ladder/${id}`,
		});
	}
	getInfo = () => {
		const id = this.props.match.params.id
		getLadder({id}).then(res=> {
			if (res.code == 0) {
				var list = res.data.list[0]
				this.setState({
					list,
				})
			}
			this.getFloor(this.state.list.ctrl_id)
		});
	}
	render() {
		const list = this.state.list
		const { submitting } = this.props;
		var la
		if(window.localStorage.getItem("language")=="zh"){
			la = undefined;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className="content">
					<Tabs
					  tabs={tabs}
					  initialPage={this.state.view}
					  onChange={this.tabChange}
					  tabBarActiveTextColor="#1E90FF"
					  tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
					>
						<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'auto',backgroundColor:'#fff'}}>
							<Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
								<InputItem
									value={list.name}
									disabled
								>
									<FormattedMessage id="Device Name"/>
								</InputItem>
								<InputItem
									value={list.install_addr}
									disabled
								>
									<FormattedMessage id="Install Address"/>
								</InputItem>
								{
								list.ctrl?
									<div onClick={()=>this.goDevice(0,list.ctrl_id)}>
										<InputItem
											value={list.ctrl}
											disabled
											style={{color:'red'}}
										>
											<FormattedMessage id="Ctrl"/>
										</InputItem>
									</div>
									:
									<div></div>
								}
								{list.door1?
									<div onClick={()=>this.goDevice(1,list.door1)}>
										<InputItem
										value={list.door1}
										disabled
										style={{color:'red'}}
									>
										<FormattedMessage id="Door"/>
										</InputItem>
									</div>
									:
									<div></div>
								}
								{list.door2 ?
									<div onClick={()=>this.goDevice(1,list.door2)}>
										<InputItem
										value={list.door2}
										disabled
										style={{color:'red'}}
									>
										<FormattedMessage id="Door"/>
										</InputItem>
									</div>
									:
									<div></div>				
								}
								{/* <div onClick={()=>this.goLadder()}>
									<InputItem
										disabled="true"
										style={{color:'red'}}
									>
										电梯
									</InputItem>
								</div> */}
								{
									(this.state.la=="zh")?
									<InputItem
										value={state[list.state]}
										disabled
									>
										<FormattedMessage id="State"/>
									</InputItem>
									:
									<InputItem
										value={list.state}
										disabled
									>
										<FormattedMessage id="State"/>
									</InputItem>
								}
							</Form>
						</div>
						<div style={{ backgroundColor: '#fff' }}>
							<List>
								<Picker
									disabled={this.state.change}
									cols={1}
									data={this.state.floor}
									value={this.state.from}
									onOk={v => this.onChange(v)}
								>
									<List.Item arrow="horizontal"><FormattedMessage id="Current Floor"/></List.Item>
								</Picker>
								<Picker
									disabled={this.state.change}
									cols={1}
									data={this.state.floor}
									value={this.state.to}
									onOk={v => this.onChangel(v)}
								>
									<List.Item arrow="horizontal"><FormattedMessage id="Destination Floor"/></List.Item>
								</Picker>
								<List.Item>
									<Button disabled={!this.state.from} size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
										<FormattedMessage id="OK"/>
									</Button>
								</List.Item>
							</List>
						</div>
					</Tabs>
				</div>
			</LocaleProvider>
		);
	}
}
