import React, { Component } from 'react';
import { Button, message, Form, Col, Row, List, LocaleProvider } from 'antd';
import { connect } from 'dva';
import { Modal, } from 'antd-mobile';
import { readCompany } from '../../services/api';
import styles from './Group.less';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';

const alert = Modal.alert;
@connect(({ user }) => ({
	currentUser: user.currentUser,
}))

export default class extends Component {
	state = {
		language:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getGroup()
	}
	getGroup = () =>{
		const { currentUser } = this.props;
		const username = currentUser.username;
		readCompany({ username, nums:10, page:1 }).then((res)=>{
			if(res.code==0){
				const list = res.data.list.map((item) => {
					return item;
				});
				this.setState({
					list,
				})
			}
		})
	}
	goGroup=(item)=>{
		const id = item.id
		this.props.history.push({
			pathname:`/company/groupinfo/${id}`,
		});
	}
	render() {
		const { language, list } = this.state;
		var la
		if(language=="zh"){
			la = zh;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className={styles.content}>
					<div style={{ backgroundColor: '#fff' }}>
						<List
							className={styles.lis}
							itemLayout="horizontal"
							dataSource={list}
							renderItem={(item,index) => (
								<List.Item onClick={()=>this.goGroup(item)}>
									{
										<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
											<tbody>
												<tr>
													<Col span={24}>
														<Col span={10}>
															<a className={styles.text}><FormattedMessage id="Group Name"/> ：</a>
														</Col>
														<Col span={14}>
															<td className={styles.left}>{item.name}</td>
														</Col>
													</Col>
												</tr>
												<tr>
													<Col span={24}>
														<Col span={10}>
															<a className={styles.text}><FormattedMessage id="Group Number"/> ：</a>
														</Col>
														<Col span={14}>
															<td className={styles.left}>{item.number}</td>
														</Col>
													</Col>
													<Col span={24}>
														<Col span={10}>
															<a className={styles.text}><FormattedMessage id="Group Creator"/>：</a>
														</Col>
														<Col span={14}>
															<td className={styles.left}>{item.leader}</td>
														</Col>
													</Col>
												</tr>
											</tbody>
										</table>
									}
								</List.Item>
							)}
						/>
					</div>
				</div>
			</LocaleProvider>
		);
	}
}
