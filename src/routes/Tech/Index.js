import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Select, Input, Pagination, List, LocaleProvider } from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './Index.less';
import MobileNav from '../../components/MobileNav';
import { getDevices, deleteFollowInfo, getOrderCode } from '../../services/api';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';
import { injectIntl, FormattedMessage } from 'react-intl';

@connect(({ tech }) => ({
	tech,
}))
@Form.create()
export default class Tech extends Component {
	state = {
		navs: [
		{
			label: (window.localStorage.getItem("language")=='zh')?'产品说明书':'Description',
			link: '/tech/manual',
		}, {
			label: (window.localStorage.getItem("language")=='zh')?'故障代码查询':'Code Query',
			link: '/tech/code',
		}
		/* {
			label: (window.localStorage.getItem("language")=='zh')?'其他相关资料':'Other Data',
			link: '/tech/other',
		} */
		],
		name: '',
		img: true,
		code:'',
		list:[],
		language:window.localStorage.getItem("language"),
	}
	getData = () => {
		getOrderCode({ code:this.state.code}).then((res) => {
				if (res.code==0) {
					const list = res.list.map((item)=>{
						return item;
					})
					this.setState({
						list,
					})
				}
		})
	}
	onChange = (e) =>{
		let val = e.target.value
		this.setState({
			code:val,
		});
	}
	pageChange = (val) => {
		const { device_type,} =this.state
		this.getData(device_type,val,switchIdx)
	}
	render() {
		const { location } = this.props;
		const { navs, list, switchIdx,language } = this.state;
		const currentPath = pathToRegexp('/tech/:name').exec(location.pathname);
		const active = currentPath[1];
		var la = language;
		if(la == "zh" ){
			la = zh;
		}else{
			la = en;
		}
		return (
			<LocaleProvider locale={la}>
				<div className="content">
					<MobileNav
						active={active}
						key="nav"
						navs={this.state.navs}
					/>
					<div className={styles.content}>
						<Row className={styles.page}>
							<Col span={17} style={{ margin:'5px' }}>
								<Input
									placeholder={(language=="en")?"Code":"故障代码"}
									onChange={this.onChange}
									value={this.state.code}
									maxlength="16"></Input>
							</Col>
							<Col span={6}>
								<Button disabled={!this.state.code} onClick={() => this.getData()} className={styles.Button} style={{ width: '100%' }} type="primary" ><FormattedMessage id="search"/></Button>
							</Col>
						</Row>
						<List
							className={styles.lis}
							dataSource={this.state.list}
							renderItem={(item,index) => (
								<List.Item className={styles.list} key={index}>
									<Row>
										<Col span={5}>
											<a className={styles.text}><FormattedMessage id="fault code"/>：</a>
										</Col>
										<Col span={17}>
											<div className={styles.text2}><FormattedMessage id={item.code_id}/></div>
										</Col>
										<Col span={5}>
											<a className={styles.text}><FormattedMessage id="Reason"/></a>
										</Col>
										<Col span={18}>
											<div className={styles.text2}><FormattedMessage id={item.reason}/></div>
										</Col>
										<Col span={5}>
											<a className={styles.text}><FormattedMessage id="Answer"/></a>
										</Col>
										<Col span={18}>
											<div className={styles.text2}><FormattedMessage id={item.answer}/></div>
										</Col>
									</Row>
								</List.Item>
							)}
						/>
					</div>
				</div>
			</LocaleProvider>
		);
	}
}
