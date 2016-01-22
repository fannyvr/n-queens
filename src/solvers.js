/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findSolution = function(row, n, validator, board, callback) {
  if(row === n){
    return callback();
  }
  for (var i = 0; i < n; i++) {
    board.togglePiece(row, i);
    if(!board[validator]()){
      var result = findSolution(row + 1, n, validator, board, callback);
      if (result) {
        return result;
      }
    }
    board.togglePiece(row, i)
  }
};

window.findNRooksSolution = function(n) {
  var board = new Board({n: n});
  var rows = board.rows();

  _.each(rows, function(row, index){
    var placed = false;  
    _.each(row, function(square, i){
      if(!placed){
        rows[index][i] = 1;
        if(!board.hasColConflictAt(i)){
          placed = true;
        }else{
          rows[index][i] = 0;
        }  
      }
    });
  });

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(rows));
  return rows;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n:n});

  findSolution(0, n, 'hasAnyRooksConflicts', board, function(){
    solutionCount++;
  });

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n:n});
  var solution = board.rows();
  
  findSolution(0, n, "hasAnyQueensConflicts", board, function(){
    solution =  _.map(board.rows(), function(row){
      return row.slice();
    });
  });

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;

};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n:n});

  findSolution(0, n, 'hasAnyQueensConflicts', board, function(){
    solutionCount++;
  });

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
