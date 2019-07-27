import React, { Component } from 'react';
import { Row, Col, Button, Spin, DatePicker, Pagination, Icon, Input, List} from 'antd';
import { Tabs, Flex, Badge, Modal, LocaleProvider} from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import styles from './FollowDevice.less';
import singalImg from '../../assets/signal.png';
import { getFollowDevices, getDevicesStatus, getFault } from '../../services/api';
import en from 'antd-mobile/lib/locale-provider/en_US';
import { injectIntl, FormattedMessage } from 'react-intl';

var switchIdx = 0;
const alert = Modal.alert;
const tabs = [
	{ title: (window.localStorage.getItem("language")=='en') ? 'All' : '全部', device_type: '' },
	{ title: (window.localStorage.getItem("language")=='en') ? 'Door' : '门机', device_type: '15' },
	{ title: (window.localStorage.getItem("language")=='en') ? 'Ctrl' : '控制柜', device_type: '240' },
];
const tabs2 = [
	{ title: (window.localStorage.getItem("language")=='en') ? 'All' : '全部', state: '' },
	{ title: (window.localStorage.getItem("language")=='en') ? 'Online' : '在线', state: 'online' },
	{ title: (window.localStorage.getItem("language")=='en') ? 'Fault' : '故障', state: 'offline' },
	{ title: (window.localStorage.getItem("language")=='en') ? 'Offline' : '离线', state: 'longoffline' },
];
const modelName = {
	'0':'HPC181',
	"1":'NSFC01-01B',
	"2":'NSFC01 -02T',
}
const typeName ={
	'240':'ctrl',
	'15':'door',
}
const state ={
	'online':'online',
	'offline':'offline',
	'longoffline':'long offline',
}
const module = {
	'1':'Wifi',
	'3':'China Unicom',
	'6':'China Mobile',
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
			<em><FormattedMessage id="edit"/></em>
		</span>
	</div>
);

export default class extends Component {
	state = {
		list: [],
		codelist:[],
		asd:[],
		switchIdx:0,
		device_type: 0,
		type:0,
		src: '',
		code: false,
		device:'',
		search_info:'',
		iddr:'',
	}
	componentWillMount() {
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
		this.getDevice(type,1,switchIdx);
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
					if(totalNumber==0){
						this.setState({
							page:0,
						});
					}else{
						this.setState({
							list,
							page,
							totalNumber,
						});
					}
				} else {
					this.setState({
						list: [],
					});
				}
			});
		}
	}
	getFault = (e,device_type) =>{
		const list=[]
		if(device_type=="15"){
			device_type='door'
		}else{
			device_type='ctrl'
		}
		getFault({ num: 10, page:e, islast:1, device_type, state:'untreated' }).then((res) => {
			const pos = res.data.list.map((item,index) => {
				if(device_type=='ctrl'){
					item.code = 'E'+res.data.list[index].code.toString(16)
				}else{
					item.code = parseInt(res.data.list[index].code)+50
				}
				this.getFollowDevices(item.device_id,index,list,item.code)
			})
			if(res.data.totalNumber==0){
				this.setState({
					page:0,
				});
			}else{
				this.setState({
					page:e,
          totalNumber:res.data.totalNumber,
				});
			}
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
					codelist:list,
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
		this.props.history.push(`/company/edit-device/${detail.device_id}`);
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
			if (res.code == 0) {
				const now = new Date().getTime();
				const totalNumber = res.data.totalNumber
				const list = res.data.list.map((item) => {
					return item;
				});
				this.setState({
					list,
					totalNumber,
				});
			}
		})
	}
	render() {
		const ModelName = { 1: 'NSFC01-01B', 2: 'NSFC01-02T'};
		const { navs, list, switchIdx } = this.state;
		var la = window.localStorage.getItem("language")
		if(la == "zh" ){
			la = undefined;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className="content">
					<Tabs
						tabs={tabs2}
						initialPage={this.state.switchIdx}
						tabBarActiveTextColor="#1E90FF"
						tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
						onChange={(tab, index) => { this.goFollowList(tab.device_type,index); }}
					>
						<div style={{ backgroundColor: '#fff' }}>
							<Row className={styles.page}>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"Install Address":"安装地址"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
								<Col span={24} className={styles.center}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							<List
								className={styles.lis}
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton edit={(event) => { this.edit(event, item); }} />]} className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
                      la==en?
                      <Col span={20}>
                        <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
                              <td className={styles.left} style={{width:'220px'}}>{item.install_addr}</td>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="type"/>：</a>
                                <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.IMEI}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
                                <td className="tl"><Signal width={item.rssi}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="model"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{modelName[item.device_model]}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="state"/></a>
                                <td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
                                </Col>
                              </Col>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      :
                      <Col span={20}>
                        <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
                              <td className={styles.left2} style={{width:'200px'}}>{item.install_addr}</td>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="type"/>：</a>
                                <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.IMEI}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
                                <td className="tl"><Signal width={item.rssi}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="model"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{modelName[item.device_model]}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="state"/></a>
                                <td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
                                </Col>
                              </Col>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    }
									</List.Item>
								)}
							/>
						</div>
						<div style={{ backgroundColor: '#fff' }}>
							<Row className={styles.page}>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"Install Address":"安装地址"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
								<Col span={24} className={styles.center}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							<List
								className={styles.lis}
								itemLayout="horizontal"
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton edit={(event) => { this.edit(event, item); }} />]} className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
										  la==en?
										  <Col span={20}>
										    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
										      <tbody>
										        <tr>
										          <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
										          <td className={styles.left} style={{width:'220px'}}>{item.install_addr}</td>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="type"/>：</a>
										            <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.IMEI}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
										            <td className="tl"><Signal width={item.rssi}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="model"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{modelName[item.device_model]}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="state"/></a>
										            <td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
										            </Col>
										          </Col>
										        </tr>
										      </tbody>
										    </table>
										  </Col>
										  :
										  <Col span={20}>
										    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
										      <tbody>
										        <tr>
										          <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
										          <td className={styles.left2} style={{width:'200px'}}>{item.install_addr}</td>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="type"/>：</a>
										            <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.IMEI}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
										            <td className="tl"><Signal width={item.rssi}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="model"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{modelName[item.device_model]}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="state"/></a>
										            <td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
										            </Col>
										          </Col>
										        </tr>
										      </tbody>
										    </table>
										  </Col>
										}
									</List.Item>
								)}
							/>
						</div>
						<div style={{ backgroundColor: '#fff' }}>
							<Row className={styles.page}>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"Install Address":"安装地址"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
								<Col span={24} className={styles.center}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							<List
								className={styles.lis}
								itemLayout="horizontal"
								dataSource={this.state.codelist}
								renderItem={(item,index) => (
									<List.Item className={styles.item} key={index} onClick={this.goDevice(item)}>
                    {
                      la==en?
                      <Col span={22}>
                        <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
                              <td className={styles.left} style={{width:'200px'}}>{item.install_addr}</td>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="type"/>：</a>
                                <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.IMEI}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
                                <td className="tl"><Signal width={item.rssi}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="model"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{modelName[item.device_model]}</td>
                                </Col>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="state"/></a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}><FormattedMessage id={item.code}/></td>
                                </Col>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
                                </Col>
                              </Col>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      :
                      <Col span={22}>
                        <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
                              <td className={styles.left3} width={{width:'200px'}}>{item.install_addr}</td>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="type"/>：</a>
                                <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{item.IMEI}</td>
                                </Col>
                              </Col>
                              <Col span={8}>
                                <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
                                <td className="tl"><Signal width={item.rssi}/></td>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="model"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{modelName[item.device_model]}</td>
                                </Col>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="state"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}><FormattedMessage id={item.code}/></td>
                                </Col>
                              </Col>
                            </tr>
                            <tr>
                              <Col span={16}>
                                <Col span={10}>
                                  <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
                                </Col>
                                <Col span={14}>
                                  <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
                                </Col>
                              </Col>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    }
									</List.Item>
								)}
							/>
						</div>
						<div style={{ backgroundColor: '#fff' }}>
							<Row className={styles.page}>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"IMEI":"设备编号"}
										onChange={this.onChange}
										value={this.state.search_info}
										maxlength="16"></Input>
								</Col>
								<Col span={8} style={{margin:'5px',}}>
									<Input
										placeholder={(la=="en")?"Install Address":"安装地址"}
										onChange={this.onChangel}
										value={this.state.iddr}
										maxlength="16"></Input>
								</Col>
								<Col span={6}>
									<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
								</Col>
								<Col span={24} className={styles.center}>
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							<List
								className={styles.lis}
								itemLayout="horizontal"
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item actions={[<ListButton edit={(event) => { this.edit(event, item); }} />]} className={styles.item} key={index} onClick={this.goDevice(item)}>
										{
										  la==en?
										  <Col span={20}>
										    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
										      <tbody>
										        <tr>
										          <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
										          <td className={styles.left} style={{width:'220px'}}>{item.install_addr}</td>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="type"/>：</a>
										            <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.IMEI}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
										            <td className="tl"><Signal width={item.rssi}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="model"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{modelName[item.device_model]}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="state"/></a>
										            <td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
										            </Col>
										          </Col>
										        </tr>
										      </tbody>
										    </table>
										  </Col>
										  :
										  <Col span={20}>
										    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
										      <tbody>
										        <tr>
										          <a className={styles.text}><FormattedMessage id="Install Address"/> ：</a>
										          <td className={styles.left2} style={{width:'200px'}}>{item.install_addr}</td>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device Name"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.device_name ? item.device_name : <FormattedMessage id="None"/>}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="type"/>：</a>
										            <td className="tl"><FormattedMessage id={typeName[item.device_type] ||''}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Device IMEI"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{item.IMEI}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="RSSI"/>：</a>
										            <td className="tl"><Signal width={item.rssi}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="model"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{modelName[item.device_model]}</td>
										            </Col>
										          </Col>
										          <Col span={8}>
										            <a className={styles.text}><FormattedMessage id="state"/></a>
										            <td className="tl"><FormattedMessage id={state[item.state] ||'None'}/></td>
										          </Col>
										        </tr>
										        <tr>
										          <Col span={16}>
										            <Col span={10}>
										              <a className={styles.text}><FormattedMessage id="Module Type"/> ：</a>
										            </Col>
										            <Col span={14}>
										              <td className={styles.left}>{<FormattedMessage id={module[item.cellular]}/>}</td>
										            </Col>
										          </Col>
										        </tr>
										      </tbody>
										    </table>
										  </Col>
										}
									</List.Item>
								)}
							/>
						</div>
					</Tabs>
				</div>
			</LocaleProvider>
		);
	}
}
