import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Avatar} from 'antd';
import styles from './Profile.less';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
export default class Profile extends Component {
  render() {
    const { currentUser } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <section className={styles.avatar}>
            <img src={currentUser.avatar} />
          </section>
          <section className={styles.info}>
            <p>类型 ：{currentUser.position}</p>
          </section>
          <section className={styles.info}>
            <p>姓名 ：{currentUser.name}</p>
          </section>
          <section className={styles.info}>
            <p>性别 ：{currentUser.sex}</p>
          </section>
          <section className={styles.info}>
            <p>所在群 ：{currentUser.group}</p>
          </section>
          <section className={styles.info}>
            <p>个人编号 ：{currentUser.number}</p>
          </section>
          <section className={styles.info}>
            <p>身份证号 ：{currentUser.idnumber}</p>
          </section>
          <section className={styles.info}>
            <p>手机号 ：{currentUser.phone}</p>
          </section>
          <section className={styles.info}>
            <p>工作评价 ：{currentUser.evaluate}</p>
          </section>
        </div>
      </div>
    )
  }
}
