const language = window.localStorage.getItem("language");
export const IOMenu = [{
	label:language=="zh"?"I/O 板输入配置":"I/O Board input configuration",
	value:0,
	children: [{
			label: 'X1',
			value: '7.01-011',
			Polarity:0,
		},{
			label: 'X2',
			value: '7.01-020',
			Polarity:0,
		},{
			label: 'X3',
			value: '7.01-030',
			Polarity:0,
		},{
			label: 'X4',
			value: '7.01-041',
			Polarity:1,
		},{
			label: 'X5',
			value: '7.01-050',
			Polarity:0,
		},{
			label: 'X6',
			value: '7.01-061',
			Polarity:1,
		},{
			label: 'X7',
			value: '7.01-070',
			Polarity:0,
		},{
			label: 'X8',
			value: '7.01-080',
			Polarity:0,
		},{
			label: 'X9',
			value: '7.01-090',
			Polarity:0,
		},{
			label: 'X10',
			value: '7.01-100',
			Polarity:0,
		},{
			label: 'X11',
			value: '7.01-111',
			Polarity:1,
		},{
			label: 'X12',
			value: '7.01-121',
			Polarity:1,
		},{
			label: 'X13',
			value: '7.01-131',
			Polarity:1,
		},{
			label: 'X14',
			value: '7.01-141',
			Polarity:1,
		},{
			label: 'X15',
			value: '7.01-151',
			Polarity:1,
		},{
			label: 'X16',
			value: '7.01-161',
			Polarity:1,
		},{
			label: 'X17',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X18',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X19',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X20',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X21',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X22',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X23',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X24',
			value: '7.01-000',
			Polarity:0,
		},{
			label: 'X25',
			value: '7.01-000',
			Polarity:0,
		},
	]
},{
	label:language=="zh"?"I/O 板输出配置":"I/O Board output configuration",
	value:1,
	children: [{
			label: 'Y1',
			value: '7.04-01',
			Polarity:2,
		},{
			label: 'Y2',
			value: '7.04-02',
			Polarity:2,
		},{
			label: 'Y3',
			value: '7.04-03',
			Polarity:2,
		},{
			label: 'Y4',
			value: '7.04-04',
			Polarity:2,
		},{
			label: 'Y5',
			value: '7.04-00',
			Polarity:2,
		},{
			label: 'Y6',
			value: '7.04-00',
			Polarity:2,
		},{
			label: 'Y7',
			value: '7.04-00',
			Polarity:2,
		}]
},]
export const Board = [{
	label:"轿顶板输入配置",
	value:0,
	children: [{
			label: language=="zh"?'前门光幕开关极性':"Polarity of Frontdoor Light Curtain Switch",
			value: 1,
		},{
			label: language=="zh"?'后门光幕开关极性':"Polarity of Backdoor Light Curtain Switch",
			value: '1',
		},{
			label: language=="zh"?'前门安全触板开关极性':"Polarity of Frontdoor safety contact switch",
			value: '0',
		},{
			label: language=="zh"?'后门安全触板开关极性':"Polarity of Backdoor safety contact switch",
			value: '0',
		},{
			label: language=="zh"?'前门开门到位开关极性':"Polarity of Frontdoor Open-in-place Switch",
			value: '1',
		},{
			label: language=="zh"?'后门开门到位开关极性':"Polarity of Backdoor Open-in-place Switch",
			value: '1',
		},{
			label: language=="zh"?'前门关门到位开关极性':"Polarity of Frontdoor closing in place switch",
			value: '1',
		},{
			label: language=="zh"?'后门关门到位开关极性':"Polarity of Backdoor closing in place switch",
			value: '1',
		},{
			label: language=="zh"?'满载输入':"Full load input",
			value: '1',
		},{
			label: language=="zh"?'超载输入':"Overload input",
			value: '1',
		}]
},{
	label:"轿顶板输出配置",
	value:1,
	children: [{
			label:'CP3-Y1',
			value: '7.05-01',
		},{
			label:'CP3-Y2',
			value: '7.05-02',
		},{
			label:'CP3-Y3',
			value: '7.05-03',
		},{
			label: language=="zh"?'轿顶串行功能扩展':"Serial Function Expansion of Car Top",
			value: language=="zh"?'真彩液晶':"LCD",
		}]
},]
