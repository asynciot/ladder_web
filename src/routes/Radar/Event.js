import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Pagination, LocaleProvider } from 'antd';
import { Picker, List, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './Event.less';
import ReactEcharts from 'echarts-for-react';
import {getEvent} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';
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
				const list = res.data.list.map((item)=>{
					if(item.interval!=null){
						item.endtime = item.time+item.interval*item["length"]
						item.state = "Nomal Event"
					}else{
						item.endtime = item.time+20*item["length"]
						item.state = "Realtime"
					}
					return item;
				})
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
		var la
		if(window.localStorage.getItem("language") == "zh" ){
			la = zh
		}else{
			la = en
		}
		return(
			<LocaleProvider locale={la}>
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
						<List className={styles.table}>
							{
								list.map((item, index) => (
									<List.Item className={styles.item} key={index} onClick={() => this.goHistory(item)}>
										<table border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<td className="tr"><FormattedMessage id="Event State"/></td>
													<td className="tl" style={{ width: '260px' }}>{<FormattedMessage id={item.state}/>}</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="start time"/> ：</td>
													<td className="tl">{moment(item.time).format('YYYY-MM-DD HH:mm:ss') }</td>
												</tr>
												<tr>
													<td className="tr"><FormattedMessage id="end time"/> ：</td>
													<td className="tl">{item.endtime? moment(item.endtime).format('YYYY-MM-DD HH:mm:ss'):<FormattedMessage id="None"/>}</td>					
												</tr>
											</tbody>
										</table>
									</List.Item>
								))
							}
						</List>
					</div>
				</div>
			</LocaleProvider>
		);
	}
}