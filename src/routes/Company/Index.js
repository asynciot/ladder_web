import React, { Component } from 'react';
import { Row, Col, Avatar, Icon, Button, } from 'antd';
import { connect } from 'dva';
import { Modal, Accordion, List, Badge, Grid } from 'antd-mobile';
import styles from './Index.less';

const { alert } = Modal;

@connect(({ user, company }) => ({
  currentUser: user.currentUser,
  company,
}))

export default class Company extends Component {
  state = {
    list: [],
  }
  componentDidMount() {
  }
  companyId = localStorage.getItem('companyId');
  joincompanyId = localStorage.getItem('joinCompanyId');

  showProfile = () => {
    const { history } = this.props;
    history.push('/company/profile');

	};
	showMessage = () => {
		const { history } = this.props;
    history.push('/message');
	};
	showData = () => {
		const { history } = this.props;
    history.push('/company/data/statistics');
  };
	showDevice = () => {
		const { history } = this.props;
    history.push('/company/device');
  };
	
  logout = () => {
    this.props.dispatch({ type: 'login/logout' });
  };
  goDetail = (link) => {
    const { history } = this.props;
    if (link.indexOf('/') === 0) {
      history.push(link);
    } else {
      history.push(`/company/${link}`);
    }
  };
  render() {
    const { company: { group, unread }, currentUser } = this.props;		
    return (
      <div className="content">
        <div className={styles.header}>
          <Avatar
            className={styles.avatar}
            size="large"
            src={currentUser.portrait}
          />
          <p onClick={() => this.goDetail('revise')} className={styles.nickname}>{currentUser.nickname}<Icon className={styles.edit} type="form" /></p>
        </div>
				<div className={styles.back}>
					<Row>
						<Col span={6} onClick={() => this.goDetail('/company/followdevice')}>
							<img className={styles.icon}  src={require('../../assets/icon/电梯.png')} />
							<a className={styles.icon}>设备管理</a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('message/all')}>
							<img className={styles.icon}  src={require('../../assets/icon/信息.png')} />
							<a className={styles.icon}>消息处理</a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('work-order')}>
							<img className={styles.icon}  src={require('../../assets/icon/工单.png')} />
							<a className={styles.icon}>工单处理</a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('follow/new')}>
							<img className={styles.icon}  src={require('../../assets/icon/关注.png')} />
							<a className={styles.icon}>关注设备</a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('/tech/manual')}>
							<img className={styles.icon}  src={require('../../assets/icon/文档.png')} />
							<a className={styles.icon}>技术文档</a>
						</Col>
					</Row>
				</div>
        {/*<List>
          <List.Item arrow="horizontal" onClick={() => this.goDetail('/company/followdevice')}>设备管理</List.Item>
          <List.Item arrow="horizontal" onClick={() => this.goDetail('message/all')} >消息处理</List.Item>
          <List.Item arrow="horizontal" onClick={() => this.goDetail('work-order')} >工单处理</List.Item>
          <List.Item arrow="horizontal" onClick={() => this.goDetail('follow/new')} >关注设备</List.Item>
          <List.Item arrow="horizontal" onClick={() => this.goDetail('statistics/all')} >设备统计</List.Item>*/}
          {/*<List.Item arrow="horizontal" onClick={() => this.goDetail('/test')} >测试</List.Item>
					<List.Item arrow="horizontal" onClick={() => this.goDetail('/tech/manual')} >技术文档</List.Item>
				</List>*/}
				<Col xs={{ span: 24 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn}>
					<Button onClick={this.logout} type="primary" style={{ width: '100%' }} >登出</Button>
				</Col>
        {/* <Row type="flex" justify="space-around" align="middle">
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
            {
              this.companyId && (
                <Accordion className="accordion">
                  {
                    group.map(data => (
                      <Accordion.Panel className={styles.panel} header={`公司名：${data.label}，ID:${data.id}`} key={data.label}>
                        <List key={data.label}>
                          {
                            data.children.map((item, index) =>
                              <List.Item key={`${item.label}`}>{item.label}</List.Item>
                            )
                          }
                        </List>
                      </Accordion.Panel>
                    ))
                  }
                </Accordion>
              )
            }
            <List>
              <List.Item arrow="horizontal" onClick={this.showProfile}>我的信息</List.Item>
              <List.Item arrow="horizontal" onClick={this.showMessage} extra={<Badge text={unread} overflowCount={99} />}>消息通知</List.Item>
              <List.Item arrow="horizontal" onClick={this.showData}>数据统计</List.Item>
              <List.Item arrow="horizontal" onClick={this.showDevice}>设备关注</List.Item>
              {
                !this.companyId && (
                  <List.Item arrow="horizontal" onClick={this.showAlert}>公司群</List.Item>
                )
              }              
              
            </List>
          </Col>
        </Row> */}
      </div>
    );
  }
}
