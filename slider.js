var slider = function module(){
	var config = {
		min: 0,
		max: 10,
		step: 1,
		size: 500,
		handleSize: 25,
		offset: 10,
		margin: {top: 5, right: 0, bottom: 5, left: 0},
		transitionDuration: 10000
	};

	var dispatch = d3.dispatch('change');

	function override(_objA, _objB){ for(var x in _objA){ if(x in _objB){ _objB[x] = _objA[x]; } } }
	
	var exports = function(_container){
		var scale = d3.scale.linear().domain([config.min, config.max]).range([0, config.size]);

		var drag = d3.behavior.drag()
			.on('drag', move);

		var sliderGroup = _container.select('.slider-group');
		var playbackGroup = _container.select('.playback-group');

		var sliderBg = sliderGroup.append('div')
			.classed('slider-bg', true)
			.style({
				position: 'absolute'
			})
			.on('click', function(){
				var newVal = Math.min(Math.max(0, d3.mouse(this)[0] - config.handleSize/4), config.size);
				sliderHandle.style({left: newVal + 'px'});
				var newX = ~~(newVal/(config.size/config.max));
				dispatch.change(newX);
			});

		var sliderImg = sliderGroup.append('img')
			.classed('slider-img', true)
			.attr({
				src: 'timeline3.png'
			})
			.style({
				position: 'absolute'
			});

		var sliderHandle = sliderGroup.append('div')
			.classed('slider-handle', true)
			.style({
				position: 'absolute',
				left: '0px',
				width: config.handleSize + 'px',
				height: config.handleSize + 'px'
			})
			.call(drag);

		var playbackPlay = playbackGroup.append('div')
			.classed('playback-button play', true)
			.style({
				position: 'absolute',
				'margin-left': config.handleSize + 'px',
				width: config.handleSize + 'px',
				height: config.handleSize + 'px'
			})
			.on('click', onPlaybackClick);

		var playbackNext = playbackGroup.append('div')
			.classed('next-button', true)
			.style({
				position: 'absolute',
				'margin-left': config.handleSize * 2 + 'px',
				width: config.handleSize + 'px',
				height: config.handleSize + 'px'
			})
			.on('click', function(){
				var handlePos = parseFloat(sliderHandle.style('left'));
				var nextTick = Math.min(scale.domain()[1], scale.invert(handlePos) + 1);
				onPlaybackClick(nextTick);
			});

		var playbackPrevious = playbackGroup.append('div')
			.classed('previous-button', true)
			.style({
				position: 'absolute',
				width: config.handleSize + 'px',
				height: config.handleSize + 'px'
			})
			.on('click', function(){
				var handlePos = parseFloat(sliderHandle.style('left'));
				var prevTick = Math.max(scale.domain()[0], scale.invert(handlePos) - 1);
				onPlaybackClick(prevTick);
			});

		var pX = 0;
		function sendEventOnStep(val){
			var newX = ~~scale.invert(val);
			if(pX !== newX){
				dispatch.change(newX);
				pX = newX;
			}
		}

		function move(){
			var el = d3.select(this);
			var newVal;
			if(d3.event.x < 0){
				newVal = 0;
			}
			else if(d3.event.x > config.size + config.handleSize){
				newVal = config.size;
			}
			else{
				var val = parseFloat(el.style('left'));
				newVal = Math.min(Math.max(0, val + d3.event.dx), config.size);
			}
			el.style({'left': (newVal) + 'px'});
			sendEventOnStep(newVal);
		}

		var isPlaying = false;
		var stepSize = scale(1) - scale(0);

		function onPlaybackClick(targetStep){

			if(isPlaying){
				sliderHandle.transition()
					.duration(0);
				setPlayClass();
				isPlaying = false;
				return;
			}

			var attrX = parseFloat(sliderHandle.style('left'));
			var delta;
			var duration;
			if(typeof targetStep !== 'undefined'){
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
				.styleTween('left', function tween(d, i, a) {
					return function(t){
						var newVal = (t * (delta) + attrX);
						sendEventOnStep(newVal);
						return newVal + 'px';
					}
				})
				.each('start', function(){
					setPauseClass();
					isPlaying = true;
				})
				.each('end', function(){
					setPlayClass();
					isPlaying = false;
				});
		}

		function setPlayClass(){
			playbackPlay.classed('play', true);
			playbackPlay.classed('pause', false);
		}

		function setPauseClass(){
			playbackPlay.classed('play', false);
			playbackPlay.classed('pause', true);
		}

	};
	
	exports.config = function(newConfig){
		override(newConfig, config);
		return this;
	};

	return d3.rebind(exports, dispatch, 'on')
};