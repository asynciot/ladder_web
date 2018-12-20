import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message } from 'antd';
import { List, InputItem } from 'antd-mobile';
import styles from './EditDevice.less';
import { putFollowInfo, getDevices } from '../../services/api';
import pathToRegexp from 'path-to-regexp';
export default class extends Component {
  state = {
    device_name: '',
    submitting: false,
  }
  componentWillMount() {
    this.getInfo();
  }
  getInfo() {
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/edit-device/:id').exec(location.pathname);
		const device_id =match[1]
    getDevices({device_id}).then(res=> {
      if (res.data.list[0].install_addr) {
        this.setState({
          install_addr: res.data.list[0].install_addr,					
        })
      }
      this.setState({
				device_id,
        device_name: res.data.list[0].device_name,
      })
    });
  }
  onChange = (value, name) => {
    const val = {};
    val[`${name}`] = value;
    this.setState(val);
  }
  submit = () => {
    putFollowInfo({
      device_id: this.state.device_id,
      device_name: this.state.device_name,
      install_addr: this.state.install_addr,
    }).then((res) => {
      if (res.code === 0) {
        message.success('修改成功', 1, () => {
            this.props.history.goBack();
        });
      } else {
        message.error('修改失败');
      }
    });
  }
  render() {
    const { submitting } = this.state;
    return (
      <div className="content">
        <List>
          <InputItem
            onChange={value => this.onChange(value, 'address')}
            value={this.state.install_addr}
          >
            地点
          </InputItem>
          <InputItem
            onChange={value => this.onChange(value, 'device_name')}
            value={this.state.device_name}
          >
            别名
          </InputItem>
          <List.Item>
            <Button disabled={!this.state.device_name && !this.state.install_addr } size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
              修改
            </Button>
          </List.Item>
        </List>
      </div>
    );
  }
}
