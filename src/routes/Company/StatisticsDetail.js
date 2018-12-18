import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Input, Form } from 'antd';
import { Picker, List, Tabs, Switch, Calendar, InputItem } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import styles from './Statistics.less';
import MobileNav from '../../components/MobileNav';
import { getStatistic } from '../../services/api';

const FormItem = Form.Item;
const randomHexColor = () => { // 随机生成十六进制颜色
  let hex = Math.floor(Math.random() * 11777216).toString(16); // 生成ffffff以内16进制数
  while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
    hex = `0${hex}`;
  }
  return `#${hex}`; // 返回‘#'开头16进制颜色
};

const textStyle = {
  fontSize: 11,
};
let date = [];
const style = {
  textStyle: {
    color: '#1E90FF',
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
};
const errorOri = {
  textStyle,
  title: {
    text: '错误统计',
    textStyle: style.textStyle,
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: 35,
    bottom: 30,
    top: 48,
    right:12,
  },
  xAxis: [{
      axisLabel: {
        fontSize: 9,
        margin: 3,
        interval:2,
      },
      data: date
    },
  ],
  yAxis: [{
      splitLine: style.splitLine,
      minInterval: 1,
      axisLabel: {
        fontSize: 9,
        margin: 6,       
      },
    },
  ],
  series: [
    {
      name: '数量',
      type: 'bar',
      barWidth: 8,
      color: randomHexColor(),
      data: [],
    },
  ],
  animation: false,
};
const alertOri = {
  textStyle,
  title: {
    text: '警报统计',
    textStyle: style.textStyle,
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b} <br/> {a} : {c}',
  },
  grid: {
    left: 26,
    bottom: 30,
    top: 48,
    right: 12,
  },
  xAxis: [{
      axisLabel: {
        fontSize: 9,
        margin: 3,
        interval:2,
      },
      axisLine: style.axisLine,
      data: date
    },
  ],
  yAxis: [
    {
      scale: false,
      nameGap: 3,
      splitLine: style.splitLine,
      minInterval: 1,
      axisLabel: {
        fontSize: 9,
        margin: 6,
      },
      axisLine: style.axisLine,

    },
  ],
  series: [
    {
      name: '数量',
      type: 'bar',
      barWidth: 8,
      color: randomHexColor(),
      data: [],
    },
  ],
  animation: false,
};
const timeList = [{
  label: '1天',
  value: 1,
},{
  label: '7天',
  value: 7,
}, {
  label: '30天',
  value: 30,
},];
@connect(({ tech,company }) => ({
  tech,
  currentCompany: company.currentCompany,
}))
@Form.create()
export default class History extends Component {
  state = {
    navs: [{
      label: '全部',
      link: '/company/statistics/all',
    }, {
      label: '控制器',
      link: '/company/statistics/door',
    }, {
      label: '控制柜',
      link: '/company/statistics/ctrl',
    }],
    switch: false,
    pick: [1],
    history: false,
    view: 0,
    wave: [],
    stop: true,
    statistics: {
    	error: 0,
    	alert: 0,
    	door: 0,
    	ctrl: 0,
    },
    errorOpt: Object.assign({}, errorOri),
    alertOpt: Object.assign({}, alertOri),
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.getStatisticData(id);
  }
  componentWillReceiveProps(nextProps) {
    const locationChanged = nextProps.location !== this.props.location
    if (locationChanged) {
      this.getStatisticData(nextProps.match.params.id);
    }
  }
  getStatisticData(id) {
    const { pick, statistics, errorOpt, alertOpt } = this.state;
    id ? '':id = this.props.match.params.id;
    const query = { id, days: pick[0], detail: true, page:1, num: 20 };
    getStatistic(query).then(res => {
      // if (res.code === 0 && res.data.list.length != 0) {
        let error = 0, alert = 0, errorList = [], alertList = [], data = {};
        res.data.list.forEach(item => {
          item.code == 0 ? alert++ : error++;
          const time = moment(item.createTime).format("YYYYMMDD")
          data[time] == undefined ? data[time] = [0, 0]: '';
          item.code == 0 ? data[time][0]++ : data[time][1]++;
        });
        date = Object.keys(data);
        date.length == 0 ? date = [moment(new Date()).format("YYYYMMDD")] : '';
        errorList = Object.values(data).map(item=>{
          return item[1]
        })
        alertList = Object.values(data).map(item=>{
          return item[0]
        })
        errorList.length == 0 ? errorList=[0]:'';
        alertList.length == 0 ? alertList=[0]:'';
        errorOpt.xAxis[0].data = date;
        errorOpt.series[0].data = errorList;
        alertOpt.xAxis[0].data = date;
        alertOpt.series[0].data = alertList;
        statistics.error = error;
        statistics.alert = alert;
        this.setState({
          statistics,
          alertOpt,
          errorOpt,
        });
      // }
    })
  }
  onSelect(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'tech/query',
      payload: {
        type: e[0],
      },
    });
    this.setState({
      model: e,
      name: '',
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.getStatisticData(this.props.match.params.id);
  }
  input = (val) => {
    this.setState({
      name: val,
    });
  }
  onChange = (val) => {
    this.setState({
      pick: val,
    })
  }
  showData = () => {
    const { history } = this.props;
    history.push('/company/data/details');
  }
  render() {
    const { currentCompany, isMobile, match } = this.props;   
    const { statistics } = this.state;
    const type = match.params.id;
    return (
      <div className="content">
        <div className={styles.content}>
          <div className={styles.date}>
            {
            isMobile ? (
              <div className={styles.tab1} style={{paddingTop: 0}}>
                <List style={{ backgroundColor: 'white' }} className="picker-list">
                  <Picker
                    title="时长"
                    cols={1}
                    data={timeList}
                    value={this.state.pick}
                    onOk={v => this.onChange(v)}
                  >
                    <List.Item arrow="horizontal">时长</List.Item>
                  </Picker>
                </List>
                <Row type="flex" justify="space-around" align="middle" style={{ margin: '10px 0' }}>
                  <Col xs={{ span: 22 }} sm={{ span: 18 }} md={{ span: 16 }}>
                    <Button onClick={this.handleSubmit} type="primary" style={{ width: '100%' }} >查询</Button>
                  </Col>
                </Row>
              </div>
              ) : (
                <Form onSubmit={this.handleSubmit}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 18 }}>
                      <FormItem label="初始日期：" {...formItemLayout}>
                        {getFieldDecorator('username', {
                          rules: [{
                            message: '请输入初始日期！',
                          }],
                        })(
                          <Input
                            placeholder="初始日期"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 18 }}>
                      <FormItem label="结束日期：" {...formItemLayout}>
                        {getFieldDecorator('username', {
                          rules: [{
                            message: '请输入结束日期！',
                          }],
                        })(
                          <Input
                            placeholder="结束日期"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 16 }}>
                      <FormItem className="tc">
                        <Button type="primary" htmlType="submit" >查询</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
            	)
          }             
          </div>        
          <div>
            <Row
              type="flex"
              justify="space-around"
              align="middle"
              className={styles.ladder}
            >
              <Col xs={{span: 24,}} className={styles.door} md={{span: 18,}}>
                <section>
                  <p >故障数量 ：{statistics.error}</p>
                  <p className={styles.new}>报警数量 ：{statistics.alert}</p>
                </section>
              </Col>
            </Row>              
          </div>
          <div className={styles.tab}>
            <Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>	            
              <Col xs={{ span: 24 }} md={{ span: 36 }}>
                  <ReactEcharts
                    className={styles.chart}
                    option={this.state.alertOpt}
                    style={{ height: 180, paddingBottom: 0,  }}
                  />
                {/* <div className={styles.tips}>
                  <Link to="/company/data/details" className={styles.name}>详情</Link>
                </div> */}
              </Col>	            	            
            </Row>
            <Row gutter={6} type="flex" justify="center" align="middle" className={styles.charts}>
              <Col xs={{ span: 24 }} md={{ span: 36 }}>	              
                  <ReactEcharts
                    className={styles.chart}
                    option={this.state.errorOpt}
                    style={{ height: 180, paddingBottom: 0  }}
                  />
                  {/* <div className={styles.tips}>
                    <Link to="/company/data/details" className={styles.name}>详情</Link>
                  </div> */}
              </Col>
            </Row> 
          </div>
        </div>
      </div>
    );
  }
}
