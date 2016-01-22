// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    getColumn: function(colIndex){
      var column = [];
      var rows = this.rows();
      _.each(rows, function(row, index){
        column.push(row[colIndex]);
      });
      return column;
    },

    getMajorDiagonal: function(majorDiagonalColumnIndexAtFirstRow){
      var diagIndex = majorDiagonalColumnIndexAtFirstRow;
      var rows = this.rows();
      var size = rows.length;
      var diagonal = [];

      for (var i = 0; i < size; i++) {
        if (diagIndex < size){
          diagonal.push(rows[i][diagIndex]);
          diagIndex++;
        }
      };
      return diagonal;
    },

    getMinorDiagonal: function(minorDiagonalColumnIndexAtFirstRow) {
      var diagIndex = minorDiagonalColumnIndexAtFirstRow;
      var rows = this.rows();
      var size = rows.length;
      var diagonal = [];

      for (var i = 0; i < size; i++) {
        if (diagIndex >= 0) {
          diagonal.push(rows[i][diagIndex]);
          diagIndex--;
        }
      };
      return diagonal;
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var count = 0;
      var conflict = false;
      _.each(row, function(square){
        square && count++;
      });
      if (count > 1){
        conflict = true;
      }

      return conflict;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rows = this.rows();
      var self = this;
      var conflict = false;
      _.each(rows, function(row, i){
       if(self.hasRowConflictAt(i)){
        conflict = true
       }
      });
      return conflict; 
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var column = this.getColumn(colIndex);
      var conflict = false;
      var count = 0;

      _.each(column, function(square){
        if (square === 1) {
          count++;
        }
      });
      if (count > 1) {
        conflict = true;
      }
      return conflict; 
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      var conflict = false;
      var self = this;
      _.each(rows, function(row, i) {
        if (self.hasColConflictAt(i)) {
          conflict = true;
        }
      });

      return conflict;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var diagonal = this.getMajorDiagonal(majorDiagonalColumnIndexAtFirstRow);
      var conflict = false;
      var count = 0;

      _.each(diagonal, function(square) {
        square && count++;
      });
      if (count > 1) {
        conflict = true;
      }
      return conflict; 
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var conflict = false;
      var self = this;
      var n = this.get('n');
      var i = -Math.abs(n - 2);

      for (var i; i < n; i++) {
        if (self.hasMajorDiagonalConflictAt(i)) {
          conflict = true;
        }
      };

      return conflict;
    },


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var diagonal = this.getMinorDiagonal(minorDiagonalColumnIndexAtFirstRow);
      var conflict = false;
      var count = 0;

      _.each(diagonal, function(square){
        if (square === 1) {
          count++;
        }
      });
      if (count > 1) {
        conflict = true;
      }
      return conflict;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var conflict = false;
      var self = this;
      var n = this.get('n');
      var i = n + 2;

      for (var j = 0; j <= i; j++) {
        if(self.hasMinorDiagonalConflictAt(j)){
          conflict = true;
        }
      };
  
      return conflict;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
