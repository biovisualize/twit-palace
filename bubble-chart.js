var bubbleChart = function module(){

	var container;
	var width = 600;
	var height = 500;
	var margins = {top: 20, right: 0, bottom: 0, left: 0};
	var animationSpeed = 800;

	var colors = d3.scale.category20c();

	var pack = d3.layout.pack()
		.sort(null)
		.size([width, height])
		.padding(2)
		.value(function(d){return d.value; });

	// Tooltip
	////////////////////////////////////////////////////////
	function renderTooltip(svg){
		var tooltipGroup = svg.append('g').classed('tooltip', true);
		tooltipGroup.append('rect').attr({width: 100, height: 30, x: -50, y: -22});
		tooltipGroup.append('text').attr({x: 0, y: 0}).text('testtttttt');
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
			.attr({transform: function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }});

		nodeEnter.append('circle')
			.style({opacity: 0})
			.attr({r: function(d){
				return d.r;
			}})
			.on('mousemove', function(d, i){
				var tooltipText = d.key + ' (' + d.value + ')';
				var mousePos = d3.mouse(svg.node());
				tooltipGroup.attr({
					transform: 'translate(' + [mousePos[0], mousePos[1]] + ')'
				})
					.style({display: 'block'})
					.select('text')
					.text(tooltipText);
				tooltipGroup.select('rect').attr({width: tooltipText.length * 12, x: -tooltipText.length * 6})
			})
			.on('mouseout', function(d, i){
				tooltipGroup.style({display: 'none'});
			})
			.on('click', function(d, i){ });
		nodeEnter.append('text')
			.style({'font-size': '0px', opacity: 0});

		node.transition().duration(animationSpeed)
			.attr({transform: function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }});
		node.selectAll('circle')
			.data(function(d){ return [d];})
			.style({
				fill: function(d, i){
					if(d.depth === 0) return null;
					return colors(d.event);
				},
				opacity: 1
			})
			.transition().duration(animationSpeed)
			.attr({r: function(d){
				return d.r;
			}});
		node.selectAll('text')
			.data(function(d){ return [d];})
			.text(function(d){ return d.r > 10 ? d.key : ''; })
			.transition().duration(animationSpeed/2)
			.attr({dy: function(d){ return d.fontSize*0.35 + 'px'; }})
			.style({
				'font-size': function(d){
					return d.fontSize + 'px';
				},
				opacity: 1
			});

		node.exit().remove();
	};

	return exports;
};