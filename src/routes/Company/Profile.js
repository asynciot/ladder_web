import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Modal, Alert } from 'antd';
import styles from './Profile.less';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))

export default class Profile extends Component {
	showRevise = () => {
	  const { history } = this.props;
	  history.push('/company/revise');
	};

	render() {
	  const { currentUser } = this.props;
	  return (
      <div className={styles.main}>
        <div className={styles.content}>
          <section className={styles.avatar}>
            <img src={currentUser.portrait} alt="" />
          </section>
          <section className={styles.info}>
            <p>类型 ：{currentUser.position}</p>
          </section>
          <section className={styles.info}>
            <p>姓名 ：{currentUser.nicname}</p>
          </section>
          <section className={styles.info}>
            <p>公司 ：{currentUser.companyName}</p>
          </section>
          <section className={styles.info}>
            <p>手机号 ：{currentUser.mobile}</p>
          </section>
        </div>
        <div className={styles.additional}>
          <Button size="large" className={styles.submit} onClick={this.showRevise} type="primary">
              修改
          </Button>
        </div>
      </div>
	  );
	}
}
