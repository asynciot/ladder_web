import React, { Component } from 'react';
import { connect } from 'dva';
import { List, SearchBar, Modal, PullToRefresh, Button } from 'antd-mobile';

const { Item } = List;
const { Brief } = Item;
const { alert } = Modal;
@connect(({ message, global }) => ({ message, global }))
export default class Service extends Component {
  state = {
    modal: false,
    height: document.documentElement.clientHeight,
    refreshing: false,
    down: false,
    item: {
      title: '',
      info: '',
      content: '',
    },
  }
  componentDidMount() {
  }
  onClose = () => {
    this.setState({
      modal: false,
    });
  }
  showAlert = (item) => {
    const type = parseInt(item.type);
    switch (type) {
      case 0:
        this.setState({
          modal: true,
          item,
        });
        break;
      default:
        alert(item.title, <div>{item.content}</div>, [
          { text: '拒绝', onPress: () => this.reject(item) },
          { text: '同意', onPress: () => this.accept(item) },
        ]);
    }
  }
  accept = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/accept',
      payload: {
        msgId: item.id,
        id: item.info,
      },
    });
  }
  reject = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/reject',
      payload: {
        msgId: item.id,
        id: item.info,
      },
    });
  }
  ptr = null;
  render() {
    const { isMobile, message: { list } } = this.props;
    return (
      <div className="content">
        {
          isMobile && (
            <SearchBar placeholder="搜索" maxLength={12} />
          )
        }
        <List style={{ backgroundColor: 'white' }}>
          <PullToRefresh
            damping={60}
            ref={el => this.ptr = el}
            style={{
              height: this.state.height,
              overflow: 'auto',
            }}
            indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
            direction={this.state.down ? 'down' : 'up'}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              setTimeout(() => {
                this.setState({ refreshing: false });
              }, 1000);
            }}
          >
          {
            list.length ? list.map(item => (
              <Item onClick={() => this.showAlert(item)} key={item.id} extra={moment(item.createTime).format('HH:mm')} align="top" multipleLine>
                {item.title}<Brief>{item.content}</Brief>
              </Item>
            )) : (
              <Item>暂无消息</Item>
            )
          }
          </PullToRefresh>
        </List>
        <Modal
          visible={this.state.modal}
          transparent
          maskClosable={true}
          title={this.state.item.title}
          footer={[{ text: '确定', onPress: () => this.onClose() }]}
        >
          <div style={{ height: 40, overflow: 'scroll' }}>{this.state.item.content}</div>
        </Modal>
      </div>
    );
  }
}
