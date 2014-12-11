var bubbleChart = function module(){

	var container;
	var width = 600;
	var height = 500;
	var margins = {top: 20, right: 0, bottom: 0, left: 0};
	var animationSpeed = 500;

	var bubbleColors = {new: '#FFD9D9', persistent: '#FFB8B8'};

	var pack = d3.layout.pack()
		.sort(null)
		.size([width, height])
		.padding(2)
		.value(function(d){return d.value; });

	// Tooltip
	////////////////////////////////////////////////////////
	function renderTooltip(svg){
		var tooltipGroup = svg.append('g').classed('tooltip', true);
		tooltipGroup.append('path').attr({
			'class': 'tooltip-box'
		});
		tooltipGroup.append('text').attr({x: 0, y: 0});
	}

	var exports = function(_container){
		container = _container;
	};

	exports.renderBubbles = function(_keywordsEntries){

		var svg = container.select('svg');
		var svgGroup =svg.select('.top');
		if(!svgGroup[0][0]){
			var svg = container.append('svg')
				.attr({width: width + margins.left + margins.right, height: height + margins.top + margins.bottom});
			svgGroup = svg.append('g')
				.classed('top', true)
				.attr({transform: 'translate(' + [margins.left, margins.top] + ')'});
			renderTooltip(svg);
		}
		var tooltipGroup = svg.select('g.tooltip');

		var packData = pack.nodes({key: '', value: 1, children: _keywordsEntries}).filter(function(d) { return !d.children; });
		packData.forEach(function(d){ d.fontSize = ~~(d.r / d.key.length * 3); });

		var node = svgGroup.selectAll('g.node')
			.data(packData, function(d, i){ return d.key; });

		var nodeEnter = node.enter().append('g')
			.classed('node', function(d){ return d.depth > 0;})
			.classed('parent-node', function(d){ return d.depth === 0;})
			.attr({transform: function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }});

		node.selectAll('circle').style({fill: bubbleColors.persistent});

		nodeEnter.append('circle')
			.style({
				fill: bubbleColors.new,
				stroke: '#FF9494'
			})
			.attr({r: function(d){
				return d.r;
			}})
			.on('mousemove', function(d, i){
				var tooltipText = d.key + ' (' + d.value + ' tweets)';
				var textW = tooltipText.length * 12;
				var mousePos = d3.mouse(svg.node());
				tooltipGroup.attr({
						transform: 'translate(' + [mousePos[0], mousePos[1] - 20] + ')'
					})
					.style({display: 'block'})
					.select('text')
					.text(tooltipText);
				tooltipGroup.select('path.tooltip-box')
					.attr({
						transform: 'translate(' + [-tooltipText.length * 6, -22] + ')',
						d: 'M' + [[0, 0], [textW, 0], [textW, 30],
							[textW/2 + 10, 30], [textW/2, 40], [textW/2 - 10, 30],
							[0, 30]].join('L') + 'Z'
					})
			})
			.on('mouseout', function(d, i){
				tooltipGroup.style({display: 'none'});
			})
			.on('click', function(d, i){ });
		nodeEnter.append('text');

		node.transition().duration(animationSpeed)
			.attr({transform: function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }});
		node.selectAll('circle')
			.data(function(d){ return [d];})
			.attr({r: function(d){
				return d.r;
			}});
		node.selectAll('text')
			.data(function(d){ return [d];})
			.attr({dy: function(d){ return d.fontSize*0.35 + 'px'; }})
			.style({
				'font-size': function(d){
					return d.fontSize + 'px';
				}
			})
			.text(function(d){ return d.r > 10 ? d.key : ''; });

		node.exit().remove();
	};

	return exports;
};