import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Flex, ImagePicker, List, InputItem, Picker, LocaleProvider } from 'antd-mobile';
import { Button, message,  } from 'antd';
import base64url from 'base64url';
import styles from './Call.less';
import { postCall, getFollowDevices, getFloorData } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
// import zh from 'antd-mobile/lib/locale-provider/zh_CN';
import en from 'antd-mobile/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');
const tabs = [
	{ title: (window.localStorage.getItem("language")=="zh")?'呼叫电梯':"Call"},
];
@connect(({ submit, user, loading }) => ({
	submit,
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
		var la
		if(window.localStorage.getItem("language")=="zh"){
			la = undefined;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
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
									disabled={this.state.change}
									cols={1}
									data={this.state.floor}
									value={this.state.from}
									onOk={v => this.onChange(v)}
								>
									<List.Item arrow="horizontal"><FormattedMessage id="Current Floor"/></List.Item>
								</Picker>
								<Picker
									disabled={this.state.change}
									cols={1}
									data={this.state.floor}
									value={this.state.to}
									onOk={v => this.onChangel(v)}
								>
									<List.Item arrow="horizontal"><FormattedMessage id="Destination Floor"/></List.Item>
								</Picker>
								<List.Item>
									<Button disabled={!this.state.from} size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
										<FormattedMessage id="OK"/>
									</Button>
								</List.Item>
							</List>
						</div>
					</Tabs>
				</div>
			</LocaleProvider>
		);
	}
}
