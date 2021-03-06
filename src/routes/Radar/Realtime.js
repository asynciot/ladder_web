import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Row, Col, Button, Spin, DatePicker, Switch, } from 'antd';
import { Picker, List, Tabs, Modal,Popover, NavBar, Icon } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import styles from './Realtime.less';
import echarts from 'echarts';
import { postMonitor, getFollowDevices, getDeviceList, getDoorRuntime, getCommand } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import mfb from './mfb.css';

const alert = Modal.alert;
var COUNTS=0;
var CT=0;
var chartInte =null;
var showInte =null;
var dateInte = null;
var timing = null;
var websock = '';

const parseState = (event) => {
	let statusName = 'None';
	if (event.openKeep) {
		statusName = 'Keep the door open';
	}
	if (event.closeKeep) {
		statusName = 'Keep the door close';
	}
	if (event.open) {
		statusName = 'Open the door';
	}
	if (event.close) {
		statusName = 'Close the door';
	}
	if (event.stop) {
		statusName = 'Stop Output';
	}
	return statusName;
}
@connect(({ device, user }) => ({
	device,
	currentUser: user.currentUser
}))
export default class DoorHistory extends Component {
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
		leftAnimation: {
			left: '0%',
			duration: 100,
		},
		rightAnimation: {
			right: '0%',
			duration: 100,
		},
		switch:false,
		pick: '',
		modal: false,
		type:'',
		src: '',
		doorWidth:4096,
		change:false,
		arr:{
			openIn:[],
			closeIn:[],
			openTo:[],
			openDecelerate:[],
			closeDecelerate:[],
			closeTo:[],
			openToOut:[],
			closeToOut:[],
			door:[],
			open:[],
			close:[],
			openKeep:[],
			closeKeep:[],
			stop:[],
			inHigh:[],
			inLow:[],
			outHigh:[],
			motorHigh:[],
			flySafe:[],
			closeStop:[],
			position:[],
			current:[],
			speed:[],
		},
		chart:{
			Position:[],
			openIn:[],
			openTo:[],
			openToOut:[],
			openDecelerate:[],
			closeIn:[],
			closeTo:[],
			closeToOut:[],
			closeDecelerate:[],
			current:[],
			speed:[],
		},
		events:{
			nums:[1,2,3,4,5,6,7,8,9,10],
		},
		page:{
			openIn:'',
			closeIn:'',
			current:'',
			openDecelerate:'',
			closeDecelerate:'',
			openToOut:'',
			openTo:'',
			closeToOut:'',
			closeTo:'',
			door:'',
			open:'',
			close:'',
			openKeep:'',
			closeKeep:'',
			stop:'',
			inHigh:'',
			inLow:'',
			outHigh:'',
			motorHigh:'',
			flySafe:'',
			closeStop:'',
			position:'',
			speed:'',
			nowtime:'',
		},
		show:{
			openIn:'',
			closeIn:'',
			current:'',
			openDecelerate:'',
			closeDecelerate:'',
			openToOut:'',
			openTo:'',
			closeToOut:'',
			closeTo:'',
			door:'',
			open:'',
			close:'',
			openKeep:'',
			closeKeep:'',
			stop:'',
			inHigh:'',
			inLow:'',
			outHigh:'',
			motorHigh:'',
			flySafe:'',
			closeStop:'',
			position:'',
			speed:'',
			nowtime:'',
		},
		color:false,
		buffer:[],
		historyEvents:[],
		id:0,
		install:'',
		device_name:'',
		device_model:'',
		IMEI:'',
		threshold:40,
		interval:50,
		duration:300,
		startTime:'',
		endTime:'',
		loading:false,
		watch:false,
		list:[],
		language:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.state.id = this.props.match.params.id
		this.getBaseData()
		document.addEventListener('visibilitychange', () => {
			if(document.title == "控制器"){
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
		clearInterval(dateInte)
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
		if(this.state.mainButton!=null)
		{
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
	initWebsocket (){ //初始化weosocket
		const { currentUser } = this.props;
		const device_id = this.state.id
		const userId = currentUser.id
		const wsurl = 'ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+device_id+'&userId='+userId;
		websock = new WebSocket(wsurl);
		websock.onopen = this.websocketonopen;
		websock.onerror = this.websocketonerror;
		websock.onmessage= (e) =>{
			if(e.data=="closed"){
				this.state.switch = false
				this.state.stop = 1
				websock.close()
				clearInterval(showInte)
				clearInterval(timing)
				this.forceUpdate()
			}else{
				this.state.watch = false;
				var redata = JSON.parse(e.data)
				this.pushData(redata)
				if(COUNTS==0){
					dateInte = setInterval( () => {
						if(this.state.clock==true){
							this.getData()
						}
					},100)
					COUNTS=COUNTS+1;
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
		console.log("WebSocket连接关闭");
	}
	alertName = (show) => {
		if (show.isLoss) {
			return 'None';
		}
		let str = '';
		if (show.inHigh) {
			str = '178';
			this.state.color=true
		}
		if (show.inLow) {
			str = '114';
			this.state.color=true
		}
		if (show.outHigh) {
      if (this.state.device_model==1) {
        str= 'OC';
      } else{
        str = '82';
      }
			this.state.color=true
		}
		if (show.motorHigh) {
      if (this.state.device_model==1) {
        str= 'None';
      } else{
        str= '66';
      }
			
			this.state.color=true
		}
		if (show.flySafe) {
			str = '55';
			this.state.color=true
		}
		if (show.closeStop) {
			str = '51';
			this.state.color=true
		}
		if (str === '') {
			str = 'None';
			this.state.color=false
		}
		return str;
	};
	clears = () => {
		let { chart, arr, } = this.state
		this.state.buffer = []
		arr.openIn = []
		arr.openTo = []
		arr.openToOut = []
		arr.openDecelerate = []
		arr.closeIn = []
		arr.closeTo = []
		arr.closeToOut = []
		arr.closeDecelerate = []
		arr.position = []
		arr.current = []
		arr.speed = []
		arr.door = []
		arr.open = []
		arr.close = []
		arr.openKeep = []
		arr.closeKeep = []
		arr.stop = []
		arr.inHigh = []
		arr.inLow = []
		arr.outHigh = []
		arr.motorHigh = []
		arr.flySafe = []
		arr.closeStop = []
		chart.Position = []
		chart.openIn = []
		chart.openTo = []
		chart.openToOut = []
		chart.openDecelerate = []
		chart.closeIn = []
		chart.closeTo = []
		chart.closeToOut = []
		chart.closeDecelerate = []
		chart.current = []
		chart.speed = []
	}
	onChange = () => {
		this.forceUpdate();
		this.clears();
		COUNTS = 0;
		CT = 0;
		this.setState({
			loading:true,
		})
		setTimeout(()=>{
			this.setState({
				loading:false,
			})
		},1000)
		if(this.state.state =="online"){
			this.state.switch = !this.state.switch;
			this.forceUpdate();
			if(this.state.switch == true){
				if(websock){
					websock.close();
					websock=null;
				}
				this.initWebsocket()
				this.state.watch = true;
				const op = 'open';
				let IMEI;
				if(this.state.list.cellular==1){
					IMEI = this.state.IMEI.substr(0,12);
				}else{
					IMEI = this.state.IMEI
				}
				const interval = this.state.interval;
				const threshold = this.state.threshold;
				const duration = this.state.duration;
				const device_type = '15';
				const type = '0';
				postMonitor({ op, IMEI, interval, threshold, duration, device_type, type,}).then((res) => {
				});
				setTimeout(()=>{
					getCommand({num:1,page:1,IMEI}).then((res)=>{
						if(res.code==0){
							let controll = 0;
							timing = setInterval( () => {
								const date = new Date().getTime();
								const endTime = Math.round(((res.list[0].submit+duration*1000)-date)/1000)
								if(endTime<0){
									this.setState({
										endTime:0,
										switch:false,
									})
									clearInterval(timing);
									if(this.state.language =="zh"&&controll==0){
										controll = 1;
										alert("监控结束,请稍后再监控。");
									}else{
										controll = 1;
										alert("End of monitoring.");
									}
								}else{
									this.setState({
										endTime,
									})
								}
							},1000)
						}
					})
				}, 1000);
			}else{
				websock.close();
				this.forceUpdate();
			}
		}else{
			if(this.state.language=="zh"){
				alert("该设备已离线");
			}else{
				alert("The device is offline.");
			}
		}
	}
	buffer2hex = (buffer) => {
		const unit16array = [];
		buffer.forEach((e) => {
			const num = e.toString(16);
			unit16array.push(num.length === 1
				? `0${num}`
				: num);
		});
		return unit16array;
	}
	getBaseData = () => {
		const {show} = this.state
		const device_id = this.state.id
		getDoorRuntime({device_id,type:4096,num:1,page:1}).then((res) => {
			let buffer = []
			buffer = base64url.toBuffer(res.data.list[0].data)				//8位转流
			show.openIn			 = (buffer[6]&0x80)>>7 						        //获取开门输入信号
			show.closeIn		 = (buffer[6]&0x40)>>6						        //获取关门输入信号
			show.openTo 		 = (buffer[6]&0x20)>>5						        //获取开到位输入信号
			show.closeTo 		 = (buffer[6]&0x10)>>4						        //获取关到位输入信号
			show.openDecelerate	 = (buffer[6]&0x08)>>3						    //开减速输入信号
			show.closeDecelerate = (buffer[6]&0x04)>>2						    //关减速输入信号
			show.openToOut		 = (buffer[6]&0x02)>>1						      //获取开到位输出信号
			show.closeToOut 	 = buffer[6]&0x01							          //获取关到位输出信号
			show.door			 = (buffer[7]&0x80)>>7						          //门光幕信号
			show.open			 = (buffer[7]&0x40)>>6						          //正在开门信号
			show.close			 = (buffer[7]&0x20)>>5						        //正在关门信号
			show.openKeep		 = (buffer[7]&0x10)>>4						        //开门到位维持信号
			show.closeKeep		 = (buffer[7]&0x08)>>3						      //关门到位维持信号
			show.stop			 = (buffer[7]&0x04)>>2						          //停止输出信号
			show.inHigh			 = (buffer[7]&0x02)>>1						        //输入电压过高
			show.inLow			 = buffer[7]&0x01							                  //输入电压过低
			show.outHigh		 = (buffer[8]&0x80)>>7						              //输出过流
			show.motorHigh		 = (buffer[8]&0x40)>>6						            //电机过载
			show.flySafe		 = (buffer[8]&0x20)>>5						              //飞车保护
			show.closeStop		 = (buffer[8]&0x10)>>4						            //开关门受阻
			show.position		 = ((buffer[8]&0x0f)<<8)+(buffer[3]&0xff)	      //获取位置信号
			show.current		 = 0										                        //获取电流信号
			show.speed = (((buffer[12]&0xff)<<8)+(buffer[13]&0xff))/1000		//获取速度
			if(show.speed>32.767){
				show.speed = show.speed-65.535;
			}
		});
		getFollowDevices({device_id}).then((res)=>{
			if(res.code==0){
				let time = res.data.list[0].device_t_update;
				time = time.replace(/NOVT/,"CST");
				show.updateTime = moment(time).subtract('hours',13).format('YYYY-MM-DD HH:mm:ss');
				this.setState({
					IMEI:res.data.list[0].IMEI,
					install:res.data.list[0].install_addr,
					device_name:res.data.list[0].device_name,
					device_model:res.data.list[0].device_model,
					state:res.data.list[0].state,
					show,
					list:res.data.list[0],
				})
			}
		})
		setTimeout(()=>{
			if(this.state.device_model == '1'){
				getDoorRuntime({device_id,num:1,page:1,type:4100}).then((res) => {
					if(res.code == 0){
						let buffer = [];
						buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
						const hex = this.buffer2hex(buffer);
						this.setState({
							doorWidth:parseInt((hex[26] + hex[27]), 16),
						})
					}
				});
			}else{
				getDoorRuntime({device_id,num:1,page:1,type:4101}).then((res) => {
					if(res.code == 0){
						let buffer = []
						buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
						const hex = this.buffer2hex(buffer);
						console.log(parseInt((hex[14] + hex[15]), 16))
						this.setState({
							doorWidth:parseInt((hex[14] + hex[15]), 16),
						})
					}
				});
			}
		}, 100);
		this.setAnimation();
	}
	getData = () => {
		const {page, show, arr, chart} = this.state;
		let buffer = this.state.buffer[0];
		let count= 0;
		const x=2;
		if(buffer!=null){
			this.state.clock=false;
			if(this.state.active==true){
				for(let i=0;i<this.state.threshold/x;i++){
					if((count+8) <= buffer.length){
						page.openIn = (buffer[count+0]&0x80)>>7;										//获取开门输入信号
						page.closeIn = (buffer[count+0]&0x40)>>6;										//获取关门信号
						page.openTo = (buffer[count+0]&0x20)>>5;										//获取开到位输入信号
						page.closeTo = (buffer[count+0]&0x10)>>4;										//获取关到位输入信号
						page.openDecelerate = (buffer[count+0]&0x08)>>3;						//开减速输入信号
						page.closeDecelerate = (buffer[count+0]&0x04)>>2;						//关减速输入信号
						page.openToOut = (buffer[count+0]&0x02)>>1;									//获取开到位输出信号
						page.closeToOut = buffer[count+0]&0x01;											//获取关到位输出信号
						page.door = (buffer[count+1]&0x80)>>7;											//正在门光幕
						page.open = (buffer[count+1]&0x40)>>6;											//正在开门信号
						page.close = (buffer[count+1]&0x20)>>5;											//正在关门信号
						page.openKeep = (buffer[count+1]&0x10)>>4;									//开门到位维持信号
						page.closeKeep	= (buffer[count+1]&0x08)>>3;								//关门到位维持信号
						page.stop = (buffer[count+1]&0x04)>>2;											//停止输出信号
						page.inHigh = (buffer[count+1]&0x02)>>1;										//输入电压过高
						page.inLow = buffer[count+1]&0x01;													//输入电压过低
						page.outHigh = (buffer[count+2]&0x80)>>7;										//输出过流
						page.motorHigh = (buffer[count+2]&0x40)>>6;									//电机过载
						page.flySafe = (buffer[count+2]&0x20)>>5;										//飞车保护
						page.closeStop = (buffer[count+2]&0x10)>>4;									//开关门受阻
						page.position = ((buffer[count+2]&0x0f)<<8)+(buffer[count+3]&0xff);				//获取位置信号
						page.current = (((buffer[count+4]&0xff)<<8)+(buffer[count+5]&0xff))/1000;	//获取电流信号
						page.speed = (((buffer[count+6]&0xff)<<8)+(buffer[count+7]&0xff))/1000;		//获取速度
						if(show.speed>32.767){
							page.speed = (page.speed-65.536).toFixed(2);
						}
						count=8*i*x
					}
					arr.openIn.push(page.openIn);
					arr.openTo.push(page.openTo);
					arr.openToOut.push(page.openToOut);
					arr.openDecelerate.push(page.openDecelerate);
					arr.closeIn.push(page.closeIn);
					arr.closeTo.push(page.closeTo);
					arr.closeToOut.push(page.closeToOut);
					arr.closeDecelerate.push(page.closeDecelerate);
					arr.position.push(page.position);
					arr.current.push(page.current);
					arr.speed.push(page.speed);
					arr.door.push(page.door);
					arr.open.push(page.open);
					arr.close.push(page.close);
					arr.openKeep.push(page.openKeep);
					arr.closeKeep.push(page.closeKeep);
					arr.stop.push(page.stop);
					arr.inHigh.push(page.inHigh);
					arr.inLow.push(page.inLow);
					arr.outHigh.push(page.outHigh);
					arr.motorHigh.push(page.motorHigh);
					arr.flySafe.push(page.flySafe);
					arr.closeStop.push(page.closeStop);
					if((i+1)%10==0){
						chart.Position.push(page.position) ;
						chart.openIn.push(page.openIn);
						chart.openTo.push(page.openTo);
						chart.openToOut.push(page.openToOut);
						chart.openDecelerate.push(page.openDecelerate);
						chart.closeIn.push(page.closeIn);
						chart.closeTo.push(page.closeTo);
						chart.closeToOut.push(page.closeToOut);
						chart.closeDecelerate.push(page.closeDecelerate);
						chart.current.push(page.current);
						chart.speed.push(page.speed);
					}
				}
			}
			this.state.buffer.shift();
			this.state.clock=true;
			if(CT==0){
				CT = CT+1;
				showInte = setInterval(() => {
					if(this.state.pclock==true){
						this.showData();
						this.setAnimation();
					}
				},100)
			}
		}
	}
	pushData = (val) => {
		let buffer = []
		buffer = base64url.toBuffer(val.data);	//8位转流
		this.state.buffer.push(buffer);
	}
	showData = () => {
		const { show, arr } = this.state;
		if(arr.door[0]!=null){
			show.openIn = arr.openIn[0];
			show.openTo = arr.openTo[0];
			show.openToOut = arr.openToOut[0];
			show.openDecelerate = arr.openDecelerate[0];
			show.closeIn = arr.closeIn[0];
			show.closeTo = arr.closeTo[0];
			show.closeToOut = arr.closeToOut[0];
			show.closeDecelerate = arr.closeDecelerate[0];
			show.position = arr.position[0];
			show.current = arr.current[0];
			show.speed = arr.speed[0];
			show.door = arr.door[0];
			show.open = arr.open[0];
			show.close = arr.close[0];
			show.openKeep = arr.openKeep[0];
			show.closeKeep = arr.closeKeep[0];
			show.stop = arr.stop[0];
			show.inHigh = arr.inHigh[0];
			show.inLow = arr.inLow[0];
			show.outHigh = arr.outHigh[0];
			show.motorHigh = arr.motorHigh[0];
			show.flySafe = arr.flySafe[0];
			show.closeStop = arr.closeStop[0];
			Object.values(arr).forEach(item => {
				item.shift()
			});
			this.forceUpdate();
		}
	}
	showChart = () =>{
		const { chart } = this.state
		let OpenIn = echarts.init(document.getElementById('OpenIn'));
		let OpenTo = echarts.init(document.getElementById('OpenTo'));
		let Decelerate = echarts.init(document.getElementById('Decelerate'));
		let CloseTo = echarts.init(document.getElementById('CloseTo'));
		let Position = echarts.init(document.getElementById('Position'));
		let Current = echarts.init(document.getElementById('Current'));
		let Speed = echarts.init(document.getElementById('Speed'));
		if(chart.Position != null){
			while(chart.Position.length>10){
				Object.values(chart).forEach(item => {
					item.shift()
				});
			}
		}
		OpenIn.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开门信号','关门信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开门信号',
				type:'line',
				step: 'start',
				data:this.state.chart.openIn,
			},{
				name:'关门信号',
				type:'line',
				step: 'start',
				data:this.state.chart.closeIn,
			}]
		})
		OpenTo.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开到位输入信号','关到位输入信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开到位输入信号',
				type:'line',
				step: 'start',
				data:this.state.chart.openTo,
			},{
				name:'关到位输入信号',
				type:'line',
				step: 'start',
				data:this.state.chart.closeTo,
			}]
		})
		CloseTo.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开门到位输出信号','关门到位输出信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开门到位输出信号',
				type:'line',
				step: 'start',
				data:this.state.chart.openToOut,
			},{
				name:'关门到位输出信号',
				type:'line',
				step: 'start',
				data:this.state.chart.closeToOut,
			}]
		})
		Decelerate.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['开减速输入信号','关减速输入信号']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'开减速输入信号',
				type:'line',
				step: 'start',
				data:this.state.chart.openDecelerate,
			},{
				name:'关减速输入信号',
				type:'line',
				step: 'start',
				data:this.state.chart.closeDecelerate,
			}]
		})
		Position.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['门坐标']
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'门坐标',
				type:'line',
				smooth: true,
				data:this.state.chart.Position,
			}]
		})
		Current.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['电流']
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'电流',
				type:'line',
				smooth: true,
				data:this.state.chart.current,
			}]
		})
		Speed.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['速度']
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'速度',
				type:'line',
				smooth: true,
				data:this.state.chart.speed,
			}]
		})
	}
	showChartEn = () =>{
		const { chart } = this.state;
		let OpenIn = echarts.init(document.getElementById('OpenIn'));
		let OpenTo = echarts.init(document.getElementById('OpenTo'));
		let Decelerate = echarts.init(document.getElementById('Decelerate'));
		let CloseTo = echarts.init(document.getElementById('CloseTo'));
		let Position = echarts.init(document.getElementById('Position'));
		let Current = echarts.init(document.getElementById('Current'));
		let Speed = echarts.init(document.getElementById('Speed'));
		if(chart.Position != null){
			while(chart.Position.length>10){
				Object.values(chart).forEach(item => {
					item.shift();
				});
			}
		}
		OpenIn.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Open signal','Close signal']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Open signal',
				type:'line',
				step: 'start',
				data:this.state.chart.openIn,
			},{
				name:'Close signal',
				type:'line',
				step: 'start',
				data:this.state.chart.closeIn,
			}]
		})
		OpenTo.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Open arrival Input','Close arrival Input']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Open arrival Input',
				type:'line',
				step: 'start',
				data:this.state.chart.openTo,
			},{
				name:'Close arrival Input',
				type:'line',
				step: 'start',
				data:this.state.chart.closeTo,
			}]
		})
		CloseTo.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Open arrival Output','Close arrival Output']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Open arrival Output',
				type:'line',
				step: 'start',
				data:this.state.chart.openToOut,
			},{
				name:'Close arrival Output',
				type:'line',
				step: 'start',
				data:this.state.chart.closeToOut,
			}]
		})
		Decelerate.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Open Decelerate Input','Close Decelerate Input']
			},
			grid: {
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
				data:[0,1]
			},
			series: [{
				name:'Open Decelerate Input',
				type:'line',
				step: 'start',
				data:this.state.chart.openDecelerate,
			},{
				name:'Close Decelerate Input',
				type:'line',
				step: 'start',
				data:this.state.chart.closeDecelerate,
			}]
		})
		Position.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Door coordinate']
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'Door coordinate',
				type:'line',
				smooth: true,
				data:this.state.chart.Position,
			}]
		})
		Current.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Current']
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'Current',
				type:'line',
				smooth: true,
				data:this.state.chart.current,
			}]
		})
		Speed.setOption({
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:['Speed']
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '3%',
				bottom:'20px',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:this.state.events.nums,
			},
			yAxis: {
			},
			series: [{
				name:'Speed',
				type:'line',
				smooth: true,
				data:this.state.chart.speed,
			}]
		})
	}
	goEvent = () => {
		const id = this.state.id;
		this.props.history.push(`/events/door/${id}/`);
	}
	goDetail = link => () => {
		const id = this.state.id;
		const type = this.state.device_model;
		this.props.history.push(`/door/${id}/params/${type}`);
	}
	goQrcode = () => {
		const device_id = this.state.id;
		getDeviceList({device_id}).then((res)=>{
			const id = res.data.list[0].IMEI
			this.setState({
				src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://server.asynciot.com/company/follow/${id}`,
				modal: true,
			});
		})
	}
	gohistory = () => {
		const id = this.state.id;
		this.props.history.push(`/company/door/${id}`);
	}
	setAnimation = () => {
		const {doorWidth, show} = this.state;
		if(show.position!=null){
			this.setState({
				leftAnimation: {
					left: `-${(show.position / doorWidth) * 50}%`,
					duration: 100,
				},
				rightAnimation: {
					right: `-${(show.position / doorWidth) * 50}%`,
					duration: 100,
				},
			});
		}
		this.forceUpdate()
	}
	changeView = (item) => {
		const { dispatch, match } = this.props;
		if(item.view==2){
			dispatch(routerRedux.replace(`/events/door/${match.params.id}`));
		}
		dispatch({
			type: 'device/changeView',
			payload: item.view,
		});
	}
	render() {
		const { language } =this.state;
		this.state.elemsToClick = this.getElemsByToggleMethod( this.state.clickOpt );
		this.attachEvt( this.state.elemsToClick, 'click' );
		this.myattachEvt();

		const { device: { events, view, property, updateTime, }} = this.props;
		const { show, id } = this.state;
		const width = parseInt((window.innerWidth - 100) / 2);
		let type = null;
		if(view == 1 && COUNTS == 1){
			chartInte = setInterval(() => {
				if(this.state.pclock==true){
					if(language=="zh"){
						this.showChart()
					}else{
						this.showChartEn()
					}
					this.forceUpdate()
				}
			},450)
			COUNTS = 2;
		}
		if(view == 0 && COUNTS == 2){
			clearInterval(chartInte);
			COUNTS = 1;
		}
		if (property.Model) {
			property.Model.value == "NSFC01-02T" ? type = 1 : type = 2;
		} else {
			type = 1;
		}
		return (
			<div className="content tab-hide">
				<div className={styles.content}>
					<div id="mymask" className={`${styles.selectMask_box} ${this.state.dateSelected ? styles.mask : ""}`}>
					<Modal
						visible={this.state.modal}
						transparent
						maskClosable={false}
						title={<FormattedMessage id="QR Code"/>}
						footer={language=="en"?[{ text: 'OK', onPress: () => this.setState({modal: false}) }]:[{ text: '确定', onPress: () => this.setState({modal: false}) }]}
						wrapProps={{ onTouchStart: this.onWrapTouchStart }}
					>
						<div className="qrcode">
							<Spin className="qrcode-loading"/>
							<img src={this.state.src} alt="code"/>
						</div>
					</Modal>
					<Modal
						visible={this.state.watch}
						transparent
						maskClosable={false}
						footer={language=="en"?[{ text: 'OK', onPress: () => this.setState({watch: false}) }]:[{ text: '确定', onPress: () => this.setState({watch: false}) }]}
						wrapProps={{ onTouchStart: this.onWrapTouchStart }}
					>
						<div>
							<p><FormattedMessage id="Wait"/></p>
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
								defaultChecked={this.state.switch}
								loading={this.state.loading}
							/>
						</Col>
					</Row>
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
							{
								(language=="zh")?
								<section className={styles.left}>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}><FormattedMessage id="Install Address"/>：<i className={styles.status}>{this.state.install}</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}><FormattedMessage id="Device Name"/>：<i className={styles.status}>{this.state.device_name}</i>
									</p>
									<p style={{
										width: '50%',
									}}><FormattedMessage id="Door State"/><i className={styles.status}>{<FormattedMessage id={parseState(show)}/>}</i>
									</p>
									<p style={{
										width: '50%',
									}}><FormattedMessage id="Door Current"/> <i className={styles.status}>{show.current} A</i>
									</p>
									<p ><FormattedMessage id="Opening signal"/><FormattedMessage id="Normally open"/>{show.openIn?<i style={{background:"#21B923"}} className={styles.signal1}/>:<i className={styles.signal1}/>}
									</p>
									<p ><FormattedMessage id="Closing signal"/><FormattedMessage id="Normally open"/>{show.closeIn?<i style={{background:"#21B923"}} className={styles.signal1}/>:<i className={styles.signal1}/>}
									</p>
									<p ><FormattedMessage id="Opening arrival signal"/><FormattedMessage id="Normally closed"/>{show.openToOut?<i style={{background:"#21B923"}} className={styles.signal1}/>:<i className={styles.signal1}/>}
									</p>
									<p ><FormattedMessage id="Closing arrival signal"/><FormattedMessage id="Normally closed"/>{show.closeToOut?<i style={{background:"#21B923"}} className={styles.signal1}/>:<i className={styles.signal1}/>}
									</p>
									<p><FormattedMessage id="Monitor remaining time"/> <i className={styles.status}>{this.state.endTime?(this.state.endTime+"s"):"0s"}</i>
									</p>
									<p ><i style={{flexShrink: 0,}}><FormattedMessage id="Order"/></i>
										{
											this.state.color ?
											<i className={styles.status} style={{ color:'red'}}>{<FormattedMessage id={this.alertName(show)}/>}</i>
											:
											<i className={styles.status}>{<FormattedMessage id={this.alertName(show)}/>}</i>
										}
									</p>
									<p
										style={{
											width: '100%',
											justifyContent: 'flex-start',
										}}
									>
										<FormattedMessage id="Last update time"/> ：<i className={styles.status}>{show.updateTime}</i>
									</p>
								</section>
								:
								<section>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}><FormattedMessage id="Install Address"/>：<i className={styles.status}>{this.state.install}</i>
									</p>
									<p style={{
										width: '100%',
										justifyContent: 'flex-start',
									}}><FormattedMessage id="Device Name"/>：<i className={styles.status}>{this.state.device_name}</i>
									</p>
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Door Current"/> <i className={styles.status}>{show.current?show.current:"0"} A</i>
									</p>
									{/*<p>开门次数 ：<i className={styles.status}>{show.times || '无'}</i>
									</p>*/}
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Opening signal"/> <i className={styles.status}>{show.openIn ? <FormattedMessage id="Open"/> : <FormattedMessage id="Close"/>}</i>
									</p>
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Closing signal"/> <i className={styles.status}>{show.closeIn ? <FormattedMessage id="Open"/> : <FormattedMessage id="Close"/>}</i>
									</p>
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Door State"/><i className={styles.status}>{<FormattedMessage id={parseState(show)}/>}</i>
									</p>
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Opening arrival signal"/><FormattedMessage id="Normally closed"/>{show.openToOut?<i style={{background:"#21B923"}} className={styles.signal1}/>:<i className={styles.signal1}/>}
									</p>
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Closing arrival signal"/><FormattedMessage id="Normally closed"/>{show.closeToOut?<i style={{background:"#21B923"}} className={styles.signal1}/>:<i className={styles.signal1}/>}
									</p>
									<p style={{
										width: '100%',
									}}><i style={{flexShrink: 0,}}><FormattedMessage id="Order"/> </i>
										{
											this.state.color ?
											<i className={styles.status} style={{ color:'red'}}>{<FormattedMessage id={this.alertName(show)}/>}</i>
											:
											<i className={styles.status}>{<FormattedMessage id={this.alertName(show)}/>}</i>
										}
									</p>
									<p style={{
										width: '100%',
									}}><FormattedMessage id="Monitor remaining time"/> <i className={styles.status}>{this.state.endTime?(this.state.endTime+"s"):"0s"}</i>
									</p>
									<p style={{
											width: '100%',
										}}><FormattedMessage id="Last update time"/><i className={styles.status}>{show.updateTime}</i>
									</p>
								</section>
							}
							</Col>
						</Row>
						<Row
							type="flex"
							justify="space-around"
							align="middle"
							className={styles.ladder}
						>
							<Col
								span={21}
							>
								<div className={styles.shaft}>
									<section>
										<div />
									</section>
									<section className={styles.noborder}>
										<div />
									</section>
									<p></p>
									<div className={styles.shaftinfo}>
										<p><FormattedMessage id="Closing arrival input"/>
										{
											show.closeTo ?
											<i
												className={styles.signal} style={{background:"#21B923"}}
											/>
											:
											<i
												className={styles.signal}
											/>
										}
										</p>
										<p><FormattedMessage id="Opening arrival input"/>
										{
											show.openTo ?
											<i
												className={styles.signal} style={{background:"#21B923"}}
											/>
											:
											<i
												className={styles.signal}
											/>
										}
										</p>
									</div>
								</div>
								<div className={styles.doors}>
									<TweenOne
									animation={this.state.leftAnimation}
									style={{ left: '0%' }}
									className={styles.doorbox}
									/>
									<section className={styles.doorstitle}>
										<div
											className={show.door
											? styles.screen
											: ''}
										/>
										<p><FormattedMessage id="Light curtain signal"/></p>
									</section>
									<TweenOne
										animation={this.state.rightAnimation}
										style={{ right: '0%' }}
										className={styles.doorbox}
									/>
								</div>
							</Col>
						</Row>
					</div>
					<div className={classNames(styles.tab, view == 1 ?'tab-active' : 'tab-notactive')}>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "OpenIn" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "OpenTo" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "CloseTo" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "Decelerate" style={{ width: 320 , height: 80 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "Position" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "Current" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 48 }}>
								<div id = "Speed" style={{ width: 320 , height: 240 }}></div>
							</Col>
						</Row>
					</div>
					<ul ref='mybtn' id="menu" className={`${mfb.mfb_component__br} ${mfb.mfb_zoomin}`} data-mfb-toggle="click">
						<li className={mfb.mfb_component__wrap}>
							<div>
								{
									language=="zh"?
									<a  className={mfb.mfb_component__button__main}>
										<i className={`${mfb.mfb_component__main_icon__resting} ${mfb.icon_plus_ch}`}></i>
										<i id="mybutton" className={`${mfb.mfb_component__main_icon__active} ${mfb.icon_close}`}></i>
									</a>
									:
									<a  className={mfb.mfb_component__button__main}>
										<i className={`${mfb.mfb_component__main_icon__resting} ${mfb.icon_plus_en}`}></i>
										<i id="mybutton" className={`${mfb.mfb_component__main_icon__active} ${mfb.icon_close}`}></i>
									</a>
								}
							</div>
						<ul className={mfb.mfb_component__list}>
							<li>
							<a  data-mfb-label={(language=="zh")?"菜单":"Menu"} className={mfb.mfb_component__button__child} onClick={this.goDetail(type == 2 ? 'params/2': 'params/1')}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_menu}`}></i>
							</a>
							</li>
							<li>
							<a data-mfb-label={(language=="zh")?"二维码":"QR code"} className={mfb.mfb_component__button__child} onClick={this.goQrcode}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_qrcode}`}></i>
							</a>
							</li>
							<li>
							<a data-mfb-label={(language=="zh")?"历史故障":"Historical faults"} className={mfb.mfb_component__button__child} onClick={this.gohistory}>
								<i className={`${mfb.mfb_component__child_icon} ${mfb.icon_fault}`}></i>
							</a>
							</li>
							<li>
							<a data-mfb-label={(language=="zh")?"历史事件":"Historical events"} className={mfb.mfb_component__button__child} onClick={this.goEvent}>
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
