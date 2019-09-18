export const menuB=[{
	num:1,
	label: (window.localStorage.getItem("language")=='en') ? 'P Params':'P组参数',
	children:[
		{
			num:1,label:'Operation enable setting',value:'',visible: true,
			range:"0~1",
			explain:"P Params1"},
		{num:1,label:'Low speed torque lifting',value:'',visible: true,
			range:"0~100",
			explain:"P Params2"},
		{num:1,label:'High speed torque lifting',value:'',visible: true,
			range:"0~2000",
			explain:"P Params3"},
		{num:1,label:'Full opening remain torque',value:'',visible: true,
			range:"0~2000",
			explain:"P Params4"},
		{num:1,label:'Full close remain torque',value:'',visible: true,
			range:"0~2000",
			explain:"P Params5"},
		{num:1,label:'Opening torque loop max voltage',value:'',visible: true,
			range:"0~2000",
			explain:"P Params6"},
		{num:1,label:'Closing torque loop max voltage',value:'',visible: true,
			range:"0~2000",
			explain:"P Params7"},
		{num:1,label:'Closing decelarate torque loop max voltage',visible: true,
			range:"0~2000",
			explain:"P Params8"},
		{num:1,label:'DC brake voltage',value:'',visible: true,
			range:"0~2000",
			explain:"P Params9"},
		{num:1,label:'Max torque',value:'',visible: true,
			range:"0~2000",
			explain:"P Params10"},
		{num:100,label:'Overload protect current',value:'',visible: true,
			range:"0.00~20.00",
			explain:"P Params11"},
		{num:100,label:'Closing overload current when accelerate and decelarate',value:'',visible: true,
			range:"0.00~20.00",
			explain:"parameter(Closing overload current when accelerate and decelarate)"},
		{num:100,label:'Closing overload current when smooth running',value:'',visible: true,
			range:"0.00~20.00",
			explain:"parameter(Closing overload current when smooth running)"},
		{num:1,label:'Current zero value',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Current zero value)"},
		{num:1,label:'Closing overload reopen enable setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Closing overload reopen enable setting)"},
		{num:1,label:'Full opening relay pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Full opening relay pole setting)"},
		{num:1,label:'Full close relay pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Full close relay pole setting)"},
		{num:1,label:'Multi-function relay Y pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Multi-function relay Y pole setting)"},
		{num:1,label:'Full opening input switch pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Full opening input switch pole setting)"},
		{num:1,label:'Full closing input switch pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Full closing input switch pole setting)"},
		{num:1,label:'Oepning decelerate input switch pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Oepning decelerate input switch pole setting)"},
		{num:1,label:'Closing decelerate input switch pole setting',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Closing decelerate input switch pole setting)"},
		{num:1,label:'Relay Y function setting',value:'',visible: true,
			range:"0~4",
			explain:"parameter(Relay Y function setting)"},
		{num:1,label:'Door operator testing run automatically',value:'',visible: true,
			range:"0~2",
			explain:"P24"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~1",
			explain:"parameter(Retined)"},
		{num:1,label:'Weight empty current of motor',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Weight empty current of motor)"},
		{num:1,label:'Data initialization',value:'',visible: true,
			range:"0~3",
			explain:"parameter(Data initialization)"},
		{num:1,label:'Closing-end Torque torque boost',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Closing-end Torque torque boost)"},
		{num:1,label:'The sign of Control mode',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(The sign of Control mode)"},
		{num:1,label:'Closing speed reduction position',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Closing speed reduction position)"},
		{num:1,label:'Opening speed reduction position',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Opening speed reduction position)"},
		{num:1,label:'Door width',value:'',visible: true,
			range:"0~5000",
			explain:"parameter(Door width)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~2000",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~0",
			explain:"parameter(Retined)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0~0",
			explain:"parameter(Retined)"}]
	},{
	num:1,label: (window.localStorage.getItem("language")=='en') ? 'D Params':'D组参数',
	children:[
		{num:10,label:'Closing start speed',value:'',visible: true,
			range:"0.0~50.0",
			explain:"D1"},
		{num:10,label:'Closing High Speed',value:'',visible: true,
			range:"0.0~50.0",
			explain:"D2"},
		{num:10,label:'Closing Low Speed 1',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing Low speed 1)"},
		{num:10,label:'Closing Low Speed 2',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing Low speed 2)"},
		{num:10,label:'Opening Start Speed',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening Start speed)"},
		{num:10,label:'Opening High Speed',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening High speed)"},
		{num:10,label:'Opening Low Speed 1',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening Low speed 1)"},
		{num:10,label:'Opening Low Speed 2',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening Low speed 2)"},
		{num:10,label:'Keeping speed for closing complete',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Keeping speed for closing complete)"},
		{num:10,label:'Keeeping speed for opening complete',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Keeeping speed for opening complete)"},
		{num:10,label:'Maximum Output Frequency',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Maximum Output Frequency)"},
		{num:10,label:'Reference Frequency',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Reference Frequency 2)"},
		{num:10,label:'Closing speed-up time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing speed-up time)"},
		{num:10,label:'Closing speed-down time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing speed-down time)"},
		{num:10,label:'opening speed-up time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(opening speed-up time)"},
		{num:10,label:'opening speed-down time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(opening speed-down time)"},
		{num:1,label:'Start S Curve',value:'',visible: true,
			range:"0~500",
			explain:"parameter(Start S Curve 2)"},
		{num:1,label:'S Curve on Arrival',value:'',visible: true,
			range:"0~500",
			explain:"parameter(S Curve on Arrival 2)"},
		{num:10,label:'Stop protect time when full opening',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Stop protect time when full opening)"},
		{num:10,label:'Closing low speed 2 switching time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing low speed 2 switching time)"},
		{num:10,label:'DC brake remain time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(DC brake remain time)"},
		{num:100,label:'Overcurrent check time when closing',value:'',visible: true,
			range:"0.00~5.00",
			explain:"parameter(Overcurrent check time when closing)"},
		{num:10,label:'Overcurrent check time point when closing',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Overcurrent check time point when closing)"},
		{num:100,label:'Overcurrent check time when opening and closing',value:'',visible: true,
			range:"0.00~5.00",
			explain:"parameter(Overcurrent check time when opening and closing)"},
		{num:10,label:'Closing Over-current Relay Action Time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing Over-current Relay Action Time 2)"},
		{num:10,label:'Full closing relay output delay',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Full closing relay output delay)"},
		{num:100,label:'Deceleration Time during Door Operator Emergency Stop',value:'',visible: true,
			range:"0.00~5.00",
			explain:"parameter(Deceleration Time during Door Operator Emergency Stop 2)"},
		{num:1,label:'Door reverse delay time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Door reverse delay time)"},
		{num:1,label:'Opetation replace time',value:'',visible: true,
			range:"5~12",
			explain:"parameter(Opetation replace time)"},
		{num:10,label:'Running test total opening and closing time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Running test total opening and closing time)"},
		{num:1,label:'Detection of Current Filtration Time',value:'',visible: true,
			range:"0~500",
			explain:"parameter(Detection of Current Filtration Time 2)"},
		{num:1,label:'Filtration Time at Given Speed',value:'',visible: true,
			range:"0~500",
			explain:"parameter(Filtration Time at Given Speed 2)"},
		{num:10,label:'Opening start acceleration time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening start acceleration time)"},
		{num:10,label:'Closing start acceleration time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing start acceleration time)"},
		{num:10,label:'Opening accelerate 1 period accelerate time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening accelerate 1 period accelerate time)"},
		{num:10,label:'Closing accelerate 1 period accelerate time',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing accelerate 1 period accelerate time)"},
		{num:10,label:'Opening accelerate 1 period speed',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Opening accelerate 1 period speed)"},
		{num:10,label:'Closing accelerate 1 period speed',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing accelerate 1 period speed)"},
		{num:1,label:'Closing overtime reverse opening delay',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Closing overtime reverse opening delay)"},
		{num:1,label:'Retined',value:'',visible: true,
			range:"0.0~50.0",
			explain:"parameter(Retined)"}],
	}];

export const menuT = [
	{
		num:1,label: (window.localStorage.getItem("language")=='en') ? 'F07 Menu':'F07 菜单',
		children: [
		{num:100,label: 'Closing Start-up Speed',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Closing Start-up Speed)"
		},
		{num:100,label: 'Closing High Speed',value:'',visible: true,
			range:"0.50~49.80",
			explain:"parameter(Closing High Speed)"
		},
		{num:100,label: 'Allowed Tolerance Frequency at Stable Speed',value:'',visible: true,
			range:"0.00~49.80",
			explain:"F07-03"},
		{num:100,label: 'Synchronous Door Coupler Opening Speed',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Synchronous Door)"},
		{num:100,label: 'Closing Low Speed 1',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Closing Low Speed 1)"},
		{num:100,label: 'Closing Low Speed 2',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Closing Low Speed 2)"},
		{num:100,label: 'Opening Start Speed',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Opening Start Speed)"},
		{num:100,label: 'Opening High Speed',value:'',visible: true,
			range:"1.30~49.80",
			explain:"parameter(Opening High Speed)"},
		{num:100,label: 'Opening Low Speed 1',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Opening Low Speed 1)"},
		{num:100,label: 'Opening Low Speed 2',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Opening Low Speed 2)"},
		{num:100,label: 'Self-learning and Power-up Speed',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Self-learning)"}, 
		{num:100,label: 'Opening Limit Position Torque Coefficient',value:'',visible: true,
			range:"0.01~20.00",
			explain:"parameter(Opening Limit)"}, 
		{num:100,label: 'Closing Low Speed Torque Coefficient',value:'',visible: true,
			range:"1.00~200.0",
			explain:"parameter(Closing Low Speed)"}, 
		{num:100,label: 'Run Speed for Start at Low Speed Area',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Run Speed for Start)"}, 
		{num:100,label: 'Run Speed during power-up of Synchronous Motor',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Run Speed during power-up)"}, 
		{num:100,label: 'Allowed Tolerance frequency during Acceleration and Deceleration',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Allowed Tolerance)"}, 
		{num:100,label: 'Maximum Output Frequency',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Maximum Output)"}, 
		{num:100,label: 'Reference Frequency',value:'',visible: true,
			range:"0.00~49.80",
			explain:"parameter(Reference Frequency)"}
		]
	},
	{
		num:1,label: (window.localStorage.getItem("language")=='en') ? 'F08 Menu':'F08 菜单',
		children: [
			{
				num:100,label: 'Acceleration Time',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Acceleration Time)"
			}, {
				num:100,label: 'Deceleration Time',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"F08-02"
			}, {
				num:10,label: 'Start S Curve',
				value:'',visible: true,
				range:"0.1~50.0",
				explain:"parameter(Start S Curve)"
			}, {
				num:10,label: 'S Curve on Arrival',
				value:'',visible: true,
				range:"0.1~50.0",
				explain:"parameter(S Curve on Arrival)"
			}, {
				num:10,label: 'Opening Stop Protection Time',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Opening Stop)"
			}, {
				num:10,label: 'Closing Stop Protection Time',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Closing Stop)"
			}, {
				num:10,label: 'Motor Cut-off Time during IPM Failure',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Motor Cut-off)"
			}, {
				num:1,label: 'Allowed Minutely Fault Count',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Allowed Minutely)"
			}, {
				num:100,label: 'Deceleration Time during Door Operator Emergency Stop',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Deceleration Time)"
			}, {
				num:10,label: 'Door Reverse Motion Delay Time',
				value:'',visible: true,
				range:"0.2~4.0",
				explain:"parameter(Door Reverse Motion)"
			}, {
				num:10,label: 'Braking Torque Holding Time',
				value:'',visible: true,
				range:"0.1~6553.0",
				explain:"parameter(Braking Torque Holding Time)"
			}, {
				num:1,label: 'Detection of Current Filtration Time',
				value:'',visible: true,
				range:"0~200",
				explain:"parameter(Detection of Current Filtration Time)"
			}, {
				num:10,label: 'Total Time of Opening and Closing during Test Run',
				value:'',visible: true,
				range:"0.1~6553.0",
				explain:"parameter(Total Time of Opening and Closing)"
			}, {
				num:100,label: 'Closing Over-current Allowed Time',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Closing Over-current Allowed Time)"
			}, {
				num:100,label: 'Opening/Closing Over-current Allowed Time',
				value:'',visible: true,
				range:"0.01~655.30",
				explain:"parameter(Opening/Closing Over-current Allowed Time)"
			}, {
				num:10,label: 'Closing Over-current Relay Action Time',
				value:'',visible: true,
				range:"0.1~6553.0",
				explain:"parameter(Closing Over-current Relay Action Time)"
			}, {
				num:10,label: 'Going-out Delay Time',
				value:'',visible: true,
				range:"0.1~6553.0",
				explain:"parameter(Going-out Delay Time)"
			}, {
				num:10,label: 'losing In Place Output Delay Time',
				value:'',visible: true,
				range:"0.0~10.0",
				explain:"parameter(losing In Place Output Delay Time)"
			}, {
				num:10,label: 'Allowed Opening/Closing Time',
				value:'',visible: true,
				range:"0.1~6553.0",
				explain:"parameter(Allowed Opening/Closing Time)"
			}, {
				num:10,label: 'Over-current Motor Cut-off Time',
				value:'',visible: true,
				range:"0.1~6553.0",
				explain:"parameter(Over-current Motor Cut-off Time)"
			}, {
				num:1,label: 'Filtration Time at Given Speed',
				value:'',visible: true,
				range:"0~1000",
				explain:"parameter(Filtration Time at Given Speed)"
			}, {
				num:1,label: 'Filtration Time at Test Speed',
				value:'',visible: true,
				range:"0~1000",
				explain:"parameter(Filtration Time at Test Speed)"
			}, {
				num:1,label: 'Output Filtration Time',
				value:'',visible: true,
				range:"0~1000",
				explain:"parameter(Output Filtration Time)"
			},
		]
	}, {
		num:1,label: (window.localStorage.getItem("language")=='en') ? 'F09 Menu':'F09 菜单',
		children: [
			{
				num:1,label: 'Opening Deceleration Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Opening Deceleration Distance)"
			}, {
				num:1,label: 'Closing Deceleration Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Closing Deceleration Distance)"
			}, {
				num:1,label: 'Opening Limit Position',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Opening Limit Position)"
			}, {
				num:1,label: 'Closing Limit Position',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Closing Limit Position)"
			}, {
				num:1,label: 'Run Distance at Unlocking Speed',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Run Distance at Unlocking Speed)"
			}, {
				num:1,label: 'Run Distance at Closing Start Speed',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Run Distance at Closing Start Speed)"
			}, {
				num:1,label: 'Safety Touch Pad Limit Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Safety Touch Pad Limit Distance)"
			}, {
				num:1,label: 'Door Width Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Door Width Distance)"
			}, {
				num:1,label: 'Opening Low Speed Area Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Opening Low Speed Area Distance)"
			}, {
				num:1,label: 'Closing Low Speed Area Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Closing Low Speed Area Distance)"
			}, {
				num:1,label: 'Acceleration Distance for Synchronous Door Coupler Opening',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Acceleration Distance for Synchronous)"
			}, {
				num:1,label: 'Deceleration Distance for Synchronous Door Operator Opening',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Deceleration Distance for Synchronous)"
			}, {
				num:1,label: 'Deceleration Distance for Opening Start at Low Speed Area',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Deceleration Distance for Opening Start)"
			}, {
				num:1,label: 'Deceleration Distance for Closing Start-up at Low Speed Area',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Deceleration Distance for Closing Start-up)"
			}, {
				num:1,label: 'Closing Over-current Detection Distance',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Closing Over-current Detection Distance)"
			}, {
				num:1,label: 'Opening Limit Protection Position',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Opening Limit Protection Position)"
			}, {
				num:1,label: 'Closing Limit Protection Position',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Closing Limit Protection Position)"
			}, {
				num:1,label: 'Deceleration Position for Opening Low Speed 1',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Deceleration Position for Opening Low Speed 1)"
			}, {
				num:1,label: 'Deceleration Position for Closing Low Speed 1',
				value:'',visible: true,
				range:"1~65530",
				explain:"parameter(Deceleration Position for Closing Low Speed 1)"
			},
		]
	}, {
		num:1,label: (window.localStorage.getItem("language")=='en') ? 'F10 Menu':'F10 菜单',
		children: [
			{
				num:100,label: 'Low Speed Torque',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(Low Speed Torque)"
			}, {
				num:100,label: 'High Speed Torque',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(High Speed Torque)"
			}, {
				num:100,label: 'Opening Hold Torque',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(Opening Hold Torque)"
			}, {
				num:100,label: 'Closing Hold Torque',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(Closing Hold Torque)"
			}, {
				num:100,label: 'Voltage during Synchronous Motor Start-up Running',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(Voltage during Synchronous Motor Start-up Running)"
			}, {
				num:100,label: 'Maximum Voltage of Torque Ring',
				value:'',visible: true,
				range:"1.00~300.00",
				explain:"parameter(Maximum Voltage of Torque Ring)"
			}, {
				num:100,label: 'Maximum Voltage of Excitation Ring',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(Maximum Voltage of Excitation Ring)"
			}, {
				num:100,label: 'Closing Overload Current during Stable Operation',
				value:'',visible: true,
				range:"0.01~6.00",
				explain:"parameter(Closing Overload Current during Stable Operation)"
			}, {
				num:100,label: 'Opening/Closing Overload Protection Current',
				value:'',visible: true,
				range:"0.01~6.00",
				explain:"parameter(Opening/Closing Overload Protection Current)"
			}, {
				num:100,label: 'Closing Overload Current during Acceleration and Deceleration',
				value:'',visible: true,
				range:"0.01~100.00",
				explain:"parameter(Closing Overload Current during Acceleration and Deceleration)"
			},
		]
	}, {
		num:1,label: (window.localStorage.getItem("language")=='en') ? 'F11 Menu':'F11 菜单',
		children: [
			{
				num:100,label: 'Max torque',
				value:'',visible: true,
				range:"1.00~300.00",
				explain:"parameter(Max torque)"
			}, {
				num:100,label: 'Decrease of Over-current',
				value:'',visible: true,
				range:"0.00~100.00",
				explain:"parameter(Decrease of Over-current)"
			}, {
				num:100,label: 'Closing Holding Torque 1',
				value:'',visible: true,
				range:"0.00~100.00",
				explain:"parameter(Closing Holding Torque 1)"
			}, {
				num:1,label: 'Current Sensor U-phase Zero Current Offset',
				value:'',visible: true,
				range:"1~700",
				explain:"parameter(Current Sensor U-phase Zero Current Offset)"
			}, {
				num:1,label: 'Current Sensor V-phase Zero Current Offset',
				value:'',visible: true,
				range:"1~700",
				explain:"parameter(Current Sensor V-phase Zero Current Offset)"
			}, {
				num:1,label: 'Current Proportion of Current Sensor',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Current Proportion of Current Sensor)"
			}, {
				num:1,label: 'Speed Ring P Parameter',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Speed Ring P Parameter)"
			}, {
				num:1,label: 'Speed Ring I Parameter',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Speed Ring I Parameter)"
			}, {
				num:1,label: 'Excitation Current Ring P Parameter',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Excitation Current Ring P Parameter)"
			}, {
				num:1,label: 'Excitation Current Ring I Parameter',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Excitation Current Ring I Parameter)"
			}, {
				num:1,label: 'Torque Current Ring P Parameter',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Torque Current Ring P Parameter)"
			},{
				num:1,label: 'Torque Current Ring I Parameter',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Torque Current Ring I Parameter)"
			}, {
				num:1,label: 'Closing High Speed Torque Limit Setting',
				value:'',visible: true,
				range:"1~20000",
				explain:"parameter(Closing High Speed Torque Limit Setting)"
			}, {
				num:1,label: 'Menu adjustment demonstration',
				value:'',visible: true,
				range:"0~10000",
				explain:"parameter(Menu adjustment demonstration)"
			}, {
				num:1,label: 'Synchronous Motor Magnetic Pole Position',
				value:'',visible: true,
				range:"0~65535",
				explain:"parameter(Synchronous Motor Magnetic Pole Position)"
			}, {
				num:1,label: 'Encoder Pulse Per Revolution',
				value:'',visible: true,
				range:"1~10000",
				explain:"parameter(Encoder Pulse Per Revolution)"
			},
		]
	}, {
		num:1,label: (window.localStorage.getItem("language")=='en') ? 'F12 Menu':'F12 菜单',
		children: [
			{
				num:1,label: 'Synchronous Door Selection Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Synchronous Door Selection Setting)"
			}, {
				num:1,label: 'Motor UVW wiring direction setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Motor UVW wiring direction setting)"
			}, {
				num:1,label: 'Door Operator Test Run Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Door Operator Test Run Setting)"
			}, {
				num:1,label: 'Door Width Self-determination Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Door Width Self-determination Setting)"
			}, {
				num:1,label: 'Data Initialization',
				value:'',visible: true,
				range:"0~3",
				explain:"parameter(Data Initialization)"
			}, {
				num:1,label: 'Determination of Magnetic Pole Position',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Determination of Magnetic Pole Position)"
			}, {
				num:1,label: 'Data Write-protected Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Data Write-protected Setting)"
			}, {
				num:1,label: 'Selection of Opening Brake/Long-term Brake',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Selection of Opening Brake/Long-term Brake)"
			}, {
				num:1,label: 'Selection of Closing Brake/Long-term Brake',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Selection of Closing Brake/Long-term Brake)"
			}, {
				num:1,label: 'Encoder Direction Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Encoder Direction Setting)"
			}, {
				num:1,label: 'Closing Overload Reverse Opening Motion Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Closing Overload Reverse Opening Motion Setting)"
			}, {
				num:1,label: 'Control Mode Setting',
				value:'',visible: true,
				range:"0~2",
				explain:"parameter(Control Mode Setting)"
			}, {
				num:1,label: 'Fireman Function Selection',
				value:'',visible: true,
				range:"0~3",
				explain:"parameter(Fireman Function Selection)"
			}, {
				num:1,label: 'Opening Limit Output Relay Polarity Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Opening Limit Output Relay Polarity Setting)"
			}, {
				num:1,label: 'Closing Limit Output Relay Polarity Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Closing Limit Output Relay Polarity Setting)"
			}, {
				num:1,label: 'Retined',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Retined)"
			}, {
				num:1,label: 'Retined',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Retined)"
			}, {
				num:1,label: 'Opening Limit Switch Polarity Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Opening Limit Switch Polarity Setting)"
			}, {
				num:1,label: 'Closing Limit Switch Polarity Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Closing Limit Switch Polarity Setting)"
			}, {
				num:1,label: 'Motor Tempreture Switch Polarity setting',
				value:'',visible: true,
				range:"0~2",
				explain:"parameter(Motor Tempreture Switch Polarity setting)"
			}, {
				num:1,label: 'Light Curtain Polarity Setting',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Light Curtain Polarity Setting)"
			}, {
				num:1,label: 'Motor Pole Number Setting',
				value:'',visible: true,
				range:"0~2",
				explain:"parameter(Motor Pole Number Setting)"
			}, {
				num:1,label: 'Retined',
				value:'',visible: true,
				range:"0~4",
				explain:"parameter(Retined)"
			}, {
				num:1,label: 'Retined',
				value:'',visible: true,
				range:"0~4",
				explain:"parameter(Retined)"
			}, {
				num:1,label: 'Opening Input Signal Terminal Selection',
				value:'',visible: true,
				range:"0~7",
				explain:"parameter(Opening Input Signal Terminal Selection)"
			}, {
				num:1,label: 'Closing Input Signal Terminal Selection',
				value:'',visible: true,
				range:"0~7",
				explain:"parameter(Closing Input Signal Terminal Selection)"
			}, {
				num:1,label: 'Opening Limit Input Signal Terminal Selection',
				value:'',visible: true,
				range:"0~7",
				explain:"parameter(Opening Limit Input Signal Terminal Selection)"
			}, {
				num:1,label: 'Closing Limit Input Signal Terminal Selection',
				value:'',visible: true,
				range:"0~7",
				explain:"parameter(Closing Limit Input Signal Terminal Selection)"
			}, {
				num:1,label: 'Retined',
				value:'',visible: true,
				range:"0~7",
				explain:"parameter(Retined)"
			}, {
				num:1,label: 'Retined',
				value:'',visible: true,
				range:"0~7",
				explain:"parameter(Retined)"
			}, {
				num:1,label: 'Fire-fighting Input Signal Terminal Selection',
				value:'',visible: true,
				range:"0~7",
				explain:"F12-31"
			}, {
				num:1,label: 'Setting for front and rear door',
				value:'',visible: true,
				range:"0~1",
				explain:"parameter(Setting for front and rear door)"
			}, {
				num:1,label: 'Closing Auto Detection Stop Position Setting',
				value:'',visible: true,
				range:"0~1000",
				explain:"parameter(Closing Auto Detection Stop Position Setting)"
			}
		]
	}
];