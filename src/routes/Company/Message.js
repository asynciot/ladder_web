import React, { Component } from 'react';
import { Icon, Spin, Affix, Row, Col, Pagination, } from 'antd';
import { Tabs, Flex, Badge, ListView, List, Button, Modal } from 'antd-mobile';
import classNames from 'classnames';
import styles from './Message.less';
import { NavLink } from 'dva/router';
import moment from 'moment'
import { getMessages, getMessageCount } from '../../services/api';
const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
); 

let page = 1
const NUM = 20
const format = "YY/MM/DD"

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
		const page = val
		this.getMessages(val)
	}
  getMessages = (val) => {
    const { type } = this.props.match.params
    let params = {
      num: NUM,
      page: page++,
    }
    if (type === 'done') {
      params.done = true
    } else if (type === 'unfinished') {
      params.done = false
    }
    getMessages(params).then(res => {
			const totalNumber = res.data.totalNumber
			const page = val
			if(res.data.totalNumber !=0){
				const page = 1
				this.setState({
					page,
				});
			}
      const { messages } = this.state
			
      const total = res.data.totalPage
      this.setState({
        total,
        messages: messages.concat(res.data.list),
				page,
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
  render() {
    const { type } = this.props.match.params
    const { messages, currMessage, all, done, unread, } = this.state
    const extra = (isSettled = false) => (
      isSettled ? 
      <span style={{color: 'green'}}>已查看</span> :
      <span style={{color: 'red'}}>点击查看</span>
    )
    return (
      <div className="content">
        <div style={{ backgroundColor: '#fff' }}>
          <Flex>
            <Flex.Item>
              <PlaceHolder><NavLink activeClassName={styles[`active-all`]} to={`/company/message/all`}>全部 {all}</NavLink></PlaceHolder>
            </Flex.Item>
            <Flex.Item>
              <PlaceHolder><NavLink activeClassName={styles[`active-done`]} to={`/company/message/done`}>已查看 {done}</NavLink></PlaceHolder>
            </Flex.Item>
            <Flex.Item>
              <PlaceHolder><NavLink activeClassName={styles[`active-unfinished`]} to={`/company/message/unfinished`}>未查看 {unread}</NavLink></PlaceHolder>
            </Flex.Item>
          </Flex>
					<Row className={styles.page}>
						<Col span={6}>
						</Col>
						<Col span={18} >
							<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
						</Col>
					</Row>
          {
            messages.length ? (
              <div>
                <List className="my-list">
                  {
                    messages.map((message) => (
                      <List.Item
                        key={message.id}
                        extra={extra(message.isSettled)}
                        onClick={this.showModal(message)}
                      >
                        <div>时间: {moment(message.createTime).format(format)}</div>
                        <div>名称: {message.title}</div>
                        <div>内容: {message.content}</div>
                      </List.Item>
                    ))
                  }
                </List>
                {
                  this.state.total > page && (
                    <div className={styles.loading}>
                      <Button onClick={this.getMessages} loading={this.state.isLoading}>加载更多</Button>
                    </div>
                  )
                }
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: 8, color: '#ccc'}}>暂无消息</div>
            )
          }
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
            <div>时间: {moment(currMessage.createTime).format(format)}</div>
            <div>名称: {currMessage.title}</div>
            <div>内容: {currMessage.content}</div>
          </div>
        </Modal>
      </div>
    );
  }
}
