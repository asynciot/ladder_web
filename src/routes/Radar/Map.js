import React, { Component } from 'react';
import { connect } from 'dva';
import { Picker, List, InputItem } from 'antd-mobile';
import { Cascader, Form, Input, Button } from 'antd';
import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import { Debounce } from 'lodash-decorators/debounce';
import FloatBar from '../../components/FloatBar';
import styles from './Map.less';
import r from '../../assets/red.png';
import g from '../../assets/green.png';
import error from '../../assets/error.gif';
import lost from '../../assets/lost.gif';
import open from '../../assets/open.gif';

import region from '../../region.json';

const FormItem = Form.Item;
let map = null;
let isLast = false;
const labelStyle = {
  color: 'black',
  fontSize: '12px',
  borderRadius: '4px',
  height: '16px',
  lineHeight: '12px',
  borderColor: 'black',
  fontFamily: ' 微软雅黑',
};

const createMark = (img) => {
  return new BMap.Icon(img, new BMap.Size(25, 25), {
    // offset: new BMap.Size(10, 25),
    anchor: new BMap.Size(10, 26),
    imageSize: new BMap.Size(25, 25),
  });
};
const redMark = createMark(r);
const greenMark = createMark(g);
const errorMark = createMark(error);
const lostMark = createMark(lost);
const openMark = createMark(`../../assets/open.gif?timestamp=${new Date().getTime()}`);
let openAnimateList = [];

@connect(({ device }) => ({
  device,
}))
@Form.create()
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: [],
      bounds: {
        lat1: 0,
        lon1: 0,
        lat2: 0,
        lon2: 0,
      },
    };
  }
  timer = null;
  componentDidMount() {
    this.initMap();
    this.timer = setInterval(this.getDevice, 30000);
  }
  componentWillUnmount() {
    isLast = true;
    clearInterval(this.getDevice);
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if ((!_.isEqual(this.state, nextState) == false) && (!_.isEqual(this.state, nextState) == false)) {
  //     return false;
  //   }
  //   return true;
  // }
  getDevice = () => {
    openAnimateList.forEach((item) => {
      clearTimeout(item);
    });
    openAnimateList = [];
    if (isLast) {
      return;
    }
    const center = map.getCenter();
    const zoom = map.getZoom();
    const mapBounds = map.getBounds();
    const mapSw = mapBounds.getSouthWest();
    const mapNe = mapBounds.getNorthEast();
    const bounds = {
      lat1: mapSw.lat,
      lon1: mapSw.lng,
      lat2: mapNe.lat,
      lon2: mapNe.lng,
    };
    // if (lat1 !== Ke || lon1 !== Le || lat2 !== Fe || lon2 !== Ge) {
    this.props.dispatch({
      type: 'device/option',
      payload: {
        option: {
          bounds,
          lat: center.lat,
          lon: center.lng,
          zoom,
        },
      },
    });
    this.setState({ bounds }, () => {
      this.props.dispatch({
        type: 'device/fetch',
        payload: {
          page: 1,
          num: 50,
          ...this.state.bounds,
        },
      });
    });
    // }
  }

  barClick = () => {
    const { history } = this.props;
    map.removeEventListener('tilesloaded', this.getDevice);
    history.push('/radar/list/all');
  }

  @Debounce(800)
  searchInput(e) {
    const location = this.state.city.toString().replace(/,/g, '') + e;
    map.centerAndZoom(location, 15);
    this.getDevice();
  }
  searchRegion(e) {
    this.setState({ city: e });
    const city = e.toString().replace(/,/g, '');
    map.centerAndZoom(city, 11);
    // this.getDevice();
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.address) {
          this.searchInput(values.address);
        }
      }
    });
  }
  goDevice = data => () => {
    if (data.type == 'ctrl') {
      this.props.history.push(`/ctrl/${data.deviceId}/realtime`);
    }
    if (data.type == 'door') {
      this.props.history.push(`/door/${data.deviceId}/realtime`);
    }
  }

  @Debounce(600)
  eventHandler() {
    this.getDevice();
  }
  initMap() {
    isLast = false;
    const { option } = this.props.device;
    const point = new BMap.Point(121.48, 31.22);
    map = new BMap.Map('map', { enableMapClick: false });
    map.addEventListener('tilesloaded', () => { this.eventHandler() ;});
    if (option.lat) {
      map.centerAndZoom(
        new BMap.Point(option.lon, option.lat),
        option.zoom);
    } else {
      const geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition((r) => {
        if (geolocation.getStatus() === 0) {
          map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 12);
          // this.getDevice();
        } else {
          map.centerAndZoom(point, 12);
          new BMap.LocalCity().get((result) => {
            map.setCenter(result.name);
          });
        }
      }, { enableHighAccuracy: true });
    }
    map.addControl(new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_SMALL,
      enableGeolocation: true,
    }));
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
  }
  render() {
    openAnimateList.forEach((item) => {
      clearTimeout(item);
    });
    openAnimateList = [];
    const { list } = this.props.device;
    const { isMobile } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (map) {
      map.clearOverlays();
      list.forEach((item) => {
        const point = new BMap.Point(item.longitude, item.latitude);
        let marker = null;
        if (item.isLoss) {
          labelStyle.color = 'red';
          labelStyle.borderColor = 'red';
          marker = new BMap.Marker(point, { icon: redMark });
        }
        if (!item.isLoss && item.Alert == '0') {
          labelStyle.color = '#55BC52';
          labelStyle.borderColor = '#55BC52';
          marker = new BMap.Marker(point, { icon: greenMark });
        }
        if (!item.isLoss && item.Alert != '0') {
          labelStyle.color = '#55BC52';
          labelStyle.borderColor = '#55BC52';
          marker = new BMap.Marker(point, { icon: lostMark });
        }
        if (!item.isLoss && parseInt(item.isOpen) === 1) {
          labelStyle.color = '#55BC52';
          labelStyle.borderColor = '#55BC52';
          marker = new BMap.Marker(point, { icon: createMark(`/open.gif?timestamp=${new Date().getTime()}`) });
          const animation = setTimeout(() => {
            clearTimeout(animation);
            marker = new BMap.Marker(point, { icon: greenMark });
            marker.addEventListener('click', this.goDevice(item));
            map.addOverlay(marker);
          }, 1500);
          openAnimateList.push(animation);
        }
        const opts = {
          position: point,
          offset: item.Name != undefined && item.Name ? new BMap.Size(-item.Name.length * 5.7, -42) : new BMap.Size(-item.deviceId.length * 3.5, -42),
        };
        marker.data = item;
        marker.addEventListener('click', this.goDevice(item));
        const label = new BMap.Label(item.Name != undefined && item.Name ? item.Name : item.deviceId, opts);
        label.setStyle(labelStyle);
        map.addOverlay(marker);
        map.addOverlay(label);
      });
    }
    return (
      <div className="content">
        <div className={styles.pcregion}>
          <Form layout="inline" onSubmit={e => this.handleSubmit(e)}>
            <FormItem>
              <Cascader options={region} onChange={(v) => { this.searchRegion(v); }} placeholder="所在地区" />
            </FormItem>
            <FormItem>
              {getFieldDecorator('address', {
                rules: [{ required: false }],
              })(
                <Input placeholder="详细地址" />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
              >搜索
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className={styles.region}>
          <List style={{ backgroundColor: 'white' }} className="picker-list">
            <Picker
              title="所在地区"
              data={region}
              value={this.state.city}
              onPickerChange={this.onPickerChange}
              onOk={v => this.searchRegion(v)}
              // onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">所在地区</List.Item>
            </Picker>
            <InputItem
              placeholder="输入地址"
              clear
              onChange={(v) => { this.searchInput(v); }}
              // onBlur={(v) => { this.searchInput(v); }}
            >详细地址
            </InputItem>
          </List>
        </div>
        {/* <FloatBar
          position="left"
          content="设备列表"
          barClick={this.barClick}
        /> */}
        <div className={styles.map} id="map" />
      </div>
    );
  }
}
