import React, { PureComponent } from 'react';
import styles from './index.less';
import arrow from '../../assets/arrow.png';

export default class FlootBar extends PureComponent {

  render() {
    const { position, content, barClick } = this.props;
    return (
      <div className={`${styles.bar} ${styles[position]}`} onClick={barClick}>
        <p>{content}</p>
        <img src={arrow} alt="arrow" />
      </div>
    );
  }
}
