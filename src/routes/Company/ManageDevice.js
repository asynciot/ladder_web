import React, { Component } from 'react';
import { } from 'antd';
import { } from 'antd-mobile';
import styles from './ManageDevice.less';

const PlaceHolder = ({ className = '', ...restProps }) => (
  <div className={`${className} ${styles.placeholder}`} {...restProps}>{restProps.children}</div>
);

export default class extends Component {
  render() {
    return (
      <div>test</div>
    );
  }
}
