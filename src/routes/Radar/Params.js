import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Collapse, Dropdown, Menu } from 'antd';
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
		<Row className={styles.border}>
			<Col span={4} >
				<div><p><FormattedMessage id={item.label}/></p></div>
			</Col>
			<Col span={20} className={styles.borderleft}>
				<p className={styles.explain}><FormattedMessage id={item.explain}/></p>
			</Col>
		</Row>
	</Menu>
);
@connect(({ device, global }) => ({
	device, global,
}))
export default class Params extends Component {
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
