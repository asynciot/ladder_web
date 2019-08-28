import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Pagination, LocaleProvider, List, } from 'antd';
import { Picker, Tabs, Modal } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './Event.less';
import ReactEcharts from 'echarts-for-react';
import {getEvent} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale("zh");
export default class DoorHistory extends Component {
	state = {
		totalList: [],
		list: [],
		switchIdx: 0,
		type: 0,
		src: '',
		code: false,
		totalNumber:0,
		page:0,
	}
	componentWillMount() {
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
		getEvent({ device_id, num: 10, page, starttime, endtime }).then((res) => {
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
					totalNumber:0,
					page:0,
				});
			}
		});
	}
	pageChange = (val) => {
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
							<DatePicker size="large" onChange={this.onStart}/>
						</Col>
						<Col span={12}>
							<DatePicker size="large" onChange={this.onEnd}/>
						</Col>
					</Row>
					<div style={{ backgroundColor: '#fff' }}>
						<div>
							<List
								className={styles.lis}
								dataSource={list}
								renderItem={(item,index) => (
									<List.Item className={styles.item} key={index} onClick={() => this.goHistory(item)}>
										<table border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<a className={styles.text}><FormattedMessage id="Event State"/></a>
													<td className="tl" style={{ width: '260px' }}>{<FormattedMessage id={item.state}/>}</td>
												</tr>
												<tr>
													<a className={styles.text}><FormattedMessage id="start time"/> ：</a>
													<td className="tl">{moment(item.time).format('YYYY-MM-DD HH:mm:ss') }</td>
												</tr>
												<tr>
													<a className={styles.text}><FormattedMessage id="end time"/> ：</a>
													<td className="tl">{item.endtime? moment(item.endtime).format('YYYY-MM-DD HH:mm:ss'):<FormattedMessage id="None"/>}</td>
												</tr>
											</tbody>
										</table>
									</List.Item>
								)}
							/>
							<Col span={24} className={styles.center2}>
								<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
							</Col>
						</div>
					</div>
				</div>
			</LocaleProvider>
		);
	}
}
