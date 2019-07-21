import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Input, } from 'antd';
import { Picker, List, Tabs,  Card, Modal, } from 'antd-mobile';
import classNames from 'classnames';
import styles from './OrderCode.less';
import { getFollowDevices, getOrderCode } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';

const alert = Modal.alert;

const faultCode = {
	'E1': 'E01',
	'E2': 'E02',
	'E3': 'E03',
	'E4': 'E04',
	'E5': 'E05',
	'E6': 'E06',
	'E7': 'E07',
	'E8': 'E08',
	'E9': 'E09',
	'E10': 'E10',
	'E11': 'E11',
	'E12': 'E12',
	'E13': 'E13',
	'E14': 'E14',
	'E15': 'E15',
	'E16': 'E16',
	'E17': 'E17',
	'E18': 'E18',
	'E19': 'E19',
	'E20': 'E20',
	'E21': 'E21',
	'E22': 'E22',
	'E23': 'E23',
	'E24': 'E24',
	'E25': 'E25',
	'E26': 'E26',
	'E27': 'E27',
	'E28': 'E28',
	'E31': 'E31',
	'E33': 'E33',
	'E34': 'E34',
	'E35': 'E35',
	'E36': 'E36',
	'E37': 'E37',
	'E38': 'E38',
	'E40': 'E40',
	'E41': 'E41',
	'E51': '04',
	'E52': '07',
	'E66': '08',
	'E82': '03',
	'E114': 'LV',
	'E178': 'OV',
}
export default class DoorHistory extends Component {
	state = {
		list:[],
	}
	componentWillMount() {
		this.getOrderCode()
	}
	getOrderCode = () =>{
		let code = this.props.match.params.id
		code = faultCode[code]
		getOrderCode({code}).then((res)=>{
			const list = res.list.map((item) => {
				return item
			})
			this.setState({
				list,
			})
		})
	}
	render() {
		const { list } = this.state;
		return (
			<div className="content tab-hide">
				<div className={styles.ct}>
					<List>
						{list.map((item, index) => (
							<List.Item className={styles.item} key={index} >
								<table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
									<tbody className={styles.tbody}>
										<tr>
											<a className={styles.text}><FormattedMessage id="fault code"/> ：</a>
											<td className="tl" style={{ width: 'auto',color:'red'}} ><FormattedMessage id={item.code_id}/></td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="Reason"/></a>
											<td>{item.reason}</td>
										</tr>
										<tr>
											<a className={styles.text}><FormattedMessage id="Answer"/></a>
											<td><p className={styles.tl}>{item.answer}</p></td>
										</tr>
									</tbody>
								</table>
								
							</List.Item>
						))}
					</List>
				</div>
			</div>
		);
	}
}
