import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { List, Table, Tabs } from 'antd';
import { Modal } from 'antd-mobile';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import MobileNav from '../../components/MobileNav';
import FloatBar from '../../components/FloatBar';
import styles from './List.less';
import { injectIntl, FormattedMessage } from 'react-intl';
const TabPane = Tabs.TabPane;

const status = ['输入电压过高', '输入电压过低', '输出过流', '电机过载', '飞车保护', '开关门受阻'];
const statusName = (item) => {
  let alert = '';
  const bit = item.Alert;
  if (item.isLoss) {
    return '失联';
  }
  if (!bit) {
    return '无';
  }
  if (bit == '0') {
    alert = '运行正常';
    return alert;
  }
  let hex = (+bit).toString(2);
  while (hex.length < 8) {
    hex = `0${hex}`;
  }
  hex = hex.split('').reverse();
  hex.forEach((item, index) => {
    if (item == '1') {
      alert += `${status[index]}
      `;
    }
  });
  return alert;
};
const columns = [{
  title: '编号',
  dataIndex: 'deviceId',
}, {
  title: '信号',
  dataIndex: 'RSSI',
}, {
  title: '状态',
  dataIndex: 'State',
  render: (text, row) => (
    <p className={classNames(styles.status, row.Alert == '0' && !row.isLoss ? styles.pass : '')}>{statusName(row)}</p>
  ),
}, {
  title: '地点',
  dataIndex: 'Address',
}, {
  title: '操作',
  key: 'action',
  render: text => (
    localStorage.getItem('status') === 'map' ?
      (<Link to={`/radar/${text.deviceId}/realtime`}>查看</Link>) :
      (<Link to={`/radar/${text.deviceId}/status`}>查看</Link>)
  ),
}];
const navs = [{
  icon: 'appstore-o',
  label: '全部',
  num: 0,
  link: '/radar/list/all',
}, {
  icon: 'check-circle-o',
  label: '运行',
  num: 0,
  link: '/radar/list/run',
}, {
  icon: 'warning',
  label: '故障',
  num: 0,
  link: '/radar/list/bug',
}, {
  icon: 'close-circle-o',
  label: '失联',
  num: 0,
  link: '/radar/list/loss',
}];

@connect(({ device }) => ({
  device,
}))
export default class LadderList extends Component {
  state = {
    modal: false,
    device: {
      deviceId: '',
      RSSI: '',
      Status: '',
      Address: '',
    },
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  goDevice = id => () => {
    // this.setState({
    //   [key]: false,
    // });
    if (localStorage.getItem('status') === 'map') {
      this.props.history.push(`/radar/${id}/realtime`);
    } else {
      this.props.history.push(`/radar/${id}/status`);
    }
  }
  goSubRoute = (link) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.replace(link));
  }
  showModal = (key, item) => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
      device: item,
    });
  }
  render() {
    const { device, isMobile, history, location } = this.props;
    const { list } = device;
    let devices = [];
    const currentPath = pathToRegexp('/radar/list/:name').exec(location.pathname);
    const active = currentPath[1];
    const activeKeyProps = {
      defaultActiveKey: location.pathname,
      activeKey: location.pathname,
    };
    switch (active) {
      case 'all':
        devices = list;
        break;
      case 'run':
        devices = list.filter(item => !item.isLoss && item.Alert == 0);
        break;
      case 'bug':
        devices = list.filter(item => !item.isLoss && item.Alert != 0);
        break;
      case 'loss':
        devices = list.filter(item => item.isLoss);
        break;
      default:
        devices = list;
    }
    navs[0].num = list.length;
    navs[1].num = (list.filter(item => !item.isLoss && item.Alert == 0) || []).length;
    navs[2].num = (list.filter(item => !item.isLoss && item.Alert != 0) || []).length;
    navs[3].num = (list.filter(item => item.isLoss) || []).length;
    return (
      <div className="content">
        {
          !isMobile && (
            <Tabs {...activeKeyProps} onChange={this.goSubRoute} style={{ padding: '0 8px 0' }}>
              {
                navs.map(item => <TabPane tab={`${item.label} ( ${item.num} )`} key={item.link} />)
              }
            </Tabs>
          )
        }
        <MobileNav
          key="nav"
          navs={navs}
          active={active}
        />
        <FloatBar
          position="right"
          content="地图列表"
          barClick={() => { history.push('/radar/map'); }}
        />
        <div className={styles.content}>
          <Modal
            visible={this.state.modal}
            transparent
            onClose={this.onClose('modal')}
            title="设备信息"
            footer={[{ text: '运行状态', onPress: () => { this.goDevice('modal', this.state.device.deviceId)(); } }]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <div className={styles.modal}>
              <table>
                <tbody>
                  <tr>
                    <td><FormattedMessage id="model"/>：</td>
                    <td>{this.state.device.deviceId}</td>
                  </tr>
                  <tr>
                    <td><FormattedMessage id="Install Address"/>：</td>
                    <td>{this.state.device.Address}</td>
                  </tr>
                  <tr>
                    <td><FormattedMessage id="device ID"/>：</td>
                    <td>{this.state.device.deviceId}</td>
                  </tr>
                  <tr>
                    <td><FormattedMessage id="RSSI"/>：</td>
                    <td>{this.state.device.RSSI}</td>
                  </tr>
                  <tr>
                    <td><FormattedMessage id="state"/>：</td>
                    <td>{statusName(this.state.device)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>
          {
            isMobile ? (
              <List
                style={{ background: '#fff' }}
                itemLayout="horizontal"
                dataSource={devices}
                renderItem={item => (
                  <List.Item onClick={this.goDevice(item.deviceId)}>
                    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td className="tr"><FormattedMessage id="Install Address"/> ：</td>
                          <td className="tl" style={{ width: '260px' }}>{item.Address}</td>
                        </tr>
                        <tr>
                          <td className="tr"><FormattedMessage id="device ID"/> ：</td>
                          <td className="tl">{item.deviceId}</td>
                          <td className="tl"><FormattedMessage id="RSSI"/> ：</td>
                          <td className="tl">{item.RSSI}</td>
                        </tr>
                        <tr>
                          <td className="tr"><FormattedMessage id="model"/> ：</td>
                          <td className="tl">{item.Model?item.Model:' '}</td>                       
                          <td className="tr"><FormattedMessage id="state"/> ：</td>
                          <td className={classNames('tl', styles.status, item.Alert == '0' && !item.isLoss ? styles.pass : '')}>{statusName(item)}</td>                         
                        </tr>
                      </tbody>
                    </table>
                  </List.Item>
                )}
              />
            ) : (
              <div>
                <Table
                  className={styles.content}
                  rowKey="deviceId"
                  columns={columns}
                  dataSource={devices}
                  bordered
                />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
