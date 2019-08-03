import React, { Component } from 'react';
import { Row, Col, Avatar, Icon, Button, Upload, message,  } from 'antd';
import { ImagePicker } from 'antd-mobile';
import { connect } from 'dva';
import { Modal, Accordion, List, Badge, Grid } from 'antd-mobile';
import styles from './Index.less';
import { getFile, } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import headimg from '../../assets/icon/head.png'

@connect(({ user, company }) => ({
	currentUser: user.currentUser,
	company,
}))

export default class Company extends Component {
		logout = () => {
		this.props.dispatch({ type: 'login/logout' });
		};
		toFollow = () => {
		const { history } = this.props;
		history.push({
			pathname: '/company/ladder/all',
		});
		}
		goDetail = (link) => {
		const { history } = this.props;
		if (link.indexOf('/') === 0) {
			history.push(link);
		} else {
			history.push(`/company/${link}`);
		}
		};
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
		return (
			<section className={styles.aui_flexView}>
				<section className={styles.aui_scrollView}>
					<div className={styles.aui_head_body}>
						<i className={`${styles.icon} ${styles.icon_news}`} onClick={() => this.goDetail('message')}></i>
						<img src={headimg } />
						<div className={styles.aui_user_item}>
							<div className={styles.aui_mine_user}>
								<Avatar
									className={styles.aui_mine_user}
									size="large"
									src={'http://server.asynciot.com/getfile?filePath='+currentUser.portrait}
								/>
								<input accept="image/jpg" className={styles.input} type="file" name='pic' onChange={this.uploadPicture} />
							</div>
							<div className={styles.aui_mine_name}>
								<h2>{currentUser.nickname}</h2><i className={`${styles.icon} ${styles.icon_edit}`} onClick={() => this.goDetail('revise')}></i>
							</div>
						</div>
					</div>
					<div className={styles.aui_palace}>
						<a className={styles.aui_palace_grid} onClick={() => this.toFollow()}>
							<div className={styles.aui_palace_grid_icon}>
								<img src={require('../../assets/icon/Elevator.png')} />
							</div>
							<div className={styles.aui_palace_grid_text}>
								<h2><FormattedMessage id="Manage Elevator"/></h2>
							</div>
						</a>
						<a className={styles.aui_palace_grid} onClick={() => this.goDetail('message')}>
							<div className={styles.aui_palace_grid_icon}>
								<img src={require('../../assets/icon/message.png')} />
							</div>
							<div className={styles.aui_palace_grid_text}>
								<h2><FormattedMessage id="Read Notice"/></h2>
							</div>
						</a>
						<a className={styles.aui_palace_grid} onClick={() => this.goDetail('work-order')}>
							<div className={styles.aui_palace_grid_icon}>
								<img src={require('../../assets/icon/workorder.png')} />
							</div>
							<div className={styles.aui_palace_grid_text}>
								<h2><FormattedMessage id="Treat Order"/></h2>
							</div>
						</a>
						<a className={styles.aui_palace_grid} onClick={() => this.goDetail('follow/new')}>
							<div className={styles.aui_palace_grid_icon}>
								<img src={require('../../assets/icon/follow.png')} />
							</div>
							<div className={styles.aui_palace_grid_text}>
								<h2><FormattedMessage id="Follow Device"/></h2>
							</div>
						</a>
						<a className={styles.aui_palace_grid} onClick={() => this.goDetail('/tech/manual')}>
							<div className={styles.aui_palace_grid_icon}>
								<img src={require('../../assets/icon/explain.png')} />
							</div>
							<div className={styles.aui_palace_grid_text}>
								<h2><FormattedMessage id="Instructions"/></h2>
							</div>
						</a>
						<a className={styles.aui_palace_grid} onClick={() => this.goDetail('/company/add')}>
							<div className={styles.aui_palace_grid_icon}>
								<img src={require('../../assets/icon/group.png')} />
							</div>
							<div className={styles.aui_palace_grid_text}>
								<h2><FormattedMessage id="Add Group"/></h2>
							</div>
						</a>
					</div>
					<div className={styles.aui_landlady}>
						<h2 onClick={() => this.logout()}><FormattedMessage id="Logout"/></h2>
					</div>
				</section>
			</section>
		);
	}
}
