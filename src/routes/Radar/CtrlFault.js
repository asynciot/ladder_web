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
import styles from './CtrlFault.less';
import ReactEcharts from 'echarts-for-react';
import {getEvent, getFault} from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh');
var device_id = 0;
const faultCode = {
	'1': '过流',
	'2': '母线过压',
	'3': '母线欠压',
	'4': '输入缺相',
	'5': '输出缺相',
	'6': '输出过力矩',
	'7': '编码器故障',
	'8': '模块过热',
	'9': '运行接触器故障',
	'10': '抱闸接触器故障',
	'11': '封星继电器故障',
	'12': '抱闸开关故障',
	'13': '运行中安全回路断开',
	'14': '运行中门锁断开',
	'15': '门锁短接故障',
	'16': '层站召唤通讯故障',
	'17': '轿厢通讯故障',
	'18': '并联通讯故障',
	'19': '开门故障',
	'20': '关门故障',
	'21': '开关门到位故障',
	'22': '平层信号异常',
	'23': '终端减速开关故障',
	'24': '下限位信号异常',
	'25': '上限位信号异常',
	'26': '打滑故障',
	'27': '电梯速度异常',
	'28': '电机反转故障',
	'31': '停车速度检测',
	'33': '马达过热故障',
	'34': '制动力严重不足',
	'35': '制动力不足警告',
	'36': 'UCMP故障',
	'37': 'IPM故障',
	'38': '再平层开关异常',
	'40': '驱动保护故障',
	'41': '平层位置异常',
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
	}
	componentWillMount() {
		const {location, currentUser } = this.props;
		const match = pathToRegexp('/ctrl/:id/fault').exec(location.pathname);
		device_id = match[1];
		this.getFault(1)
	}
	getFault = (val) => {
		let page = val
		let starttime = ''
		let endtime = ''
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
		getFault({ num: 10, page, device_id, starttime, endtime, state:'treated'}).then((res) => {
			if (res.code == 0) {
				const list = res.data.list.map((item,index) => {
					item.code = res.data.list[index].code.toString(16)
					return item;
				})
				const totalNumber = res.data.totalNumber
				this.setState({
					page,
					list,
					totalNumber,
				});
			}else{
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
	goOrder = item => () =>{
		const id = item.id
		this.props.history.push({
			pathname:`/company/order/${item.id}`,
			state: { id }
		});
	}
	pageChange = (val) => {
		const page = val
		this.getFault(val)
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
						<List>
							{
								list.map((item, index) => (
									list.length ?
									<List.Item className={styles.item} key={index} >
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0" onClick={this.goOrder(item)}>
											{
												(la=="zh")?
												<tbody>
													<tr>
														<td className="tr">id ：</td>
														<td className="tl" style={{ width: '100px' }}>{item.id}</td>
														<td className="tl"><FormattedMessage id="state"/> ：</td>
														<td className="tl" style={{ width: '260px' }}><FormattedMessage id={item.state}/></td>
													</tr>
													<tr>
														<td className="tr"><FormattedMessage id="fault code"/> ：</td>
														<td className="tl" style={{ width: '100px' }}><FormattedMessage id={'E'+item.code}/></td>
														<td className="tl"><FormattedMessage id="Creator"/> ：</td>
														<td className="tl" style={{ width: '260px' }}>{item.producer}</td>
													</tr>
													<tr>
														<td className="tr"><FormattedMessage id="start time"/> ：</td>
														<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
													</tr>
												</tbody>
												:
												<tbody>
													<tr>
														<td className="tr">id ：</td>
														<td className="tl" style={{ width: '100px' }}>{item.id}</td>
														<td className="tl"><FormattedMessage id="state"/> ：</td>
														<td className="tl" style={{ width: '260px' }}><FormattedMessage id={item.state}/></td>
													</tr>
													<tr>
														<td className="tr"><FormattedMessage id="fault code"/> ：</td>
														<td className="tl" style={{ width: '260px' }}><FormattedMessage id={'E'+item.code}/></td>
													</tr>
													<tr>
														<td className="tr"><FormattedMessage id="Creator"/> ：</td>
														<td className="tl" style={{ width: '260px' }}>{item.producer}</td>
													</tr>
													<tr>
														<td className="tr"><FormattedMessage id="start time"/> ：</td>
														<td className="tl">{moment(parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}</td>
													</tr>
												</tbody>
											}
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
			</LocaleProvider>
		);
	}
}
