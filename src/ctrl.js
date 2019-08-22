const language = window.localStorage.getItem("language");
export const ctrlMenu = [{
	num: 1,
	label: (language == 'en') ? '4.01 Menu' : '4.01 菜单',
	children: [{
			num: 10,
			label: 'Motor rated power',
			value: '',
			visible: true,
			max:45.0,
			min:0.1,
		},
		{
			num: 1,
			label: 'Motor rated voltage',
			value: '',
			visible: true,
			max:380,
			min:380,
		},
		{
			num: 1,
			label: 'Motor rated current',
			value: '',
			visible: true,
			max:300,
			min:2,
		},
		{
			num: 1,
			label: 'Motor rated torque',
			value: '',
			visible: true,
			max:2500,
			min:30,
		},
		{
			num: 10,
			label: 'Motor rated rev',
			value: '',
			visible: true,
			max:500,
			min:0,
		},
		{
			num: 1,
			label: 'Motor pole logarithm',
			value: '',
			visible: true,
			max:99,
			min:0,
		},
		{
			num: 1,
			label: 'Motor rated BEMF',
			value: '',
			visible: true,
			max:400,
			min:60,
		},
		{
			num: 1,
			label: 'Motor phase sequence',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Encoder feedback direction',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Electrical angle at initial power-on',
			value: '',
			visible: true,
			max:language == 'zh'?"不可更改":"Unalterable",
			min:language == 'zh'?"不可更改":"Unalterable",
		},
		{
			num: 1,
			label: 'Offset electrical angle at zero',
			value: '',
			visible: true,
			max:language == 'zh'?"不可更改":"Unalterable",
			min:language == 'zh'?"不可更改":"Unalterable",
		}
	]
}, {
	num: 1,
	label: (language == 'en') ? '4.02 Menu' : '4.02 菜单',
	children: [{
			num: 1,
			label: 'Speed loop lead amp-lification factor f',
			value: '',
			visible: true,
			max:31,
			min:1,
		},
		{
			num: 1,
			label: 'Speed loop lag ampli-fication factor b',
			value: '',
			visible: true,
			max:31,
			min:1,
		},
		{
			num: 1,
			label: 'Integral gain coeffici-ent of speed loop',
			value: '',
			visible: true,
			max:31,
			min:1,
		},
		{
			num: 1,
			label: 'Damping gain coeffi-cient of speed loop',
			value: '',
			visible: true,
			max:31,
			min:1,
		},
		{
			num: 1,
			label: 'Differential gain coefficient of speed loop',
			value: '',
			visible: true,
			max:31,
			min:0,
		},
		{
			num: 1,
			label: 'Proportional gain of current loop',
			value: '',
			visible: true,
			max:63,
			min:1,
		},
		{
			num: 1,
			label: 'Integral gain of current loop',
			value: '',
			visible: true,
			max:63,
			min:1,
		},
		{
			num: 1,
			label: 'Output current limit',
			value: '',
			visible: true,
			max:300,
			min:1,
		},
		{
			num: 1,
			label: 'Carrier frequency',
			value: '',
			visible: true,
			max:16,
			min:2,
		},
		{
			num: 1,
			label: 'Dead zone time setting',
			value: '',
			visible: true,
			max:3,
			min:0,
		},
		{
			num: 1,
			label: 'Exciting current setting',
			value: '',
			visible: true,
			max:15,
			min:1,
		},
		{
			num: 1,
			label: 'Integral coefficient of starting brake distance',
			value: '',
			visible: true,
			max:4000,
			min:0,
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '7.01 Menu' : '7.01 菜单',
	children: [{
			num: 1,
			label: 'X1 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X2 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X3 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X4 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X5 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X6 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X7 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X8 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X9 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X10 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X11 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X12 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X13 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X14 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X15 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X16 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X17 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X18 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X19 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X20 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X21 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X22 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X23 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X24 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		},
		{
			num: 1,
			label: 'X25 Function selection',
			value: '',
			visible: true,
			max:380,
			min:0,
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '7.02 Menu' : '7.02 菜单',
	children: [{
			num: 1,
			label: 'Polarity selection of front light curtain switch',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Polarity selection of back light curtain switch',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Polarity selection of front door safety edge switch',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Polarity selection of back door safety edge switch',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: "Polarity selection of 'front door open in place' switch",
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: "Polarity selection of 'bear door open in place' switch",
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: "Polarity selection of 'front door close in place' switch",
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: "Polarity selection of 'back door close in place' switch",
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Full load input selection',
			value: '',
			visible: true,
			max:1,
			min:0,
		},
		{
			num: 1,
			label: 'Overload input selection',
			value: '',
			visible: true,
			max:1,
			min:0,
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '7.03 Menu' : '7.03 菜单',
	children: [{
			num: 1,
			label: 'PB1 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB2 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB3 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB4 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB5 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB6 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB7 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		},
		{
			num: 1,
			label: 'PB8 Function selection',
			value: '',
			visible: true,
			max:18,
			min:0,
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '7.04 Menu' : '7.04 菜单',
	children: [{
			num: 1,
			label: 'Y1 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y2 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y3 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y4 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y5 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y6 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y7 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		},
		{
			num: 1,
			label: 'Y8 Function selection',
			value: '',
			visible: true,
			max:14,
			min:0,
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '7.05 Menu' : '7.05 菜单',
	children: [{
			num: 1,
			label: 'CP3‐Y1 Function Selection',
			value: '',
			visible: true,
			max:5,
			min:0,
		},
		{
			num: 1,
			label: 'CP3‐Y2 Function Selection',
			value: '',
			visible: true,
			max:5,
			min:0,
		},
		{
			num: 1,
			label: 'CP3‐Y3 Function Selection',
			value: '',
			visible: true,
			max:5,
			min:0,
		},
		{
			num: 1,
			label: 'CP8',
			value: '',
			visible: true,
			max:2,
			min:0,
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '9.01 Menu' : '9.01 菜单',
	children: [{
			num: 1,
			label: 'Parallel/group control selection',
			value: '',
			visible: true,
			explain:"00：单梯,01：并联,02：群控"
		},
		{
			num: 1,
			label: 'Parallel main/auxiliary elevators',
			value: '',
			visible: true,
			explain:"00：副梯,FF：主梯"
		},
		{
			num: 1,
			label: 'Removal of landing call adhesion',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Deletion of mistaken car command',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Control box configuration',
			value: '',
			visible: true,
			explain:"00：单操纵箱,01：第二操纵箱作为残疾人操纵箱,02：第二操纵箱作为后门操纵箱"
		},
		{
			num: 1,
			label: 'Landing call configuration',
			value: '',
			visible: true,
			explain:"00：单层站召唤,01：残疾人层站召唤开通,02：后门层站召唤开通"
		},
		{
			num: 1,
			label: 'Selection of analog weighing channels',
			value: '',
			visible: true,
			explain:"00：无效,01：轿顶板,02：主板"
		},
		{
			num: 1,
			label: 'Anti-nuisance function selection',
			value: '',
			visible: true,
			explain:"00：无效,01：称重判断,02：光幕判断,03：轻载开关判断"
		},
		{
			num: 1,
			label: 'Selection of arrival gong output',
			value: '',
			visible: true,
			explain:"00：到站钟一直开启,01：到站钟在设置的时间内开启,02：到站钟一直关闭"
		},
		{
			num: 1,
			label: 'Delay of arrival gong output',
			value: '',
			visible: true,
			explain:""
		},
		{
			num: 1,
			label: 'VIP service',
			value: '',
			visible: true,
			explain:"00：未开通,01：通过层站召唤按钮启用开通,02：通过层站召唤端子启用开通,03：通过 IO 板端口启用开通"
		},
		{
			num: 1,
			label: 'Security floor service at night',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '9.02 Menu' : '9.02 菜单',
	children: [{
			num: 1,
			label: 'Input options of fire elevator switch',
			value: '',
			visible: true,
			explain:"00：无效,01：层站召唤板端子输入,02：IO 板端子输入"
		},
		{
			num: 1,
			label: 'Options of fire switch configuration',
			value: '',
			visible: true,
			explain:"00：启用消防电梯开关，消防员钥匙开关和消防联动开关输入无效,01：启用消防电梯开关和消防联动开关，消防员钥匙开关输入无效,02：启用消防电梯开关和消防员钥匙开关，消防联动开关无效,03：启用消防电梯开关、消防员钥匙开关、消防联动开关"
		},
		{
			num: 1,
			label: 'Firefighting mode',
			value: '',
			visible: true,
			explain:"00：系统标配消防模式,01：香港消防模式"
		},
		{
			num: 1,
			label: 'Brake switch detection',
			value: '',
			visible: true,
			explain:"00：不检测抱闸行程开关,01：检测左右抱闸行程开关,02：检测左抱闸行程开关,03：检测右抱闸行程开关"
		},
		{
			num: 1,
			label: 'Start running with door closed limit detected',
			value: '',
			visible: true,
			explain:"00：启动运行部检测关门到位,01：启动运行检测关门到位，关门不到位禁止电梯运行"
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? '9.03 Menu' : '9.03 菜单',
	children: [{
			num: 1,
			label: 'Re-leveling',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Blackout emergency rescue',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Backup power running',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Earthquake control',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Voice station report',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Forced closing',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Remote monitor',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Cell monitorg',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Landing arrival gong',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'Landing forecasting lamp',
			value: '',
			visible: true,
			explain:"00：关闭,01：开通"
		},
		{
			num: 1,
			label: 'IC card service',
			value: '',
			visible: true,
			explain:"00：关闭,FF：开通"
		},
		{
			num: 1,
			label: 'IC card service floor 1',
			value: '',
			visible: true,
			explain:"00-FF"
		},
		{
			num: 1,
			label: 'IC card service floor 2',
			value: '',
			visible: true,
			explain:"00-FF"
		},
		{
			num: 1,
			label: 'IC card service floor 3',
			value: '',
			visible: true,
			explain:"00-FF"
		},
		{
			num: 1,
			label: 'IC card service floor 4',
			value: '',
			visible: true,
			explain:"00-FF"
		},
		{
			num: 1,
			label: 'IC card service floor 00‐FF call switch',
			value: '',
			visible: true,
			explain:"00-FF"
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? 'Software Version' : '软件版本号',
	children: [{
			num: 1,
			label: 'Elevator control software version',
			value: '',
			visible: true
		},
		{
			num: 1,
			label: 'Motor control software version',
			value: '',
			visible: true
		},
		{
			num: 1,
			label: 'Serial communication software version',
			value: '',
			visible: true
		},
		{
			num: 1,
			label: 'Car control software version',
			value: '',
			visible: true
		},
		{
			num: 1,
			label: 'Parallel communication software version',
			value: '',
			visible: true
		}
	],
}]
