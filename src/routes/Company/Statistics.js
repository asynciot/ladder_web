import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Input, Form } from 'antd';
import { Picker, List, Tabs, Switch, Calendar, InputItem } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import styles from './Statistics.less';
import MobileNav from '../../components/MobileNav';
import { getStatistic } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const randomHexColor = () => { // 随机生成十六进制颜色
	let hex = Math.floor(Math.random() * 11777216).toString(16); // 生成ffffff以内16进制数
	while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
		hex = `0${hex}`;
	}
	return `#${hex}`; // 返回‘#'开头16进制颜色
};

const textStyle = {
	fontSize: 11,
};
let date = [];
const style = {
	textStyle: {
		color: '#1E90FF',
		fontWeight: 'normal',
		fontSize: 13,
		align: 'center',
		width: '100%',
	},
	axisLine: {
		lineStyle: {
			color: '#666',
		},
	},
	splitLine: {
		show: false,
	},
};
const errorOri = {
	textStyle,
	title: {
		text: '错误统计',
		textStyle: style.textStyle,
	},
	tooltip: {
		trigger: 'axis',
	},
	grid: {
		left: 26,
		bottom: 30,
		top: 48,
		right: 12,
	},
	xAxis: [{
			axisLabel: {
				fontSize: 9,
				margin: 3,
				interval:2,
			},
			data: date
		},
	],
	yAxis: [{
			splitLine: style.splitLine,
			minInterval: 1,
			axisLabel: {
				fontSize: 9,
				margin: 6,       
			},
		},
	],
	series: [
		{
			name: '数量',
			type: 'bar',
			barWidth: 8,
			color: randomHexColor(),
			data: [],
		},
	],
	animation: false,
};
const alertOri = {
	textStyle,
	title: {
		text: '警报统计',
		textStyle: style.textStyle,
	},
	tooltip: {
		trigger: 'axis',
		formatter: '{b} <br/> {a} : {c}',
	},
	grid: {
		left: 26,
		bottom: 30,
		top: 48,
		right:12,
	},
	xAxis: [{
			axisLabel: {
				fontSize: 9,
				margin: 3,
				interval:2,
			},
			axisLine: style.axisLine,
			data: date
		},
	],
	yAxis: [
		{
			scale: false,
			nameGap: 3,
			splitLine: style.splitLine,
			minInterval: 1,
			axisLabel: {
				fontSize: 9,
				margin: 6,
			},
			axisLine: style.axisLine,

		},
	],
	series: [
		{
			name: '数量',
			type: 'bar',
			barWidth: 8,
			color: randomHexColor(),
			data: [],
		},
	],
	animation: false,
};
const timeList = [{
	label: '1天',
	value: 1,
},{
	label: '7天',
	value: 7,
}, {
	label: '30天',
	value: 30,
},];
@connect(({ tech,company }) => ({
	tech,
	currentCompany: company.currentCompany,
}))
@Form.create()
export default class History extends Component {
	state = {
		navs: [{
			label: '全部',
			link: '/company/statistics/all',
		}, {
			label: '控制器',
			link: '/company/statistics/door',
		}, {
			label: '控制柜',
			link: '/company/statistics/ctrl',
		}],
		switch: false,
		pick: [1],
		history: false,
		view: 0,
		wave: [],
		stop: true,
		statistics: {
			error: 0,
			alert: 0,
			door: 0,
			ctrl: 0,
		},
		errorOpt: Object.assign({}, errorOri),
		alertOpt: Object.assign({}, alertOri),
	}
	componentDidMount() {
		const type = this.props.match.params.id;

		this.getStatisticData(type);
	}
	componentWillReceiveProps(nextProps) {
		const locationChanged = nextProps.location !== this.props.location
		if (locationChanged) {
			this.getStatisticData(nextProps.match.params.id);
		}
	}
	getStatisticData(type) {
		const { pick, statistics, errorOpt, alertOpt } = this.state;
		const query = { days: pick[0], detail: false };
		if (type === 'door') {
			query.type = 0;
		}
		if (type === 'ctrl') {
			query.type = 1;
		}
		getStatistic(query).then(res => {
			if (res.code === 0) {
				statistics.door = res.data.count[0] || 0;
				statistics.ctrl = res.data.count[1] || 0;
				date = Object.keys(res.data.list);
				date.length == 0 ? date = [moment(new Date()).format("YYYYMMDD")] : '';
				let error = 0, alert = 0, errorList = [], alertList = [];
				Object.values(res.data.list).forEach(item => {
					const door = item[0] || { 0:0, 1:0 };
					const ctrl = item[1] || { 0:0, 1:0 };
					alert += (ctrl[0]||0 + door[0]||0);
					error += (ctrl[1]||0 + door[1]||0);
					alertList.push((ctrl[0]||0 + door[0]||0));
					errorList.push((ctrl[1]||0 + door[1]||0));
				});
				errorList.length == 0 ? errorList=[0]:'';
				alertList.length == 0 ? alertList=[0]:'';
				errorOpt.xAxis[0].data = date;
				errorOpt.series[0].data = errorList;
				alertOpt.xAxis[0].data = date;
				alertOpt.series[0].data = alertList;
				statistics.error = error;
				statistics.alert = alert;
				this.setState({
					statistics,
					alertOpt,
					errorOpt,
				});
			}
		})
	}
	onSelect(e) {
		const { dispatch } = this.props;
		dispatch({
			type: 'tech/query',
			payload: {
				type: e[0],
			},
		});
		this.setState({
			model: e,
			name: '',
		});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const { dispatch } = this.props;
		dispatch({
			type: 'tech/query',
			payload: {
				name: this.state.name,
			},
		});
	}
	input = (val) => {
		this.setState({
			name: val,
		});
	}
	onChange = (val) => {
		this.setState({
			pick: val,
		}, ()=> {
			this.getStatisticData(this.props.match.params.id);
		})
	}
	showData = () => {
		const { history } = this.props;
		history.push('/company/data/details');
	}
	render() {
		const { isMobile, match } = this.props;   
		const { statistics } = this.state;
		const type = match.params.id;
		
		return (
			<div className="content">
				<MobileNav
					key="nav"
					active={type}
					navs={this.state.navs}
				/>
				<div className={styles.content}>
					<div className={styles.date}>
						{
						isMobile ? (
							<div className={styles.tab1}>
								<List style={{ backgroundColor: 'white' }} className="picker-list">
									<Picker
										title="时长"
										cols={1}
										data={timeList}
										value={this.state.pick}
										onOk={v => this.onChange(v)}
									>
										<List.Item arrow="horizontal"><FormattedMessage id="Duration"/></List.Item>
									</Picker>
								</List>
								<Row type="flex" justify="space-around" align="middle" style={{ margin: '10px 0' }}>
									<Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }}>
										<Button onClick={this.handleSubmit} type="primary" style={{ width: '100%' }} ><FormattedMessage id="query"/></Button>
									</Col>
								</Row>
							</div>
							) : (
								<Form onSubmit={this.handleSubmit}>
									<Row type="flex" justify="space-around" align="middle">
										<Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 18 }}>
											<FormItem label="初始日期：" {...formItemLayout}>
												{getFieldDecorator('username', {
													rules: [{
														message: '请输入初始日期！',
													}],
												})(
													<Input
														placeholder="初始日期"
													/>
												)}
											</FormItem>
										</Col>
										<Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 18 }}>
											<FormItem label="结束日期：" {...formItemLayout}>
												{getFieldDecorator('username', {
													rules: [{
														message: '请输入结束日期！',
													}],
												})(
													<Input
														placeholder="结束日期"
													/>
												)}
											</FormItem>
										</Col>
										<Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 16 }}>
											<FormItem className="tc">
												<Button type="primary" htmlType="submit" ><FormattedMessage id="query"/></Button>
											</FormItem>
										</Col>
									</Row>
								</Form>
							)
					}             
					</div>        
					<div>
						<Row
							type="flex"
							justify="space-around"
							align="middle"
							className={styles.ladder}
						>
							<Col xs={{span: 24,}} className={styles.door} md={{span: 18,}}>
								<section>
									<p ><FormattedMessage id="Fault amount"/> ：{statistics.error}</p>
									<p className={styles.new}><FormattedMessage id="Alert amount"/> ：{statistics.alert}</p>
								</section>
								<section>
									{
										(type === 'all' || type === 'door') && (
											<p ><FormattedMessage id="Door"/> ：{statistics.door}</p>
										)
									}
									{
									(type === 'all' || type === 'ctrl') && (
										<p className={styles.new}><FormattedMessage id="Ctrl"/> ：{statistics.ctrl}</p>
									)
								}
								</section>
								
							</Col>
						</Row>              
					</div>
					<div className={styles.tab}>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>	            
							<Col xs={{ span: 24 }} md={{ span: 36 }}>
									<ReactEcharts
										className={styles.chart}
										option={this.state.alertOpt}
										style={{ height: 180, paddingBottom: 0,  }}
									/>	              
								{/* <div className={styles.tips}>
									<Link to="/company/data/details" className={styles.name}>详情</Link>
								</div> */}
							</Col>	            	            
						</Row>
						<Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
							<Col xs={{ span: 24 }} md={{ span: 36 }}>	              
									<ReactEcharts
										className={styles.chart}
										option={this.state.errorOpt}
										style={{ height: 180, paddingBottom: 0  }}
									/>
									{/* <div className={styles.tips}>
										<Link to="/company/data/details" className={styles.name}>详情</Link>
									</div> */}
							</Col>
						</Row> 
					</div>
				</div>
			</div>
		);
	}
}
