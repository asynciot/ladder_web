import React, { Component } from 'react';
import { Icon, Spin, Affix, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Badge, ListView, List, Button, Modal } from 'antd-mobile';
import classNames from 'classnames';
import styles from './Message.less';
import { NavLink } from 'dva/router';
import moment from 'moment'
import { getMessages, getMessageCount, deleteMessage } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
const PlaceHolder = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
); 

let page = 1
const format = "YY/MM/DD"
const alert = Modal.alert;
const tabs = [
	{ title: (window.localStorage.getItem("language")=='zh')?'全部':"All", type: '' },
	{ title: (window.localStorage.getItem("language")=='zh')?'已查看':"Read", type: 'done' },
	{ title: (window.localStorage.getItem("language")=='zh')?'未查看':"Unread", type: 'unfinished' },
];
const Delete = ({ className = '', ...restProps }) => (
	<div className={`${className} ${styles['list-btn']}`}>
		<span style={{ display: 'block', marginBottom: 8 }} onClick={restProps.delete ? restProps.delete:''}>
			<Icon className={`${styles.delete} ${styles.icon}`} type="close" />
			<em><FormattedMessage id="edit"/></em>
		</span>
	</div>
);
function closest(el, selector) {
	const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
	while (el) {
		if (matchesSelector.call(el, selector)) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
}

export default class extends Component {
	state = {
		messages: [],
		isLoading: false,
		modal: false,
		currMessage: {},
		all:0,
		done:0,
		unread:0,
		total: 0,
	}
	componentDidMount() {
		page = 1
		this.getMessages(0)
		this.getMessageCount()
	}
	componentWillReceiveProps(nextProps) {
		const locationChanged = nextProps.location !== this.props.location
		if (locationChanged) {
			page = 1
			this.setState({
				messages: []
			})
			setTimeout(this.getMessages, 100);
		}
	}
	showModal = (message) => (e) => {
		e.preventDefault(); // 修复 Android 上点击穿透
		message.isSettled = true
		const { done, unread} = this.state
		this.setState({
			modal: true,
			currMessage: message,
			done: unread != 0 ? (+done + 1) : done,
			unread: unread != 0 ? (+unread - 1) : 0,
		});
		getMessages({ id: message.id })
	}
	onClose =  () => {
		this.setState({
			modal: false,
		});
	}
	onWrapTouchStart = (e) => {
		// fix touch to scroll background page on iOS
		if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
			return;
		}
		const pNode = closest(e.target, '.am-modal-content');
		if (!pNode) {
			e.preventDefault();
		}
	}
	pageChange = (val) => {
		const { device_type,} =this.state
		this.getDevice(device_type,val,switchIdx)
		const page = val
		this.getMessages(val)
	}
	getMessages = (val,type) => {
		let params = {
			num: 10,
			page: val,
		}
		if (type === 'done') {
			params.done = true
		} else if (type === 'unfinished') {
			params.done = false
		}
		getMessages(params).then(res => {
			const totalNumber = res.data.totalNumber
			if(res.data.totalNumber !=0){
				this.setState({
					page:1,
				});
			}else{
				this.setState({
					page:0,
				});
			}
			const { messages } = this.state
			const total = res.data.totalPage
			this.setState({
				total,
				messages: res.data.list,
				totalNumber,
			});
		})
	}
	getMessageCount = () => {
		getMessageCount().then(res => {
			this.setState({
				...res.data
			});
		})
	}
	delete = (e, detail) => {
		const id = detail.id
		alert('提示', '是否确定', [
			{ text: '取消', style: 'default' },
			{ text: '确认',
				onPress: () => {
					deleteMessage({id}).then(() => {
						this.getMessages(0)
					});
				},
			},
		]);
	}
	render() {
		const { type } = this.props.match.params
		const { messages, currMessage, all, done, unread, } = this.state
		const extra = (isSettled = false) => (
			isSettled ? 
			<span style={{color: 'green'}}><FormattedMessage id="have read"/></span> :
			<span style={{color: 'red'}}><FormattedMessage id="to read"/></span>
		)
		return (
			<div className="content">
				<div style={{ backgroundColor: '#fff' }}>
					<Tabs
						tabs={tabs}
						initialPage={this.state.type}
						tabBarActiveTextColor="#1E90FF"
						tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
						onChange={(tab, index) => { this.getMessages(1,tab.type); }}
					>
						<List className="my-list">
							<Row className={styles.page}>
								<Col span={6}>
								</Col>
								<Col span={18} >
									<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
								</Col>
							</Row>
							{
								messages.map((message) => (
									<List.Item
										key={message.id}
										extra={<Delete delete={(event) => { this.delete(event,message); }} />}
									>
										<div onClick={this.showModal(message)} >
											<div><FormattedMessage id="Create Time"/>: {moment(message.createTime).format(format)}</div>
											<div><FormattedMessage id="title"/>: {message.title}</div>
											<div><FormattedMessage id="Content"/>: {message.content}</div>
										</div>
									</List.Item>
								))
							}
						</List>
					</Tabs>	
				</div>
				<Modal
					visible={this.state.modal}
					transparent
					maskClosable={true}
					onClose={this.onClose}
					title="消息"
					wrapProps={{ onTouchStart: this.onWrapTouchStart }}
					footer={[{ text: '确定', onPress: () => { this.onClose(); } }]}
				>
					<div style={{ height: 100, overflow: 'scroll' }}>
						<div><FormattedMessage id="Create Time"/>: {moment(currMessage.createTime).format(format)}</div>
						<div><FormattedMessage id="title"/>: {currMessage.title}</div>
						<div><FormattedMessage id="Content"/>: {currMessage.content}</div>
					</div>
				</Modal>
			</div>
		);
	}
}
