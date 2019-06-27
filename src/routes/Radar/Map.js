import React, { Component } from 'react';
import { connect } from 'dva';
import { Picker, List, InputItem } from 'antd-mobile';
import { Cascader, Form, Input, Button } from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './Map.less';
import { getFollowDevices, } from '../../services/api';
import { injectIntl, FormattedMessage } from 'react-intl';
var cell_lat=0;
var cell_lon=0;
export default class Map extends Component {
	state = {
		id:'',
	};
	
  componentWillMount() {
		const { location } = this.props;
		const match = pathToRegexp('/company/:id/map').exec(location.pathname);
		this.state.id = match[1];
  }
	componentDidMount() {
		this.getDevice()
	}
  getDevice = () => {
		const { id,} = this.state;
		const device_id = id
		const _this = this
		getFollowDevices({ num: 1, page: 1, device_id, }).then((res) => {
			cell_lat = res.data.list[0].cell_lat
			cell_lon = res.data.list[0].cell_lon
			if(cell_lat == null&&cell_lon== null){
				alert("此设备没有地址坐标！")
				var map = new BMap.Map("map");
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 11);
					}else{
						map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
					}
				});
			}else{
				var map = new BMap.Map("map");
				map.centerAndZoom(new BMap.Point(cell_lon, cell_lat), 11);  // 初始化地图,设置中心点坐标和地图级别
				// 添加带有定位的导航控件
				var navigationControl = new BMap.NavigationControl({
					// 靠左上角位置
					anchor: BMAP_ANCHOR_TOP_LEFT,
					// LARGE类型
					type: BMAP_NAVIGATION_CONTROL_LARGE,
					// 启用显示定位
					enableGeolocation: true
				});
				map.addControl(navigationControl);
				var marker = new BMap.Marker(new BMap.Point(cell_lon, cell_lat));
				map.addOverlay(marker);            //增加点
			}
		});
  }
  render() {
    return (
      <div className="content">
        <div className={styles.map} id="map" />
      </div>
    );
  }
}
