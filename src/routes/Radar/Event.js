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
import styles from './Event.less';
import ReactEcharts from 'echarts-for-react';
import {getEvent} from '../../services/api';

export default class DoorHistory extends Component {
	state = {
		totalList: [],
		list: [],
		switchIdx: 0,
		type: 0,
		src: '',
		code: false,
		totalNumber:0,
	}
	componentWillMount() {
		this.getEvent(1)
	}
	onStart = async(val) => {
		await this.setState({
			start: val,
		});
		window.localStorage.setItem('starttime',moment(this.state.start).format('YYYY-MM-DD'))
		this.getEvent(1)
	}
	onEnd = async(val) => {
		await this.setState({
			end: val,
		});
		window.localStorage.setItem('endtime',moment(this.state.end).format('YYYY-MM-DD'))
		this.getEvent(1)
	}
	goHistory = (item) => {
		const { match } = this.props;
		const device_type = match.params.type
		const device_id = match.params.id
		this.props.history.push(`/${device_type}/${device_id}/history/${item.id}`);
	}
	getEvent = (val) => {
		const { match } = this.props;
		const device_id = match.params.id
		const starttime = window.localStorage.getItem('starttime')
		const endtime = window.localStorage.getItem('endtime')
		const page = val
		getEvent({ device_id, num: 10, page, starttime, endtime, }).then((res) => {
			if (res.code === 0) {
				const list = res.data.list
				const totalNumber = res.data.totalNumber
				this.setState({
					list,
					totalNumber,
					page,
				});
			} else {
				this.setState({
					list: [],
				});
			}
		});		
	}
	pageChange = (val) => {
		const page = val
		this.getEvent(val)
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
								<List.Item className={styles.item} key={index} onClick={() => this.goHistory(item)}>
									<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
										<tbody>
											<tr>
												<td className="tr">id ：</td>
												<td className="tl" style={{ width: '260px' }}>{item.id}</td>
											</tr>
											<tr>
												<td className="tr">开始时间 ：</td>
												<td className="tl">{moment(item.time).format('YYYY-MM-DD HH:mm:ss') }</td>
											</tr>
											<tr>
												<td className="tr">结束时间 ：</td>
												<td className="tl">{moment(item.time+item.interval*item["length"]).format('YYYY-MM-DD HH:mm:ss')}</td>					
											</tr>
										</tbody>
									</table>
								</List.Item>
							))
						}
					</List>					
				</div>	
			</div>
		);
	}
}