const menuData = [{
  name: '雷达',
  icon: 'environment-o',
  path: 'radar',
  children: [{
    name: '地图',
    path: 'map',
  }, {
    name: '列表',
    path: 'list/all',
    query: null,
  }],
}, 
{
  name: '技术',
  icon: 'tool',
  path: 'tech/code',
}, 
//{
//name: '服务',
//icon: 'team',
//path: 'service',
//}, 
{
  name: '我的',
  icon: 'home',
  path: 'company',
},
];

const mobileMenu = [{
  name: '搜索范围',
  icon: 'environment-o',
  path: '/radar',
  children: [{
    name: '控制器',
    path: 'map',
  }, {
    name: '控制柜',
    path: 'cabinet',
  }],
}, 
{
  name: '个人信息',
  icon: 'user',
  path: 'user/profile',
}, 
{
  name: '软件设置',
  icon: 'setting',
  path: 'setting',
}, 
{
  name: '问题反馈',
  icon: 'form',
  path: 'question',
}, 
{
  name: '使用帮助',
  icon: 'bulb',
  path: 'help',
}, 
{
  name: '退出应用',
  icon: 'logout',
  path: 'logout',
}
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}
export const getMenuData = () => formatter(menuData);
export const getMobileData = () => formatter(mobileMenu);

