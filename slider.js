var slider = function module(){
	var config = {
		min: 0,
		max: 10,
		step: 1,
		size: 500,
		handleSize: 25,
		offset: 10,
		margin: {top: 5, right: 5, bottom: 5, left: 5},
		transitionDuration: 10000
	};

	var dispatch = d3.dispatch('change');

	var playIcon = 'M 7.2416834,3.8654577 C 6.8923974,3.8592177 6.5182144,3.9487777 6.2104334,4.2092077 C 5.3925194,4.9012777 5.5229334,6.209208 5.5229334,6.209208 L 5.5229334,12.334208 L 5.5229334,18.459208 C 5.5229334,18.459208 5.3925194,19.767138 6.2104334,20.459208 C 7.0311834,21.153688 8.3354335,20.521708 8.3354335,20.521708 L 19.147933,14.271708 C 19.147933,14.271708 20.521626,13.751608 20.554183,12.334208 C 20.521626,10.916818 19.147933,10.365458 19.147933,10.365458 L 8.3354335,4.1154577 C 8.3354335,4.1154577 7.8238265,3.8758477 7.2416834,3.8654577 z M 8.6791835,7.521708 C 9.0846715,7.453298 9.4916835,7.646708 9.4916835,7.646708 L 15.647933,11.209208 C 15.647933,11.209208 16.410662,11.527838 16.429183,12.334208 C 16.410662,13.140568 15.647933,13.427958 15.647933,13.427958 L 9.4916835,16.990458 C 9.4916835,16.990458 8.7398645,17.354298 8.2729335,16.959208 C 7.8076165,16.565478 7.8979335,15.802958 7.8979335,15.802958 L 7.8979335,12.334208 L 7.8979335,8.834208 C 7.8979335,8.834208 7.8076165,8.102938 8.2729335,7.709208 C 8.3896665,7.610428 8.5440205,7.544508 8.6791835,7.521708 z';
	var pauseIcon = 'M 16.619995,4.53374 C 17.437895,5.22581 17.314475,6.53712 17.314475,6.53712 L 17.313205,12.65698 L 17.314475,18.77685 C 17.314475,18.77685 17.437895,20.08816 16.619995,20.78023 C 16.331115,21.02466 15.982485,21.10698 15.604605,21.11101 C 15.226715,21.10698 14.878085,21.02466 14.589215,20.78023 C 13.771305,20.08816 13.894735,18.77685 13.894735,18.77685 L 13.896005,12.65698 L 13.894735,6.53712 C 13.894735,6.53712 13.771305,5.22581 14.589215,4.53374 C 14.896455,4.27377 15.271275,4.19719 15.604605,4.20312 C 15.937935,4.19719 16.312755,4.27377 16.619995,4.53374 z M 10.619994,4.53374 C 11.437894,5.22581 11.314474,6.53712 11.314474,6.53712 L 11.313204,12.65698 L 11.314474,18.77685 C 11.314474,18.77685 11.437894,20.08816 10.619994,20.78023 C 10.331114,21.02466 9.9824839,21.10698 9.604601,21.11101 C 9.226717,21.10698 8.87809,21.02466 8.589215,20.78023 C 7.771308,20.08816 7.894735,18.77685 7.894735,18.77685 L 7.896005,12.65698 L 7.894735,6.53712 C 7.894735,6.53712 7.771308,5.22581 8.589215,4.53374 C 8.896451,4.27377 9.271275,4.19719 9.604604,4.20312 C 9.9379339,4.19719 10.312754,4.27377 10.619994,4.53374 z';
	var nextIcon = 'M 18.392101,15.327593 L 7.7298722,21.262023 C 7.7298722,21.262023 6.3843422,21.679463 5.8585722,20.708253 C 5.2757622,19.631673 6.2058122,18.894273 6.2058122,18.894273 L 15.196742,14.151862 C 15.196742,14.151862 16.908381,13.474712 16.876821,12.857142 C 16.908381,12.239572 15.196742,11.562422 15.196742,11.562422 L 6.2058122,6.8200124 C 6.2058122,6.8200124 5.2757622,6.0826124 5.8585722,5.0060324 C 6.3843422,4.0348224 7.7298722,4.4522624 7.7298722,4.4522624 L 18.392101,10.386692 C 18.392101,10.386692 20.046701,10.954272 20.047691,12.857142 C 20.046701,14.760013 18.392101,15.327593 18.392101,15.327593 z';

	function override(_objA, _objB) { for (var x in _objA) {if (x in _objB) {_objB[x] = _objA[x];}} }
	
	var exports = function(container){
		var scale = d3.scale.linear().domain([config.min, config.max]).range([0, config.size])

		var drag = d3.behavior.drag()
			.on('drag', move);

		var svg = container.append('div')
			.attr({'class': 'slider'})
			.append('svg')
			.attr({
				width: config.size + config.handleSize*3 + config.offset + config.margin.left + config.margin.right,
				height: config.handleSize + config.margin.top + config.margin.bottom
			});
		var sliderGroup = svg.append('g')
			.attr({transform: 'translate(' + [
					config.handleSize*2 + config.offset + config.margin.left,
				config.margin.top
			] + ')'});
		var playbackGroup = svg.append('g')
			.attr({transform: 'translate(' + [config.margin.left, config.margin.top] + ')'});

		var sliderBg = sliderGroup.append('rect')
			.attr({
				class: 'slider-bg',
				x: 0,
				y: config.handleSize/3,
				rx: 3,
				ry: 3,
				width: config.size + config.handleSize,
				height: config.handleSize/4,
				fill: 'white',
				stroke:'silver'
			})
			.on('click', function(){
				var newVal = Math.min(Math.max(0, d3.mouse(this)[0] - config.handleSize/4), config.size);
				sliderHandle.attr({x:newVal});
				var newX = ~~(newVal/(config.size/config.max));
				dispatch.change(newX);
			});

		var sliderHandle = sliderGroup.append('rect')
			.attr({
				class: 'slider-handle',
				x: 0,
				rx: 5,
				ry: 5,
				width: config.handleSize,
				height: config.handleSize,
				fill: '#eee',
				stroke:'silver'
			})
			.call(drag);

		var playbackPlay = playbackGroup.append('rect')
			.attr({
				class: 'playback-button',
				rx: 5,
				ry: 5,
				width: config.handleSize,
				height: config.handleSize,
				fill: '#eee',
				stroke:'silver'
			})
			.on('click', onPlaybackClick);

		playbackGroup.append('path').attr({
				'class': 'play-icon',
				d: playIcon
			})
			.style({'pointer-events': 'none'});

		playbackGroup.append('path').attr({
				'class': 'pause-icon',
				d: pauseIcon
			})
			.style({
				'pointer-events': 'none',
				display: 'none'
			});

		var playbackNext = playbackGroup.append('rect')
			.attr({
				class: 'next-button',
				x: config.handleSize,
				rx: 5,
				ry: 5,
				width: config.handleSize,
				height: config.handleSize,
				fill: '#eee',
				stroke:'silver'
			})
			.on('click', function(){
				var handlePos = sliderHandle.attr('x');
				var nextTick = Math.min(scale.domain()[1], scale.invert(handlePos) + 1);
				onPlaybackClick(nextTick);
			});

		playbackGroup.append('path').attr({
				'class': 'next-icon',
				d: nextIcon,
				transform: 'translate('+ config.handleSize +', 0)'
			})
			.style({'pointer-events': 'none'});

		var pX = 0;
		function sendEventOnStep(val){
			var newX = ~~scale.invert(val);
			if(pX !== newX){
				dispatch.change(newX);
				pX = newX;
			}
		}

		function move(){
			this.parentNode.appendChild(this);
			var newVal;
			if(d3.event.x < 0){
				newVal = 0;
			}
			else if(d3.event.x > config.size + config.handleSize){
				newVal = config.size;
			}
			else{
				var val = this.attributes.x.value;
				var newVal = Math.min(Math.max(0, +val + +d3.event.dx), config.size);
			}
			this.attributes.x.value = newVal;
			sendEventOnStep(newVal);
		}

		var isPlaying = false;
		var stepSize = scale(1) - scale(0);

		function onPlaybackClick(targetStep){

			if(isPlaying){
				sliderHandle.transition()
					.duration(0);
				setPlayIcon();
				isPlaying = false;
				return;
			}

			var attrX = +sliderHandle.attr('x');
			var delta;
			var duration;
			if(targetStep){
				delta = stepSize * targetStep - attrX;
				duration = 50;
			}
			else{
				delta = config.size - attrX;
				var pos = delta / config.size;
				duration = config.transitionDuration * pos;
			}

			sliderHandle.transition()
				.duration(duration)
				.ease('linear')
				.attrTween('x', function tween(d, i, a) {
					return function(t){
						var newVal = (t * (delta) + attrX);
						sendEventOnStep(newVal);
						return newVal;
					}
				})
				.each('start', function(){
					setPauseIcon();
					isPlaying = true;
				})
				.each('end', function(){
					setPlayIcon();
					isPlaying = false;
				});
		}

		function setPlayIcon(){
			playbackGroup.select('.pause-icon')
				.style({display: 'none'});
			playbackGroup.select('.play-icon')
				.style({display: 'block'});
		}

		function setPauseIcon(){
			playbackGroup.select('.pause-icon')
				.style({display: 'block'});
			playbackGroup.select('.play-icon')
				.style({display: 'none'});
		}

	};
	
	exports.config = function(newConfig){
		override(newConfig, config);
		return this;
	};

	return d3.rebind(exports, dispatch, 'on')
};