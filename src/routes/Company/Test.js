import React, { Component } from 'react';
import { Row, Col, Button, } from 'antd';
import { connect } from 'dva';
import { Modal, Accordion, List, Badge } from 'antd-mobile';
import styles from './Index.less';

export default class Company extends Component {
  render() {
    return (
      <div className="content">
        <div className={styles.header}>
        </div>
        <List>
			<icon></icon>
		</List>
      </div>
    );
  }
}
