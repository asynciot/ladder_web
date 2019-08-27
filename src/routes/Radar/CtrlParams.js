import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import $ from 'jquery';
import { Row, Col, Collapse, Dropdown, Menu } from 'antd';
import { List, Accordion, Flex } from 'antd-mobile';
import styles from './CtrlParams.less';
import { injectIntl, FormattedMessage } from 'react-intl';

const Panel = Collapse.Panel;
const { SubMenu } = Menu;
const Menus = (item) => (
	<Menu>
		<Flex>
			<Flex.Item className={styles.border}><FormattedMessage id="Range"/></Flex.Item>
		</Flex>
		<Flex>
			<Flex.Item className={styles.border}><div><p>{item.range}</p></div></Flex.Item>
		</Flex>
	</Menu>
);

@connect(({ ctrl, global }) => ({
	ctrl, global,
}))
export default class Params extends Component {
	state ={
	}
	componentWillMount(){
	}
	render() {
		const { ctrl: { menu }, location } = this.props;
		return (
			<div className="content">
				<div className={styles.content}>
					<Row type="flex" justify="space-around" align="middle">
						<Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 12 }}>
							<Accordion className="accordion">
								{
									menu.map(data => (
										<Accordion.Panel className={styles.panel} header={data.label} key={data.label}>
											<List key={data.label}>
												{
													data.children.map((item, index) =>(
														item.range ?
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
