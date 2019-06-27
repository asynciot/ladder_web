import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Pagination, } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './CtrlFault.less';
import ReactEcharts from 'echarts-for-react';
import {getEvent, getFault} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
const faultCode = {
	'1': '开关门受阻',
	'2': '飞车保护',
	'16': '电机过载',
	'32': '输出过流',
	'64': '输入电压过低',
	'128': '输入电压过高',
}
const state = {
	"treating": '未处理',
	"treated": '已处理',
	"untreated": '未处理',
}
export default class DoorHistory extends Component {
	state = {
		totalList: [],
		list: [],
		switchIdx: 0,
		type: 0,
		src: '',
		code: false,
		totalNumber:0,
		start:'',
		end:'',
		device_id:'',
	}
	componentWillMount() {
		const {location, currentUser, match} = this.props;
		this.state.device_id = match.params.id
		this.getFault(1)
	}
	getFault = (val) => {
		let page = val
		let starttime = ''
		let endtime = ''
		const device_id = this.state.device_id
		if(this.state.start != 0){
			starttime = new Date(this.state.start).getTime()
		}else{
			starttime = ''
		}
		if(this.state.end != 0){
			endtime = new Date(this.state.end).getTime()
		}else{
			endtime = ''
		}
		getFault({ num: 10, page, device_id, starttime, endtime}).then((res) => {
			if (res.code == 0) {
				const list = res.data.list
				const totalNumber = res.data.totalNumber
				this.setState({
					page,
					list,
					totalNumber,
				});
			} else {
				this.setState({
					list: [],
				});
			}
		})
	}
	onStart = async(val) => {
		await this.setState({
			start: val,
		});
		this.getFault(1)
	}
	onEnd = async(val) => {
		await this.setState({
			end: val,
		});
		this.getFault(1)
	}
	pageChange = (val) => {
		const page = val
		this.getFault(val)
	}
	goOrder = item => () =>{
		const id = item.id
		this.props.history.push({
			pathname:`/order/${item.id}`,
			state: { id }
		});
	}
	render(){
		const { navs, list, switchIdx } = this.state;
		return(		
			<div className="content tab-hide">
				<Row type="flex" justify="center" align="middle">
					<Col span={12}>
						<DatePicker title="开始时间" size="large" value={this.state.start} onChange={this.onStart} />
					</Col>
					<Col span={12}>
						<DatePicker title="结束时间" size="large" value={this.state.end} onChange={this.onEnd} />
					</Col>
				</Row>
				<div>
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
								list.length ?
								<List.Item className={styles.item} key={index}>
									<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goOrder(item)}>
										<tbody>
											<tr>
												<td className="tr">id ：</td>
												<td className="tl" style={{ width: '95px' }}>{item.id}</td>
												<td className="tl"><FormattedMessage id="state"/> ：</td>
												<td className="tl" style={{ width: '260px' }}><FormattedMessage id={item.state}/></td>
											</tr>
											<tr>
												<td className="tr"><FormattedMessage id="fault code"/> ：</td>
												<td className="tl" style={{ width: '95px' }}><FormattedMessage id={'dE'+item.code}/></td>
												<td className="tl"><FormattedMessage id="creator"/> ：</td>
												<td className="tl" style={{ width: '100px' }}>{item.producer}</td>
											</tr>
											<tr>
												<td className="tr"><FormattedMessage id="start time"/> ：</td>
												<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
											</tr>
										</tbody>
									</table>
								</List.Item>
								:
								<List.Item className={styles.item} key={index}>
									<p><FormattedMessage id="No Information"/></p>
								</List.Item>
							))
						}
					</List>					
				</div>	
			</div>
		);
	}
}