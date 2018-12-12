import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './Menu.less';

@connect(({ device }) => ({
  device,
}))
export default class Register extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <div className={styles.content}>登记</div>
    );
  }
}