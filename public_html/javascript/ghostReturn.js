

var grid = [];

for(var i = 0; i < 15; grid.push(i),i++);	
(function(){

	function getRow(pos, numCol){
		return  (Math.floor(pos / numCol));
	}
	function getColumn(pos, numCol){
		return pos % numCol;
	}
	function getPos(row,column, numCol){
		return row * numCol + column;
	}
	function moveLeft(pos, numCol){
		var newPos = getPos(getRow(pos,numCol),getColumn(pos,numCol) - 1, numCol);
		if(getRow(newPos, numCol) !== getRow(pos, numCol)){
			return -1;
		}

		return newPos;
	}
	function moveRight(pos, numCol){
		var newPos = getPos(getRow(pos,numCol),getColumn(pos,numCol) + 1, numCol);
		if(getRow(newPos, numCol) !== getRow(pos, numCol)){
			return -1;
		}
		return newPos;
	}
	function moveUp(pos, numCol){
		return getPos(getRow(pos,numCol) - 1,getColumn(pos,numCol), numCol);
	}
	function moveDown(pos, numCol){
		return getPos(getRow(pos,numCol) + 1,getColumn(pos,numCol), numCol);
	}
	var posPaths = [];
	(function move(start, end,numOfColumns, grid, path){
		if(start === end){
			path.push(start);
			posPaths.push(path.slice());
			
		}else{
			if(path.indexOf(start) === -1){
				path.push(start);
				var mL = moveLeft(start, numOfColumns);
				var mU = moveUp(start, numOfColumns);
				var mR = moveRight(start, numOfColumns);
				var mD = moveDown(start, numOfColumns);

				if(mU < grid.length && mU >= 0){
					move(mU,end,numOfColumns,grid,path.slice());
				}
				if(mR < grid.length && mR >= 0){
					move(mR,end,numOfColumns,grid,path.slice());
				}
				if(mD < grid.length && mD >= 0){
					move(mD,end,numOfColumns,grid,path.slice());
				}
				if(mL < grid.length && mL >= 0){
					move(mL,end,numOfColumns,grid,path.slice());
				}

			}


		}
	})(2,7,3,grid,[]);
	console.log(posPaths);



})();
