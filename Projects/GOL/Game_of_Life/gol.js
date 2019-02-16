/**
 * gol.js
 *
 * EECS 183: Final Project
 * Fall 2016
 *
 * Implements Game of Life.
 */


var Constants = {
    numberOfRows: 50,
    numberOfColumns: 120,
    cellSize: 5,
    aliveColor: "#1CC6FF",
    deadColor: "#C9E8F2",
    generationInterval: 0.1,
};


/**
 * Creates an HTML table representing canvas and inserts it into HTML.
 */
function createCanvas() {
    var canvasTable = $("<table>", {id: "canvas-table"});
    var canvasTableHead = $("<thead>");
    // add rows and columns
    for (var rowIndex = 0; rowIndex < Constants.numberOfRows; rowIndex++) {
        // make a row
        var canvasRow = $("<tr>");
        for (var columnIndex = 0; columnIndex < Constants.numberOfColumns; columnIndex++) {
            // make a cell
            var canvasCell = $("<td>");
            canvasRow.append(canvasCell);
        }
        canvasTableHead.append(canvasRow);
    }
    canvasTable.append(canvasTableHead);
    // add table to HTML
    $("#canvas-container").append(canvasTable);

    // set size of cells
    $("#canvas-table td").css({
        width: Constants.cellSize,
        height: Constants.cellSize,
    });
}


/**
 * Returns cell from HTML canvas table at specified rowIndex and columnIndex.
 */
function getCanvasCellAtIndex(rowIndex, columnIndex) {
    return $("#canvas-table tr:eq(" + rowIndex + ") td:eq(" + columnIndex + ")");
}


/**
 * Creates and returns 2d array represnting game grid.
 * Initializes each cell to an object with and isAlive as false 0 liveNeighbors.
 */
function createGameGrid() {
    var grid = new Array(Constants.numberOfRows);
    for (var row = 0; row < Constants.numberOfRows; row++) {
        grid[row] = new Array(Constants.numberOfColumns);
        for (var col = 0; col < Constants.numberOfColumns; col++) {
            grid[row][col] = {
                isAlive: false,
                liveNeighbors: 0,
            };
        }
    }
    return grid;
}


/**
 * Executes when entire HTML document loads.
 */
$(document).ready(function() {
    createCanvas();
    var gameGrid = createGameGrid();

    $("#still-life-btn, #oscillator-btn, #spaceship-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val();
        var newRow = Math.floor(Math.random() * Constants.numberOfRows);
        var newCol = Math.floor(Math.random() * Constants.numberOfColumns);
        drawPattern(pattern, gameGrid, newRow, newCol);
    });

    // event loop
    var isRunning = false;
    var timer;
    function runGoL() {
        if (!isRunning) {
            isRunning = true;
            evolveStep(gameGrid);
            // wait to run again
            timer = setTimeout(function() {
                isRunning = false;
                runGoL();
            }, Constants.generationInterval * 1000);
        }
    }
    $("#start-game").click(function () {
        runGoL();
    });
    $("#stop-game").click(function () {
        isRunning = false;
        clearTimeout(timer);
    });
    $("#clearBoard-btn").click(function() {
        for (var row = 0; row < Constants.numberOfRows; ++row) {
            for (var col = 0; col < Constants.numberOfColumns; ++col) {
              getCanvasCellAtIndex(row, col).css("backgroundColor", "");
              gameGrid[row][col].isAlive = false;
              gameGrid[row][col].liveNeighbors = 0;
            }
        }
        updateCells(gameGrid);
    });

    $("#color-black").click(function () {
        Constants.aliveColor = "#000000";
        Constants.deadColor = "#c5ccd3";
    });

    $("#color-blue").click(function () {
        Constants.aliveColor = "#1CC6FF";
        Constants.deadColor = "#C9E8F2";
    });

    $("#slow-down").click(function () {
        Constants.generationInterval *= 2;
    });

    $("#speed-up").click(function () {
        Constants.generationInterval = Constants.generationInterval / 2;
    });

    drawOscillator("Blinker", gameGrid, 5, 5);
    console.log(countLiveNeighbors(gameGrid, 6, 6));
    console.log(countLiveNeighbors(gameGrid, 6, 4));
    console.log(countLiveNeighbors(gameGrid, 5, 6));
    console.log(countLiveNeighbors(gameGrid, 5, 4));
    })


/****************************** BEGIN CORE CODE ******************************/


/**
 * Requires: grid is a 2d array representing game grid
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 *           state is set to the string "alive" or the string "dead"
 * Modifies: grid and HTML table representing the grid
 * Effects:  Sets isAlive field in cell of grid to either true or false,
 *           depending on the value of state.
 *           Updates backgroundColor of cell in HTML table.
 */
function setCellState(state, grid, row, col) {
    if (row >= 0 && row < Constants.numberOfRows && col >= 0 && col < Constants.numberOfColumns) {
        if(state === "alive"){
            grid[row][col].isAlive = true;
        }

        else if(state === "dead"){
            grid[row][col].isAlive = false;
        }

        if(grid[row][col].isAlive){
            getCanvasCellAtIndex(row, col).css("backgroundColor", Constants.aliveColor);
        }
        else{
            getCanvasCellAtIndex(row, col).css("backgroundColor", Constants.deadColor);
        }
    }

}


/**
 * Requires: grid is a 2d array representing game grid
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: Nothing.
 * Effects:  Counts the number of live neighbors for
 *           the cell at row, col in grid and returns the count.
 */
function countLiveNeighbors(grid, row, col) {
    //counting above and below cell

    //using (row - 1) and (col - 1) to start check
    //on the above left cell
    var count = 0;
    if (row > 0 && col > 0){
        row = row - 1;
        col = col - 1;
        if (grid[row][col].isAlive) {
        count++;
        }
    }
    if (row > 0 && col < Constants.numberOfColumns - 1){
        col = col + 1;
        if (grid[row][col].isAlive) {
            count++;
        }
    }
    if ((row > 0) && (col < Constants.numberOfColumns - 1)) {
        col = col + 1;
        if (grid[row][col].isAlive) {
            count++;
        }
    }
    if (row < Constants.numberOfRows - 1 && col > 1) {
        row = row + 1;
        col = col - 2;
    if (grid[row][col].isAlive) {
        count++;
    }
    }
    if (col < Constants.numberOfColumns - 2) {
        col = col + 2;
        if (grid[row][col].isAlive) {
            count++;
        }
    }
    if ((col > 0) && (row < Constants.numberOfRows - 1)){
        col = col - 2;
        row = row + 1;
        if (grid[row][col].isAlive) {
            count++;
        }
    }
    if (row < Constants.numberOfRows - 1){
        col = col + 1;
        if (grid[row][col].isAlive) {
            count++;
        }
    }
    if (row < Constants.numberOfRows - 1 && (col < Constants.numberOfColumns - 1) ){
        col = col + 1;
        if (grid[row][col].isAlive) {
            count++;
        }
    }
    return count;
}

/**
 * Requires: grid is a 2d array representing game grid
 * Modifies: grid
 * Effects:  Updates the liveNeighbors field of each cell in grid
 */
function updateLiveNeighbors(grid) {
    for (var i = 0; i < Constants.numberOfRows; ++i) {
      for (var k = 0; k < Constants.numberOfColumns; ++k) {
        grid[i][k].liveNeighbors = countLiveNeighbors(grid, i, k);
      }
    }
}

/**
 * Requires: grid is a 2d array representing game grid
 * Modifies: grid
 * Effects:  Sets the state of cells in grid according to the number of
 *           liveNeighbors each cell has, and to the rules of the Game of Life.
 */
function updateCells(grid) {
    for (var row = 0; row < Constants.numberOfRows; row++){
        for (var col = 0; col < Constants.numberOfColumns; col++) {
            if (grid[row][col].isAlive){
                if (grid[row][col].liveNeighbors < 2){
                    setCellState("dead", grid, row, col);
                }
                else if (grid[row][col].liveNeighbors > 3){
                    setCellState("dead", grid, row, col);
                }
                else if (grid[row][col].liveNeighbors === 2 || grid[row][col].liveNeighbors === 3){
                    setCellState("alive", grid, row, col);
                }
            }
            else if (!grid[row][col].isAlive){
                if (grid[row][col].liveNeighbors === 3){
                    setCellState("alive", grid, row, col);
                }
            }

       }

    }
}


/**
 * Requires: grid is a 2d array representing game grid
 * Modifies: grid
 * Effects:  Changes the grid to evolve the cells to the next generation according
 *           to the rules of the Game of Life. In order to correctly move forward,
 *           all cells should count the number of their live neighbors before
 *           proceeding to change the state of all cells.
 */
function evolveStep(grid) {
    updateLiveNeighbors(grid);
    updateCells(grid);
}

/**
 * Requires: patternName is a string
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  This function is called when a user clicks on one of the HTML
 *           "Draw <pattern>" buttons.
 *           Draws the pattern specified by patternName.
 */
function drawPattern(patternName, grid, row, col) {

    switch(patternName){
        case "Block":
        case "Beehive":
        case "Loaf":
        case "Boat":
            drawStillLife(patternName, grid, row, col);
            break;
        case "Blinker":
        case "Toad":
        case "Beacon":
        case "Pulsar":
            drawOscillator(patternName, grid, row, col);
            break;
        case "Glider":
        case "Lwss":
            drawSpaceship(patternName, grid, row, col);
            break;
        default:
            break;
    }
}

/**
 * Requires: patternName is one of {"Block", "Beehive", "Loaf", "Boat"}
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  Draws the pattern specified by patternName.
 *           This function should draw as much of the pattern as possible
 *           without going outside the boundaries of the canvas.
 */
 function drawStillLife(patternName, grid, row, col) {
    // TODO: implement

    switch (patternName){
        case "Block":

// Block
            setCellState("alive", grid, row, col);
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row + 1, col + 1);
            setCellState("alive", grid, row + 1, col);

            break;

        case "Beehive":

//Beehive
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row, col + 2);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row + 1, col + 3);
            setCellState("alive", grid, row + 2, col + 1);
            setCellState("alive", grid, row + 2, col + 1);
            setCellState("alive", grid, row + 2, col + 2);

            break;

        case "Loaf":

//Loaf
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row, col + 2);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row + 1, col + 3);
            setCellState("alive", grid, row + 2, col + 1);
            setCellState("alive", grid, row + 2, col + 3);
            setCellState("alive", grid, row + 3, col + 2);

            break;

        case "Boat":

//Boat
            setCellState("alive", grid, row, col);
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row + 1, col + 2);
            setCellState("alive", grid, row + 2, col + 1);

            break;

    }

}

/**
 * Requires: patternName is one of {"Blinker", "Toad", "Beacon", "Pulsar"}
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  Draws the pattern specified by patternName.
 *           This function should draw as much of the pattern as possible
 *           without going outside the boundaries of the canvas.
 */
function drawOscillator(patternName, grid, row, col) {
    // TODO: implement
    switch (patternName){

        case "Blinker":
            setCellState("alive", grid, row, col);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row + 2, col);

            break;

        case "Toad":
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row, col + 2);
            setCellState("alive", grid, row, col + 3);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row + 1, col + 1);
            setCellState("alive", grid, row + 1, col + 2);


            break;

        case "Beacon":

            setCellState("alive", grid, row, col);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row + 1, col + 1);
            setCellState("alive", grid, row + 2, col + 2);
            setCellState("alive", grid, row + 2, col + 3);
            setCellState("alive", grid, row + 3, col + 2);
            setCellState("alive", grid, row + 3, col + 3);

            break;

        case "Pulsar":


            setCellState("alive", grid, row, col + 2);
            setCellState("alive", grid, row, col + 3);
            setCellState("alive", grid, row, col + 4);
            setCellState("alive", grid, row, col + 8);
            setCellState("alive", grid, row, col + 9);
            setCellState("alive", grid, row, col + 10);

            setCellState("alive", grid, row + 5, col + 2);
            setCellState("alive", grid, row + 5, col + 3);
            setCellState("alive", grid, row + 5, col + 4);
            setCellState("alive", grid, row + 5, col + 8);
            setCellState("alive", grid, row + 5, col + 9);
            setCellState("alive", grid, row + 5, col + 10);




            setCellState("alive", grid, row + 7, col + 2);
            setCellState("alive", grid, row + 7, col + 3);
            setCellState("alive", grid, row + 7, col + 4);
            setCellState("alive", grid, row + 7, col + 8);
            setCellState("alive", grid, row + 7, col + 9);
            setCellState("alive", grid, row + 7, col + 10);


            setCellState("alive", grid, row + 12, col + 2);
            setCellState("alive", grid, row + 12, col + 3);
            setCellState("alive", grid, row + 12, col + 4);
            setCellState("alive", grid, row + 12, col + 8);
            setCellState("alive", grid, row + 12, col + 9);
            setCellState("alive", grid, row + 12, col + 10);

            setCellState("alive", grid, row + 2, col);
            setCellState("alive", grid, row + 3, col);
            setCellState("alive", grid, row + 4, col);
            setCellState("alive", grid, row + 8, col);
            setCellState("alive", grid, row + 9, col);
            setCellState("alive", grid, row + 10, col);

            setCellState("alive", grid, row + 2, col + 5);
            setCellState("alive", grid, row + 3, col + 5);
            setCellState("alive", grid, row + 4, col + 5);
            setCellState("alive", grid, row + 8, col + 5);
            setCellState("alive", grid, row + 9, col + 5);
            setCellState("alive", grid, row + 10, col + 5);


            setCellState("alive", grid, row + 2, col + 7);
            setCellState("alive", grid, row + 3, col + 7);
            setCellState("alive", grid, row + 4, col + 7);
            setCellState("alive", grid, row + 8, col + 7);
            setCellState("alive", grid, row + 9, col + 7);
            setCellState("alive", grid, row + 10, col + 7);

            setCellState("alive", grid, row + 2, col + 12);
            setCellState("alive", grid, row + 3, col + 12);
            setCellState("alive", grid, row + 4, col + 12);
            setCellState("alive", grid, row + 8, col + 12);
            setCellState("alive", grid, row + 9, col + 12);
            setCellState("alive", grid, row + 10, col + 12);


            break;
}
}


/**
 * Requires: patternName is one of {"Glider", "Lwss"}
 *           grid is a 2d array representing game grid
 *           row and col represent the top left corner of the pattern
 *           0 <= row && row < Constants.numberOfRows
 *           0 <= col && col < Constants.numberOfColumns
 * Modifies: grid
 * Effects:  Draws the pattern specified by patternName.
 *           This function should draw as much of the pattern as possible
 *           without going outside the boundaries of the canvas.
 */
function drawSpaceship(patternName, grid, row, col) {
    // TODO: implement
    switch(patternName){
        case "Glider":
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row + 1, col + 2);
            setCellState("alive", grid, row + 2, col);
            setCellState("alive", grid, row + 2, col + 1);
            setCellState("alive", grid, row + 2, col + 2);

            break;

        case "Lwss":
            setCellState("alive", grid, row, col + 1);
            setCellState("alive", grid, row, col + 4);
            setCellState("alive", grid, row + 1, col);
            setCellState("alive", grid, row + 2, col);
            setCellState("alive", grid, row + 2, col + 4);
            setCellState("alive", grid, row + 3, col);
            setCellState("alive", grid, row + 3, col + 1);
            setCellState("alive", grid, row + 3, col + 2);
            setCellState("alive", grid, row + 3, col + 3);

            break;

    }

}
