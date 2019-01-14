import React, { Component } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
// import LazyLoadImg from 'lazy-load-img';
import LazyLoad from 'react-lazy-load';
import styles from './Reader.less';

const books = [
  {
    label: 'NSFC01-01B',
    page: 20,
  }, {
    label: 'NSFC01-02T',
    page: 38,
  }, {
    label: 'CtrlCode',
    page: 5,
  },{
    label: 'FAMILY_LAD',
    page: 6,
  },
];

const prefix = (num, length) => {
  return (Array(length).join('0') + num).slice(-length);
};
@connect(({ tech }) => ({
  tech,
}))
export default class Reader extends Component {
  componentWillMount() {
    const { location } = this.props;
    const currentPath = pathToRegexp('/tech/reader/:name').exec(location.pathname);
    const name = currentPath[1];
    const length = books.filter(item => item.label === name)[0].page;
    for (let idx = 0; idx < length; idx++) {
      this.data[idx] = {
        url: `/${name}/${prefix(idx + 1, 4)}.jpg`,
        page: idx,
      };
      this.timerList[idx] = {
        img: idx,
        time: 0,
      };
    }
  }
  componentDidMount() {
  }
  // componentWillUnMount() {
  //   clearInterval(this.timer);
  // }
  // calc = () => {
  //   const { scrollTop, clientHeight } = ReactDOM.findDOMNode(this.refs.view);
  //   this.list.forEach((item, index) => {
  //     const { height, offsetTop} = ReactDOM.findDOMNode(item);
  //     const center = offsetTop + height / 2;
  //     if (center >= scrollTop && center <= scrollTop + clientHeight) {
  //       this.timerList[index].time += 50;
  //     }
  //   });
  // }
  timer= null;
  timerList = [];
  data = [];
  list = [];
  render() {
    return (
      <div className="content">
        {
          this.data.map((item, index) => (
            <LazyLoad height={400} key={index} offsetBottom={100}>
              <img className={styles.img} key={item.page} src={item.url} alt="doc" />
            </LazyLoad>
          ))
        }
      </div>
    );
  }
}
