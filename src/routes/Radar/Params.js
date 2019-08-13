import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Collapse, Modal, Dropdown, Menu } from 'antd';
import { List, Accordion, } from 'antd-mobile';
import styles from './Params.less';
import { injectIntl, FormattedMessage } from 'react-intl';

const columns = [
	{
		title: '属性',
		dataIndex: 'propertyName',
	}, {
		title: '值',
		dataIndex: 'value',
	},
];
const Panel = Collapse.Panel;
const { SubMenu } = Menu;
const Menus = (item) => (
	<Menu>
		<p className={styles.explain}><FormattedMessage id={item.explain}/></p>
		{/* <Menu.Item><FormattedMessage id={item.label}/></Menu.Item> */}
	</Menu>
);
@connect(({ device, global }) => ({
	device, global,
}))
export default class Params extends Component {
	state = {
		dis:false,
	}
	render() {
		const { device: { menu }, location } = this.props;
		return (
			<div className="content">
				<div className={styles.content}>
					<Row type="flex" justify="space-around" align="middle">
						<Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 12 }}>
							<Accordion className="accordion">
								{
									menu.map((data,indexs) => (
										<Accordion.Panel className={styles.panel} header={`${data.label}`} key={data.label}>
											<List key={data.label}>
												{
													data.children.filter(item=>item.visible).map((item, index) =>(
														item.explain ?
														<Dropdown overlay={Menus(item)} trigger={['click']}>
															<List.Item key={`${item.label}${index}`} extra={item.value}>
																{`${+index+1}`.length == 2?`${+index+1}`:`0${+index+1}`}. <FormattedMessage id={item.label}/>
															</List.Item>
														</Dropdown>
														:
														<List.Item key={`${item.label}${index}`} extra={item.value}>
															{`${+index+1}`.length == 2?`${+index+1}`:`0${+index+1}`}. <FormattedMessage id={item.label}/>
														</List.Item>
													))
												}
											</List>
										</Accordion.Panel>
									))
								}
							</Accordion>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
