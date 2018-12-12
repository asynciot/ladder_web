import React from 'react';
import styles from './LadderLayout.less';

export default ({ children }) => {
  return (
    <div className={styles.content}>
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
};
