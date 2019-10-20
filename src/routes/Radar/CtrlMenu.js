import React ,{Component}from 'react'  //导入 React Component
import { Row, Col } from 'antd';
import { Flex } from 'antd-mobile';
import styles from './CtrlRealtime.less';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { IOMenu, Board } from '../../ctrlMenu.js';

const polarity =(val)=> {
	if(val==0)
		return "Normally open";
	else if(val==1)
		return "Normally closed";
	else
		return "None";
}
class CtrlMenu extends Component{ //定义类继承 Compoent
	state={
		switch:false,
	}
	onChange = () => {
		this.setState({
			switch:!this.state.switch
		})
	}
	render(){ //render就是返回一个标签
		return(
			<div>
			{
				<div className={styles.Menu}>
					{
						this.state.switch==false?
						<Flex>
							<Flex.Item><p className={styles.shishi}><FormattedMessage id="IO Watch"/></p></Flex.Item>
							<Flex.Item><p className={styles.shishi} style={{'color':'#289EFC'}} onClick={()=>{this.onChange()}}><FormattedMessage id="Switch"/></p></Flex.Item>
						</Flex>
						:
						<Flex>
							<Flex.Item><p className={styles.shishi}><FormattedMessage id="Board Watch"/></p></Flex.Item>
							<Flex.Item><p className={styles.shishi} style={{'color':'#289EFC'}} onClick={()=>{this.onChange()}}><FormattedMessage id="Switch"/></p></Flex.Item>
						</Flex>
					}
					<div>
						{
							this.state.switch==false?
							<Row>
								<Col
									span={24}
									className={styles.door}
								>
									<Row style={{'text-align':'center'}}>
										<Col span={5} style={{'text-align':'left'}}><FormattedMessage id="Interface"/></Col>
										<Col span={11}><FormattedMessage id="Signal Name"/></Col>
										<Col span={4}><FormattedMessage id="Polarity"/></Col>
										<Col span={4}><FormattedMessage id="State"/></Col>
									</Row>
									<div>
										{
											IOMenu.map((item)=>(
												item.children.map((prop)=>(
													<Row style={{'text-align':'center'}}>
														<Col span={5} style={{'text-align':'left'}}>{prop.label}</Col>
														<Col span={11}><FormattedMessage id={prop.value}/></Col>
														<Col span={4}><FormattedMessage id={polarity(prop.Polarity)}/></Col>
														<Col span={4}><i className={styles.signal}/></Col>
													</Row>
												))
											))
										}
									</div>
								</Col>
							</Row>
							:
							<Row>
								<Col
									span={24}
									className={styles.door}
								>
									<Row style={{'text-align':'center'}}>
										<Col span={5} style={{'text-align':'left'}}><FormattedMessage id="Interface"/></Col>
										<Col span={11}><FormattedMessage id="Signal Name"/></Col>
										<Col span={4}><FormattedMessage id="Polarity"/></Col>
										<Col span={4}><FormattedMessage id="State"/></Col>
									</Row>
									<div>
										{
											Board.map((item)=>(
												item.children.map((prop)=>(
													<Row style={{'text-align':'center'}}>
														<Col span={4} style={{'text-align':'left'}}>{prop.grade}</Col>
														<Col span={12}>{prop.label}</Col>
														<Col span={4}><FormattedMessage id={polarity(prop.Polarity)}/></Col>
														<Col span={4}><i className={styles.signal}/></Col>
													</Row>
												))
											))
										}
									</div>
								</Col>
							</Row>
						}
					</div>
				</div>
			}
			</div>
		)
	}
}

export default CtrlMenu ;  //将此标签导出 。方便其他地方的调用使用
