import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Row, Col, Button, Switch } from 'antd';
import { Picker, List, Tabs } from 'antd-mobile';
import classNames from 'classnames';
import TweenOne from 'rc-tween-one';
import F2 from '@antv/f2';
import styles from './Info.less';

const tabs = [
  { title: '门' },
  { title: '分屏' },
  { title: '滤波' },
];
const randomHexColor = () => { // 随机生成十六进制颜色
  let hex = Math.floor(Math.random() * 11777216).toString(16); // 生成ffffff以内16进制数
  while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
    hex = `0${hex}`;
  }
  return `#${hex}`; // 返回‘#'开头16进制颜色
};
let timer = null;
let callback = null;
let play = null;
const timeList = [{
  label: '30s',
  value: 30,
}, {
  label: '60s',
  value: 60,
}, {
  label: '90s',
  value: 90,
}];
const alertName = (event) => {
  if (event.isLoss) {
    return '无';
  }
  let str = '';
  if (event.inHigh) {
    str += ' 输入电压过高 ';
  }
  if (event.inLow) {
    str += ' 输入电压过低 ';
  }
  if (event.outHigh) {
    str += ' 输出过流 ';
  }
  if (event.motorHigh) {
    str += ' 电机过载 ';
  }
  if (event.flySafe) {
    str += ' 飞车保护 ';
  }
  if (event.closeStop) {
    str += ' 开关门受阻 ';
  }
  if (str === '') {
    str = '运行正常';
  }
  return str;
};
const data = [{
  time: 0,
  value: 0,
}];
const cList = ['chartId0', 'chartId1', 'chartId2', 'chartId3', 'chartId4', 'chartId5', 'chartId6', 'chartId7', 'chartId8', 'chartId9', 'chartId10', 'chartId11'];
@connect(({ device }) => ({
  device,
}))
export default class RealTime extends Component {
  state = {
    switch: false,
    leftAnimation: {
      left: '0%',
      duration: 100,
    },
    rightAnimation: {
      right: '0%',
      duration: 100,
    },
    pick: [30],
    view: 1,
    stop: true,
  }
  componentWillMount() {
    this.setAnimation();
    this.fetchData();
    timer = setInterval(() => {
      this.fetchData();
    }, parseInt(this.state.pick[0]) * 1000);
  }

  componentDidMount() {
    cList.forEach((item) => {
      this.initVChart(item);
      this.initSChart(`s${item}`);
    });
  }

  componentWillUnmount() {
    const {
      device: {
        ws,
      },
    } = this.props;
    clearInterval(timer);
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    if (ws) {
      ws.close();
      clearInterval(play);
      clearInterval(callback);
    }
  }

  onChange = (val) => {
    clearInterval(timer);
    this.fetchData();
    timer = setInterval(() => {
      this.fetchData();
    }, parseInt(val[0]) * 1000);
    this.setState({
      pick: val,
    });
  }
  startTime = null;
  timeTicket = null;
  chartId0 = null;
  chartId1 = null;
  chartId2 = null;
  chartId3 = null;
  chartId4 = null;
  chartId5 = null;
  chartId6 = null;
  chartId7 = null;
  chartId8 = null;
  chartId9 = null;
  chartId10 = null;
  chartId11 = null;

  initVChart(chartId) {
    const width = window.innerWidth - 88;
    const chart = new F2.Chart({
      id: chartId,
      width,
      height: chartId === 'chartId0' ? 80 : 60,
      pixelRatio: window.devicePixelRatio, // 指定分辨率
      animate: false,
      padding: chartId === 'chartId0' ? [20, 1, 1, 10] : [0, 0, 1, 10],
    });
    if (chartId === 'chartId0') {
      chart.axis('time', {
        position: 'top',
        labelOffset: -65,
        label(text, index, total) {
          const cfg = {
            textAlign: 'center',
          };
          if (index === 0) {
            cfg.textAlign = 'start';
          }
          if (index > 0 && index === total - 1) {
            cfg.textAlign = 'end';
          }
          cfg.text = text;
          return cfg;
        },
      });
    } else {
      chart.axis('time', {
        position: 'bottom',
        label: null,
      });
    }
    chart.axis('value', {
      label: null,
      tickLine: null,
    });
    chart.source(data, { time: {
      type: 'timeCat',
      mask: 'ss.S',
      tickCount: 5,
      // range: [0, 1],
    },
    value: {
      type: 'linear',
      tickCount: 5,
    } });
    chart.line({
      sortable: false,
    }).position('time*value').color(randomHexColor());
    chart.render();
    this[chartId] = chart;
  }

  initSChart(chartId) {
    const width = parseInt(window.innerWidth / 2 - 20);
    const chart = new F2.Chart({
      id: chartId,
      width,
      height: 120,
      pixelRatio: window.devicePixelRatio, // 指定分辨率
      animate: false,
      padding: [18, 12, 20, 30],
    });
    chart.source(data, { time: {
      type: 'timeCat',
      mask: 'ss.S',
      tickCount: 4,
    },
    value: {
      type: 'linear',
      tickCount: 5,
      range: [0, 1],
    } });
    chart.line({
      sortable: false,
    }).position('time*value').color(randomHexColor());
    chart.render();
    this[chartId] = chart;
  }

  data0 = []
  data1 = []
  data2 = []
  data3 = []
  data4 = []
  data5 = []
  data6 = []
  data7 = []
  data8 = []
  data9 = []
  data10 = []
  data11 = []

  playWave = () => {
    const { device: { wave } } = this.props;
    const data = wave[wave.length - 1];
    const time = new Date().getTime();
    const arr = [data.speed, data.current, data.position, data.door, data.openIn, data.closeIn, data.openTo, data.closeTo, data.openSlow, data.closeSlow, data.openToOut, data.closeToOut];
    for (let idx = 0; idx < 12; idx++) {
      this[`data${idx}`].push(
        {
          time,
          value: arr[idx],
        }
      );
    }
    if (this.data0.length > 200) {
      for (let idx = 0; idx < 12; idx++) {
        this[`data${idx}`].splice(0, 1);
      }
    }
    for (let idx = 0; idx < 12; idx++) {
      if (this.state.view == 1) {
        this[`schartId${idx}`].changeData(this[`data${idx}`]);
      }
      if (this.state.view == 2) {
        this[`chartId${idx}`].changeData(this[`data${idx}`]);
      }
    }
  };

  echarts = [];
  setAnimation = () => {
    const { device: {
      event,
      doorWidth,
    } } = this.props;
    this.setState({
      leftAnimation: {
        left: `-${(event.position / doorWidth) * 50}%`,
        duration: 100,
      },
      rightAnimation: {
        right: `-${(event.position / doorWidth) * 50}%`,
        duration: 100,
      },
    });
  }
  fetchData = () => {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/radar/:id/:name').exec(location.pathname);
    if (match[1].indexOf('test') !== -1) {
      match[1] = '864507032589979';
    }
    dispatch({
      type: 'device/info',
      payload: {
        id: match[1],
      },
    }).then(() => {
      this.playWave();
      if (this.state.view == 0) {
        this.setAnimation();
      }
    });
  }
  playEvent = () => {
    const { device: {
      eventList,
    }, dispatch } = this.props;
    let event = null;
    const lastId = eventList.length ? eventList[eventList.length - 1].startId : 0;
    if (lastId > this.data0.length) {
      event = eventList.shift();
      if (event) {
        dispatch({
          type: 'device/play',
          payload: {
            event,
            isConcat: true,
            eventList,
          },
        }).then(() => {
          this.playWave();
          if (this.state.view == 0) {
            this.setAnimation();
          }
        });
      }
    } else if (lastId == 0 && this.data0.length && !callback) {
      clearInterval(play);
      this.closeSwitch();
      this.clear();
    }
  }
  switch = () => {
    clearInterval(play);
    clearInterval(timer);
    let {
      device: {
        ws,
      },
      dispatch,
    } = this.props;
    const match = pathToRegexp('/radar/:id/:name').exec(location.pathname);
    if (match[1].indexOf('test') !== -1) {
      match[1] = '864507032589979';
    }
    if (this.state.switch) {
      if (ws) {
        clearInterval(play);
        clearInterval(callback);
        ws.close();
      }
    } else {
      clearInterval(timer);
      const random = parseInt(Math.random() * 1000);
      dispatch({
        type: 'device/hbp',
        payload: {
          id: match[1],
          monitorId: random,
          threshold: 15,
          duration: this.state.pick[0],
        },
      });
      dispatch({
        type: 'device/socket',
        payload: {
          id: match[1],
          monitorId: random,
        },
      }).then(() => {
        ws = this.props.device.ws;
        if (ws) {
          ws.onmessage = (msg) => {
            try {
              if (JSON.parse(msg.data).code == 0) {
                dispatch({
                  type: 'device/message',
                  payload: {
                    data: JSON.parse(msg.data).list,
                  },
                });
              }
            } catch (e) {
              console.error(e);
            }
          };
          ws.onopen = (() => {
            this.clear();
            callback = setInterval(() => {
              ws.send('a');
            }, 500);
            play = setInterval(() => {
              this.playEvent();
            }, 100);
            setTimeout(() => {
              ws.close();
              clearInterval(callback);
              callback = null;
            }, parseInt(this.state.pick[0]) * 1000);
          });
          ws.onclose = (() => {
            clearInterval(timer);
            timer = setInterval(this.fetchData, parseInt(this.state.pick[0]) * 1000);
          });
        }
      });
    }
    this.setState({
      switch: !this.state.switch,
    });
  }
  clear = () => {
    cList.forEach((item, index) => {
      this[`data${index}`] = [];
      this[`chartId${index}`].clear();
      this[`schartId${index}`].clear();
      this[`chartId${index}`].source(data);
      this[`schartId${index}`].source(data);
      this[`chartId${index}`].line({
        sortable: false,
      }).position('time*value').color(randomHexColor());
      this[`schartId${index}`].line({
        sortable: false,
      }).position('time*value').color(randomHexColor());
      this[`chartId${index}`].render();
      this[`schartId${index}`].render();
    });
  }
  closeSwitch = () => {
    this.setState({ switch: false });
    this.forceUpdate();
  }
  tabChange = (idx) => {
    if (this.data0.length === 0) {
      return;
    }
    if (idx == 1) {
      for (let id = 0; id < 12; id++) {
        this[`schartId${id}`].changeData(this[`data${id}`]);
      }
    }
    if (idx == 2) {
      for (let id = 0; id < 12; id++) {
        this[`chartId${id}`].changeData(this[`data${id}`]);
      }
    }
    if (this.state.view == 0) {
      this.setAnimation();
    }
    this.setState({
      view: idx,
    });
  }
  render() {
    const { device: { event } } = this.props;
    let statusName = '无';
    if (event.openKeep) {
      statusName = '开门到位维持';
    }
    if (event.closeKeep) {
      statusName = '关门到位维持';
    }
    if (event.open) {
      statusName = '正在开门';
    }
    if (event.close) {
      statusName = '正在关门';
    }
    if (event.stop) {
      statusName = '停止输出';
    }
    return (
      <div className="content">
        <div className={styles.content}>
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <List style={{ backgroundColor: 'white' }} className="picker-list">
                <Picker
                  title="实时时长"
                  cols={1}
                  data={timeList}
                  value={this.state.pick}
                  onOk={v => this.onChange(v)}
                >
                  <List.Item arrow="horizontal">实时时长</List.Item>
                </Picker>
              </List>
            </Col>
            <Col className={styles.ctrl} xs={{ span: 6 }} md={{ span: 6 }}>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={this.switch}
                // disabled={event.isLoss || alertName(event) !== '运行正常'}
                checked={this.state.switch}
                defaultChecked={this.state.switch}
              />
            </Col>
          </Row>
          <Tabs tabs={tabs} swipeable={false} useOnPan={false} animated={false} initialPage={this.state.view} onChange={(v, idx) => this.tabChange(idx)}>
            <div className={styles.tab}>
              <Row
                type="flex"
                justify="space-around"
                align="middle"
                className={styles.ladder}
              >
                <Col
                  span={24}
                  className={classNames(styles.door)}
                >
                  <section>
                    <p>门坐标 ：<i className={styles.status}>{event.position || event.position === 0 ? event.position : '无'}</i>
                    </p>
                    <p>门状态 ：<i className={styles.status}>{statusName || '无'}</i>
                    </p>
                    <p>门电流 ：<i className={styles.status}>{isNaN(event.current) ? '无' : `${event.current} A`}</i>
                    </p>
                    <p style={{
                      display: 'flex',
                    }}
                    >
                      <i style={{
                        flexShrink: 0,
                      }}
                      >报警 ：
                      </i>
                      <i className={styles.status}>{alertName(event)}</i>
                    </p>
                  </section>
                </Col>
              </Row>
              <Row
                type="flex"
                justify="space-around"
                align="middle"
                className={styles.ladder}
              >
                <Col
                  span={24}
                  className={styles.door}
                >
                  <section>
                    <p>开门信号 ：
                      <i
                        className={classNames(styles.signal, event.openIn
                        ? styles.ready
                        : '')}
                      />
                    </p>
                    <p>开到位输出信号 ：
                      <i
                        className={classNames(styles.signal, event.openToOut
                        ? styles.ready
                        : '')}
                      />
                    </p>
                  </section>
                  <section>
                    <p>关门信号 ：
                      <i
                        className={classNames(styles.signal, event.closeIn
                        ? styles.ready
                        : '')}
                      />
                    </p>
                    <p>关到位输出信号 ：
                      <i
                        className={classNames(styles.signal, event.closeToOut
                        ? styles.ready
                        : '')}
                      />
                    </p>
                  </section>
                </Col>
              </Row>
              <Row
                type="flex"
                justify="space-around"
                align="middle"
                className={styles.ladder}
              >
                <Col
                  xs={{
                  span: 21,
                }}
                  md={{
                  span: 17,
                }}
                >
                  <div className={styles.shaft}>
                    <section>
                      <div />
                    </section>
                    <section className={styles.noborder}>
                      <div />
                    </section>
                    <p />
                    <div className={styles.shaftinfo}>
                      <p>关到位输入
                        <i
                          className={classNames(styles.signal, event.closeTo
                          ? styles.ready
                          : '')}
                        />
                      </p>
                      <p>开到位输入
                        <i
                          className={classNames(styles.signal, event.openTo
                          ? styles.ready
                          : '')}
                        />
                      </p>
                    </div>
                  </div>
                  <div className={styles.doors}>
                    <TweenOne
                      animation={this.state.leftAnimation}
                      // updateReStart={false}
                      style={{ left: '0%' }}
                      className={styles.doorbox}
                    />
                    <section className={styles.doorstitle}>
                      <div
                        className={event.door
                        ? styles.screen
                        : ''}
                      />
                      <p>光幕信号</p>
                    </section>
                    <TweenOne
                      animation={this.state.rightAnimation}
                      style={{ right: '-0%' }}
                      className={styles.doorbox}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles.tab}>
              <Row gutter={8} type="flex" justify="center" align="middle">
                <Col span={23} className={styles.scanvas}>
                  <div className={styles['split-tips']}>
                    <section>
                      <p className={styles.name}>速度</p>
                      <p className={styles.current}>{event.speed}</p>
                      <p className={styles.unit}>m/s</p>
                    </section>
                    <section>
                      <p className={styles.name}>电流</p>
                      <p className={styles.current}>{event.current}</p>
                      <p className={styles.unit}>A</p>
                    </section>
                    <section>
                      <p className={styles.name}>位置</p>
                      <p className={styles.current}>{event.position}</p>
                    </section>
                    <section>
                      <p className={styles.name}>门光幕</p>
                      <p className={styles.current}>{event.door}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开门输入</p>
                      <p className={styles.current}>{event.openIn}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关门输入</p>
                      <p className={styles.current}>{event.closeIn}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开到位输入</p>
                      <p className={styles.current}>{event.openTo}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关到位输入</p>
                      <p className={styles.current}>{event.closeTo}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开减速输入</p>
                      <p className={styles.current}>{event.openSlow}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关减速输入</p>
                      <p className={styles.current}>{event.closeSlow}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开到位输出</p>
                      <p className={styles.current}>{event.openToOut}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关到位输出</p>
                      <p className={styles.current}>{event.closeToOut}</p>
                    </section>
                  </div>
                  <canvas id="schartId0" />
                  <canvas id="schartId1" />
                  <canvas id="schartId2" />
                  <canvas id="schartId3" />
                  <canvas id="schartId4" />
                  <canvas id="schartId5" />
                  <canvas id="schartId6" />
                  <canvas id="schartId7" />
                  <canvas id="schartId8" />
                  <canvas id="schartId9" />
                  <canvas id="schartId10" />
                  <canvas id="schartId11" />
                </Col>
              </Row>
            </div>
            <div className={styles.tab}>
              <Row type="flex" justify="center" align="middle">
                <Col span={23} className={styles.canvas}>
                  <div className={styles['collection-tips']}>
                    <section>
                      <p className={styles.name}>速度</p>
                      <p className={styles.current}>{event.speed}</p>
                      <p className={styles.unit}>m/s</p>
                    </section>
                    <section>
                      <p className={styles.name}>电流</p>
                      <p className={styles.current}>{event.current}</p>
                      <p className={styles.unit}>A</p>
                    </section>
                    <section>
                      <p className={styles.name}>位置</p>
                      <p className={styles.current}>{event.position}</p>
                    </section>
                    <section>
                      <p className={styles.name}>门光幕</p>
                      <p className={styles.current}>{event.door}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开门输入</p>
                      <p className={styles.current}>{event.openIn}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关门输入</p>
                      <p className={styles.current}>{event.closeIn}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开到位输入</p>
                      <p className={styles.current}>{event.openTo}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关到位输入</p>
                      <p className={styles.current}>{event.closeTo}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开减速输入</p>
                      <p className={styles.current}>{event.openSlow}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关减速输入</p>
                      <p className={styles.current}>{event.closeSlow}</p>
                    </section>
                    <section>
                      <p className={styles.name}>开到位输出</p>
                      <p className={styles.current}>{event.openToOut}</p>
                    </section>
                    <section>
                      <p className={styles.name}>关到位输出</p>
                      <p className={styles.current}>{event.closeToOut}</p>
                    </section>
                  </div>
                  <canvas id="chartId0" />
                  <canvas id="chartId1" />
                  <canvas id="chartId2" />
                  <canvas id="chartId3" />
                  <canvas id="chartId4" />
                  <canvas id="chartId5" />
                  <canvas id="chartId6" />
                  <canvas id="chartId7" />
                  <canvas id="chartId8" />
                  <canvas id="chartId9" />
                  <canvas id="chartId10" />
                  <canvas id="chartId11" />
                </Col>
              </Row>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}
