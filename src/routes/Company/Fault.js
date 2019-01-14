import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Input,  } from 'antd';
import { Picker, List, Tabs, Modal, Card, } from 'antd-mobile';
import classNames from 'classnames';
import styles from './Fault.less';
import {getFault, postFinish, postFault, getDispatch } from '../../services/api';

var _val = ""
var dispatch_id = 0
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
				item.code = res.data.list[res.data.list.length-1].code.toString(16)
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
										<td className="tr">故障代码 ：</td>
										<td className="tl" style={{ width: '100px' }}>E{item.code}</td>
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
