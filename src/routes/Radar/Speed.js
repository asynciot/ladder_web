import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import { Picker, List } from 'antd-mobile';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import styles from './Speed.less';

const randomHexColor = () => { // 随机生成十六进制颜色
  let hex = Math.floor(Math.random() * 11777216).toString(16); // 生成ffffff以内16进制数
  while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
    hex = `0${hex}`;
  }
  return `#${hex}`; // 返回‘#'开头16进制颜色
};
const timer = null;
const textStyle = {
  fontSize: 11,
};
const style = {
  textStyle: {
    color: '#D72826',
    fontWeight: 'normal',
    fontSize: 13,
    align: 'center',
    width: '100%',
  },
  axisLine: {
    lineStyle: {
      color: '#666',
    },
  },
  splitLine: {
    show: false,
  },
  lineStyle: {
    color: '#1f77b4',
  },
};
const createOpt = (title) => {
  return {
    textStyle,
    title: {
      text: `${title}`,
      textStyle: style.textStyle,
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br/> {a} : {c} m/s',
    },
    grid: {
      left: 25,
      bottom: 25,
      top: 48,
      right: 30,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        name: 't',
        nameGap: 3,
        axisLabel: {
          fontSize: 9,
          margin: 6,
        },
        axisLine: style.axisLine,
        data: [],
      },
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        max: 1,
        min: 0,
        splitNumber: 1,
        splitLine: style.splitLine,
        nameGap: 3,
        axisLabel: {
          fontSize: 9,
          margin: 6,
        },
        axisLine: style.axisLine,
        boundaryGap: [0.2, 0.2],
      },
    ],
    series: [
      {
        name: '信号值',
        type: 'line',
        step: 'start',
        lineStyle: {
          color: randomHexColor(),
        },
        data: [],
      },
    ],
    animation: false,
  };
};
const positionOri = {
  textStyle,
  title: {
    text: '门位置',
    textStyle: style.textStyle,
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b} <br/> {a} : {c} m/s',
  },
  grid: {
    left: 35,
    bottom: 25,
    top: 48,
    right: 35,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      name: 't',
      nameGap: 3,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
      scale: false,
      nameGap: 3,
      splitLine: style.splitLine,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,
      boundaryGap: [0.2, 0.2],
    },
  ],
  series: [
    {
      name: '位置',
      type: 'line',
      lineStyle: {
        color: randomHexColor(),
      },
      data: [],
    },
  ],
  animation: false,
};
const speedOri = {
  textStyle,
  title: {
    text: '门速度',
    textStyle: style.textStyle,
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b} <br/> {a} : {c} m/s',
  },
  grid: {
    left: 30,
    bottom: 25,
    top: 48,
    right: 30,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      name: 't',
      nameGap: 3,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
      scale: false,
      name: 'm/s',
      nameGap: 3,
      splitLine: style.splitLine,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,
      boundaryGap: [0.2, 0.2],
    },
  ],
  series: [
    {
      name: '速度',
      type: 'line',
      lineStyle: {
        color: randomHexColor(),
      },
      data: [],
    },
  ],
  animation: false,
};
const currentOri = {
  textStyle,
  title: {
    text: '门电流',
    textStyle: style.textStyle,
  },
  grid: {
    left: 25,
    bottom: 25,
    top: 48,
    right: 30,
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b} <br/> {a} : {c} A',
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      name: 't',
      nameGap: 3,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
      scale: true,
      name: 'A',
      nameGap: 3,
      splitLine: style.splitLine,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,
      boundaryGap: [0.2, 0.2],
    },
  ],
  series: [
    {
      name: '电流',
      type: 'line',
      lineStyle: {
        color: randomHexColor(),
      },
      data: [],
    },
  ],
  animation: false,
};
@connect(({ device }) => ({
  device,
}))
export default class Speed extends Component {
  state = {
    pick: '',
    wave: [],
    stop: true,
    openInOpt: createOpt('开门输入'),
    closeInOpt: createOpt('关门输入'),
    openToOpt: createOpt('开到位输入'),
    closeToOpt: createOpt('关到位输入'),
    openSlowOpt: createOpt('开减速输入'),
    closeSlowOpt: createOpt('关减速输入'),
    openToOutOpt: createOpt('开到位输出'),
    closeToOutOpt: createOpt('关到位输出'),
    doorOpt: createOpt('门光幕'),
    positionOpt: Object.assign({}, positionOri),
    currentOpt: Object.assign({}, currentOri),
    speedOpt: Object.assign({}, speedOri),
  }
  componentWillMount() {
    const { device: { wave, waveList }, location } = this.props;
    if (wave.length) {
      this.setState({
        wave,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
  }

  onChange = (val) => {
    const { dispatch, location, device: { waveList } } = this.props;
    const match = pathToRegexp('/radar/:id/:name').exec(location.pathname);
    this.startTime = waveList.filter(item => item.value === val[0])[0].label;
    this.setState({
      pick: val,
    });
    dispatch({
      type: 'device/wave',
      payload: {
        id: match[1],
        params: {
          id: val[0],
        },
      },
    }).then(() => {
      this.initChart();
    });
  }
  startTime = null;
  timeTicket = null;
  initChart() {
    this.setState({
      openInOpt: createOpt('开门输入'),
      closeInOpt: createOpt('关门输入'),
      openToOpt: createOpt('开到位输入'),
      closeToOpt: createOpt('关到位输入'),
      openSlowOpt: createOpt('开减速输入'),
      closeSlowOpt: createOpt('关减速输入'),
      openToOutOpt: createOpt('开到位输出'),
      closeToOutOpt: createOpt('关到位输出'),
      doorOpt: createOpt('门光幕'),
      positionOpt: {
        textStyle,
        title: {
          text: '门位置',
          textStyle: style.textStyle,
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/> {a} : {c} m/s',
        },
        grid: {
          left: 35,
          bottom: 25,
          top: 48,
          right: 35,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: 't',
            nameGap: 3,
            axisLabel: {
              fontSize: 9,
              margin: 6,
            },
            axisLine: style.axisLine,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            scale: false,
            nameGap: 3,
            splitLine: style.splitLine,
            axisLabel: {
              fontSize: 9,
              margin: 6,
            },
            axisLine: style.axisLine,
            boundaryGap: [0.2, 0.2],
          },
        ],
        series: [
          {
            name: '位置',
            type: 'line',
            lineStyle: {
              color: randomHexColor(),
            },
            data: [],
          },
        ],
        animation: false,
      },
      currentOpt: {
        textStyle,
        title: {
          text: '门电流',
          textStyle: style.textStyle,
        },
        grid: {
          left: 25,
          bottom: 25,
          top: 48,
          right: 30,
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/> {a} : {c} A',
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: 't',
            nameGap: 3,
            axisLabel: {
              fontSize: 9,
              margin: 6,
            },
            axisLine: style.axisLine,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: 'A',
            nameGap: 3,
            splitLine: style.splitLine,
            axisLabel: {
              fontSize: 9,
              margin: 6,
            },
            axisLine: style.axisLine,
            boundaryGap: [0.2, 0.2],
          },
        ],
        series: [
          {
            name: '电流',
            type: 'line',
            lineStyle: {
              color: randomHexColor(),
            },
            data: [],
          },
        ],
        animation: false,
      },
      speedOpt: {
        textStyle,
        title: {
          text: '门速度',
          textStyle: style.textStyle,
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/> {a} : {c} m/s',
        },
        grid: {
          left: 30,
          bottom: 25,
          top: 48,
          right: 30,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: 't',
            nameGap: 3,
            axisLabel: {
              fontSize: 9,
              margin: 6,
            },
            axisLine: style.axisLine,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            scale: false,
            name: 'm/s',
            nameGap: 3,
            splitLine: style.splitLine,
            axisLabel: {
              fontSize: 9,
              margin: 6,
            },
            axisLine: style.axisLine,
            boundaryGap: [0.2, 0.2],
          },
        ],
        series: [
          {
            name: '速度',
            type: 'line',
            lineStyle: {
              color: randomHexColor(),
            },
            data: [],
          },
        ],
        animation: false,
      },
    }, () => {
      const {
        openInOpt,
        closeInOpt,
        openToOpt,
        closeToOpt,
        openSlowOpt,
        closeSlowOpt,
        openToOutOpt,
        closeToOutOpt,
        doorOpt,
        speedOpt,
        currentOpt,
        positionOpt,
      } = this.state;
      const { device: { wave, interval } } = this.props;
      let idx = 0;
      while (idx < 10) {
        const time = moment(parseInt(this.startTime + (interval * idx))).format('ss.SSS');
        openInOpt.xAxis[0].data.push(time);
        closeInOpt.xAxis[0].data.push(time);
        openToOpt.xAxis[0].data.push(time);
        closeToOpt.xAxis[0].data.push(time);
        openSlowOpt.xAxis[0].data.push(time);
        closeSlowOpt.xAxis[0].data.push(time);
        openToOutOpt.xAxis[0].data.push(time);
        closeToOutOpt.xAxis[0].data.push(time);
        doorOpt.xAxis[0].data.push(time);
        speedOpt.xAxis[0].data.push(time);
        currentOpt.xAxis[0].data.push(time);
        positionOpt.xAxis[0].data.push(time);
        idx++;
      }
      this.setState({
        openInOpt,
        closeInOpt,
        openToOpt,
        closeToOpt,
        openSlowOpt,
        closeSlowOpt,
        openToOutOpt,
        closeToOutOpt,
        doorOpt,
        speedOpt,
        currentOpt,
        positionOpt,
      });
    });
  }
  fetchData = () => {
    const {
      openInOpt,
      closeInOpt,
      openToOpt,
      closeToOpt,
      openSlowOpt,
      closeSlowOpt,
      openToOutOpt,
      closeToOutOpt,
      doorOpt,
      speedOpt,
      currentOpt,
      positionOpt,
    } = this.state;
    const { device: { wave, interval } } = this.props;
    const index = openInOpt.series[0].data.length;
    const idx = index + 1;
    if (idx < wave.length) {
      if (idx >= 10) {
        const time = moment(parseInt(this.startTime + (interval * idx))).format('ss.SSS');

        openInOpt.xAxis[0].data.push(time);
        closeInOpt.xAxis[0].data.push(time);
        openToOpt.xAxis[0].data.push(time);
        closeToOpt.xAxis[0].data.push(time);
        openSlowOpt.xAxis[0].data.push(time);
        closeSlowOpt.xAxis[0].data.push(time);
        openToOutOpt.xAxis[0].data.push(time);
        closeToOutOpt.xAxis[0].data.push(time);
        doorOpt.xAxis[0].data.push(time);
        speedOpt.xAxis[0].data.push(time);
        currentOpt.xAxis[0].data.push(time);
        positionOpt.xAxis[0].data.push(time);
      }
      openInOpt.series[0].data.push(wave[idx].openIn);
      closeInOpt.series[0].data.push(wave[idx].closeIn);
      openToOpt.series[0].data.push(wave[idx].openTo);
      closeToOpt.series[0].data.push(wave[idx].closeTo);
      openSlowOpt.series[0].data.push(wave[idx].openSlow);
      closeSlowOpt.series[0].data.push(wave[idx].closeSlow);
      openToOutOpt.series[0].data.push(wave[idx].openToOut);
      closeToOutOpt.series[0].data.push(wave[idx].closeToOut);
      doorOpt.series[0].data.push(wave[idx].door);
      speedOpt.series[0].data.push(wave[idx].speed);
      currentOpt.series[0].data.push(wave[idx].current);
      positionOpt.series[0].data.push(wave[idx].position);
      this.setState({
        openInOpt,
        closeInOpt,
        openToOpt,
        closeToOpt,
        openSlowOpt,
        closeSlowOpt,
        openToOutOpt,
        closeToOutOpt,
        doorOpt,
        speedOpt,
        currentOpt,
        positionOpt,
      });
    } else {
      clearInterval(this.timeTicket);
      this.setState({
        stop: true,
      });
    }
  };
  getCurrentData = (data) => {
    const list = data.series[0].data;
    return list[list.length - 1] || list[list.length - 1] === 0 ? list[list.length - 1] : '-';
  }

  control = () => {
    const { device: { interval } } = this.props;
    if (this.state.stop) {
      clearInterval(this.timeTicket);
      this.timeTicket = setInterval(this.fetchData, interval);
    } else {
      clearInterval(this.timeTicket);
    }
    this.setState({
      stop: !this.state.stop,
    });
  }
  echarts = [];
  restart = () => {
    clearInterval(this.timeTicket);
    this.echarts.forEach((item) => {
      if (item) {
        const instance = item.getEchartsInstance();
        instance.clear();
      }
    });
    this.initChart();
    this.setState({
      stop: true,
    });
  }
  render() {
    const { device: { wave, waveList }, location } = this.props;
    const match = pathToRegexp('/radar/:name/:id?').exec(location.pathname);
    return (
      <div className="content">
        <div className={styles.content}>
          <Row type="flex" justify="center" align="middle">
            <Col xs={{ span: 18 }} md={{ span: 6 }}>
              <List style={{ backgroundColor: 'white' }} className="picker-list">
                <Picker
                  title="历史数据"
                  cols={1}
                  disabled={!Array.isArray(waveList) || waveList.length === 0}
                  data={(waveList || []).map(item => ({ label: moment(item.label).format('YYYY-MM-DD HH:mm:ss'),
                  value: item.value }))}
                  value={this.state.pick}
                  onOk={v => this.onChange(v)}
                  extra={waveList.length !== 0 ? '请选择' : '无数据'}
                >
                  <List.Item arrow="horizontal">历史数据</List.Item>
                </Picker>
              </List>
            </Col>
            <Col className={styles.ctrl} xs={{ span: 6 }} md={{ span: 6 }}>
              <Button icon={this.state.stop ? 'caret-right' : 'pause'} onClick={this.control} disabled={this.state.pick.length === 0} shape="circle" type="primary" />
              <Button className={styles.refresh} icon="reload" disabled={this.state.pick.length === 0} onClick={this.restart} shape="circle" type="default" />
            </Col>
          </Row>
          <Row gutter={8} type="flex" justify="center" align="middle" className={classNames(styles.wave, styles.door)}>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.speedOpt)}</p>
                <p className={styles.unit}>m/s</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.speedOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.currentOpt)}</p>
                <p className={styles.unit}>A</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.currentOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.positionOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.positionOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.openInOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.openInOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.closeInOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.closeInOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.openToOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.openToOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.closeToOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.closeToOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.openSlowOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.openSlowOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.closeSlowOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.closeSlowOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.openToOutOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.openToOutOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.closeToOutOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.closeToOutOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
            <Col xs={{ span: 11 }} md={{ span: 18 }}>
              <div className={styles.tips}>
                <p className={styles.name}>当前值</p>
                <p className={styles.current}>{this.getCurrentData(this.state.doorOpt)}</p>
              </div>
              <ReactEcharts
                className={styles.chart}
                option={this.state.doorOpt}
                style={{ height: 150, paddingBottom: 0 }}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
