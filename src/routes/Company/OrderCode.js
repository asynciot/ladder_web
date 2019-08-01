import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import _ from 'lodash';
import base64url from 'base64url';
import { Debounce } from 'lodash-decorators/debounce';
import { Row, Col, Button, Spin, DatePicker, Input, List, LocaleProvider } from 'antd';
import { Picker,  Tabs,  Card, Modal, } from 'antd-mobile';
import classNames from 'classnames';
import styles from './OrderCode.less';
import { getFollowDevices, getOrderCode } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
import zh from 'antd/es/locale-provider/zh_CN';
import en from 'antd/es/locale-provider/en_GB';

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
    language:window.localStorage.getItem("language"),
	}
	componentWillMount() {
		this.getOrderCode()
	}
	getOrderCode = () =>{
    const { language } = this.state;
		let code = this.props.match.params.id;
		code = faultCode[code];
    if(code!=null){
      getOrderCode({code}).then((res)=>{
      	const list = res.list.map((item) => {
      		return item;
      	})
      	this.setState({
      		list,
      	})
      })
    }else{
      if(language=="zh"){
      	alert("暂无该故障的详细信息");
      }else{
      	alert("No details are available yet.");
      }
    }
	}
	render() {
		const { list } = this.state;
    var la = window.localStorage.getItem("language");
    if(la == "zh" ){
    	la = zh;
    }else{
    	la = en;
    }
		return (
			<LocaleProvider locale={la}>
        <div className="content tab-hide">
          <div>
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
