import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'dva';
import { Tabs, Flex, ImagePicker, List, InputItem, Picker } from 'antd-mobile';
import { Button, message } from 'antd';
import base64url from 'base64url';
import qrcode from 'qrcode.js';
import pathToRegexp from 'path-to-regexp';
import styles from './Call.less';
import { postCall, getFollowDevices, getFloorData } from '../../services/api';

const tabs = [
	{ title: '呼叫电梯' },
];
const timeList = [{
	label: '90s',
	value: '90',
},{
	label: '60s',
	value: '60',
}, {
	label: '30s',
	value: '30',
},];
@connect(({ submit, user, loading }) => ({
  submit,
  currentUser: user.currentUser,
  submitting: loading.effects['user/updateUser'],
}))
export default class extends Component {
  state = {
    from: '',
		to: '',
    view: 0,
		pick:'',
  }
  async componentWillMount() {
    getFollowDevices({ num: 1, page:1, device_id:this.props.match.params.id}).then((res) => {
    	this.setState({
    		IMEI: res.data.list[0].IMEI,
    	});
    });
		this.getFloor(this.props.match.params.id)
  }
  componentDidMount() {
    this.forceUpdate()
  }

	getFloor(val){
		getFloorData({device_id:val,}).then((res) => {
			if(res.code == 0){
				let buffer = [];
				let arr = [];
				
				buffer = base64url.toBuffer(res.data.list[0].data);	//8位转流
				buffer.forEach((item) => {
					arr.push(String.fromCharCode(item))
				})
				let high = arr.length/3
				let floor = [{
					label:'',
					value:'',
				}]
				
				for(let i=0; i<high;i++){
					if(i==0){
						floor[0].label=arr[i*3]+arr[i*3+1]+arr[i*3+2]
						floor[0].value=i+1
					}else{
						let floor1 = {
							label:'',
							value:'',
						}
						floor1.label=arr[i*3]+arr[i*3+1]+arr[i*3+2]
						floor1.value=i+1
						floor.push(floor1)
					}
				}
				this.setState({
					floor,
				})
				console.log(floor)
			}else{
				alert("获取楼层高度失败！")
			}
		})
		this.forceUpdate()
	}
  onChange = (value) => {
    this.setState({
      from: value,
    });
  }
  onChangel = (value) => {
    this.setState({
      to: value,
    });
  }

  submit = () => {
		const from = this.state.from[0]
		const to = this.state.to[0]
    postCall({IMEI: this.state.IMEI, from, to}).then((res) => {
		
    });
  }
  tabChange = (tab, index) => {
    this.setState({
      view: index,
    });
  }
  render() {
    const { submitting } = this.props;
    return (
      <div className="content">
       <Tabs
          tabs={tabs}
          initialPage={this.state.view}
          onChange={this.tabChange}
          tabBarActiveTextColor="#1E90FF"
          tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
        >
          <div style={{ backgroundColor: '#fff' }}>
            <List>
							<Picker
								title="选择当前楼层"
								disabled={this.state.change}
								cols={1}
								data={this.state.floor}
								value={this.state.from}
								onOk={v => this.onChange(v)}
							>
								<List.Item arrow="horizontal">当前楼层</List.Item>
							</Picker>
							<Picker
								title="选择目的楼层"
								disabled={this.state.change}
								cols={1}
								data={this.state.floor}
								value={this.state.to}
								onOk={v => this.onChangel(v)}
							>
								<List.Item arrow="horizontal">目的楼层</List.Item>
							</Picker>
              <List.Item>
                <Button disabled={!this.state.from} size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
                  呼叫
                </Button>
              </List.Item>
            </List>
          </div>
        </Tabs>
      </div>
    );
  }
}