function createGraphFrom2DMatrix(number, matrixV, matrixU) {
	for(var i=1; i<NUM; i++) {
		for(var j=i+1; j<=NUM; j++) {
			addRemoveEdge('V', i, j, false); // 모두 false 넣어서 엣지 전체 삭제 addEdge(group, host, step, isEdge)
			addRemoveEdge('U', i, j, false);
		}
	}

	for(var i=NUM+1; i<=number; i++){
		addVertex(i);
	}
	for(var i=number+1; i<=NUM; i++){
		removeVertex('V',i);
		removeVertex('U',i);
	}
	NUM = number;
	
	for(var i=1; i<NUM; i++) {
		for(var j=i+1; j<=NUM; j++) {
			addRemoveEdge('V', i, j, matrixV[i-1][j-1] == '1') //addEdge(group, host, step, isEdge)
			addRemoveEdge('U', i, j, matrixU[i-1][j-1] == '1') //addEdge(group, host, step, isEdge)
		}
	}
	layerV.draw();
	layerU.draw();
}

// 인접 매트릭스 생성
function create2DMatrix(graph) {
    var matrix = [];
    var numOfNode = graph.nodes.size;
    for (var i = 1; i <= numOfNode; i++) {
        var temp = [];
        for (var j = 1; j <= numOfNode; j++) {
            if (graph.nodes.get(i).isAdjacent(graph.nodes.get(j))) {
                // 인접 버텍스 
                temp.push(1);
            } else {
                temp.push(0);
            }
        }
        matrix.push(temp);
    }
    return matrix;
}

function reIndex(matrix, index) {
    var temp_matrix = [...Array(matrix.length)].map(e => Array(matrix.length));
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            temp_matrix[index[i]][index[j]] = matrix[i][j];
        }
    }
    return temp_matrix;
}
function inv(index) {
    var inverse = new Array(index.legnth);
    for (var i = 0; i < index.length; i++) {
        inverse[index[i]] = i;
    }
    return inverse;
}

// 다익스트라
function dijkstra(dMatrix) {
    var table = [];
    var n = dMatrix.length;

    const infinity = n;
    var known = [];
    for (var i = 0; i < n; i++) {
        known.push(false);
    }
    var d = [];
    d.push(0);
    for (var i = 1; i < n; i++) {
        d.push(infinity);
    }
    var p = [];
    for (var i = 0; i < n; i++) {
        p.push(-1);
    }

    for (var i = 0; i < n; i++) {
        var min = 0;
        while (known[min] == true) {
            min++;
        }
        for (var j = 0; j < n; j++) {
            if (known[j] == false && d[j] < d[min]) {
                min = j;
            }
        }

        known[min] = true;
        for (var j = 0; j < n; j++) {
            if (Number(dMatrix[min][j]) != 0 && d[j] > d[min] + Number(dMatrix[min][j]) && known[j] == false) {
                d[j] = d[min] + Number(dMatrix[min][j]);
                p[j] = min;
            }
        }
    }
    table.push(d);
    table.push(p);

    var path = [];
    for (var i = 0; i < n; i++) {
        var temp_path = [];
        var temp = [];
        k = i;
        while (k != -1) {
            temp.push(k);
            k = table[1][k];
        }
        temp_path.push(temp[temp.length - 1]);
        for (var j = temp.length - 2; j >= 0; j--) {
            temp_path.push(temp[j]);
        }
        path.push(temp_path);
    }
    return path;
}

function distanceMatrix(matrix) {
    // 소팅
    var distance = [];

    for (var i = 0; i < matrix.length; i++) {
        var rowDistance = [];		
		var index = [];

		for (var k = 0; k < matrix.length; k++) {
			index.push(k);
		}
		index[0] = i;
		index[i] = 0;
		var dMatrix = reIndex(matrix, index);
		var dPath = dijkstra(dMatrix);
		
        for (var j = 0; j < matrix[i].length; j++) {
            var ddA = -1;
            for (var k = 0; k < dPath.length; k++) {
                var temp = inv(index);
                if (temp[dPath[k][dPath[k].length - 1]] == j) {
                    ddA = dPath[k].length - 1;
                    break;
                }
            }
            rowDistance.push(ddA);
        }
        distance.push(rowDistance);
    }
    return distance;
}

function printMatrix(matrix) {
    for (var a = 0; a < matrix.length; a++) {
        var temp = "";
        for (var b = 0; b < matrix[a].length; b++) {
            temp = temp + matrix[a][b];
        }
        console.log(temp);
    }
}

// 0로 시작하는 인접어레이로 변환
function zeroIndexGraph(matrix) {
    var adjacent = [];

    for (var i = 0; i < matrix.length; i++) {
        var rowAdjacent = [];
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1)
                rowAdjacent.push(j);
        }
        adjacent.push(rowAdjacent);
    }
    return adjacent;
}

function makeSequence(neighbor, distance) {
	var sequence = [];
	for(var i=0; i<neighbor.length; i++) {
		var mutualDistance = [];
		for(var j=0; j<neighbor[i].length - 1; j++) {
			for(var k=j+1; k<neighbor[i].length; k++) {
				mutualDistance.push( distance[neighbor[i][j]][neighbor[i][k]] );
			}
		}
		mutualDistance.sort(function(a,b) {
			return a-b;
		});
		var tmutual = [];
		for( var k=0; k < neighbor.length * neighbor.length - 1 - mutualDistance.length; k++) {
			tmutual.push(0);
		}
		for( var k=0; k < mutualDistance.length; k++) {
			tmutual.push(mutualDistance[k]);
		}
		sequence.push(tmutual);
	}
	return sequence;
}

function makeMainIndex(originSequence) {
	var mainIndex = [];
	var sequence = originSequence.map(function(arr) {
		return arr.slice();
	});
	var tempSorter = new Map();
	for(var i=0; i<sequence.length; i++) {
		tempSorter.set(sequence[i].join(','), i);
	}
	var sorter = new Map([...tempSorter.entries()].sort((a, b) => {
			var arr1 = a[0].split(',');
			var arr2 = b[0].split(',');
			for(var v = 0; v<arr1.length; v++) {
				if(Number(arr1[v]) != Number(arr2[v])) {
					var bol = Number(arr1[v]) > Number(arr2[v]);
					return bol? 1 : -1;
				}
			}
			return 0;
		}	
	)); // 키 기준 소팅
	for ( let [key, value] of sorter ) {
		var vsit = key;
		for(var i=0; i < sequence.length; i++) {
			if(sequence[i].join(',') == vsit) mainIndex.push(i);
		}
	}
	return mainIndex;
}


function makeSortedDegree(grh) {
	var degree = [];
	var sum;
	
	for(var i=0; i<grh.length; i++) {
		sum = 0;
		for(var j=0; j<grh[i].length; j++) {
			if(grh[i][j] == 1) {
				sum++;
			}
		}
		degree.push(sum);
	}
	
	degree.sort(function(a,b) {
			return a-b;
	});
	
	return degree;
}

function makeFairGraph(grh) {
	var d = new Map();
	var nt = new Map();
	var e = new Map();
	
	for(var N1=0; N1<grh.length; N1++) {
		for(var N2=0; N2<grh[N1].length; N2++) {
			var sign = -1;
			var tgrh = grh.map(function(arr) {
				return arr.slice();
			});
			
			if(grh[N1][N2] != 0) {
				tgrh[N1][N2] = 0;
				tgrh[N2][N1] = 0;
				sign = 1;
			}
			
			
			// vertex1에서의 최단경로
			var shortestPath1 = [];
			var index1 = [];
			for(var q=0; q<grh.length; q++) {
				index1.push(q);
			}
			index1[0] = N1;
			index1[N1] = 0;
			var temp_grh1 = reIndex(tgrh, index1);
			var p1 = dijkstra(temp_grh1);
			for(var i=0; i<p1.length; i++) {
				var tpath1 = [];
				for(var j=0; j<p1[i].length; j++) {
					var temp = inv(index1);
					tpath1.push(temp[ p1[i][j] ]);
					shortestPath1.push(tpath1);
				}
			}
			// vertex2에서의 최단경로
			var shortestPath2 = [];
			var index2 = [];
			for(var q=0; q<grh.length; q++) {
				index2.push(q);
			}
			index2[0] = N2;
			index2[N2] = 0;
			var temp_grh2 = reIndex(tgrh, index2);
			var p2 = dijkstra(temp_grh2);
			for(var i=0; i<p2.length; i++) {
				var tpath2 = [];
				for(var j=0; j<p2[i].length; j++) {
					var temp = inv(index2);
					tpath2.push(temp[ p2[i][j] ]);
					shortestPath2.push(tpath2);
				}
			}
			// vertex1, 2 간 거리
			var DA = 0;
			for(var i=0; i<shortestPath1.length; i++) {
				if(shortestPath1[i][shortestPath1[i].length - 1] == N2) {
					DA = shortestPath1[i].length - 1;
					break;
				}
			}
			// vertex1, 2 간 최단경로
			var shortestPath12 = [];
			for(var i=0; i<shortestPath1.length; i++) {
				for(var j=0; j<shortestPath2.length; j++) {
					if(	shortestPath1[i][shortestPath1[i].length - 1]
					 == shortestPath2[j][shortestPath2[j].length - 1])
					{
						var tempPath = shortestPath1[i].slice();
						for(var k=shortestPath2[j].length-2; k>=0; k--){
							tempPath.push(shortestPath2[j][k]);
						}
						if(tempPath.length - 1 == DA) {
							shortestPath12.push(tempPath);
						}
					}
				}
			}
			
			// Vertex1,2 Pair 그래프 
			var check = false;
			var SA = new Set();
			for(var i=0; i<shortestPath12.length; i++) {
				if(	shortestPath12[i][0] == N1 &&
					shortestPath12[i][shortestPath12[i].length - 1] == N2) {
					check = true;
					for (var j=0; j<shortestPath12[i].length; j++) {
						SA.add(shortestPath12[i][j]);
					}
				}
			}
			var VA = N1 + "," + N2;
			// vertex1, 2 간 거리
			if(check) {
				d.set(VA, sign * DA);
			} else {
				d.set(VA, sign);
			}
			// Pair 그래프 버텍스 수
			nt.set(VA, SA.size);
			// Pair 그래프 엣지 수
			var count = 0;
			for(var i=0; i < grh.length; i++) {
				for(var j=i+1; j < grh.length; j++) {
					if(SA.has(i) && SA.has(j) && grh[i][j]!=0) count++;
				}
			}
			e.set(VA, count);
		}
	}
	return {d, nt, e};
}
function makeFrequency(d, nt ,e, N) {
	var tempFrequency = new Map();
	var dummy = [];
	for(var i=0; i<N; i++) {
		dummy.push(0);
	}
	
	for(var i=0; i<N; i++) {
		for(var j=0; j<N; j++) {
			var ind = i + "," + j;
			var vec = d.get(ind) + "," + nt.get(ind) + "," + e.get(ind);
			tempFrequency.set(vec, dummy.slice());
		}
	}
	var frequency = new Map([...tempFrequency.entries()].sort(
		(a, b) => {
			var arr1 = a[0].split(',');
			var arr2 = b[0].split(',');
			for(var v = 0; v<arr1.length; v++) {
				if(Number(arr1[v]) != Number(arr2[v])) {
					var bol = Number(arr1[v]) > Number(arr2[v]);
					return bol? 1 : -1;
				}
			}
			return 0;
		}	
	)); // 키 기준 소팅
	
	for( let [key, value] of frequency ) {
		for(var i=0; i<N; i++) {
			var f = 0;
			for(var j=0; j<N; j++) {
				var ind = i + "," + j;
				var vec = d.get(ind) + "," + nt.get(ind) + "," + e.get(ind);
				if (vec == key) f++;
			}
			frequency.get(key)[i] = f;
		}
	}
	return frequency;
}

function makeFinalVertices(frequency, N){
	var vss = [];
	for( let [key, value] of frequency) {
		vss.push(frequency.get(key).slice());
	}
	
	var tvss = [];
	var row = [];
	for(var i=0; i<vss.length; i++) row.push(0);
	for(var i=0; i<vss[0].length; i++) tvss.push(row.slice());
	for(var i=0; i<vss.length; i++) {
		for(var j=0; j<vss[i].length; j++) {
			tvss[j][i] = vss[i][j];
		}
	}
	for(var i=0; i<tvss.length; i++) tvss[i].push(i);
	tvss.sort(
		(a, b) => {
			for(var v = 0; v<a.length; v++) {
				if(Number(a[v]) != Number(b[v])) {
					var bol = Number(a[v]) > Number(b[v]);
					return bol? 1 : -1;
				}
			}
			return 0;
		}
	);
	
	
	var clss = [];
	var cl = [];
	var dl = [];
	var c = 0;
	var ic = 0;
	dl = tvss[ic].slice();
	dl.pop();
	while(ic < N) {
		cl = tvss[ic].slice();
		cl.pop();
		if (cl == dl) {
			clss.push(c);
		} else {
			dl = cl;
			clss.push(++c);
		}
		ic++
	}
	
	var vertex = [];
	for(var i=0; i<N; i++) {
		vertex.push(tvss[i][tvss[i].length-1]);
	}
	
	return vertex;
}

function makeSignMatrix(d, nt, e, vertex, N) {
	var signMatrix = new Map();
	for(var i=0; i<N; i++) {
		for(var j=0; j<N; j++) {
			var ind = i + "," + j;
			var si = [];
			si.push(d.get(ind));
			si.push(nt.get(ind));
			si.push(e.get(ind));
			signMatrix.set(ind, si);
		}
	}
	
	return signMatrix
}

function compareArray(arrA, arrB) {
    if(arrA.length != arrB.length) return false;

    for(var i=0; i<arrA.length; i++) {
        if(arrA[i] != arrB[i]) return false;
    }
    return true;
}

function isPossibleIsomorphicBySign (frequencyA, frequencyB, vertexA, vertexB) {
	var checkSignA = [];
	for( let [key, value] of frequencyA) {
		var checkSignRowA = [];
		var wsA = key.split(',');
		for(var i=0; i<wsA.length; i++) {
			checkSignRowA.push(wsA[i]);
		}
		var vsA = value;
		for(var i=0; i<vsA.length; i++) {
			checkSignRowA.push(vsA[vertexA[i]]);
		}
		checkSignA.push(checkSignRowA);
	}
	var checkSignB = [];
	for( let [key, value] of frequencyB) {
		var checkSignRowB = [];
		var wsB = key.split(',');
		for(var i=0; i<wsB.length; i++) { 
			checkSignRowB.push(wsB[i]);
		}
		var vsB = value;
		for(var i=0; i<vsB.length; i++) {
			checkSignRowB.push(vsB[vertexB[i]]);
		}
		checkSignB.push(checkSignRowB);
	}
	
	if (checkSignA.length != checkSignB.length) {
		return false;
	}
	for(var i=0; i<checkSignA.length; i++) {
		if(checkSignA[i].length != checkSignB[i].length) {
			return false;
		} else {
			for(var j=0; j<checkSignA[i].length; j++) {
				if(checkSignA[i][j] != checkSignB[i][j]) {
					return false;
				}
			}
		}
	}
	return true;
}

function findIsomorphism(signMatrixA, signMatrixB, vertexA, vertexB, N){
	var isomorphic = false;
	var fixisoB = [];
	for(var i=0; i<N; i++) {
		fixisoB.push(i);
	}
	var isoB = fixisoB.slice();
	
	for(var J=0; J<N; J++) {
		if(isomorphic) break;
		isoB = fixisoB.slice();
		isoB[0] = fixisoB[J];
		isoB[J] = fixisoB[0];
		for(var I=0; I<N * N; I++) {
			var oldisoB = isoB.slice();
			isoB = transform(signMatrixA, signMatrixB, vertexA, vertexB, isoB);
			
			var quit = false;
			var mismatch = false;
			
			for(var ii=0; ii<N; ii++) {
				if(quit) break;
				for(var jj=ii+1; jj<N; jj++) {
					var indA = vertexA[ii] + "," + vertexA[jj];
					var indB = vertexB[isoB[ii]] + "," + vertexB[isoB[jj]];
					var ta = signMatrixA.get(indA);
					var tb = signMatrixB.get(indB);
					if (!compareArray(ta,tb)) {
						quit = true;
						mismatch = true;
					}
				}
			}
			if(compareArray(isoB, oldisoB)) {
				if(!mismatch) isomorphic = true;
				break;
			}
		}
	}
	return {isomorphic, isoB};
}

function transform(signMatrixA, signMatrixB, vertexA, vertexB, isoB) {
	var iso = isoB.slice();
	var k;
	var n = iso.length;
	var found = false;
	var check = true;
	for(var i=0; i<n; i++) {
		if(found) break;
		for(var j=i+1; j<n; j++) {
			var indA = vertexA[i] + "," + vertexA[j];
			var indB = vertexB[isoB[i]] + "," + vertexB[isoB[j]];
			var a = signMatrixA.get(indA);
			var b = signMatrixB.get(indB);
			if(!compareArray(a,b)) {
				k = j;
				var temp_ind = indB.split(",");
				while(k < n-1 && check == true) {
					k++;
					temp_ind[1] = vertexB[isoB[k]];
					var ind = temp_ind[0] + "," + temp_ind[1];
					var b = signMatrixB.get(ind);
					if(compareArray(a,b)) {
						var temp_iso = isoB.slice();
						temp_iso[j] = isoB[k];
						temp_iso[k] = isoB[j];
						var ti = -1;
						var tj = -1;
						var quit = false;
						for(var ii=0; ii<n; ii++) {
							if(quit) break;
							for(var jj=ii+1; jj<n; jj++) {
								var tindA = vertexA[ii] + "," + vertexA[jj];
								var tindB = vertexB[temp_iso[ii]] + "," + vertexB[temp_iso[jj]];
								var ta = signMatrixA.get(tindA);
								var tb = signMatrixB.get(tindB);
								if(!compareArray(ta,tb)) {
									ti = ii;
									tj = jj;
									quit = true;
									break;
								}
								if( k == n-1 && ti == -1) {
									check = false;
									quit = true;
									break;
								}
							}
						}
						if(ti==-1 || ti>i || (ti==i && tj>j)) check = false;
					}
				}
				if(!check) {
					found = true; 
					iso[j] = isoB[k]; 
					iso[k] = isoB[j];
					break;
				}
				if (check) return iso;
			}
		}
	}
	return iso;
}

function conclusion(isDeg, isSig, isIso, mainIndexA, mainIndexB, vertexA, vertexB, isoB, N) {
	if(isDeg) {
		console.log("디그리 구조 같음");
	} else {
		console.log("디그리 구조 틀림");
		return {result: false, msg: "디그리 구조 틀림"};
	}
	if(isSig) {
		console.log("사인행렬 같음");
	} else {
		console.log("사인행렬 틀림");
		return {result: false, msg: "사인행렬 틀림"};
	}
	if(isIso) {
		console.log("두 그래프는 동형");
		var map = new Map();
		for(var i=0; i<N; i++) {
			var invA = inv(mainIndexA);
			var invB = inv(mainIndexB);
			console.log("f(" + (invA[vertexA[i]] + 1) + ") = " + (invB[vertexB[isoB[i]]] + 1));
			
			map.set((invA[vertexA[i]] + 1), (invB[vertexB[isoB[i]]] + 1));
		}
		return {result: true, msg: "두 그래프는 동형",map: map};
		
	} else {
		console.log("두 그래프는 동형 아님");
		return {result: false, msg: "두 그래프는 동형 아님"};
	}
}

function runAlgo(matA, matB) {
	var startTime = new Date().getTime();
	console.log("startTime:"+startTime);
	
	var N = matA.length;
	
	var disA = distanceMatrix(matA);
	var disB = distanceMatrix(matB);
	var neiA = zeroIndexGraph(matA);
	var neiB = zeroIndexGraph(matB);
	var seqA = makeSequence(neiA, disA);
	var seqB = makeSequence(neiB, disB);
	var mainIndexA = makeMainIndex(seqA);
	var mainIndexB = makeMainIndex(seqB);
	var grhA = reIndex(matA,mainIndexA);
	var grhB = reIndex(matB,mainIndexB);
	var faiA = makeFairGraph(grhA);
	var faiB = makeFairGraph(grhB);
	var frqA = makeFrequency(faiA.d, faiA.nt, faiA.e, N);
	var frqB = makeFrequency(faiB.d, faiB.nt, faiB.e, N);
	var fnvA = makeFinalVertices(frqA, N);
	var fnvB = makeFinalVertices(frqB, N);
	var sgmA = makeSignMatrix(faiA.d, faiA.nt, faiA.e, fnvA, N);
	var sgmB = makeSignMatrix(faiB.d, faiB.nt, faiB.e, fnvB, N);
	var degA = makeSortedDegree(grhA);
	var degB = makeSortedDegree(grhB);

	var isDeg = compareArray(degA, degB); // degree 비교로 기본 동형가능체크
	var isSig = isPossibleIsomorphicBySign(frqA, frqB, fnvA, fnvB);
	var result = findIsomorphism(sgmA,sgmB,fnvA,fnvB,N);

	var fin = conclusion(isDeg, isSig, result.isomorphic, mainIndexA, mainIndexB, fnvA, fnvB, result.isoB, N);
	var endTime = new Date().getTime();
	console.log("endTime:"+endTime);
	console.log("time:"+(endTime-startTime));
	
	return {fin:fin, time:endTime-startTime};
}
