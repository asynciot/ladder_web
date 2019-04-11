import React, { Component } from 'react';
import { connect } from 'dva';
import { Picker, List, InputItem } from 'antd-mobile';
import { Row, Col, Button, Form, Select, Input } from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './Index.less';
import MobileNav from '../../components/MobileNav';
import E1 from '../../assets/fault/c1.png';
import E2 from '../../assets/fault/c2.png';
import E3 from '../../assets/fault/c3.png';
import E4 from '../../assets/fault/c4.png';
import E5 from '../../assets/fault/c5.png';
import E6 from '../../assets/fault/c6.png';
import E7 from '../../assets/fault/c7.png';
import E8 from '../../assets/fault/c8.png';
import E9 from '../../assets/fault/c9.png';
import E10 from '../../assets/fault/c10.png';
import E11 from '../../assets/fault/c11.png';
import E12 from '../../assets/fault/c12.png';
import E13 from '../../assets/fault/c13.png';
import E14 from '../../assets/fault/c14.png';
import E15 from '../../assets/fault/c15.png';
import E16 from '../../assets/fault/c16.png';
import E17 from '../../assets/fault/c17.png';
import E18 from '../../assets/fault/c18.png';
import E19 from '../../assets/fault/c19.png';
import E20 from '../../assets/fault/c20.png';
import E21 from '../../assets/fault/c21.png';
import E22 from '../../assets/fault/c22.png';
import E23 from '../../assets/fault/c23.png';
import E24 from '../../assets/fault/c24.png';
import E25 from '../../assets/fault/c25.png';
import E26 from '../../assets/fault/c26.png';
import E27 from '../../assets/fault/c27.png';
import E28 from '../../assets/fault/c28.png';
import E29 from '../../assets/fault/c29.png';
// import E30 from '../../assets/fault/c30.png';
import E31 from '../../assets/fault/c31.png';
import E32 from '../../assets/fault/c32.png';
import E33 from '../../assets/fault/c33.png';
import E34 from '../../assets/fault/c34.png';
import E35 from '../../assets/fault/c35.png';
import E36 from '../../assets/fault/c36.png';
import E37 from '../../assets/fault/c37.png';
import E38 from '../../assets/fault/c38.png';
// import E39 from '../../assets/fault/c39.png';
import E40 from '../../assets/fault/c40.png';
import E41 from '../../assets/fault/c41.png';
import E51 from '../../assets/fault/c51.png';
import E52 from '../../assets/fault/c52.png';
import E66 from '../../assets/fault/c66.png';
import E82 from '../../assets/fault/c82.png';
import E114 from '../../assets/fault/c114.png';
import E178 from '../../assets/fault/c178.png';
import E179 from '../../assets/fault/dOC.png';

const Option = Select.Option;
const FormItem = Form.Item;
const options = [
	{
		label: 'NSFC01-02T',
		value: 'NSFC01-02T',
	}, {
		label: 'NSFC02-02T',
		value: 'NSFC02-02T',
	},
];
@connect(({ tech }) => ({
	tech,
}))
@Form.create()
export default class Tech extends Component {
	state = {
		navs: [{
			label: '故障代码查询',
			link: '/tech/code',
		},{
			label: '产品说明书',
			link: '/tech/manual',
		}, {
			label: '其他相关资料',
			link: '/tech/other',
		}],
		name: '',
		img: true,
		solution: {},
	}
	componentDidMount() {
	}

	input = (val) => {
		this.setState({
			name: val,
		});
	}
	submit = (val) => {
		this.setState({
			name: val,
		});
	}
	info = (item) => {
// 		if(this.state.name==04){
// 			
// 		}
		let imgList= [
			E1,
			E2,
			E3,
			E4,
			E5,
			E6,
			E7,
			E8,
			E9,
			E10,
			E11,
			E12,
			E13,
			E14,
			E15,
			E16,
			E17,
			E18,
			E19,
			E20,
			E21,
			E22,
			E23,
			E24,
			E25,
			E26,
			E27,
			E28,
			E29,
			E31,
			E31,
			E32,
			E33,
			E34,
			E35,
			E36,
			E37,
			E38,
			E38,
			E40,
			E41,
			E51,
			E52,
			E66,
			E82,
			E114,
			E178,
			E179
		]
		if(item.device_type == 'ctrl'){
			imgList=imgList[item.code-1]
		}else{
			if(item.code=='51'){
				imgList=imgList[41]
			}else if(item.code=='52'){
				imgList=imgList[42]
			}else if(item.code=='66'){
				imgList=imgList[43]
			}else if(item.code=='82'){
				imgList=imgList[44]
			}else if(item.code=='114'){
				imgList=imgList[45]
			}else if(item.code=='178'){
				imgList=imgList[46]
			}
		}
	}
	render() {
		const { location } = this.props;
		const currentPath = pathToRegexp('/tech/:name').exec(location.pathname);
		const active = currentPath[1];
		return (
			<div className="content">
				<MobileNav
					active={active}
					key="nav"
					navs={this.state.navs}
				/>
				<div className={styles.content}>
					<List>
						<InputItem
							onChange={this.input}
							value={this.state.name}
						>
							故障代码:
						</InputItem>
						<List.Item>
							<Button disabled={!this.state.name} size="large" style={{ width: '100%' }} type="primary" onClick={() => this.info()}>
								查询
							</Button>
							<div>
							</div>
						</List.Item>
					</List>
				</div>
			</div>
		);
	}
}
