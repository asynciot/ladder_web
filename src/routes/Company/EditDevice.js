import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, DatePicker } from 'antd';
import { List, InputItem } from 'antd-mobile';
import styles from './EditDevice.less';
import { putFollowInfo, getDevices } from '../../services/api';
import pathToRegexp from 'path-to-regexp';
var _val1 = '';
var _val2 = '';
export default class extends Component {
  state = {
    device_name: '',
    submitting: false,
		list:[],
  }
  componentWillMount() {
    this.getInfo();
  }
  getInfo() {
		const { dispatch, location } = this.props;
		const match = pathToRegexp('/company/edit-device/:id').exec(location.pathname);
		const device_id =match[1]
    getDevices({device_id}).then(res=> {
      if (res.code == 0) {
        var list = res.data.list[0]
				this.setState({
					list,
				})
      }
    });
  }
	remind = () =>{
		var val1 = document.getElementById('1').value
		var val2 = document.getElementById('2').value
		const len1 =val1.length
		const len2 =val2.length
		if(isNaN(val1)||isNaN(val2)){
			val1 = _val1
			val2 = _val2
			alert("只允许输入数字")
		}else if(len1>3 || len2>3){
			val1 = _val1
			val2 = _val2
			alert("不可超过三位数字")
		}else{
			_val1 = val1
			_val2 = val2
		}
		this.setState({
			maintenance_remind: _val1,
			inspection_remind: _val2,
		});
	}
  onChange = (value, name) => {
    const val = {};
    val[`${name}`] = value;
    this.setState(val);
  }
  submit = () => {
		const time1 = this.state.maintenance_remind*24*3600*1000
		const time2 = this.state.inspection_remind*24*3600*1000
    putFollowInfo({
      device_id: this.state.list.device_id,
      device_name: this.state.list.device_name,
      install_addr: this.state.list.install_addr,
			maintenance_nexttime: this.state.maintenance_nexttime,
			inspection_nexttime: this.state.inspection_nexttime,
			maintenance_remind: time1,
			inspection_remind: time2,
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
  render() {
    const { submitting } = this.state;
		const list = this.state.list
    return (
      <div className="content">
        <List>
          <InputItem
            onChange={value => this.onChange(value, 'install_addr')}
            value={list.install_addr}
          >
            地点
          </InputItem>
          <InputItem
            onChange={value => this.onChange(value, 'device_name')}
            value={list.device_name}
          >
            别名
          </InputItem>
					<tr>
						<td className="tr">下次维保时间 ：</td>
						<DatePicker title="下次维保时间" size="large" value={this.state.maintenance_nexttime} onChange={this.onStart} />
					</tr>
					<InputItem
						id='1'
						onChange={value => this.remind()}
						value={this.state.maintenance_remind}
					>
						提前提醒维保
					</InputItem>
					<InputItem
						disabled={true}
						onChange={value => this.onChange(value, 'maintenance_lasttime')}
						value={moment(parseInt(list.maintenance_lasttime)).format('YYYY-MM-DD HH:mm:ss')}
					>
						上次维保时间
					</InputItem>
					<tr>
						<td className="tr">下次年检时间 ：</td>
						<DatePicker title="下次年检时间" size="large" value={this.state.inspection_nexttime} onChange={this.onEnd} />
					</tr>
					<InputItem
						id='2'
						onChange={value => this.remind()}
						value={this.state.inspection_remind}
					>
						提前提醒年检
					</InputItem>
					<InputItem
						disabled={true}
						onChange={value => this.onChange(value, 'inspection_lasttime')}
						value={moment(parseInt(list.inspection_lasttime)).format('YYYY-MM-DD HH:mm:ss')}
					>
						上次年检时间
					</InputItem>
          <List.Item>
            <Button disabled={!list.device_name && !list.install_addr } size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
              修改
            </Button>
          </List.Item>
        </List>
      </div>
    );
  }
}
