import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { ListView } from 'antd-mobile';
import styles from './Reader.less';

const prefix = (num, length) => {
  return (Array(length).join('0') + num).slice(-length);
};

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}
let data = [];
export default class Reader extends Component {
  state = {
    height: window.innerHeight - 106,
    dataSource: new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
  }

  componentWillMount() {
    const { location } = this.props;
    const currentPath = pathToRegexp('/tech/reader/:name').exec(location.pathname);
    const name = currentPath[1];
    for (let idx = 0; idx < 20; idx++) {
      data[idx] = {
        url: `/${name}/${prefix(idx+1, 4)}.jpg`,
        page: idx,
      };
    }
  }
  componentDidMount() {
    // setTimeout(() => {
    genData();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
      isLoading: false,
      height: this.state.height,
    });
    // }, 600);
  }
  lv = null;
  imgs = [];
  scroll = () => {
    console.log(1);
  }
  render() {
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ padding: '5px 0' }}>
          <img className={styles.img} src={obj.url} alt="" />
        </div>
      );
    };
    return (
      <div className="content">
        <ListView
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          onScroll={()=>this.scroll}
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
        />
      </div>
    );
  }
}
