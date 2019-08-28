import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Accordion } from 'antd-mobile';
import pathToRegexp from 'path-to-regexp';
import styles from './Manual.less';
import MobileNav from '../../components/MobileNav';

const options = [
	{
		label:(window.localStorage.getItem("language")=='zh')?"中文说明书":"Chinese Instructions",
		children:[{
			label: 'NSFC01-01B',
			link: 'NSFC01-01B',
		},{
			label: 'NSFC01-02T',
			link: 'NSFC01-02T',
		},{
			label: 'HPC181',
			link: 'HPC181',
		},{
			label: (window.localStorage.getItem("language")=='zh')?'控制柜故障代码':'Ctrl Fault Code',
			link: 'CtrlCode',
		}]
	},{
		label:(window.localStorage.getItem("language")=='zh')?"英文说明书":"English Instructions",
		children:[{
		label: 'NSFC01-02T_EN',
		link: 'NSFC01-02T_EN',
	},{
		label: 'HPC181_EN',
		link: 'HPC181_EN',
	}]
	}
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
					<List style={{ backgroundColor: 'white' }}>
						<Accordion className="accordion">
						{
								options.map(item => (
									<Accordion.Panel className={styles.panel} header={item.label} key={item.label}>
									{
										item.children.map(data =>(
											<List.Item key={data.label} onClick={() => this.onClick(data.link)} arrow="horizontal">{data.label}</List.Item>
										))
									}
									</Accordion.Panel>
								))
						}
						</Accordion>
					</List>
				</div>
			</div>
		);
	}
}
