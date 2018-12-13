import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Revise.less';

const FormItem = Form.Item;
@connect(({ submit, user, loading }) => ({
  submit,
  currentUser: user.currentUser,
  submitting: loading.effects['user/updateUser'],
}))
@Form.create()
export default class Profile extends Component {	
  emitEmpty = () => {
    this.props.form.resetFields('username');
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'user/updateUser',
            payload: {
              ...values,
            },
          });
        }
      }
    );
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
    const { form, submitting, currentUser } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <div className={styles.content}>
              {/*<section className={styles.info}>
                <FormItem>
                  <Row gutter={8}>
                    <Col span={6}>
                      <div>姓名:</div>
                    </Col>
                    <Col span={18}>
                      {getFieldDecorator('nicname', {
                        initialValue: currentUser.nicname || '',
                          rules: [{
                            required: true,class:'explain', message: '请输入姓名',
                          }],
                      })(<Input placeholder="姓名" ></Input>)
                      }
                    </Col>
                  </Row>
                </FormItem>
              </section>
               <section className={styles.info}>
              <FormItem>
                <Row gutter={8}>
                  <Col span={6}>
                  	<div>公司名:</div>
	                </Col>
	                <Col span={18}>
	                  {getFieldDecorator('companyName', {
	                    initialValue:currentUser.companyName || '',
	                    rules: [{
	                      required: true,class:'explain', message: '请输入公司名',
	                    }],
	                  })(<Input placeholder="公司名"></Input>)}
	                </Col>
                </Row>
              </FormItem>
            </section> */}
            <section className={styles.info}>
              <FormItem>
                <Row gutter={8}>
                  <Col span={6}>
	                  <div>手机号码:</div>
	                </Col>
	                <Col span={18}>
	                  {getFieldDecorator('mobile', {
	                    initialValue:currentUser.mobile || '',
	                    rules: [{
	                      required: true,class:'explain', message: '请输入手机号码',
	                    }],
	                  })(<Input placeholder="手机号码"></Input>)}
	                </Col>
                </Row>
              </FormItem>
            </section>
            <section className={styles.info}>
            	{getFieldDecorator('id', {
                initialValue:currentUser.id || '',
                rules: [{
                }],
              })}
            </section>
            <FormItem className={styles.additional}>
	            <Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
	                提交修改
	            </Button>
            </FormItem>
          </div>
        </Form>    
      </div>	  	
    )
  }
}
