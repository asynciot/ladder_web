import React, { Component } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import pathToRegexp from 'path-to-regexp';
import styles from './Manual.less';
import MobileNav from '../../components/MobileNav';

const options = [
	{
		label: 'NSFC01-01B',
		link: 'NSFC01-01B',
	},{
		label: 'NSFC01-02T',
		link: 'NSFC01-02T',
	},{
		label: (window.localStorage.getItem("language")=='zh')?'控制柜故障代码':'Ctrl Fault Code',
		link: 'CtrlCode',
	},
];
@connect(({ tech }) => ({
	tech,
}))
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
	}
	componentDidMount() {
	}
	onClick = (link) => {
		this.props.history.push(`/tech/reader/${link}`);
	}
	onChange = () => {

	}
	render() {
		const { location } = this.props;
		const currentPath = pathToRegexp('/tech/:name').exec(location.pathname);
		const active = currentPath[1];
		return (
			<div className="content">
				<MobileNav
					key="nav"
					active={active}
					navs={this.state.navs}
				/>
				<div className={styles.content}>
					{/* <Row className={styles.page}>
						<Col span={8} style={{margin:'5px',}}>
							<Input
								placeholder={(la=="zh")?"故障代码":"Order Code"}
								onChange={this.onChange}
								value={this.state.search_info}
								maxlength="16"></Input>
						</Col>
						<Col span={8} style={{margin:'5px',}}>
							<Input
								placeholder={(la=="zh")?"关键词":"Key Word"}
								onChange={this.onChangel}
								value={this.state.iddr}
								maxlength="16"></Input>
						</Col>
						<Col span={6}>
							<Button onClick={()=>this.search()} type="primary" style={{margin:'5px',width:'100%'}} ><FormattedMessage id="search"/></Button>
						</Col>
						<Col span={24} className={styles.center}>
							<Pagination simple pageSize={10} onChange={this.pageChange} current={this.state.page} total={this.state.totalNumber} />
						</Col>
					</Row> */}
					<List style={{ backgroundColor: 'white' }}>
						{
							options.map(item => (
								<List.Item key={item.label} onClick={() => this.onClick(item.link)} arrow="horizontal">{item.label}</List.Item>
							))
						}
					</List>
				</div>
			</div>
		);
	}
}
