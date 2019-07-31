import React, { Component } from 'react';
import { Row, Col, Avatar, Icon, Button, Upload, message,  } from 'antd';
import { ImagePicker } from 'antd-mobile';
import { connect } from 'dva';
import { Modal, Accordion, List, Badge, Grid } from 'antd-mobile';
import styles from './Index.less';
import { getFile, } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';

var avatar = '';
const { alert } = Modal;
const typeName ={
	'ctrl':'ctrl',
	'door':'door',
}
@connect(({ user, company }) => ({
	currentUser: user.currentUser,
	company,
}))
export default class Company extends Component {
	state = {
		list: [],
		loading: false,
		la:window.localStorage.getItem("language"),
	}
	componentDidMount() {
		this.reader = new FileReader();
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
	toFollow = () => {
		const { history } = this.props;
		history.push({
			pathname: '/company/ladder/all',
		});
	}
	uploadPicture = (e) => {
		var files = e.target.files[0];
		if(files.type != "image/jpeg"&&files.type != "image/jpg"){
			if(this.state.la=="zh"){
				alert("只支持JPG格式！");
			}else{
				alert("Only JPG!");
			}
		}
		var formdata = new FormData();
		formdata.append("file",files);
		fetch('http://server.asynciot.com/account/portrait', {
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
			},
			body: formdata
		}).then((res)=>{
			if(res.code ==0){
				if(this.state.la=="zh"){
					alert("成功");
				}else{
					alert("Success");
				}
			}
		})
	};
	render() {
		const { company: { group, unread }, currentUser } = this.props;
		const imageUrl = this.state.imageUrl;
		return (
			<div className="content">
				<div className={styles.header}>
					<div className={styles.upload}>
						<Avatar
							className={styles.avatar}
							size="large"
							src={'http://server.asynciot.com/getfile?filePath='+currentUser.portrait}
						/>
						<input accept="image/jpg" className={styles.input} type="file" name='pic' onChange={this.uploadPicture} />
					</div>
					<p onClick={() => this.goDetail('revise')} className={styles.nickname}>{currentUser.nickname}<Icon className={styles.edit} type="form" /></p>
				</div>
				<div className={styles.back}>
					<Row>
						<Col span={6} onClick={() => this.toFollow()}>
							<img className={styles.icon}  src={require('../../assets/icon/电梯.png')} />
							<a className={styles.icon}><FormattedMessage id="Manage Elevator"/></a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('message')}>
							<img className={styles.icon}  src={require('../../assets/icon/信息.png')} />
							<a className={styles.icon}><FormattedMessage id="Read Notice"/></a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('work-order')}>
							<img className={styles.icon}  src={require('../../assets/icon/工单.png')} />
							<a className={styles.icon}><FormattedMessage id="Treat Order"/></a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('follow/new')}>
							<img className={styles.icon}  src={require('../../assets/icon/关注.png')} />
							<a className={styles.icon}><FormattedMessage id="Follow Device"/></a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('/tech/manual')}>
							<img className={styles.icon}  src={require('../../assets/icon/文档.png')} />
							<a className={styles.icon}><FormattedMessage id="Instructions"/></a>
						</Col>
						<Col span={6} onClick={() => this.goDetail('/company/add')}>
							<img className={styles.icon}  src={require('../../assets/icon/群组.png')} />
							<a className={styles.icon}><FormattedMessage id="Add Group"/></a>
						</Col>
					</Row>
				</div>
				<Col xs={{ span: 24 }} sm={{ span: 18 }} md={{ span: 16 }} className={styles.btn1}>
					<Button className={styles.Button} onClick={this.logout} type="primary" style={{ width: '100%' }} ><FormattedMessage id="Logout"/></Button>
				</Col>
			</div>
		);
	}
}
