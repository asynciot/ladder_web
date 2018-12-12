import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import { List } from 'antd-mobile';
import styles from './Index.less';
import img1 from '../../assets/service-img1.jpg';
import img2 from '../../assets/service-img2.jpg';
import img3 from '../../assets/service-img3.jpg';
import img4 from '../../assets/service-img4.jpg';

export default class Service extends Component {
  state = {
    navs: [{
      icon: 'solution',
      label: '维保打卡',
    }, {
      icon: 'schedule',
      label: '申请售后服务',
    }, {
      icon: 'medicine-box',
      label: '技术救援',
    }],
  }
  componentDidMount() {
  }
  render() {
    const { isMobile } = this.props;
    return (
      <div className="content">
        {
          isMobile &&(
            <Row className="mb-10" gutter={4}>
              <Col xs={{ span: 6 }} sm={{ span: 12 }} className="img-content">
                <img src={img1} className={styles.img} alt="service" />
              </Col>
              <Col xs={{ span: 6 }} sm={{ span: 12 }} className="img-content">
                <img src={img2} className={styles.img} alt="service" />
              </Col>
              <Col xs={{ span: 6 }} sm={{ span: 12 }} className="img-content">
                <img src={img3} className={styles.img} alt="service" />
              </Col>
              <Col xs={{ span: 6 }} sm={{ span: 12 }} className="img-content">
                <img src={img4} className={styles.img} alt="service" />
              </Col>
            </Row>
          )
        }
        <List style={{ backgroundColor: 'white' }}>
          {
            this.state.navs.map(item => (
              <List.Item arrow="horizontal" key={item.label}>{item.label}</List.Item>
            ))
          }
        </List>
      </div>
    );
  }
}
