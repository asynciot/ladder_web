import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Collapse, Dropdown, Menu } from 'antd';
import { List, Accordion } from 'antd-mobile';
import styles from './CtrlParams.less';
import { injectIntl, FormattedMessage } from 'react-intl';

const Panel = Collapse.Panel;
const { SubMenu } = Menu;
const Menus = (item) => (
	<Menu>
		<Row className={styles.border}>
			<Col span={6} >
				<div><p><FormattedMessage id="Parameter Name"/></p></div>
			</Col>
			<Col span={12} className={styles.borderleft2}>
				<p><FormattedMessage id="Function Declaration"/></p>
			</Col>
			<Col span={6} className={styles.borderleft2}>
				<div><p><FormattedMessage id="Range"/></p></div>
			</Col>
		</Row>
		<Row className={styles.border2}>
			<Col span={6} style={{"text-align":'left'}}>
				<div><p ><FormattedMessage id={item.label}/></p></div>
			</Col>
			<Col span={12} className={styles.borderleft}>
				<p className={styles.explain}><FormattedMessage id={item.explain}/></p>
			</Col>
			<Col span={6} style={{"text-align":'center'}}>
				<div><p>{item.range}</p></div>
			</Col>
		</Row>
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
