import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'dva';
import { Tabs, Flex, ImagePicker, List, InputItem } from 'antd-mobile';
import { Button, message } from 'antd';
import base64url from 'base64url';
import qrcode from 'qrcode.js';
import pathToRegexp from 'path-to-regexp';
import styles from './Follow.less';
import camera from '../../assets/camera.png';
import { postFollowInfo } from '../../services/api';

const tabs = [
	{ title: '输入串号' },
  // { title: '上传二维码' },
  
];

@connect(({ submit, user, loading }) => ({
  submit,
  currentUser: user.currentUser,
  submitting: loading.effects['user/updateUser'],
}))
export default class extends Component {
  state = {
    deviceNo: '',
		qrcodeNo: '',
    view: 0,
  }
  componentWillMount() {
    const IMEI = this.props.match.params.IMEI;
    if (IMEI !== 'new') {
      this.setState({
        deviceNo: IMEI,
        view: 0,
      });
    }
  }
  componentDidMount() {
    qrcode.callback = (val) => {
      const match = pathToRegexp('${window.location.origin}/:sub?/:sec?/:sec?').exec(val);
      if (match && match[2] == 'follow' && match[3]) {
        this.setState({
          qrcodeNo: match[3],
        });
      }else {
        this.setState({
          qrcodeNo: val,
        });
      }
    };
    this.reader = new FileReader();
    this.reader.onload= (e) => {
			qrcode.decode(e.currentTarget.result)
    };
  }

  onChange = (value) => {
    this.setState({
      deviceNo: value,
    });
  }
  reader = null;
  upload = (e) => {
    this.reader.readAsDataURL(e.target.files[0]);	
  }
  submit = () => {
    postFollowInfo({
      deviceNo: this.state.view ? this.state.deviceNo:this.state.qrcodeNo,
    }).then((res) => {
      if (res.code === 0) {
        message.success('关注成功');
        this.props.history.push(`/home`);
      } else if (res.code === 855) {
        return message.error('您已经关注此设备');
      } else {
        return message.error('关注失败');
      }
    });
  }
  tabChange = (tab, index) => {
    this.setState({
      view: index,
    });
  }
  render() {
    const { submitting } = this.props;
    return (
      <div className="content">
       <Tabs
          tabs={tabs}
          initialPage={this.state.view}
          onChange={this.tabChange}
          tabBarActiveTextColor="#1E90FF"
          tabBarUnderlineStyle={{ borderColor: '#1E90FF' }}
        >
          {/* <div style={{ backgroundColor: '#fff' }}>
            <List>
              <List.Item>
                <div className={styles.upload}>
                  <img src={camera} alt="" />
                  <input accept="image/*" className={styles.input} onChange={this.upload} type="file" />
                  <ImagePicker
                    className={styles.btn}
                    files={this.state.files}
                    onChange={this.onUpload}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                  />
                </div>
              </List.Item>
              <InputItem
                onChange={this.onChange}
                value={this.state.qrcodeNo}
                disabled="true"
              >
                串号：
              </InputItem>
              <List.Item>
                <Button disabled={!this.state.qrcodeNo} size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
                  关注
                </Button>
              </List.Item>
            </List>
          </div>*/}
          <div style={{ backgroundColor: '#fff' }}>
            <List>
              <InputItem
                onChange={this.onChange}
                value={this.state.deviceNo}
              >
                串号
              </InputItem>
              <List.Item>
                <Button disabled={!this.state.deviceNo} size="large" loading={submitting} style={{ width: '100%' }} type="primary" onClick={() => this.submit()}>
                  关注
                </Button>
              </List.Item>
            </List>
          </div>
        </Tabs>
      </div>
    );
  }
}
