import React, { Component } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import styles from './Reader.less';

const prefix = (num, length) => {
	return (Array(length).join('0') + num).slice(-length);
};
@connect(({ tech }) => ({
	tech,
}))
export default class Reader extends Component {
	state = {
		url:"",
	}
	componentWillMount() {
		const { location } = this.props;
		const currentPath = pathToRegexp('/tech/reader/:name').exec(location.pathname);
		const name = currentPath[1];
		this.setState({
			url:"http://server.asynciot.com/getfile?filePath=instruction/"+name+".pdf",
		})
	}
	componentDidMount() {
	}
	render() {
		return (
			<div className="content">
				{
					<iframe src={this.state.url} height="100%" width="100%" />
				}
			</div>
		);
	}
}
