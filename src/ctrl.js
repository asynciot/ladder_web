const language = window.localStorage.getItem("language");
export const ctrlMenu = [{
	num: 1,
	label: (language == 'en') ? '4.01 Menu' : '4.01 菜单',
	children: [{
			num: 10,
			label: 'Motor rated power',
			value: '',
			visible: true,
			range:"0.1~45.0",
			explain:"4.01-01",
			unit:' W'
		},
		{
			num: 1,
			label: 'Motor rated voltage',
			value: '',
			visible: true,
			range:"380~380",
			explain:"4.01-01",
			unit:' V'
		},
		{
			num: 1,
			label: 'Motor rated current',
			value: '',
			visible: true,
			range:"2~300",
			explain:"4.01-01",
			unit:' A'
		},
		{
			num: 1,
			label: 'Motor rated torque',
			value: '',
			visible: true,
			range:"30~2500",
			explain:"4.01-01",
			unit:' '
		},
		{
			num: 10,
			label: 'Motor rated rev',
			value: '',
			visible: true,
			range:"0~500",
			explain:"4.01-01",
			unit:' rpm'
		},
		{
			num: 1,
			label: 'Motor pole logarithm',
			value: '',
			visible: true,
			range:"0~99",
			explain:"4.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Motor rated BEMF',
			value: '',
			visible: true,
			range:'60~400',
			explain:"4.01-08",
			unit:' V'
		},
		{
			num: 1,
			label: 'Motor phase sequence',
			value: '',
			visible: true,
			range:'0~1',
			explain:"4.01-11",
			unit:' '
		},
		{
			num: 1,
			label: 'Encoder feedback direction',
			value: '',
			visible: true,
			range:'0~1',
			explain:"4.01-12",
			unit:' '
		},
		{
			num: 1,
			label: 'Electrical angle at initial power-on',
			value: '',
			visible: true,
			range:language == 'zh'?"不可更改":"Unalterable",
			explain:"4.01-14",
			unit:' '
		},
		{
			num: 1,
			label: 'Offset electrical angle at zero',
			value: '',
			visible: true,
			range:language == 'zh'?"不可更改":"Unalterable",
			explain:"4.01-14",
			unit:' '
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
			range:'1~31',
			explain:"4.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Speed loop lag ampli-fication factor b',
			value: '',
			visible: true,
			range:'1~31',
			explain:"4.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Integral gain coeffici-ent of speed loop',
			value: '',
			visible: true,
			range:'1~31',
			explain:"4.02-03",
			unit:' '
		},
		{
			num: 1,
			label: 'Damping gain coeffi-cient of speed loop',
			value: '',
			visible: true,
			range:'1~31',
			explain:"4.02-04",
			unit:' '
		},
		{
			num: 1,
			label: 'Differential gain coefficient of speed loop',
			value: '',
			visible: true,
			range:'0~31',
			explain:"4.02-05",
			unit:' '
		},
		{
			num: 1,
			label: 'Proportional gain of current loop',
			value: '',
			visible: true,
			range:'1~63',
			explain:"4.02-06",
			unit:' '
		},
		{
			num: 1,
			label: 'Integral gain of current loop',
			value: '',
			visible: true,
			range:'1~63',
			explain:"4.02-06",
			unit:' '
		},
		{
			num: 1,
			label: 'Output current limit',
			value: '',
			visible: true,
			range:'1~300',
			explain:"4.02-08",
			unit:' A'
		},
		{
			num: 1,
			label: 'Carrier frequency',
			value: '',
			visible: true,
			range:'2~16',
			explain:"4.02-09",
			unit:' kHz'
		},
		{
			num: 1,
			label: 'Dead zone time setting',
			value: '',
			visible: true,
			range:'0~3',
			explain:"4.02-10",
			unit:' us'
		},
		{
			num: 1,
			label: 'Exciting current setting',
			value: '',
			visible: true,
			range:'1~15',
			explain:"4.02-10",
			unit:' '
		},
		{
			num: 1,
			label: 'Integral coefficient of starting brake distance',
			value: '',
			visible: true,
			range:'0~4000',
			explain:"4.02-12",
			unit:' '
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
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X2 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X3 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X4 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X5 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X6 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X7 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X8 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X9 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X10 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X11 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X12 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X13 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X14 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X15 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X16 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X17 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X18 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X19 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X20 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X21 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X22 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X23 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X24 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
		},
		{
			num: 1,
			label: 'X25 Function selection',
			value: '',
			visible: true,
			range:'0~380',
			explain:"7.01-01",
			unit:' '
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
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Polarity selection of back light curtain switch',
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Polarity selection of front door safety edge switch',
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Polarity selection of back door safety edge switch',
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: "Polarity selection of 'front door open in place' switch",
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: "Polarity selection of 'bear door open in place' switch",
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: "Polarity selection of 'front door close in place' switch",
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: "Polarity selection of 'back door close in place' switch",
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Full load input selection',
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
		},
		{
			num: 1,
			label: 'Overload input selection',
			value: '',
			visible: true,
			range:'0~1',
			explain:"7.02-01",
			unit:' '
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
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB2 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB3 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB4 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB5 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB6 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB7 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
		},
		{
			num: 1,
			label: 'PB8 Function selection',
			value: '',
			visible: true,
			range:'0~18',
			explain:"7.03-01",
			unit:' '
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
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y2 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y3 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y4 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y5 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y6 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y7 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'Y8 Function selection',
			value: '',
			visible: true,
			range:'0~14',
			explain:"7.04-01 expalin",
			unit:' '
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
			range:'0~5',
			explain:"7.05-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'CP3‐Y2 Function Selection',
			value: '',
			visible: true,
			range:'0~5',
			explain:"7.05-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'CP3‐Y3 Function Selection',
			value: '',
			visible: true,
			range:'0~5',
			explain:"7.05-01 expalin",
			unit:' '
		},
		{
			num: 1,
			label: 'CP8',
			value: '',
			visible: true,
			range:'0~2',
			explain:"None",
			unit:' '
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
			unit:' '
		},
		{
			num: 1,
			label: 'Parallel main/auxiliary elevators',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Removal of landing call adhesion',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Deletion of mistaken car command',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Control box configuration',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Landing call configuration',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Selection of analog weighing channels',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Anti-nuisance function selection',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Selection of arrival gong output',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Delay of arrival gong output',
			value: '',
			visible: true,
			unit:' s'
		},
		{
			num: 1,
			label: 'VIP service',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Security floor service at night',
			value: '',
			visible: true,
			unit:' '
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
			unit:' '
		},
		{
			num: 1,
			label: 'Options of fire switch configuration',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Firefighting mode',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Brake switch detection',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Start running with door closed limit detected',
			value: '',
			visible: true,
			unit:' '
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
			unit:' '
		},
		{
			num: 1,
			label: 'Blackout emergency rescue',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Backup power running',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Earthquake control',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Voice station report',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Forced closing',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Remote monitor',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Cell monitorg',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Landing arrival gong',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Landing forecasting lamp',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'IC card service',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'IC card service floor 1',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'IC card service floor 2',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'IC card service floor 3',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'IC card service floor 4',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'IC card service floor 00‐FF call switch',
			value: '',
			visible: true,
			unit:' '
		}
	],
}, {
	num: 1,
	label: (language == 'en') ? 'Software Version' : '软件版本号',
	children: [{
			num: 1,
			label: 'Elevator control software version',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Motor control software version',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Serial communication software version',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Car control software version',
			value: '',
			visible: true,
			unit:' '
		},
		{
			num: 1,
			label: 'Parallel communication software version',
			value: '',
			visible: true,
			unit:' '
		}
	],
}]
