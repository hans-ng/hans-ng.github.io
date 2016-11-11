var rows = 40;
var cols = 80;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var colorArray = new Array(rows * cols);

var timer;
var reproductionTime = 100;

function init() {
  createTable();
  initGrid();
  resetGrid();
  setupControlButtons();
}

function initGrid() {
  for (var i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrid() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
      colorArray[i * cols + j] = Math.floor(Math.random()*256*256*256);
    }
  }
}

function copyAndResetGrid() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

function createTable() {
  var gridContainer = document.getElementById("gridContainer");

  if (!gridContainer) {
    console.error("Problem: no div for the grid table");
    return;
  }

  var table = document.createElement("table");

  for (var row = 0; row < rows; row++) {
    var tr = document.createElement("tr");

    for (var col = 0; col < cols; col++) {
      var cell = document.createElement("td");
      cell.setAttribute("id", row + "_" + col);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }

    table.appendChild(tr);
  }

  gridContainer.appendChild(table);
}

function cellClickHandler() {
  var rowcol = this.id.split("_");
  var row = rowcol[0];
  var col = rowcol[1];

  var classes = this.getAttribute("class");
  if (classes.indexOf("dead") > -1) {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
    this.style.backgroundColor = randomColor(+row, +col);
  } else {
    this.setAttribute("class", "dead");
    this.style.backgroundColor = "transparent";
    grid[row][col] = 0;
  }
}

function updateView() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var cell = document.getElementById(i+"_"+j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
        cell.style.backgroundColor = "transparent";
      } else {
        cell.setAttribute("class", "live");
        cell.style.backgroundColor = randomColor(i, j);
      }
    }
  }
}

function setupControlButtons() {
  // button to start
  var startButton = document.getElementById("start");
  startButton.onclick = startButtonHandler;

  // button to clear
  var clearButton = document.getElementById("clear");
  clearButton.onclick = clearButtonHandler;

  // button to randomize life status
  var randomButton = document.getElementById("random");
  randomButton.onclick = randomButtonHandler;

}

// start/pause/continue the game
function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    this.innerHTML = "Continue";
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    playing = true;
    this.innerHTML = "Pause";
    play();
  }
}

function clearButtonHandler() {
  console.log("Clear the game: stop playing, clear the grid");

  var startButton = document.getElementById("start");
  startButton.innerHTML = "Start";

  playing = false;

  clearTimeout(timer);

  // NodeList is different from Array: when changing class name of an element in the list, the cellsList is to be updated as well
  var cellsList = document.getElementsByClassName("live");
  var cellsArray = [];
  for (var i = 0; i < cellsList.length; i++) {
    cellsArray.push(cellsList[i]);
  }
  for (var i = 0; i < cellsArray.length; i++) {
    cellsArray[i].setAttribute("class", "dead");
    cellsArray[i].style.backgroundColor = "transparent";
  }

  resetGrid();
}

/*
 1. User cannot randomize grid when it's in playing state
 2. Clear the grid by utilizing clearButtonHandler
 3. Randomly apply "live" class into cells
*/
function randomButtonHandler() {
  if (playing) {
    return;
  }

  clearButtonHandler();

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var isLive = Math.round(Math.random());
      if (isLive == 1) {
        var cell = document.getElementById(i+"_"+j);
        cell.setAttribute("class", "live");
        cell.style.backgroundColor = randomColor(i, j);
        grid[i][j] = 1;
      }
    }
  }
}

// run the life game
function play() {
  console.log("Play the game");
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  // copy nextGrid to grid and reset nextGrid
  copyAndResetGrid();

  // reflect grid value into the table
  updateView();
}

/*
  Game rules:
  1. Any live cell with fewer than two live neighbors dies, as if caused by under-population.
  2. Any live cell with two or three live neighbors lives on to the next generation.
  3. Any live cell with more than three live neighbors dies, as if by overcrowding.
  4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/
function applyRules(row, col) {
  var numberOfNeighbors = countNeighbors(row, col);

  if (grid[row][col] == 1) {
    if (numberOfNeighbors < 2 || numberOfNeighbors > 3) {
      nextGrid[row][col] = 0;
    } else {
      nextGrid[row][col] = 1;
    }
  } else if (numberOfNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
}

function countNeighbors(row, col) {
  var count = 0;

  for (var i = -1; i <= 1; i++) {
    if (row + i >= 0 && row + i < rows) {
      for (var j = -1; j <= 1; j++) {
        if (col + j >= 0 && col + j < cols) {
          count += grid[row + i][col + j];
        }
      }
    }
  }

  return count - grid[row][col];
}

function randomColor(row, col) {
  return "#" + colorArray[row * cols + col].toString(16);
}

window.onload = init;
