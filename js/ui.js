function addVertex(number) {	
	var textV = new Konva.Text({
		width:  60,
		fontSize: 26,
		fontFamily: 'Calibri',
		align:'center',
		text: 'V'+number,
		fill: 'black',
		padding: 4,
	});
	var vertexV = new Konva.Rect({
		width:  56,
		height: 35,
		fill: colorV,
		stroke: 'black',
		strokeWidth: 4,
	});
	var groupV = new Konva.Group({
		id: 'vertexV' + number,
		x: stageV.width()/2,
		y: stageV.height()/2,
		draggable: true,
		dragBoundFunc: function (pos) {
			var newX = pos.x > stageV.width() ? stageV.width()-50 : pos.x;
			var newY = pos.y > stageV.height() ? stageV.height()-30 : pos.y;
			newX = newX < 0 ? 10 : newX;
			newY = newY < 0 ? 10 : newY;
			return {
				x: newX,
				y: newY,
			};
		},
	});
	
	
	var textU = new Konva.Text({
		width:  60,
		fontSize: 26,
		fontFamily: 'Calibri',
		align:'center',
		text: 'U'+number,
		fill: 'black',
		padding: 4,
	});
	var vertexU = new Konva.Rect({
		width:  56,
		height: 35,
		fill: colorU,
		stroke: 'black',
		strokeWidth: 4,
	});
	var groupU = new Konva.Group({
		id: 'vertexU' + number,
		x: stageU.width()/2,
		y: stageU.height()/2,
		draggable: true,
		dragBoundFunc: function (pos) {
			var newX = pos.x > stageU.width() ? stageU.width()-50 : pos.x;
			var newY = pos.y > stageU.height() ? stageU.height()-30 : pos.y;
			newX = newX < 0 ? 10 : newX;
			newY = newY < 0 ? 10 : newY;
			return {
				x: newX,
				y: newY,
			};
		},
	});
	
	groupV.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
	});
	groupV.on('mouseout', function () {
		document.body.style.cursor = 'default';
	});
	groupV.on('dragend', function () {
		redrawLine ('V', number) // redrawLine (group, number)
	});
	
	
	groupU.on('mouseover', function () {
		document.body.style.cursor = 'pointer';
	});
	groupU.on('mouseout', function () {
		document.body.style.cursor = 'default';
	});
	groupU.on('dragend', function () {
		redrawLine ('U', number) // redrawLine (group, number)
	});
	
	groupV.add(vertexV);
	groupV.add(textV);
	
	groupU.add(vertexU);
	groupU.add(textU);
	
	layerV.add(groupV)
	layerU.add(groupU);
	groupV.zIndex(100+number);
	groupU.zIndex(100+number);
	
	layerV.draw();
	layerU.draw();
	
	$("#selectV").append("<option value='" + number + "'>V"+ number + "</option>");
	$("#selectU").append("<option value='" + number + "'>U"+ number + "</option>");
	graphV.addVertex(number);
	graphU.addVertex(number);
}

function addRemoveEdge(group, host, step, isEdge) {
	var graph;
	var layer;
	
	if(group == 'V') {
		graph = graphV;
		layer = layerV;
	} else if(group == 'U') {
		graph = graphU;
		layer = layerU;
	}
	
	if(isEdge) { // 체크박스 체크: 추가하는 경우
		if (!graph.nodes.get(host).isAdjacent( graph.nodes.get(step) )) { // 현재 엣지가 없는 경우에만 추가
			graph.addEdge(host, step); // 엣지 추가
			var line = layer.getChildren(function(node){
				return node.getId() === 'edge' + group + host + '_' + step;
			});
			if (line.length == 0) { // 라인이 없는 경우 그려줌
				addLine (group, host, step);
			}
		}
	} else { // 체크박스 언체크: 삭제하는 경우
		graph.removeEdge(host, step);
		var line = layer.getChildren(function(node){
			return node.getId() === 'edge' + group + host + '_' + step;
		});
		if(line.length == 1) line.destroy(); // 라인이 있는 경우 삭제
	}
}

function removeVertex(group, host) {
	var graph;
	var layer;
	
	if(group == 'V') {
		graph = graphV;
		layer = layerV;
	} else if(group == 'U') {
		graph = graphU;
		layer = layerU;
	}
	
	graph.removeVertex(host);
	var vertex = layer.getChildren(function(node){
		return node.getId() === 'vertex' + group + host;
	});
	if(vertex.length == 1) vertex.destroy(); // 버텍스가 있는 경우 삭제
	
	for(var step = host+1; step <= NUM; step++) {
		addRemoveEdge(group, host, step, false); // false를 넣어서 엣지 모두 삭제
	}
	for(var step = 1; step < host; step++) {
		addRemoveEdge(group, step, host, false); // false를 넣어서 엣지 모두 삭제
	}
	
	$("#select" + group + " option[value='"+host+"']").remove();
}

function redrawLine (group, vertexNumber) {
	var layer = (group == 'V' ? layerV : layerU);
	var graph = (group == 'V' ? graphV : graphU);
	var adjacents = graph.nodes.get(vertexNumber).adjacents;
	
	var host;
	var step;
	
	for(var i in adjacents ) { // 모든 인접 버텍스 for loop
		if( vertexNumber < adjacents[i].value) { 	// 인접 버텍스가 동생인 경우
			host = vertexNumber;
			step = adjacents[i].value;;
		} else {									// 인접 버텍스가 형인 경우
			host = adjacents[i].value;
			step = vertexNumber;
		}
		
		var edge = layer.getChildren(function(node){
			return node.getId() === 'edge' + group + host + '_' + step;
		});
		if(edge.length == 1) {
			edge.destroy(); // 엣지가 있는 경우 삭제
			addLine(group, host, step); // 다시 그려줌 addLine (group, host, step)
		}
	}				
}

function addLine (group, host, step) {
	var color = (group == 'V' ? colorV : colorU);
	var layer = (group == 'V' ? layerV : layerU);
	
	var hostVertex = layer.getChildren(function(node){
		return node.getId() === 'vertex'+group+host;
	});
	var stepVertex = layer.getChildren(function(node){
		return node.getId() === 'vertex'+group+step;
	});
	
	var points = [Number(hostVertex[0].absolutePosition()['x'])+28, Number(hostVertex[0].absolutePosition()['y'])+17,
				Number(stepVertex[0].absolutePosition()['x'])+28, Number(stepVertex[0].absolutePosition()['y'])+17];
	
	var line = new Konva.Line({
		id: 'edge' + group + host + '_' + step,
		points: points,
		stroke: color,
		strokeWidth: 4,
		lineCap: 'round',
		lineJoin: 'round',
	});
	layer.add(line);
	line.zIndex(0);
	line.draw();
}

function moveAnimation(delay, map) {
	var cnt = 1;
	var interval = setInterval(function intervalFun() {
		var vertexVnumber = cnt++;
		var vertexUnumber = map.get(vertexVnumber);
		var vertexV = layerV.getChildren(function(node){
			return node.getId() === 'vertexV' + vertexVnumber;
		});
		var vertexU = layerU.getChildren(function(node){
			return node.getId() === 'vertexU' + vertexUnumber;
		});
		
		var tween = new Konva.Tween({
				node: vertexU[0],
				x: Number(vertexV[0].absolutePosition()['x'] ),
				y: Number(vertexV[0].absolutePosition()['y'] ),
				onUpdate: () => redrawLine ('U', vertexUnumber), //redrawLine (group, vertexNumber)
				onFinish: () => redrawLine ('U', vertexUnumber), //redrawLine (group, vertexNumber)
				easing: Konva.Easings['StrongEaseInOut'],
				duration: 1,
			});
		tween.play();
		layerU.draw();
		
		if (vertexVnumber == NUM) clearInterval(interval); // 끝
		return intervalFun;
	}(), delay);
}