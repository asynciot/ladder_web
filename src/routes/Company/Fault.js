import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Input, } from 'antd';
import { Picker, List, Tabs,  Card, Modal, } from 'antd-mobile';
import classNames from 'classnames';
import styles from './Fault.less';
import { getFault, postFinish, postFault, getFollowDevices, getOrderCode } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';

const alert = Modal.alert;
var _val = ""
const { TextArea } = Input;
const CodeTransform = {
	'51':'04',
	'52':'07',
	'66':'08',
	'82':'03',
	'114':'LV',
	'178':'OV',
	'229':'MO',
}
export default class Fault extends Component {
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
		device_name:'',
		language:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getFault()
	}
	getFault = () =>{
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/order/:id').exec(location.pathname);
		const id = match[1];
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
					item.code = "E"+res.data.list[res.data.list.length-1].code.toString(16)
				}else{
					item.code = CodeTransform[res.data.list[res.data.list.length-1].code+50]
				}
				if(item.state == 'treating'){
					this.state.disable = true
				}else if(item.state == 'untreated'){
					this.state.disable1 = true
				}else{
					this.state.disable = true
					this.state.disable1 = true
				}
				const device_id = item.device_id;
				let name = '';
				getFollowDevices({device_id,num:1,page:1}).then(res=>{
					this.setState({
						device_name:res.data.list[0].device_name,
					})
				})
				return item;
			})
			this.setState({
				list,
			});
		});
	}
	upFault = (e) =>{
		const { language } = this.state;
		var file = e.target.files[0]
		if(file.size>1024*1024*5){
			if(language=="zh"){
				alert("请上传不超过5M的图片！");
				return
			}else{
				alert("Please upload no more than 1M pictures.");
				return
			}
		}
		this.state.file1 = new File([file], "before"+new Date().getTime()+".jpg",{type:"image/*"});
		var reader = new FileReader()
		reader.onload = function (e) {
			document.getElementById('beforeShow').src=e.target.result
			document.querySelector("#upload1").src = e.target.result
		}
		reader.readAsDataURL(this.state.file1)
	}
	upFinish = (e) =>{
		const { language } = this.state;
		var file = e.target.files[0]
		if(file.size>1024*1024*5){
			if(language=="zh"){
				alert("请上传不超过5M的图片！");
				return
			}else{
				alert("Please upload no more than 5M pictures.");
				return
			}
		}
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
		const { language } = this.state;
		var formdata = new FormData();
		formdata = new window.FormData();
		formdata.append("file1",this.state.file1);
		formdata.append("file2",this.state.file2);
		if(this.state.maintenance_nexttime !='' & this.state.maintenance_nexttime != null){
			formdata.append("maintenance_nexttime",this.state.maintenance_nexttime);
		}
		if(this.state.inspection_nexttime !='' & this.state.inspection_nexttime != null){
			formdata.append("inspection_nexttime",this.state.inspection_nexttime);
		}
		formdata.append("id",location.state.id);
		formdata.append("remarks",this.state.remark);
		formdata.append("result",'untransfer');
		if(!this.state.file1 || !this.state.file2){
			if(language=="zh"){
				alert("请上传维修前和维修后的图片！");
				return
			}else{
				alert("Please upload pictures before and after maintenance.");
				return
			}
		}
		if(language=="zh"){
			alert('提示', '图片上传中，请等待！', [
				{ text: '确认',},
			]);
		}else{
			alert('提示','Picture upload, please wait!',[
				{ text: 'Ok',},
			]);
		}
		fetch('http://server.asynciot.com/device/Dispatch/finish', {
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
			},
			credentials: 'include',
			body: formdata
		}).then((res)=> { return res.json()}).then((json)=>{
			setTimeout(() =>{
				if(json.code == 0){
					if(language=="zh"){
						alert('提示','上传成功',[
							{ text: '确认',},
						]);
					}else{
						alert('提示','Success',[
							{ text: 'Ok',},
						]);
					}
					this.props.history.push(`/company/work-order`);
				}else{
					if(language=="zh"){
						alert('提示', '上传失败', [
							{ text: '确认',},
						]);
					}else{
						alert('提示','Error',[
							{ text: 'Ok',},
						]);
					}
				}
			}, 500);
		})
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
	postFault = () =>{
		const { history } = this.props;
		const { language } = this.state;
		const order_id = this.props.match.params.id
		postFault({order_id}).then((res) => {
			if(res.code == 0){
				if(language=="zh"){
					alert("接单成功！")
				}else{
					alert("Success")
				}
				history.push({
					pathname: `/company/work-order`,
				});
			}else{
				if(language=="zh"){
					alert("接单失败！")
				}else{
					alert("Error")
				}
			}
		})
	}
	info = () => {
		const id = this.state.list[0].code
		this.props.history.push({
			pathname: `/company/order/code/${id}`,
		});
	}
	onChange = (e) =>{
		let val = e.target.value
		this.setState({
			remark:val,
		});
	}
	render() {
		const { list,language } = this.state;
		return (
			<div className="content tab-hide">
				<div className={styles.ct}>
					<List>
						{list.map((item, index) => (
							<List.Item className={styles.item} key={index} >
								<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
									<tbody className={styles.tbody}>
										<tr>
											<a className={styles.text}><FormattedMessage id="fault"/> ：</a>
											<td className={styles.left} style={{ width: 'auto',color:'red'}} onClick={() => this.info(item)}><FormattedMessage id={item.code}/></td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
											<td className="tl">{this.state.device_name}</td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="fault"/><FormattedMessage id="type"/> ：</a>
											<td className="tl" style={{ width: '100px' }}><FormattedMessage id={'O'+item.type}/></td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="State"/> ：</a>
											<td className={styles.left} style={{ width: '100px' }}><FormattedMessage id={item.state}/></td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="Device Type"/> ：</a>
											<td className="tl"><FormattedMessage id={item.device_type ||''}/></td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="report time"/> ：</a>
											<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="fault duration"/> ：</a>
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
													placeholder={language=="zh"?"故障详情":"fault details"}
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
							<input accept="image/*" className={styles.input} type="file" id='upload1' multiple onChange={this.upFault} />
						</Col>
						<Col span={12} >
							<img className={styles.icon} id="afterShow" src={require('../../assets/icon/系统故障.png')} />
							<a className={styles.icon1}><FormattedMessage id="photo after treating"/></a>
							<input accept="image/*" className={styles.input} type="file" id='upload2' onChange={this.upFinish} multiple/>
						</Col>
						<Col xs={{ span: 12 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
							<Button disabled={this.state.disable} onClick={() => this.postFault()} type="primary" style={{ width: '100%' }} ><FormattedMessage id="receive"/></Button>
						</Col>
						<Col xs={{ span: 12 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
							<Button disabled={this.state.disable1} onClick={(event) => {this.uploadPicture(event)}} type="primary" style={{ width: '100%' }} ><FormattedMessage id="Complete"/></Button>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
