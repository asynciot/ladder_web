import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Input, Modal, } from 'antd';
import { Picker, List, Tabs,  Card, } from 'antd-mobile';
import classNames from 'classnames';
import styles from './Fault.less';
import {getFault, postFinish, postFault, getDispatch } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import c1 from '../../assets/fault/c1.png';
import c2 from '../../assets/fault/c2.png';
import c3 from '../../assets/fault/c3.png';
import c4 from '../../assets/fault/c4.png';
import c5 from '../../assets/fault/c5.png';
import c6 from '../../assets/fault/c6.png';
import c7 from '../../assets/fault/c7.png';
import c8 from '../../assets/fault/c8.png';
import c9 from '../../assets/fault/c9.png';
import c10 from '../../assets/fault/c10.png';
import c11 from '../../assets/fault/c11.png';
import c12 from '../../assets/fault/c12.png';
import c13 from '../../assets/fault/c13.png';
import c14 from '../../assets/fault/c14.png';
import c15 from '../../assets/fault/c15.png';
import c16 from '../../assets/fault/c16.png';
import c17 from '../../assets/fault/c17.png';
import c18 from '../../assets/fault/c18.png';
import c19 from '../../assets/fault/c19.png';
import c20 from '../../assets/fault/c20.png';
import c21 from '../../assets/fault/c21.png';
import c22 from '../../assets/fault/c22.png';
import c23 from '../../assets/fault/c23.png';
import c24 from '../../assets/fault/c24.png';
import c25 from '../../assets/fault/c25.png';
import c26 from '../../assets/fault/c26.png';
import c27 from '../../assets/fault/c27.png';
import c28 from '../../assets/fault/c28.png';
import c29 from '../../assets/fault/c29.png';
// import c30 from '../../assets/fault/c30.png';
import c31 from '../../assets/fault/c31.png';
import c32 from '../../assets/fault/c32.png';
import c33 from '../../assets/fault/c33.png';
import c34 from '../../assets/fault/c34.png';
import c35 from '../../assets/fault/c35.png';
import c36 from '../../assets/fault/c36.png';
import c37 from '../../assets/fault/c37.png';
import c38 from '../../assets/fault/c38.png';
// import c39 from '../../assets/fault/c39.png';
import c40 from '../../assets/fault/c40.png';
import c41 from '../../assets/fault/c41.png';
import c51 from '../../assets/fault/c51.png';
import c52 from '../../assets/fault/c52.png';
import c66 from '../../assets/fault/c66.png';
import c82 from '../../assets/fault/c82.png';
import c114 from '../../assets/fault/c114.png';
import c178 from '../../assets/fault/c178.png';
var _val = ""
var dispatch_id = 0
const { TextArea } = Input;
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
	'door':'控制器',
	'ctrl':'控制柜',
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
export default class DoorHistory extends Component {
	state = {
		list:[],
		nowTime: new Date().getTime(),
		file1:null,
		file2:null,
		disable1:false,
		disable:false,
		last:'',
		val:'',
		maintenance:true,
		inspection:true,
		remark:'',
	}
	componentWillMount() {
		this.getFault()
	}
	getFault = () =>{
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/order/:id').exec(location.pathname);
		let id = match[2];
		getFault({ id, page:1, num:1, }).then((res) => {
			const list = res.data.list.map((item) => {
				if(item.type == "2"){
					this.state.maintenance = false
				}
				if(item.type == "3"){
					this.state.inspection = false
				}
				const time = this.state.nowTime - item.createTime
				item.hour = parseInt((time)/(1000*3600))
				item.minute = parseInt(time%(1000*3600)/(1000*60))
				item.second = parseInt(time%(1000*3600)%(1000*60)/1000)
				if(item.device_type=='ctrl'){
					item.code = res.data.list[res.data.list.length-1].code.toString(16)
				}else{
					item.code = (res.data.list[res.data.list.length-1].code+50)
				}								
				if(item.state == 'treating'){
					this.state.disable = true
				}else if(item.state == 'untreated'){
					this.state.disable1 = true
				}else{
					this.state.disable = true
					this.state.disable1 = true
				}
				
				return item;
			})
			this.setState({
				list,
			});
		});
	}
	upFault = (e) =>{
		var file = e.target.files[0]		
		this.state.file1 = new File([file], "before"+new Date().getTime()+".jpg",{type:"image/*"});
		var reader = new FileReader()
		reader.onload = function (e) {
			document.getElementById('beforeShow').src=e.target.result
			document.querySelector("#upload1").src = e.target.result
		}
		reader.readAsDataURL(this.state.file1)
	}
	upFinish = (e) =>{
		var file = e.target.files[0]
		this.state.file2 = new File([file], "after"+new Date().getTime()+".jpg",{type:"image/*"});
		var reader = new FileReader()
		reader.onload = function (e) {
			document.getElementById('afterShow').src=e.target.result
			document.querySelector("#upload2").src = e.target.result
		}
		reader.readAsDataURL(this.state.file2)
	}
	uploadPicture = (e) =>{
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/order/:id').exec(location.pathname);
		let id = match[2];
		var formdata = new FormData()
		formdata = new window.FormData()
		formdata.append("file1",this.state.file1)
		formdata.append("file2",this.state.file2)
		if(this.state.maintenance_nexttime !='' & this.state.maintenance_nexttime != null){
			formdata.append("maintenance_nexttime",this.state.maintenance_nexttime)
		}
		if(this.state.inspection_nexttime !='' & this.state.inspection_nexttime != null){
			formdata.append("inspection_nexttime",this.state.inspection_nexttime)
		}
		formdata.append("id",this.props.location.state.id)
		formdata.append("remarks",this.state.remark)
		formdata.append("result",'untransfer')
		if(!this.state.file1 || !this.state.file2){
			alert("请上传维修前和维修后的图片！")
		}else {
			fetch('http://server.asynciot.com/device/Dispatch/finish', {
				method: 'POST',
				headers: {
					Accept: 'application/json, text/plain, */*',
				},
				credentials: 'include',	
				body: formdata
			}).then(res=> { return res.json()}).then(json=>{
				if(json.code == 0){
					alert("上传成功")
					this.props.history.push(`/company/work-order`);
				}else{
					alert("上传失败")
				}
			})
		}
	}
	onStart = async(val) => {
		await this.setState({
			maintenance_nexttime: val,
		});
	}
	onEnd = async(val) => {
		await this.setState({
			inspection_nexttime: val,
		});
	}
	postFault = (e) =>{
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/order/:id').exec(location.pathname);
		let id = match[2];
		postFault({order_id}).then((res) => {
			if(res.code == 0){
				alert("接单成功！")
			}else{
				alert("接单失败！")
			}
		})
	}
	info = (item) => {
		let imgList= [
			c1,
			c2,
			c3,
			c4,
			c5,
			c6,
			c7,
			c8,
			c9,
			c10,
			c11,
			c12,
			c13,
			c14,
			c15,
			c16,
			c17,
			c18,
			c19,
			c20,
			c21,
			c22,
			c23,
			c24,
			c25,
			c26,
			c27,
			c28,
			c29,
			c31,
			c31,
			c32,
			c33,
			c34,
			c35,
			c36,
			c37,
			c38,
			c38,
			c40,
			c41,
			c51,
			c52,
			c66,
			c82,
			c114,
			c178,
		]
		if(item.device_type == 'ctrl'){
			imgList=imgList[item.code-1]
		}else{
			if(item.code=='51'){
				imgList=imgList[41]
			}else if(item.code=='52'){
				imgList=imgList[42]
			}else if(item.code=='66'){
				imgList=imgList[43]
			}else if(item.code=='82'){
				imgList=imgList[44]
			}else if(item.code=='114'){
				imgList=imgList[45]
			}else if(item.code=='178'){
				imgList=imgList[46]
			}
		}
		Modal.info({
			title: '故障详情',
			content: (
				<div>
					<img className={styles.img} src={imgList} />
				</div>
			),
			onOk() {},
		});
	}
	onChange = (e) =>{
		let val = e.target.value
		this.setState({
			remark:val,
		});
	}
	render() {
		const { list, } = this.state;
		return (
			<div className="content tab-hide">
				<div className={styles.ct}>
					<List>
						{list.map((item, index) => (
							<List.Item className={styles.item} key={index} >
								<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
									<tbody className={styles.tbody}>
										<tr>
											<td className="tr"><FormattedMessage id="fault"/> ：</td>
											<td className="tl" style={{ width: 'auto' }}><FormattedMessage id={'E'+item.code}/></td>
											<td className="tl" onClick={() => this.info(item)}><FormattedMessage id="Details"/></td>
										</tr>
										<tr>
											<td className="tr"><FormattedMessage id="device ID"/> ：</td>
											<td className="tl">{item.device_id}</td>
										</tr>
										<tr>
											<td className="tr"><FormattedMessage id="fault"/><FormattedMessage id="type"/> ：</td>
											<td className="tl" style={{ width: '100px' }}><FormattedMessage id={'O'+item.type}/></td>
										</tr>
										<tr>
											<td className="tr"><FormattedMessage id="device type"/> ：</td>
											<td className="tl"><FormattedMessage id={item.device_type ||''}/></td>
										</tr>
										<tr>
											<td className="tr"><FormattedMessage id="report time"/> ：</td>
											<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
										</tr>
										<tr>
											<td className="tr"><FormattedMessage id="fault duration"/> ：</td>
											<td className="tl">{item.hour}<FormattedMessage id="H"/>{item.minute}<FormattedMessage id="M"/>{item.second}<FormattedMessage id="S"/></td>
										</tr>
										{/*
											<tr>
												<td className="tr"><FormattedMessage id="next maintenance"/> ：</td>
												<td className="tl"><DatePicker title="下次维保时间" disabled={this.state.maintenance} size="large" value={this.state.maintenance_nexttime} onChange={this.onStart} /></td>
											</tr>
											<tr>
												<td className="tr"><FormattedMessage id="next yearly check"/> ：</td>
												<td className="tl"><DatePicker title="下次年检时间" disabled={this.state.inspection} size="large" value={this.state.inspection_nexttime} onChange={this.onEnd} /></td>
											</tr>
										*/}
										<tr>
											<div className={styles.ls}>
												<TextArea
													// placeholder="50字以内" 
													maxlength={50}
													// width={100px}
													value={this.state.remark}
													onChange={this.onChange}
													autosize={{ minRows: 2, maxRows: 8 }}/>
											</div>
										</tr>
									</tbody>
								</table>
							</List.Item>
						))}
					</List>
					<Row gutter={40}>
						<Col span={12} >
							<img className={styles.icon} id="beforeShow" src={require('../../assets/icon/故障报修1.png')} />
							<a className={styles.icon1}><FormattedMessage id="photo before treating"/></a>
							<input accept="image/*" className={styles.input} type="file" id='upload1' onChange={this.upFault}/>
						</Col>
						<Col span={12} >
							<img className={styles.icon} id="afterShow" src={require('../../assets/icon/系统故障.png')} />
							<a className={styles.icon1}><FormattedMessage id="photo after treating"/></a>
							<input accept="image/*" className={styles.input} type="file" id='upload2' onChange={this.upFinish}/>
						</Col>
						<Col xs={{ span: 12 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
							<Button disabled={this.state.disable} onClick={() => this.postFault()} type="primary" style={{ width: '100%' }} ><FormattedMessage id="receive"/></Button>
						</Col>
						<Col xs={{ span: 12 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
							<Button disabled={this.state.disable1} onClick={(event) => {this.uploadPicture(event)}} type="primary" style={{ width: '100%' }} ><FormattedMessage id="complete"/></Button>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
