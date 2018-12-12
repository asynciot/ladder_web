import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './AddGroup.less';


const FormItem = Form.Item;
@connect(({ addgroup, loading }) => ({
  addgroup,
  submitting: loading.effects['addgroup/addgroup'],
}))
@Form.create()
export default class AddGroup extends Component {
  state = {
    count: 0,
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'addgroup/addgroup',
            payload: {
              ...values,
            },
          });
        }
      }
    );
  }
  
  emitEmpty = () => {
    this.props.form.resetFields('username');
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }
  
  render() {
    const { form, login, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count } = this.state;
    const suffix = form.getFieldValue('username') ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      	<div className={styles.main}>
	       	<Form onSubmit={this.handleSubmit}>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>王大锤申请加入XX维保单位群,申请理由如下:</div>
          			</Col>
	          		<Col span={17}>
              		{getFieldDecorator('reason', {
                  rules: [{
                    required:false, 
                  }], 
	                })(
	                  <textarea rows="6" placeholder="请输入申请理由……" />
	                )}		              			
	          		</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>其个人信息如下:</div>
          				</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>头像:</div>
	              			<div src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1516820584034&di=4c09334ed083fffcb0e50e569ddcfba6&imgtype=0&src=http%3A%2F%2Fimg5q.duitang.com%2Fuploads%2Fitem%2F201506%2F21%2F20150621121631_LP4F2.jpeg'>
          				</Col>
          			<Col span={17}>
	              	{getFieldDecorator('username', {
	                  rules: [{	
	                    required: true, message: '请输入姓名！',
	                  }],
	                })(
	                  <Input
	                    size="large"
	                    suffix={suffix}
	                    placeholder="姓名"
	                  />
	                )}
								</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>性别:</div>
          			</Col>
          			<Col span={17}>
	              	{getFieldDecorator('usersex', {
	                  rules: [{
	                    required: true, message: '请输入性别！',
	                  }],
	                })(
	                  <Input
	                    size="large"
	//                  prefix={<Icon type="mobile" className={styles.prefixIcon} />}
	                    suffix={suffix}
	                    placeholder="性别"
	                  />
	                )}
								</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>证件号码:</div>
          			</Col>
          			<Col span={17}>
	              	{getFieldDecorator('idNumber', {
	                  rules: [{
	                    required: true, message: '请输入证件号码！',
	                  }],
	                })(
	                  <Input
	                    size="large"
	                    suffix={suffix}
	                    placeholder="证件号码"
	                  />
	                )}
								</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>单位名称:</div>
          			</Col>
          			<Col span={17}>
	              	{getFieldDecorator('companyname', {
	                  rules: [{
	                    required: true, message: '请输入单位名称！',
	                  }],
	                })(
	                  <Input
	                    size="large"
	                    suffix={suffix}
	                    placeholder="单位名称"
	                  />
	                )}
								</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>营业执照编号:</div>
          			</Col>
          			<Col span={17}>
	              	{getFieldDecorator('companyid', {
	                  rules: [{
	                    required: true, message: '请输入营业执照编号！',
	                  }],
	                })(
	                  <Input
	                    size="large"
	                    suffix={suffix}
	                    placeholder="营业执照编号"
	                  />
	                )}
								</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem>
	       			<Row gutter={8}>
	       				<Col span={7}>
	              			<div>单位所在地:</div>
          			</Col>
          			<Col span={17}>
	              	{getFieldDecorator('address', {
	                  rules: [{
	                    required: true, message: '请输入单位所在地！',
	                  }],
	                })(
	                  <Input
	                    size="large"
	                    suffix={suffix}
	                    placeholder="单位所在地"
	                  />
	                )}
								</Col>
	       			</Row>
	       		</FormItem>
	       		<FormItem className={styles.additional}>
	       			<Button 
                	size="large" 
                	loading={submitting} 
                	className={styles.submit} 
                	type="primary" 
                	htmlType="submit">
          		提交
            	</Button>
	       		</FormItem>
	       	</Form>
      	</div>
    );
  }
}