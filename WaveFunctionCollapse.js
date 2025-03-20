// Initialize empty arrays for grid, tiles, and tile objects
let grid = [];
let tile = [];
let tileObj = [];

// Variables to hold JSON data, edges configuration, base tile size, and canvas size
let data;
let edgesArray;
let bSize = 40;
const canSize = 400;
let gridSize;

// Variable for Wave Function Collapse (WFC) related data
let wfc;

// Current state index for the data array
let currentState = 0;

// Variables for file paths, canvas size, images, file extension, total images, and various DOM elements
let path;
let canvasSize;
let allImages = [];
let extension;
let total_img;
let canvas;
let imageContainer;
let buttonContainer;
let runButton;
let totalStates;
let stateButtons = [];
let imgCanvas = [];

// p5.js preload function to load JSON and images before setup
function preload() {
  // Load JSON data from file "data.json"
  data = loadJSON("data.json", () => {
    // Parse the JSON data
    data = data["data"];
    // Loop through each object in the data
    for (const obj in data) {
      if (Object.prototype.hasOwnProperty.call(data, obj)) {
        const element = data[obj];
        let path = element.path;
        let extension = element.extension;
        let total_img = element.total_img;
        let images = [];
        // Loop to load each image based on total_img count
        for (var i = 0; i < total_img; i++) {
          let curPath = path + i.toString() + extension;
          images[i] = loadImage(curPath);
        }
        // Store the loaded images in the allImages array
        allImages.push(images);
      }
    }
    // Set the total number of states from the length of the data array
    totalStates = data.length;
  });
}

// p5.js setup function to initialize the canvas and UI layout
function setup() {
  // Determine canvas size based on the smaller dimension of window
  canvasSize = min(windowHeight, windowWidth) * 0.7; // 70% of window height
  let x = (windowWidth - canvasSize) / 2; // Centering horizontally
  let y = (windowHeight - canvasSize) / 2; // Centering vertically
  // Calculate grid size based on canvas size and base tile size
  gridSize = canvasSize / bSize;

  // Create the canvas and position it in the center
  canvas = createCanvas(canvasSize, canvasSize);
  canvas.position(x, y);
  // Set initial background color
  background(150);

  // Load the initial state's images into the tile array
  total_img = data[currentState].total_img;
  for (var i = 0; i < total_img; i++) {
    tile[i] = allImages[currentState][i];
  }

  // Setup UI layout and process the data for further operations
  setupLayout();
  setupData();
  modifyData();
  modifyGrid();
}

// Function to setup the layout of UI elements (buttons, images, run button)
function setupLayout() {
  // Create a container for buttons with vertical overflow and absolute positioning
  buttonContainer = createDiv("")
    .style("overflow-y", "auto")
    .style("position", "absolute")
    .style("padding", "10px");
  // Create a container for images with absolute positioning
  imageContainer = createDiv("")
    .style("position", "absolute")
    .style("padding", "10px");
  // Create the run button with styling and position settings
  runButton = createButton("Run Again")
    .style("height", "50px")
    .style("display", "block")
    .style("margin", "10px auto")
    .style("width", "100px")
    .style("position", "absolute");
  // Set event handler for run button to re-run the process with current state
  runButton.mousePressed(() => {
    run(currentState);
  });

  // Adjust layout based on current window dimensions
  adjustLayout();

  // Create state buttons for each available state and add them to the button container
  for (let i = 0; i < totalStates; i++) {
    let btn = createButton(i + 1 + " : " + data[i].name);
    btn.style("height", "50px");
    // Add clicking event listener to change state and run accordingly
    btn.mousePressed(() => {
      run(i);
    });
    stateButtons.push(btn);
    buttonContainer.child(btn);
  }
  // Display images associated with the current state
  showImages(currentState);
}

// Function to adjust the layout of buttons, images, and canvas based on window size
function adjustLayout() {
  // Clear previous images in image container
  imageContainer.html("");
  let canvasX = (windowWidth - canvasSize) / 2;
  let buttonWidth = 110; // Estimated button width including margin
  let columns = Math.max(1, Math.floor((windowWidth - 20) / buttonWidth));
  let rows = Math.ceil(totalStates / columns);
  let buttonsHeight = rows * 60; // Adjusted height considering multiple rows

  let imageWidth = 100; // Adjusted width assuming 100px per image
  let imageCount = total_img; // Number of images (dynamic)
  let imageRows = Math.ceil(imageCount / columns);
  let imagesHeight = imageRows * imageWidth; // Adjusted height assuming 100px per image
  let padding = imageRows * 10 + rows * 10;

  // If there's enough space on the left of the canvas, position buttons and images accordingly
  if (canvasX > 150) {
    columns = Math.max(1, Math.floor((canvasX - 20) / buttonWidth));
    rows = Math.ceil(totalStates / columns);
    buttonsHeight = rows * 60;

    columns = Math.max(1, Math.floor((canvasX - 20) / buttonWidth));
    imageRows = Math.ceil(imageCount / columns);
    imagesHeight = imageRows * imageWidth; // Adjusted height assuming 100px per image
    padding = imageRows * 10 + rows * 10;

    // Place buttons on the left in a grid and vertically centered
    buttonContainer
      .style("left", "10px")
      .style("top", "50%")
      .style("transform", "translateY(-50%)");
    buttonContainer.style("width", canvasX - 50 + "px");
    buttonContainer
      .style("display", "grid")
      .style("grid-template-columns", `repeat(${columns}, 1fr)`);
    buttonContainer.style("gap", "10px");

    // Position the run button below the button grid
    runButton.style("left", "10px");
    runButton.style("top", "calc(50% + " + (buttonsHeight / 2 + 20) + "px)"); // Below button grid
    runButton.style("width", canvasX - 20 + "px"); // Centered horizontally within button grid width

    // Place images on the right side of canvas
    imageContainer
      .style("left", canvasX + canvasSize + 20 + "px")
      .style("top", "50%")
      .style("transform", "translateY(-50%)");
    imageContainer
      .style("display", "grid")
      .style("grid-template-columns", `repeat(${columns}, 1fr)`);
    imageContainer.style("gap", "10px");
  } else {
    // If not enough space on the left, place buttons on top in a grid layout
    buttonContainer
      .style("top", "10px")
      .style("left", "10px")
      .style("right", "10px");
    buttonContainer
      .style("display", "grid")
      .style("grid-template-columns", `repeat(${columns}, 1fr)`);
    buttonContainer.style("gap", "10px");

    // Position the run button centered below the buttons
    runButton
      .style("top", buttonsHeight + 20 + "px")
      .style("left", "50%")
      .style("transform", "translateX(-50%)");

    // Position the images below the run button
    imageContainer
      .style("top", buttonsHeight + canvasSize + 90 + padding + "px")
      .style("left", "10px")
      .style("right", "10px");
    imageContainer
      .style("display", "grid")
      .style("grid-template-columns", `repeat(${columns}, 1fr)`);
    imageContainer.style("gap", "10px");

    // Adjust canvas position dynamically below the buttons
    let newCanvasY = buttonsHeight + 120; // Adjust canvas position dynamically
    canvas.position(canvasX, newCanvasY);
    // canvas.style("padding-bottom", padding + "px");

    // Ensure the screen is scrollable if the canvas goes below screen height
    if (newCanvasY + canvasSize > windowHeight) {
      document.body.style.overflowY = "scroll";
    }
  }
}

// Function to run the generation process based on the selected state
function run(stateNumber) {
  // Reset background and update current state
  background(150);
  currentState = stateNumber;
  // Clear previous grid and tile arrays
  grid = [];
  tile = [];
  // Load the new state's total image count and corresponding images
  total_img = data[currentState].total_img;
  for (var i = 0; i < total_img; i++) {
    tile[i] = allImages[currentState][i];
  }
  // Readjust layout and reinitialize data processing
  adjustLayout();
  setupData();
  modifyData();
  modifyGrid();
  // Update the images displayed for the current state
  showImages(currentState);
  // Restart the drawing loop
  loop();
}

// Function to display images for the current state in the image container
function showImages(stateNumber) {
  // Clear previous images from the container
  imageContainer.html("");
  // Loop through each image and create an image element for display
  for (let i = 0; i < total_img; i++) {
    let img = createImg(
      allImages[stateNumber][i].canvas.toDataURL(),
      "Image " + (i + 1)
    )
      .style("width", "100px")
      .style("height", "100px");
    imgCanvas.push(img);
    imageContainer.child(img);
  }
}

// p5.js draw function to render the grid and corresponding tile images
function draw() {
  // Loop through each grid cell to display the image based on WFC data
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
      let state = grid[x][y];
      if (wfc[state]) {
        image(wfc[state].img, x * bSize, y * bSize, bSize, bSize);
      }
    }
  }
  // Stop the draw loop after one pass to avoid continuous redrawing
  noLoop();
}

// Function to setup tile objects based on the loaded data and rotations
function setupData() {
  // Remove previous image elements from each tile object
  for (const obj in tileObj) {
    if (Object.prototype.hasOwnProperty.call(tileObj, obj)) {
      const element = tileObj[obj];
      element.img.remove();
    }
  }
  // Reset tileObj array
  tileObj = [];
  // Get edges configuration from the current state's data
  edgesArray = data[currentState].edges;
  let rotation = data[currentState].rotation;
  let idx = 0;
  // Loop through rotation configurations to create rotated tile objects
  for (let i = 0; i < rotation.length; i++) {
    const arr = rotation[i];
    for (let j = 0; j < arr.length; j++) {
      const num = arr[j];
      // Create a new Tile with rotation and store it in tileObj
      tileObj[idx] = new Tile(tile[i], edgesArray[i]).rotate(num);
      idx++;
    }
  }
}

// Function to modify data by setting up the Wave Function Collapse adjacency rules
function modifyData() {
  // Initialize wfc object
  wfc = {};
  // Loop through each tile object to define its adjacent possibilities
  for (var i = 0; i < tileObj.length; i++) {
    let e1 = [];
    let e2 = [];
    // Check compatibility between tiles based on edge matching rules
    for (var j = 0; j < tileObj.length; j++) {
      if (tileObj[i].edges[1] == tileObj[j].edges[3]) {
        e1.push(j.toString());
      }
      if (tileObj[i].edges[2] == tileObj[j].edges[0]) {
        e2.push(j.toString());
      }
    }
    // Assign image and adjacency lists to the corresponding entry in wfc object
    wfc[i.toString()] = {
      img: tileObj[i].img,
      adj: [[], e1, e2, []],
    };
  }
}

// Function to modify the grid based on WFC rules and initialize it with a random start tile
function modifyGrid() {
  // Reset grid array
  grid = [];
  // Initialize grid with undefined values
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      grid[i][j] = undefined;
    }
  }

  // Set the first cell of the grid with a random tile
  grid[0][0] = floor(random(0, tileObj.length)).toString();
  try {
    // Loop through grid cells to set valid adjacent tiles based on defined rules
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        if (i != 0 || j != 0) {
          if (j == 0) {
            // If first column, choose a tile based on the top neighbor
            grid[i][j] = random(wfc[grid[i - 1][j]].adj[1]);
          } else {
            if (i == 0) {
              // If first row, choose a tile based on the left neighbor
              grid[i][j] = random(wfc[grid[i][j - 1]].adj[2]);
            } else {
              // For other cells, find common valid adjacent tiles from both left and top neighbors
              let posAdj = [];
              //   console.log(grid[i][j - 1]);
              //   console.log(i, j - 1);
              posAdj.push(wfc[grid[i][j - 1]].adj[2]);
              posAdj.push(wfc[grid[i - 1][j]].adj[1]);
              let am = findCommon(posAdj);
              grid[i][j] = random(am);
            }
          }
        }
      }
    }
  } catch (error) {
    // If an error occurs during grid modification, retry the grid setup
    modifyGrid();
  }
}

// Helper function to find common elements between arrays (used for finding valid tile matches)
function findCommon(arr) {
  let arr4 = arr.slice();
  let filArr = arr4.shift().filter(function (v) {
    return arr4.every(function (a) {
      return a.indexOf(v) !== -1;
    });
  });
  return filArr;
}
