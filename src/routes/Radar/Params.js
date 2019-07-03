import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Collapse, Modal } from 'antd';
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
@connect(({ device, global }) => ({
	device, global,
}))
export default class Params extends Component {
	state = {
		dis:false,
	}
	submit = (val,item) => {
		const { device: { menu }} = this.props;
		console.log(menu)
		Modal.info({
			title: '参数详情',
			content: (
				<div>
					{val}
				</div>
			),
			onOk() {},
		});
	}
	render() {
		const { device: { menu }, location } = this.props;
		const { isMobile } = this.props.global;
		return (
			<div className="content">
				<div className={styles.content}>
					{
						isMobile ? (
							<Row type="flex" justify="space-around" align="middle">
								<Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 12 }}>
									<Accordion className="accordion">
										{
											menu.map((data,indexs) => (
												<Accordion.Panel className={styles.panel} header={`${data.label}`} key={data.label}>
													<List key={data.label}>
														{
															data.children.filter(item=>item.visible).map((item, index) =>(
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
						) : (
							<Row type="flex" justify="space-around" align="middle">
								<Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 14 }}>
									<Collapse className="accordion">
										{
											menu.map(data => (
												<Panel header={`F${data.label+4}`} key={data.label}>
													<List key={data.label}>
														{
															data.children.map((item, index) =>
																<List.Item key={`${item.label}${index}`} extra={item.value}><FormattedMessage id={item.label}/></List.Item>
															)
														}
													</List>
												</Panel>
											))
										}
									</Collapse>
								</Col>
							</Row>
						)
					}
				</div>
			</div>
		);
	}
}
