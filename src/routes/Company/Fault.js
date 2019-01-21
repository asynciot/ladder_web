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
import c01 from '../../assets/fault/c01.png';
import c02 from '../../assets/fault/c02.png';
import c03 from '../../assets/fault/c03.png';
import c04 from '../../assets/fault/c04.png';
import c05 from '../../assets/fault/c05.png';
import c06 from '../../assets/fault/c06.png';
import c07 from '../../assets/fault/c07.png';
import c08 from '../../assets/fault/c08.png';
import c09 from '../../assets/fault/c09.png';
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
import c54 from '../../assets/fault/c54.png';
import c58 from '../../assets/fault/c58.png';
import c66 from '../../assets/fault/c66.png';
import c82 from '../../assets/fault/c82.png';

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
	'0': '暂无',
	'01': '过流',
	'02': '母线过压',
	'03': '母线欠压',
	'04': '输入缺相',
	'05': '输出缺相',
	'06': '输出过力矩',
	'07': '编码器故障',
	'08': '模块过热',
	'09': '运行接触器故障',
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
	'54': '电机过载',
	'58': '输出过流',
	'66': '输入电压过低',
	'82': '输入电压过高',
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
	}
	componentWillMount() {
		this.getFault()
	}
	getFault = () =>{
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/order/:id').exec(location.pathname);
		let id = match[1];
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
				}
				if(item.state == 'untreated'){
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
		const match = pathToRegexp('/order/:id').exec(location.pathname);
		const order_id = match[1];
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
		const match = pathToRegexp('/order/:id').exec(location.pathname);
		const order_id = match[1];
		postFault({order_id}).then((res) => {
			if(res.code == 0){
				alert("接单成功！")
			}else{
				alert("接单失败！")
			}
		})
	}
	info = (item) => {
		let a = 'c'+item.code
		Modal.info({
			title: '故障详情',
			content: (
				<div>
					<img className={styles.img} src={a} />
				</div>
			),
			onOk() {},
		});
	}
	render() {
		const { list, } = this.state;
		return (
			<div className="content tab-hide">
				<List>
					{list.map((item, index) => (
						<List.Item className={styles.item} key={index} >
							<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
								<tbody>
									<tr>
										<td className="tr">故障名称 ：</td>
										<td className="tl" style={{ width: '200px' }}>{faultCode[item.code]}</td>
										<td className="tl" onClick={() => this.info(item)}>详情</td>
									</tr>
									<tr>
										<td className="tr">设备编号 ：</td>
										<td className="tl">{item.device_id}</td>
									</tr>
									<tr>
										<td className="tr">故障类型 ：</td>
										<td className="tl" style={{ width: '100px' }}>{names[item.type]}</td>
									</tr>
									<tr>
										<td className="tr">设备类型 ：</td>
										<td className="tl">{typeName[item.device_type] ||''}</td>
									</tr>
									<tr>
										<td className="tr">故障时间 ：</td>
										<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
									</tr>
									<tr>
										<td className="tr">故障时长 ：</td>
										<td className="tl">{item.hour}小时{item.minute}分{item.second}秒</td>
									</tr>
									<tr>
										<td className="tr">下次维保 ：</td>
										<td className="tl"><DatePicker title="下次维保时间" disabled={this.state.maintenance} size="large" value={this.state.maintenance_nexttime} onChange={this.onStart} /></td>
									</tr>
									<tr>
										<td className="tr">下次年检 ：</td>
										<td className="tl"><DatePicker title="下次年检时间" disabled={this.state.inspection} size="large" value={this.state.inspection_nexttime} onChange={this.onEnd} /></td>
									</tr>
									<tr>
										<Col span="6">
											<td className="tr">维修报告 ：</td>
										</Col>
										<Col span="18">
											<div className={styles.ls}><TextArea placeholder="50字以内" maxlength="50" autosize autosize={{ minRows: 2, maxRows: 8 }}/></div>
										</Col>	
									</tr>
								</tbody>
							</table>
						</List.Item>
					))}
				</List>
				<Row gutter={40}>
					<Col span={12} >						
						<img className={styles.icon} id="beforeShow" src={require('../../assets/icon/故障报修1.png')} />
						<a className={styles.icon1}>维修前图片上传</a>
						<input accept="image/*" className={styles.input} type="file" id='upload1' onChange={this.upFault}/>
					</Col>
					<Col span={12} >						
						<img className={styles.icon} id="afterShow" src={require('../../assets/icon/系统故障.png')} />
						<a className={styles.icon1}>维修后图片上传</a>
						<input accept="image/*" className={styles.input} type="file" id='upload2' onChange={this.upFinish}/>
					</Col>
					<Col xs={{ span: 12 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
						<Button disabled={this.state.disable} onClick={() => this.postFault()} type="primary" style={{ width: '100%' }} >接单</Button>
					</Col>
					<Col xs={{ span: 12 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
						<Button disabled={this.state.disable1} onClick={(event) => {this.uploadPicture(event)}} type="primary" style={{ width: '100%' }} >维修完成</Button>
					</Col>
				</Row>
			</div>
		);
	}
}
