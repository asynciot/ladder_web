import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Row, Col, Button, Spin, Icon, DatePicker, Switch, } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import styles from './CtrlRealtime.less';
import echarts from 'echarts';
import { getEvent, postMonitor, getFollowDevices, getFault, getFloorData, getCtrlRuntime, getCommand } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import mfb from './mfb.css';
import { IOMenu, Board} from '../../ctrlMenu.js';
import CtrlMenu from './CtrlMenu.js'; 

const Watch = {
	label: 'Watch',
	view: 0,
};
const Line={
	label: 'Line',
	view: 1,
};
var counts=0;
var ct=0;
var chartInte =null;
var showInte = null;
var DataInte = null;
var timing = null;
var charts = true;
var websock = '';
const alert = Modal.alert;

const direction = {
	'01': 'arrow-up',
	'10': 'arrow-down',
	'00': '',
	'11': '',
}
const parseStatus= (event) => {
	let statusName = 'None';
	if ((event&(0x01)) == 1) {
		statusName= 'Automatic';
	}
	if ((event&(0x02))>>1 == 1) {
		statusName= 'Overhaul';
	}
	if ((event&(0x04))>>2 == 1) {
		statusName= 'Driver';
	}
	if ((event&(0x08))>>3 == 1) {
		statusName= 'Firefighting';
	}
	if ((event&(0x10))>>4 == 1) {
		statusName= 'Lock ladder';
	}
	if ((event&(0x20))>>5 == 1) {
		statusName= 'Fault';
	}
	if ((event&(0x40))>>6 == 1) {
		statusName= 'Overload';
	}
	if ((event&(0x80))>>7 == 1) {
		statusName= 'Full load';
	}
	return statusName
}
const parseModel = (event) => {
	let statusName = 'None';
	if ((event&(0x01)) == 1) {
		statusName = 'Single Ladder';
	}
	if ((event&(0x02))>>1 == 1) {
		statusName = 'Parallel Connection';
	}
	if ((event&(0x04))>>2 == 1) {
		statusName = 'Group Control';
	}
	return statusName
}
const data = [{
	time: 0,
	value: 0,
}];

@connect(({ ctrl,user }) => ({
	ctrl,
	currentUser: user.currentUser,
}))

export default class CtrlRealtime extends Component {
	state = {
		dateSelected:false,
		closedate:false,
		outButton:'',
		outtarget:'',
		clickOpt : 'click',
		toggleMethod : 'data-mfb-toggle',
		menuState : 'data-mfb-state',
		isOpen : 'open',
		isClosed : 'closed',
		mainButtonClass : process.env.NODE_ENV === 'production'?'mfb_component__button__main___3WV7w':'mfb__mfb_component__button__main___3WV7w',
		elemsToClick:'',
		outelemsToClick:'',
		mainButton:'',
		target:'',
		currentState:'',
		pclock:true,
		clock:true,
		active:true,
		charts:true,
		floor:[],
		buffer:[],
		leftAnimation: {
			left: '0%',
			duration: 100,
		},
		rightAnimation: {
			right: '0%',
			duration: 100,
		},
		switch:false,
		switch1:false,
		pick: '',
		modal: false,
		src: '',
		event:{
			run:[],
			lock:[],
			close:[],
			model:[],
			status:[],
			upCall:[],
			downCall:[],
			openBtn:[],
			closeBtn:[],
			floor:[],
			nums:[1,2,3,4,5,6,7,8,9,10],
		},
		show:{
			run:'',
			lock:'',
			close:'',
			model:'',
			status:'',
			upCall:'',
			downCall:'',
			openBtn:'',
			closeBtn:'',
			floor:'',
			nowtime:'',
			updateTime:'',
			speed:'',
		},
		page:{
			run:'',
			lock:'',
			close:'',
			model:'',
			status:'',
			upCall:'',
			downCall:'',
			openBtn:'',
			closeBtn:'',
			floor:'',
			nowtime:'',
			updateTime:'',
			speed:'',
		},
		arr:{
			run:[],
			lock:[],
			close:[],
			model:[],
			status:[],
			upCall:[],
			downCall:[],
			openBtn:[],
			closeBtn:[],
			floor:[],
			nowtime:[],
			updateTime:[],
			speed:[],
		},
		doorWidth: 4096,
		run:[],
		lock:[],
		close:[],
		markFloor:'',
		change:false,
		markList:[],
		isIo:true,
		isIo1:true,
		isCar:true,
		IoInfo1:'Io Input Watch:',
		IoInfo:'Car Input Watch:',
		IMEI:'',
		code:'',
		install_addr:'',
		device_name:'',
		startTime:'',
		endTime:'',
		command:false,
		loading:false,
		language:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getBaseData()
		this.getfloor()
		document.addEventListener('visibilitychange', () => {
			if(document.title == "控制柜"){
				var isHidden = document.hidden;
				if (isHidden) {
					this.state.active =false
					if(websock){
						websock.close()
						websock=null
					}
				} else {
					this.state.active =true
					if(websock){
						websock.close()
						websock=null
					}
					this.initWebsocket()
				}
			}
		})
	}
	componentWillUnmount() {
		this.state.charts = false;
		this.state.pclock = false;
		clearInterval(chartInte)
		clearInterval(showInte)
		clearInterval(DataInte)
		clearInterval(timing)
		if(websock){
			websock.close()
			websock=null
		}
	}

	myattachEvt=()=>{
		this.state.outButton=document.querySelector('#mymask');
		if(this.state.outButton!=null)
		{
			this.state.outButton.addEventListener("click",this.handleMask,false);
		}
	}
	handleMask=(evt)=>{
		this.state.outtarget=evt.target;
		if(this.state.outtarget.id!="mybutton"&&this.state.target!=""){
			this.state.currentState = this.state.target.getAttribute( this.state.menuState ) === this.state.isClosed ;
			this.state.target.setAttribute(this.state.menuState, this.state.currentState);
			this.setState({
				dateSelected:this.state.closedate
			})
		}

	}
	attachEvt=( elems, evt )=>{
		for( var i = 0, len = elems.length; i < len; i++ ){
			this.state.mainButton = elems[i].querySelector('.' + this.state.mainButtonClass);
			if(this.state.mainButton!=null){
				this.state.mainButton.addEventListener( evt , this.toggleButton, false);
			}
		}
	}
	getElemsByToggleMethod=( selector )=>{
		return document.querySelectorAll('[' + this.state.toggleMethod + '="' + selector + '"]');
	}
	toggleButton=( evt )=>{
		this.state.target = evt.target;
		while ( this.state.target && !this.state.target.getAttribute( this.state.toggleMethod ) ){
			this.state.target = this.state.target.parentNode;
			if(!this.state.target) { return; }
		}
		this.state.currentState = this.state.target.getAttribute( this.state.menuState ) === this.state.isOpen ? this.state.isClosed : this.state.isOpen;
		this.state.target.setAttribute(this.state.menuState, this.state.currentState);
			this.setState({
			dateSelected:!this.state.dateSelected
		})
	}
	initWebsocket = () =>{ //初始化weosocket
		const { currentUser } = this.props;
		const { pick } = this.state
		const device_id = this.props.match.params.id
		const userId = currentUser.id
		const wsurl = 'ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+device_id+'&userId='+userId;
		websock = new WebSocket(wsurl);
		websock.onopen = this.websocketonopen;
		websock.onerror = this.websocketonerror;
		websock.onmessage= (e) =>{
			if(e.data=="closed"){
				this.state.switch = false
				this.state.command = false
				websock.close()
				clearInterval(showInte)
				clearInterval(timing)
				this.forceUpdate()
			}else{
				var redata = JSON.parse(e.data)
				this.pushData(redata)
				if(counts==0){
					DataInte = setInterval( () => {
						if(this.state.clock==true){
							this.getData()
						}
					},500)
					counts=counts+1;
				}
			}
		}
		websock.onclose = this.websocketclosed;
	}
	websocketonopen() {
		console.log("WebSocket连接成功");
	}
	websocketonerror(e) {
		console.log("WebSocket连接发生错误");
	}
	websocketclosed(){
		console.log("WebSocket已关闭")
	}
	onChange = (val) => {
		this.clears()
		counts = 0
		ct = 0
		var loading = true;
		this.setState({
			loading,
		})
		setTimeout(()=>{
			loading = false;
			this.setState({
				loading,
			})
		},1000)
		if(this.state.state =="online"){
			this.state.switch = !this.state.switch;
			this.forceUpdate();
			if(this.state.switch == true){
				const device_id = this.props.match.params.id
				if(websock){
					websock.close()
					websock=null
				}
				this.initWebsocket()
				const op = 'open';
				let IMEI;
				if(this.state.list.cellular==1){
					IMEI = this.state.IMEI.substr(0,12);
				}else{
					IMEI = this.state.IMEI
				}
				const interval = 500;
				const threshold = 4;
				const duration = 300;
				const device_type = '240';
				const type = '0';
				const segment = '00,00,00,00';
				const address = '00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00';
				if(this.state.endTime==0){
					postMonitor({ op, IMEI, interval, threshold, duration, device_type, type, segment, address}).then((res) => {
					});
					setTimeout(()=>{
						getCommand({num:1,page:1,IMEI}).then((res)=>{
							if(res.code==0){
								let controll = 0;
								timing = setInterval( () => {
									const date = new Date().getTime()
									const endTime = Math.round(((res.list[0].submit+duration*1000)-date)/1000)
									if(endTime<0){
										this.setState({
											endTime:0,
											switch:false,
										})
										clearInterval(timing)
										if(this.state.language =="zh"&&controll==0){
											controll = 1;
											alert("监控结束,请稍后再监控。");
										}else{
											alert("End of monitoring.");
										}
									}else{
										this.setState({
											endTime,
										})
									}
									this.forceUpdate()
								},1000)
							}
						})
					}, 1000);
				}
			}else{
				websock.close()
			}
		}else{
			if(this.state.language=="zh"){
				alert("该设备已离线");
			}else{
				alert("The device is offline.");
			}
		}
	}
	getBaseData = () => {
		const { show } = this.state
		const device_id = this.props.match.params.id
		getCtrlRuntime({device_id}).then((res) => {
			let buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
			show.upCall   = buffer[6]&0x01
			show.downCall = (buffer[6]&0x02)>>1
			show.run      = (buffer[6]&0x04)>>2					//获取运行信号
			show.lock     = (buffer[6]&0x08)>>3					//获取门锁信号
			show.open     = (buffer[6]&0x10)>>4					//获取关门信号
			show.close    = (buffer[6]&0x20)>>5					//获取关门信号
			show.openBtn  = (buffer[6]&0x40)>>6					//获取开门按钮信号
			show.closeBtn = (buffer[6]&0x80)>>7					//获取关门按钮信号
			show.model    = buffer[7]&0xff						//获取电梯模式
			show.status   = buffer[8]&0xff						//获取电梯状态
			show.floor    = buffer[9]&0xff           			//获取电梯当前楼层
		});
		this.setState({
			show,
		})
		getFollowDevices({device_id}).then((res)=>{
			let command = false
			if(res.code ==0){
				if(res.data.list[0].commond=="ok"||res.data.list[0].commond=="monitor"){
					command = false
				}else{
					command = true
				}
				let time = res.data.list[0].device_t_update;
				time = time.replace(/NOVT/,"CST");
				show.updateTime = moment(time).subtract('hours',13).format('YYYY-MM-DD HH:mm:ss');
				this.setState({
					list:res.data.list[0],
					IMEI:res.data.list[0].IMEI,
					install_addr:res.data.list[0].install_addr,
					device_name:res.data.list[0].device_name,
					command,
					state:res.data.list[0].state,
					show,
				})
			}
		})
		getFault({ num: 1, page:1, islast:1, device_type:'ctrl', state:'untreated', device_id }).then((res) => {
			if(res.code ==0){
				if(res.data.list[0]!=null){
					this.setState({
						code:res.data.list[0].code.toString(16),
					})
				}
			}
		})
	}
	pushData = (val) => {
		let buffer = []
		buffer = base64url.toBuffer(val.data);	//8位转流
		this.state.buffer.push(buffer)
	}
	getData = (val) => {
		const { run, lock, close, page, arr } = this.state;
		let buffer = this.state.buffer[0]
		let count= 0
		const x=2
		let markList = []
		const floor = this.state.floor
		if(buffer!=null){
			this.state.clock=false
			if(this.state.active==true){
				if((count+33) <= buffer.length){
					page.upCall   = buffer[count+0]&0x01						//上运行方向
					page.downCall = (buffer[count+0]&0x02)>>1					//下运行方向
					page.run      = (buffer[count+0]&0x04)>>2					//获取运行信号
					page.lock     = (buffer[count+0]&0x08)>>3					//获取门锁信号
					page.open     = (buffer[count+0]&0x10)>>4					//获取开门信号
					page.close    = (buffer[count+0]&0x20)>>5					//获取关门信号
					page.openBtn  = (buffer[count+0]&0x40)>>6					//获取开门按钮信号
					page.closeBtn = (buffer[count+0]&0x80)>>7					//获取关门按钮信号
					page.model    = buffer[count+1]&0xff						//获取电梯模式
					page.status   = buffer[count+2]&0xff						//获取电梯状态
					page.floor    = buffer[count+27]&0xff						//获取电梯当前楼层
					page.speed    = ((buffer[count+31]&0xff)<<8)+(buffer[count+32]&0xff)	//获取电梯当前速度
					arr.upCall.push(page.upCall)
					arr.downCall.push(page.downCall)
					arr.run.push(page.run)
					arr.lock.push(page.lock)
					arr.open.push(page.open)
					arr.close.push(page.close)
					arr.openBtn.push(page.openBtn)
					arr.closeBtn.push(page.closeBtn)
					arr.model.push(page.model)
					arr.status.push(page.status)
					arr.floor.push(page.floor)
					arr.speed.push(page.speed)
					run.push(page.run)
					lock.push(page.lock)
					close.push(page.close)
					markList[0] = (buffer[count+19]&0x01)
					markList[1] = (buffer[count+19]&0x02)>>1
					markList[2] = (buffer[count+19]&0x04)>>2
					markList[3] = (buffer[count+19]&0x08)>>3
					markList[4] = (buffer[count+19]&0x10)>>4
					markList[5] = (buffer[count+19]&0x20)>>5
					markList[6] = (buffer[count+19]&0x40)>>6
					markList[7] = (buffer[count+19]&0x80)>>7
					markList[8] = (buffer[count+20]&0x01)
					markList[9] = (buffer[count+20]&0x02)>>1
					markList[10] = (buffer[count+20]&0x04)>>2
					markList[11] = (buffer[count+20]&0x08)>>3
					markList[12] = (buffer[count+20]&0x10)>>4
					markList[13] = (buffer[count+20]&0x20)>>5
					markList[14] = (buffer[count+20]&0x40)>>6
					markList[15] = (buffer[count+20]&0x80)>>7
					markList[16] = (buffer[count+21]&0x01)
					markList[17] = (buffer[count+21]&0x02)>>1
					markList[18] = (buffer[count+21]&0x04)>>2
					markList[19] = (buffer[count+21]&0x08)>>3
					markList[20] = (buffer[count+21]&0x10)>>4
					markList[21] = (buffer[count+21]&0x20)>>5
					markList[22] = (buffer[count+21]&0x40)>>6
					markList[23] = (buffer[count+21]&0x80)>>7
					markList[24] = (buffer[count+22]&0x01)
					markList[25] = (buffer[count+22]&0x02)>>1
					markList[26] = (buffer[count+22]&0x04)>>2
					markList[27] = (buffer[count+22]&0x08)>>3
					markList[28] = (buffer[count+22]&0x10)>>4
					markList[29] = (buffer[count+22]&0x20)>>5
					markList[30] = (buffer[count+22]&0x40)>>6
					markList[31] = (buffer[count+22]&0x80)>>7
					markList[32] = (buffer[count+23]&0x01)
					markList[33] = (buffer[count+23]&0x02)>>1
					markList[34] = (buffer[count+23]&0x04)>>2
					markList[35] = (buffer[count+23]&0x08)>>3
					markList[36] = (buffer[count+23]&0x10)>>4
					markList[37] = (buffer[count+23]&0x20)>>5
					markList[38] = (buffer[count+23]&0x40)>>6
					markList[39] = (buffer[count+23]&0x80)>>7
					markList[40] = (buffer[count+24]&0x01)
					markList[41] = (buffer[count+24]&0x02)>>1
					markList[42] = (buffer[count+24]&0x04)>>2
					markList[43] = (buffer[count+24]&0x08)>>3
					markList[44] = (buffer[count+24]&0x10)>>4
					markList[45] = (buffer[count+24]&0x20)>>5
					markList[46] = (buffer[count+24]&0x40)>>6
					markList[47] = (buffer[count+24]&0x80)>>7
					markList[48] = (buffer[count+25]&0x01)
					markList[49] = (buffer[count+25]&0x02)>>1
					markList[50] = (buffer[count+25]&0x04)>>2
					markList[51] = (buffer[count+25]&0x08)>>3
					markList[52] = (buffer[count+25]&0x10)>>4
					markList[53] = (buffer[count+25]&0x20)>>5
					markList[54] = (buffer[count+25]&0x40)>>6
					markList[55] = (buffer[count+25]&0x80)>>7
					markList[56] = (buffer[count+26]&0x01)
					markList[57] = (buffer[count+26]&0x02)>>1
					markList[58] = (buffer[count+26]&0x04)>>2
					markList[59] = (buffer[count+26]&0x08)>>3
					markList[60] = (buffer[count+26]&0x10)>>4
					markList[61] = (buffer[count+26]&0x20)>>5
					markList[62] = (buffer[count+26]&0x40)>>6
					markList[63] = (buffer[count+26]&0x80)>>7
					for(let i=0;i<floor.length;i++){
						this.state.markList[i] = markList[i]
					}
					this.state.markList.reverse()
					count+=33
				}
			}
			this.state.buffer.shift()
			this.state.clock=true
			if(ct==0){
				ct = ct+1
				showInte = setInterval(() => {
					if(this.state.pclock==true){
						this.showData()
					}
				},500)
			}
		}
	}
	clears = () => {
		let { arr } = this.state
		this.state.buffer = []
		arr.upCall = []
		arr.downCall = []
		arr.run = []
		arr.open = []
		arr.lock = []
		arr.close = []
		arr.openBtn = []
		arr.closeBtn = []
		arr.model = []
		arr.status = []
		arr.floor = []
		arr.speed = []
		this.state.run = []
		this.state.lock = []
		this.state.close = []
	}
	showData = () => {
		const { show, arr } = this.state
		if(arr.upCall[0]!=null){
			show.upCall = arr.upCall[0]
			show.downCall = arr.downCall[0]
			show.run = arr.run[0]
			show.lock = arr.lock[0]
			show.open = arr.open[0]
			show.close = arr.close[0]
			show.openBtn = arr.openBtn[0]
			show.closeBtn = arr.closeBtn[0]
			show.model = arr.model[0]
			show.status = arr.status[0]
			show.floor = arr.floor[0]
			show.speed = arr.speed[0]
			Object.values(arr).forEach(item => {
				item.shift()
			});
		}
	}
	getfloor = (val) => {
		const { show, } = this.state
		const {location } = this.props;
		const {pick} = this.state;
		const match = pathToRegexp('/ctrl/:id/realtime').exec(location.pathname);
		const device_id = match[1];
		getFloorData({device_id}).then((res) => {
			if(res.code == 0){
				let buffer = [];
				let arr = [];
				let floor = [];
				buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
				buffer.forEach((item) => {
					arr.push(String.fromCharCode(item))
				})
				let high = arr.length/3;
				for(let i=0; i<high;i++){
					floor[high-1-i]=arr[i*3]+arr[i*3+1]+arr[i*3+2];
				}
				this.setState({
					floor,
				});
			}
		})
	}
	showChart = () =>{
		const {event} = this.props;
		const {run,lock,close,} = this.state;
		let Run = echarts.init(document.getElementById('run'))
		let Lock = echarts.init(document.getElementById('lock'))
		let Close = echarts.init(document.getElementById('close'))
		if(run.length > 10){
			run.shift()
			lock.shift()
			close.shift()
		}
		Run.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['运行信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'运行信号',
				type:'line',
				step: 'start',
				data:this.state.run
			}]
		});
		Lock.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['门锁信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'门锁信号',
				type:'line',
				step: 'start',
				data:this.state.lock
			}]
		});
		Close.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['关门信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'关门信号',
				type:'line',
				step: 'start',
				data:this.state.close
			}]
		});
	}
	showChartEn = () =>{
		const {event} = this.props;
		const {run,lock,close,} = this.state;
		let Run = echarts.init(document.getElementById('run'))
		let Lock = echarts.init(document.getElementById('lock'))
		let Close = echarts.init(document.getElementById('close'))
		if(run.length > 10){
			run.shift()
			lock.shift()
			close.shift()
		}
		Run.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Operating signal']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Operating signal',
				type:'line',
				step: 'start',
				data:this.state.run
			}]
		});
		Lock.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Lock signal']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Lock signal',
				type:'line',
				step: 'start',
				data:this.state.lock
			}]
		});
		Close.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Closing signal']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.event.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Closing signal',
				type:'line',
				step: 'start',
				data:this.state.close
			}]
		});
	}
	goEvent = item => () => {
		const { history } = this.props;
		const id = this.props.match.params.id;
		history.push(`/events/ctrl/${item.id}/`);
	}
	goDetail = link => () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/ctrl/${id}/${link}`);
	}
	goQrcode = () => {
		const id = this.state.IMEI
		this.setState({
			src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://server.asynciot.com/company/follow/${id}`,
			modal: true,
		});
	}
	goDebug = () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/company/debug/${id}`);
	}
	gohistory = () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/ctrl/${id}/fault`);
	}
	gocall = () => {
		const id = this.props.match.params.id;
		this.props.history.push(`/company/${id}/call`);
	}
	goFault = (val) => {
		const id = 'E'+this.state.code
		this.props.history.push({
			pathname: `/company/order/code/${id}`,
		});
	}
	changeIo = () => {
		this.state.isIo = !this.state.isIo
		if(this.state.isIo==true){
			this.state.IoInfo="Car Input Watch:"
		}else{
			this.state.IoInfo="Car Output Watch:"
		}
		this.forceUpdate()
	}
	changeIo1 = () => {
		this.state.isIo1 = !this.state.isIo1
		if(this.state.isIo1==true){
			this.state.IoInfo1="Io Input Watch:"
		}else{
			this.state.IoInfo1="Io Output Watch:"
		}
		this.forceUpdate()
	}
	onChange1 = () => {
		this.state.switch1 = !this.state.switch1
		this.forceUpdate()
	}
	changeView = (item) => {
		this.props.dispatch({
			type: 'ctrl/changeView',
			payload: item.view,
		});
	}
	render() {
		this.state.elemsToClick = this.getElemsByToggleMethod( this.state.clickOpt );
		this.attachEvt( this.state.elemsToClick, 'click' );
		this.myattachEvt();

		const { ctrl: { event, view, device, floors, property, } } = this.props
		const { floor, markFloor, markList, show} = this.state
		const id = this.props.match.params.id;
		if(view == 1 && counts == 1){
			chartInte = setInterval(() => {
				if(this.state.pclock==true){
					if(this.state.language=="zh"){
						this.showChart()
					}else{
						this.showChartEn()
					}
					this.forceUpdate()
				}
			},450)
			counts = 2
		}
		if(view == 0 && counts == 2){
			clearInterval(chartInte)
			counts = 1
		}
		return (
			<div className="content tab-hide">
				<div className={styles.content}>
					<div id="mymask" className={`${styles.selectMask_box} ${this.state.dateSelected ? styles.mask : ""}`}>
					<Modal
						visible={this.state.modal}
						transparent
						maskClosable={false}
						title="二维码"
						footer={this.state.language=="en"?[{ text: 'OK', onPress: () => this.setState({modal: false}) }]:[{ text: '确定', onPress: () => this.setState({modal: false}) }]}
						wrapProps={{ onTouchStart: this.onWrapTouchStart }}
					>
						<div className="qrcode">
							<Spin className="qrcode-loading"/>
							<img src={this.state.src} alt="code"/>
						</div>
					</Modal>
					<Row type="flex" justify="center" align="middle">
						<Col span={18}>
							<p className={styles.shishi}><FormattedMessage id="Realtime:"/></p>
						</Col>
						<Col span={6}>
							<Switch
								checkedChildren={<FormattedMessage id="Open"/>}
								unCheckedChildren={<FormattedMessage id="Close"/>}
								onChange={this.onChange}
								checked={this.state.switch}
								disabled={this.state.command}
								defaultChecked={this.state.switch}
								loading={this.state.loading}
							/>
						</Col>
					</Row>
					{
						(this.state.language=="zh") ?
						<div className={classNames(styles.tab, view == 0 ?'tab-active' : 'tab-notactive')}>
							<Row
								type="flex"
								justify="space-around"
								align="middle"
								className={styles.ladder}
							>
								<Col
									span={24}
									className={classNames(styles.door)}
								>
									<section>
										<p style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}><FormattedMessage id="Install Address"/>：<i className={styles.status}>{this.state.install_addr}</i>
										</p>
										<p style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}><FormattedMessage id="Device Name"/>：<i className={styles.status}>{this.state.device_name}</i>
										</p>
										<p style={{
											width: '40%',
										}}><FormattedMessage id="Realtime:"/> <i className={styles.status}>{show.run ? <FormattedMessage id={"Operation"}/>:<FormattedMessage id={"Shutdown"}/>}</i>
										</p>
										<p  style={{
											width: '60%',
										}}><FormattedMessage id="Opening arrival signal"/><i className={styles.status}>{show.open ? <FormattedMessage id="Action"/>:<FormattedMessage id={"Stop"}/>}</i>
										</p>
										<p style={{
											width: '40%',
										}}><FormattedMessage id="Elevator mode"/><i className={styles.status}>{<FormattedMessage id={parseModel(show.model)}/>}</i>
										</p>
										<p style={{
											width: '60%',
										}}><FormattedMessage id="Closing arrival signal"/><i className={styles.status}>{show.close ? <FormattedMessage id="Action"/>:<FormattedMessage id="Stop"/>}</i>
										</p>
										<p style={{
											width: '40%',
										}}><FormattedMessage id="Door lock circuit:"/><i className={styles.status}>{show.lock ? <FormattedMessage id={"Through"}/>:<FormattedMessage id={"Break"}/>}</i>
										</p>
										<p style={{
											width: '60%',
										}}><FormattedMessage id="Elevator run speed:"/><i className={styles.status}>{show.speed ? (show.speed/1000):0}m/s</i>
										</p>
										<p style={{
											width: '40%',
										}}><FormattedMessage id="Devices State"/><i className={styles.status}>{<FormattedMessage id={parseStatus(show.status)}/>}</i>
										</p>
										<p style={{
											width: '60%',
										}}><FormattedMessage id="Order"/><i onClick={()=>{this.goFault()}} className={styles.status}>{this.state.code?<FormattedMessage id={'E'+this.state.code}/>:<FormattedMessage id={"None"}/>}</i>
										</p>
										<p style={{
											width: '40%',
										}}><FormattedMessage id="Monitor remaining time"/><i className={styles.status}>{this.state.endTime?(this.state.endTime+"s"):"0s"}</i>
										</p>
										<p style={{
											width: '80%',
											justifyContent: 'flex-start',
										}}>
											<FormattedMessage id="Last update time"/> ：
											<i className={styles.status}>{show.updateTime}</i>
										</p>
										<p style={{
											width: '20%',
											justifyContent: 'flex-start',
										}}>
											<Switch
												checkedChildren="I\O"
												unCheckedChildren={<FormattedMessage id="Car"/>}
												onChange={this.onChange1}
												checked={this.state.switch1}
												defaultChecked={this.state.switch1}
											/>
										</p>
									</section>
								</Col>
							</Row>
							<div>
								<Col span={18}>
									<CtrlMenu/>
								</Col>
								<Col span={6}>
									<div className={styles.info}>
										<p>
											<Icon className={styles.icon} type={direction[`${show.downCall}${show.upCall}`]} />
											<i>{this.state.floor[this.state.floor.length-show.floor]}</i>
										</p>
										<ul>
											{
												floor.map((item,index) => (
													markList[index] ?
													<li style={{ width: 30, color:'red'}} key={`${index}`} id={`${index}`}>{item}</li>
													:
													<li style={{ width: 30}} key={`${index}`} id={`${index}`}>{item}</li>
												))
											}
										</ul>
									</div>
								</Col>
							</div>
						</div>
						:
						<div className={classNames(styles.tab, view == 0 ?'tab-active' : 'tab-notactive')}>
							<Row
								type="flex"
								justify="space-around"
								align="middle"
								className={styles.ladder}
							>
								<Col
									span={24}
									className={classNames(styles.door)}
								>
									<section>
										<p style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}><FormattedMessage id="Install Address"/>：<i className={styles.status}>{this.state.install_addr}</i>
										</p>
										<p style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}><FormattedMessage id="Device Name"/>：<i className={styles.status}>{this.state.device_name}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Realtime:"/> <i className={styles.status}>{show.run ? <FormattedMessage id={"Operation"}/>:<FormattedMessage id={"Shutdown"}/>}</i>
										</p>
										<p  style={{
											width: '100%',
										}}><FormattedMessage id="Opening arrival signal"/><i className={styles.status}>{show.open ? <FormattedMessage id={"Action"}/>:<FormattedMessage id={"Stop"}/>}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Elevator mode"/><i className={styles.status}>{<FormattedMessage id={parseModel(show.model)}/>}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Closing arrival signal"/><i className={styles.status}>{show.close ? <FormattedMessage id={"Action"}/>:<FormattedMessage id={"Stop"}/>}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Door lock circuit:"/><i className={styles.status}>{show.lock ? <FormattedMessage id={"Through"}/>:<FormattedMessage id={"Break"}/>}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Elevator run speed:"/><i className={styles.status}>{show.speed ? (show.speed/1000):0}m/s</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Devices State"/><i className={styles.status}>{<FormattedMessage id={parseStatus(show.status)}/>}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Order"/><i onClick={()=>{this.goFault()}} className={styles.status}>{this.state.code?<FormattedMessage id={'E'+this.state.code}/>:<FormattedMessage id={"None"}/>}</i>
										</p>
										<p style={{
											width: '100%',
										}}><FormattedMessage id="Monitor remaining time"/> <i className={styles.status}>{this.state.endTime?(this.state.endTime+"s"):"0s"}</i>
										</p>
										<p style={{
											width: '80%',
											justifyContent: 'flex-start',
										}}>
											<FormattedMessage id="Last update time"/> ：
											<i className={styles.status}>{show.updateTime}</i>
										</p>
										<p style={{
											width: '20%',
											justifyContent: 'flex-start',
										}}>
											<Switch
												checkedChildren="IO"
												unCheckedChildren={<FormattedMessage id="Car"/>}
												onChange={this.onChange1}
												checked={this.state.switch1}
												defaultChecked={this.state.switch1}
											/>
										</p>
									</section>
								</Col>
							</Row>
							<div>
								<Col span={18}>
									<CtrlMenu/>
								</Col>
								<Col span={6}>
									<div className={styles.info}>
										<p>
											<Icon className={styles.icon} type={direction[`${show.downCall}${show.upCall}`]} />
											<i>{this.state.floor[this.state.floor.length-show.floor]}</i>
										</p>
										<ul>
											{
												floor.map((item,index) => (
													markList[index] ?
													<li style={{ width: 30, color:'red'}} key={`${index}`} id={`${index}`}>{item}</li>
													:
													<li style={{ width: 30}} key={`${index}`} id={`${index}`}>{item}</li>
												))
											}
										</ul>
									</div>
								</Col>
							</div>
							{/* <div className={styles.btns}>
								<section onClick={this.goDetail('params')}><FormattedMessage id="Menu"/></section>
								<section onClick={this.goQrcode}><FormattedMessage id="QR Code"/></section>
								<section onClick={this.goDebug}><FormattedMessage id="watch"/></section>
								<section onClick={this.gohistory}><FormattedMessage id="History fault"/></section>
								<section onClick={this.gocall}><FormattedMessage id="Call"/></section>
							</div> */}
						</div>
					}
					<div className={classNames(styles.tab, view == 1 ?'tab-active' : 'tab-notactive')}>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "run" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
									<div id = "lock" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
									<div id = "close" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row>
					</div>
					<ul ref='mybtn' id="menu" className={`${mfb.mfb_component__br} ${mfb.mfb_zoomin}`} data-mfb-toggle="click">
						<li className={mfb.mfb_component__wrap}>
						<a  className={mfb.mfb_component__button__main}>
							<i className={`${mfb.mfb_component__main_icon__resting} ${mfb.icon_plus}`}></i>
							<i id="mybutton" className={`${mfb.mfb_component__main_icon__active} ${mfb.icon_close}`}></i>
						</a>
						<ul className={mfb.mfb_component__list}>
							<li>
							<a  data-mfb-label={(this.state.language=="zh")?"菜单":"Menu"} className={mfb.mfb_component__button__child}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_menu}`} onClick={this.goDetail('params')}></i>
							</a>
							</li>
							<li>
							<a data-mfb-label={(this.state.language=="zh")?"二维码":"QR code"} className={mfb.mfb_component__button__child}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_qrcode}`} onClick={this.goQrcode}></i>
							</a>
							</li>
							<li>
							<a data-mfb-label={(this.state.language=="zh")?"内存查看":"Memory View"} className={mfb.mfb_component__button__child}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_watch}`} onClick={this.goDebug}></i>
							</a>
							</li>
							<li>
							<a data-mfb-label={(this.state.language=="zh")?"历史故障":"Historical fault"} className={mfb.mfb_component__button__child}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_fault}`} onClick={this.gohistory}></i>
							</a>
							</li>
							<li>
								<a data-mfb-label={(this.state.language=="zh")?"呼梯":"Call"} className={mfb.mfb_component__button__child}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_call}`} onClick={this.gocall}></i>
								</a>
							</li>
							<li>
								<a data-mfb-label={(this.state.language=="zh")?"实时":"Real time"} className={mfb.mfb_component__button__child}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_event}`}></i>
								</a>
							</li>
						</ul>
						</li>
					</ul>
					</div>
				</div>
			</div>
		);
	}
}
