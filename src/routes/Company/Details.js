import React, {Component} from 'react';
import { connect} from 'dva';
import {Picker,List, InputItem} from 'antd-mobile';
import {Row,Col,Button,Form, Select,Input} from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './Details.less';
import MobileNav from '../../components/MobileNav';

const Option = Select.Option;
const FormItem = Form.Item;
const options = [{
  label: 'NSFC01-02T',
  value: 'NSFC01-02T',
}, {
  label: 'NSFC02-02T',
  value: 'NSFC02-02T',
}, ];
@connect(({
  tech
}) => ({
  tech,
}))
@Form.create()
export default class Tech extends Component {
  state = {
    navs: [{
      label: '全部',
      link: '/company/data/details',
    }, {
      label: '门机',
      link: '/company/data/details',
    }, {
      label: '控制器',
      link: '/company/data/details',
    }],
    name: '',
    activeIdx: null,
    solution: {},
  }
  componentDidMount() {}

  input = (val) => {
    this.setState({
      name: val,
    });
  }
  showSolution = (val, idx) => {
    this.setState({
      solution: val,
      activeIdx: idx,
    });
  }
  render() {
    const {
      list,
      form,
      isMobile,
      location
    } = this.props;
    const {
      getFieldDecorator
    } = form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 12
        },
        sm: {
          span: 7
        },
        md: {
          span: 7
        },
      },
      wrapperCol: {
        xs: {
          span: 12
        },
        sm: {
          span: 15
        },
        md: {
          span: 13
        },
      },
    };
    return ( <
      div className = "content" >
      <
      MobileNav key = "nav"
      navs = {
        this.state.navs
      }
      /> <
      div className = {
        styles.content
      } >
      <
      Row type = "flex"
      justify = "space-around"
      align = "middle"
      className = {
        styles.tech
      } >
      <
      Col xs = {
        {
          span: 22
        }
      }
      sm = {
        {
          span: 18
        }
      }
      md = {
        {
          span: 18
        }
      } >
      <
      table border = "0"
      cellSpacing = "0"
      cellPadding = "0"
      className = {
        styles.table
      } >
      <
      thead >
      <
      tr >
      <
      td > 序号 < /td> <
      td > 类别 < /td> <
      td > 型号 < /td> <
      td > 类型 < /td> <
      td > 详细 < /td> <
      td > 时间 < /td> < /
      tr > <
      /thead> <
      tbody > { <
        tr >
        <
        td > 1 < /td> <
        td > 门机 < /td> <
        td > #F8375 < /td> <
        td > 错误 < /td> <
        td > 错误代码E0 < /td> <
        td > 2017 / 1 / 1 < br / > 12: 00: 00 < /td> < /
        tr >
      } { <
        tr >
          <
          td > 2 < /td> <
        td > 控制器 < /td> <
        td > #A1384 < /td> <
        td > 错误 < /td> <
        td > 错误代码E1 < /td> <
        td > 2017 / 1 / 1 < br / > 12: 00: 00 < /td> < /
        tr >
      } { <
        tr >
          <
          td > 3 < /td> <
        td > 门机 < /td> <
        td > #F8375 < /td> <
        td > 错误 < /td> <
        td > 错误代码E2 < /td> <
        td > 2017 / 1 / 1 < br / > 12: 00: 00 < /td> < /
        tr >
      } { <
        tr >
          <
          td > 4 < /td> <
        td > 门机 < /td> <
        td > #F8375 < /td> <
        td > 警报 < /td> <
        td > 警报代码W1 < /td> <
        td > 2017 / 1 / 1 < br / > 12: 00: 00 < /td> < /
        tr >
      } { <
        tr >
          <
          td > 5 < /td> <
        td > 门机 < /td> <
        td > #F8375 < /td> <
        td > 警报 < /td> <
        td > 警报代码W2 < /td> <
        td > 2017 / 1 / 1 < br / > 12: 00: 00 < /td> < /
        tr >
      } <
      /tbody> < /
      table > <
      /Col> < /
      Row > <
      /div> < /
      div >
    );
  }
}
