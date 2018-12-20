import React, { Component } from 'react';
import { Icon } from 'antd';
import { Tabs, Flex, Badge, List, Modal,} from 'antd-mobile';
import classNames from 'classnames';
import base64url from 'base64url';
import { Row, Col, Button, Spin, DatePicker, Pagination, } from 'antd';
import MobileNav from '../../components/MobileNav';
import styles from './FollowDevice.less';
import singalImg from '../../assets/signal.png';
import { getFollowDevices, deleteFollowInfo } from '../../services/api';
const alert = Modal.alert;
const tabs = [
  { title: '全部', device_type: '' },
  { title: '控制器', device_type: '15' },
  { title: '控制柜', device_type: '240' },
];
const typeName ={
  '240':'控制柜',
  '15':'控制器',
}
const state ={
	'online':'在线',
	'offline':'离线',
	'longoffline':'长期离线',
}
const alertName = (event) => {
  if (event.isLoss) {
    return '无';
  }
  let str = '';
  if (event.inHigh) {
    str += ' 输入电压过高 ';
  }
  if (event.inLow) {
    str += ' 输入电压过低 ';
  }
  if (event.outHigh) {
    str += ' 输出过流 ';
  }
  if (event.motorHigh) {
    str += ' 电机过载 ';
  }
  if (event.flySafe) {
    str += ' 飞车保护 ';
  }
  if (event.closeStop) {
    str += ' 开关门受阻 ';
  }
  if (str === '') {
    str = '运行正常';
  }
  return str;
};
const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);
function parseBuffer(val) {
  if (val && val != 0) {
    let bit = (+val).toString(2);
    while (bit.length < 8) {
      bit = `0${bit}`;
    }
    return bit.split('');
  } else {
    return '00000000'.split('');
  }
}
function parseInfo(event) {
  const name = [
    'closeBtn',
    'openBtn',
    'close',
    'open',
    'lock',
    'run',
    'toDown',
    'toUp',
    'group',
    'parallel',
    'single',
    'full',
    'over',
    'error',
    'lockbd',
    'fire',
    'driver',
    'check',
    'auto',
    'floor',
    'lastCode',
    'lastFloor',
    'lastTime',
  ];
  const obj = {};
  const model = { '01': '单梯', '10': '并联', '100': '群控', '000': '无' };
  const status = ['自动', '检修', '司机', '消防', '锁体', '故障', '超载', '满载'];
  const btn = { '00': '无', '01': '开门', 10: '关门' };
  let floor = '', lastCode = '', lastFloor = '', lastTime= '';
  event.forEach((item, index) => {
    if (index <= 7) {
      obj[name[index]] = parseInt(item);
    }
    if (index > 11 && index <= 23) {
      obj[name[index - 5]] = parseInt(item);
    }
    if (index>=24 && index<=31) {
      floor += `${item}`;
    }
    if (index>=32 && index<=39) {
      lastCode += `${item}`;
    }
    if (index>=40 && index<=47) {
      lastFloor += `${item}`;
    }
    if (index>=48 && index<=79) {
      lastTime += `${item}`;
    }
  });
  const statusBit = [obj.auto, obj.check, obj.driver, obj.fire, obj.lockbd, obj.error, obj.over, obj.full];
  obj.status = statusBit.map((item, index) => (item === 1 ? status[index] : '')).filter(item => item).toString();
  obj.model = model[`0${obj.single}`] || model[`${obj.parallel}0`] || model[`${obj.group}00`];
  obj.btn = btn[`${obj.closeBtn}${obj.openBtn}`];
  obj.floor = parseInt( floor, 2);
  obj.lastCode = parseInt( floor, 2);
  obj.lastFloor = parseInt( floor, 2);
  obj.lastTime = parseInt( floor, 2);
  return obj;
}
function parseEvent(event) {
  const name = [
    'openIn',
    'closeIn',
    'openTo',
    'closeTo',
    'openSlow',
    'closeSlow',
    'openToOut',
    'closeToOut',
    'door',
    'open',
    'close',
    'openKeep',
    'closeKeep',
    'stop',
    'inHigh',
    'inLow',
    'outHigh',
    'motorHigh',
    'flySafe',
    'closeStop',
  ];
  const obj = {};
  let position = '';
  let current = '';
  let speed = '';
  event.forEach((item, index) => {
    if (name[index]) {
      obj[name[index]] = parseInt(item);
    } else if (index > 19 && index <= 31) {
      position += `${item}`;
    } else if (index > 31 && index <= 47) {
      current += `${item}`;
    } else if (index > 47 && index <= 63) {
      speed += `${item}`;
    }
  });
  obj.position = parseInt(position, 2);
  obj.current = (parseInt(current, 2) / 1000).toFixed(3);
  obj.speed = ((parseInt(speed, 2) << 16 >> 16) / 1000).toFixed(3);
  obj.status = alertName(obj)
  return obj;
}
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
      <em>删除</em>
    </span>
  </div>
);

export default class extends Component {
  state = {
    totalList: [],
    list: [],
    switchIdx: 0,
    device_type: 0,
    src: '',
    code: false,
    navs: {
      all: 0,
      ok: 0,
      fault: 0,
      missing: 0,
    },
  }
  componentWillMount() {
    this.getDevice('',1);
  }
	pageChange = (val) => {
		this.getDevice(val)
	}
  getDevice = (device_type,val) => {
    let { navs } = this.state;
		const page = val
    getFollowDevices({ num: 10, page,device_type }).then((res) => {
      if (res.code === 0) {
        const now = new Date().getTime();
				const totalNumber = res.data.totalNumber
        const list = res.data.list.map((item) => {
          if (!item.updateTime) {
            item.isLoss = true;
          } else if (now - item.updateTime > 120000) {
            item.isLoss = true;
            item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm')
          } else {
            item.isLoss = false;
            item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm')
          }
          let arr = [];
          if (item.Event) {
              const buffer = base64url.toBuffer(item.Event);
                buffer.forEach((item) => {
                  arr = arr.concat(parseBuffer(item));
              });
            if (item.device_type == '15') {
              item.event = parseEvent(arr);
              item.event.status == '运行正常' ? item.Alert = 0 : item.Alert = 1;
            }else if (item.device_type == '240') {
              item.event = parseInfo(arr);
              item.event.status == '自动' ? item.Alert = 0 : item.Alert = 1;
            } else {
              item.Alert = 0
              item.event = {
                status: '运行正常'
              }
            }
          }else {
            item.Alert = 0
            item.isLoss ? item.event = {} : item.event = {
              status: '运行正常'
            }
          }
          return item;
        });
        navs.all = list.length;
        navs.ok = (list.filter(item => item.state  === 'online') || []).length;
        navs.fault = (list.filter(item => item.state === 'offline') || []).length;
        navs.missing = (list.filter(item => item.state === 'longoffline') || []).length;
        this.setState({
          switchIdx: 0,
          navs,
          totalList: list,
          list,
					page,
					totalNumber,
        });
      } else {
        navs = {
          all: 0,
          ok: 0,
          fault: 0,
          missing: 0,
        };
        this.setState({
          switchIdx: 0,
          navs,
          totalList: [],
          list: [],
        });
      }
    });
  }
  goDevice = item => () => {
    if (item.device_type === '15') {
      this.props.history.push(`/door/${item.device_id}/realtime`);
    } else {
      this.props.history.push(`/ctrl/${item.device_id}/realtime`);
    }
  }

  switchList = (switchIdx) => {
    const { totalList } = this.state;
		const page = 0;
    this.setState({
      switchIdx,
    });
    switch (parseInt(switchIdx)) {
      case 0:
        this.setState({
          list: totalList,
        });
        break;
      case 1:
        this.setState({
          list: totalList.filter(item => item.state  === "online"),
        });
        break;
      case 2:
        this.setState({
          list: totalList.filter(item => item.state  === "offline"),
        });
        break;
      case 3:
        this.setState({
          list: totalList.filter(item => item.state  === "longoffline"),
        });
        break;
      default:
        this.setState({
          list: totalList,
        });
        break;
    }
  }
  edit = (e, detail) => {
    e.stopPropagation();
    e.preventDefault();
    if (detail.install_addr == undefined || !detail.install_addr) {
      this.props.history.push(`/company/edit-device/${detail.device_id}/undefined`);
    }else {
      this.props.history.push(`/company/edit-device/${detail.device_id}`);
    }
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
					this.getDevice('',1)
        },
      },
    ]);
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
          tabs={tabs}
          initialPage={0}
          tabBarActiveTextColor="#1E90FF"
          tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
          onChange={(tab, index) => { this.getDevice(tab.device_type,1); }}
        >
          <div style={{ backgroundColor: '#fff' }}>
            <Flex>
              <Flex.Item onClick={() => this.switchList(0)}><PlaceHolder className={switchIdx === 0 ? styles.active : ''}>全部 {navs.all}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(1)}><PlaceHolder className={switchIdx === 1 ? styles.active : ''}>在线 {navs.ok}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(2)}><PlaceHolder className={switchIdx === 2 ? styles.active : ''}>离线 {navs.fault}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(3)}><PlaceHolder className={switchIdx === 3 ? styles.active : ''}>长期离线 {navs.missing}</PlaceHolder></Flex.Item>
            </Flex>
						<Row className={styles.page}>
							<Col span={6}>
							</Col>
							<Col span={18} >
								<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
							</Col>
						</Row>
            <List>
              {
                list.map((item, index) => (
                  <List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton qrcode={(event) => { this.qrcode(event, item); }} remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
                    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td className="tr">地点 ：</td>
                          <td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
                        </tr>
                        <tr>
                          <td className="tr">别名 ：</td>
                          <td className="tl">{item.device_name ? item.device_name : '无'}</td>
                          <td className="tl">类型 ：</td>
                          <td className="tl">{typeName[item.device_type] ||''}</td>
                        </tr>
                        <tr>
                          <td className="tr">编号 ：</td>
                          <td className="tl">{item.IMEI}</td>
                          <td className="tl">信号 ：</td>
                          <td className="tl"><Signal width={item.rssi}/></td>
                        </tr>
                        <tr>
                          <td className="tr">型号 ：</td>
                          <td className="tl">{item.device_model ? item.device_model : '无'}</td>
                          <td className="tr">状态 ：</td>
                          <td className="tl">{state[item.state] ||''}</td>
												</tr>
                      </tbody>
                    </table>
                  </List.Item>
                ))
              }
            </List>
          </div>
          <div style={{ backgroundColor: '#fff' }}>
            <Flex>
              <Flex.Item onClick={() => this.switchList(0)}><PlaceHolder className={switchIdx === 0 ? styles.active : ''}>全部 {navs.all}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(1)}><PlaceHolder className={switchIdx === 1 ? styles.active : ''}>在线 {navs.ok}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(2)}><PlaceHolder className={switchIdx === 2 ? styles.active : ''}>离线 {navs.fault}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(3)}><PlaceHolder className={switchIdx === 3 ? styles.active : ''}>长期离线 {navs.missing}</PlaceHolder></Flex.Item>
            </Flex>
						<Row className={styles.page}>
							<Col span={6}>
							</Col>
							<Col span={18} >
								<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
							</Col>
						</Row>
            <List>
              {
                list.map((item, index) => (
                  <List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
                    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          	<td className="tr">地点 ：</td>
                          	<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<td className="tr">别名 ：</td>
													<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													<td className="tl">类型 ：</td>
													<td className="tl">{typeName[item.device_type] ||''}</td>
												</tr>
												<tr>
													<td className="tr">编号 ：</td>
													<td className="tl">{item.IMEI}</td>
													<td className="tl">信号 ：</td>
													<td className="tl"><Signal width={item.rssi}/></td>
												</tr>
												<tr>
													<td className="tr">型号 ：</td>
													<td className="tl">{item.device_model ? item.device_model : '无'}</td>
													<td className="tr">状态 ：</td>
													<td className="tl">{state[item.state] ||''}</td>
												</tr>
                      </tbody>
                    </table>
                  </List.Item>
                ))
              }
            </List>
          </div>
          <div style={{ backgroundColor: '#fff' }}>
            <Flex>
              <Flex.Item onClick={() => this.switchList(0)}><PlaceHolder className={switchIdx === 0 ? styles.active : ''}>全部 {navs.all}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(1)}><PlaceHolder className={switchIdx === 1 ? styles.active : ''}>在线 {navs.ok}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(2)}><PlaceHolder className={switchIdx === 2 ? styles.active : ''}>离线 {navs.fault}</PlaceHolder></Flex.Item>
              <Flex.Item onClick={() => this.switchList(3)}><PlaceHolder className={switchIdx === 3 ? styles.active : ''}>长期离线 {navs.missing}</PlaceHolder></Flex.Item>
            </Flex>
						<Row className={styles.page}>
							<Col span={6}>
							</Col>
							<Col span={18} >
								<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
							</Col>
						</Row>
            <List>
              {
                list.map((item, index) => (
                  <List.Item className={styles.item} key={index} onClick={this.goDevice(item)} extra={<ListButton remove={(event) => { this.remove(event, item); }} edit={(event) => { this.edit(event, item); }} />}>
                    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
													<td className="tr">地点 ：</td>
													<td className="tl" style={{ width: '260px' }}>{item.install_addr}</td>
												</tr>
												<tr>
													<td className="tr">别名 ：</td>
													<td className="tl">{item.device_name ? item.device_name : '无'}</td>
													<td className="tl">类型 ：</td>
													<td className="tl">{typeName[item.device_type] ||''}</td>
												</tr>
												<tr>
													<td className="tr">编号 ：</td>
													<td className="tl">{item.IMEI}</td>
													<td className="tl">信号 ：</td>
													<td className="tl"><Signal width={item.rssi}/></td>
												</tr>
												<tr>
													<td className="tr">型号 ：</td>
													<td className="tl">{item.device_model ? item.device_model : '无'}</td>
													<td className="tr">状态 ：</td>
													<td className="tl">{state[item.state] ||''}</td>
												</tr>
                      </tbody>
                    </table>
                  </List.Item>
                ))
              }
            </List>
          </div>
        </Tabs>
      </div>
    );
  }
}
