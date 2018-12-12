import '@babel/polyfill';
import dva from 'dva';

// import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import moment from 'moment';
// import VConsole from 'vconsole';

import FastClick from 'fastclick';
// import './rollbar';
import onError from './error';
import './index.less';
// 1. Initialize
// var vConsole = new VConsole();
window.moment = moment;
window.$signal = {
  3: '联通3G',
  40: '移动4G',
  41: '联通4G',
}
const app = dva({
  history: createHistory(),
  onError,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
FastClick.attach(document.body, {});
