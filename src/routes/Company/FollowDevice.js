import React, { Component } from 'react';
import { Row, Col, Button, Spin, DatePicker, Pagination, Icon, Input,} from 'antd';
import { Tabs, Flex, Badge, List, Modal,} from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import styles from './FollowDevice.less';
import singalImg from '../../assets/signal.png';
import { getFollowDevices, deleteFollowInfo, getDevicesStatus } from '../../services/api';

var switchIdx = 0;
const alert = Modal.alert;
const tabs = [
  { title: '全部', device_type: '' },
  { title: '门机', device_type: '15' },
  { title: '控制柜', device_type: '240' },
];
const tabs2 = [
  { title: '全部', state: '' },
  { title: '在线', state: 'online' },
  { title: '离线', state: 'offline' },
	{ title: '长期离线', state: 'longoffline' },
];
const modelName = {
	'0':'无',
	"1":'NSFC01-01B',
	"2":'NSFC01 -02T',
}
const typeName ={
  '240':'控制柜',
  '15':'门机',
}
const state ={
	'online':'在线',
	'offline':'离线',
	'longoffline':'长期离线',
}
const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);


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
    <span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.edit ? restProps.edit:''}>
      <Icon className={`${styles.edit} ${styles.icon}`} type="form" />
      <em>编辑</em>
    </span>
    <span onClick={restProps.remove ? restProps.remove:''}>
      <Icon className={`${styles.delete} ${styles.icon}`} type="close" />
      <em>取消关注</em>
    </span>
  </div>
);

export default class extends Component {
  state = {
    list: [],
		switchIdx:0,
    device_type: 0,
		type:0,
    src: '',
    code: false,
  }
  componentWillMount() {
		const { location } = this.props;
		const match = pathToRegexp('/company/followdevice/:state').exec(location.pathname);
		const state =match[1]
		const type = this.props.location.state.device_type
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
// 		if(type == "15"){
// 			this.state.type = 1
// 		}else if(type == "240"){
// 			this.state.type = 2
// 		}
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
		this.setState({
			device_type
		});
    getFollowDevices({ num: 10, page, device_type, state, register:'registered' }).then((res) => {
      if (res.code === 0) {
        const now = new Date().getTime();
				const totalNumber = res.data.totalNumber
        const list = res.data.list.map((item) => {
          return item;
        });
        this.setState({
          list,
					page,
					totalNumber,
        });
      } else {
        this.setState({
          list: [],
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
      this.props.history.push(`/ctrl/${item.device_id}/realtime`);
    }
  }
  edit = (e, detail) => {
    e.stopPropagation();
    e.preventDefault();
//     if (detail.install_addr == undefined || !detail.install_addr) {
//       this.props.history.push(`/company/edit-device/${detail.device_id}/undefined`);
//     }else {
      this.props.history.push(`/company/edit-device/${detail.device_id}`);
    // }
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
          deleteFollowInfo({ device_id: detail.device_id }).then((res) => {            
          });
        },
      },
    ]);
		this.forceUpdate()
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
		const device_type = item;
		history.push({
			pathname: `/company/followdevice/${state}`,
			state: { device_type }
		});
		this.getDevice(item,1,val)
	}
	onChange = (e) =>{
		console.log(e.target.value)
		let val = e.target.value
		this.setState({
			search_info:val,
		});
	}
	search = () =>{
		let search_info = this.state.search_info
		getFollowDevices({ num: 10, page:1, search_info}).then((res) => {
			if (res.code === 0) {
				const now = new Date().getTime();
				const totalNumber = res.data.totalNumber
				const list = res.data.list.map((item) => {
					return item;
				});
				this.setState({
					list,
					totalNumber,
				});
			} else {
				this.setState({
					list: [],
				});
			}
		});
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
          tabs={tabs2}
          initialPage={this.state.switchIdx}
          tabBarActiveTextColor="#1E90FF"
          tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
          onChange={(tab, index) => { this.goFollowList(tab.device_type,index); }}
        >
          <div style={{ backgroundColor: '#fff' }}>
            	<List>
								<Row className={styles.page}>
									<Col span={16} style={{margin:'5px',}}>
										<Input
											placeholder="设备编号或串号"
											onChange={this.onChange}
											value={this.state.search_info}
											maxlength="16"></Input>
									</Col>
									<Col span={6}>
										<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} >搜索</Button>
									</Col>
								</Row>
            		{
									list.length ?
            			list.map((item, index) => (
            				<List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton  remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
            					<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
            						<tbody>
            							<tr>
														<a className={styles.text}>安装地址 ：</a>
														<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>,
            							</tr>
            							<tr>
														<Col span={11}>
															<td className="tr">别名 ：</td>
															<td className="tl">{item.device_name ? item.device_name : '无'}</td>
														</Col>
														<Col span={12}>	
															<td className="tl">类型：</td>
															<td className="tl">{typeName[item.device_type] ||''}</td>
														</Col>	
            							</tr>
													<tr>
														<Col span={11}>
															<td className="tr">串号 ：</td>
															<td className="tl">{item.IMEI}</td>
														</Col>
														<Col span={12}>	
															<td className="tl">信号：</td>
															<td className="tl"><Signal width={item.rssi}/></td>
														</Col>	
													</tr>
													<tr>
														<Col span={11}>
															<td className="tr">型号 ：</td>
															<td className="tl">{modelName[item.device_model]}</td>
														</Col>
													</tr>
													<tr>	
														<Col span={12}>	
															<td className="tr">状态：</td>
															<td className="tl">{state[item.state] ||''}</td>
														</Col>	
													</tr>
            						</tbody>
            					</table>
            				</List.Item>
            			)):
									<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
										<Col span={24} className={styles.center}>
											<td></td>
											<td className="tl" style={{margin:'5px',}}>暂无数据</td>
										</Col>
									</table>
            		}
            	</List>
          </div>
        </Tabs>
      </div>
    );
  }
}
