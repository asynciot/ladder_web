import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col} from 'antd';
import styles from './Index.less';


export default class Question extends Component {
  render() {
    return (
      <div className={styles.main}>
	        <div className={styles.content}>
				尊敬的用户,您好!您对本软件的使用有哪些意见和建议,请填入下方的文本框中:			
	        </div>
	        <div className={styles.comments}>
		        <textarea rows="6" placeholder="请输入您宝贵的意见……" />
	        </div>      	        
	        <div className={styles.content}>
	        	感谢您对我们的支持和厚爱,我们定会将这个平台越做越好!
	        	<button type="submit" className={styles.submit}	>提交</button>
	        </div>
      </div>
    )
  }
}
