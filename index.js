/*
  Idea:
    Generate a grid that fits the width of a screen
    Gather a selection of elements to be fitted into the grid
    Use the aspect ratios of those elements to fit them to spaces in the grid
      One element will take up:
        n*(colWidth + colGap) width
        n*(rowHeight + rowGap) height
      Where n is the number of grid tiles it spans

    I need to generate some kind of dynamic list that will store an index for each element
*/

let rects;
let displayGrid = [];
let photos = [];
function createRandomRects(n = 20) {
  const container = document.getElementById('container');
  rects = [];
  let r = 0;
  while (r < n) {
    const rectHolder = document.createElement('div');
    const rect = document.createElement('div');
    const rectWidth = Math.round(Math.random() * 450) + 50;
    const rectHeight = Math.round(Math.random() * 450) + 50;
    rects.push(rect);
    rectHolder.appendChild(rect);
    container.appendChild(rectHolder);
    rect.style.width = rectWidth + 'px';
    rect.style.height = rectHeight + 'px';
    r++;
  }
}


function getComputedGridSpacing(grid) {
  return {
    rowHeight: parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')),
    rowGap: parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
    colWidth: parseInt(window.getComputedStyle(grid).getPropertyValue('grid-template-columns')),
    colGap: parseInt(window.getComputedStyle(grid).getPropertyValue('grid-column-gap')),
  };
}
function getColumnCount(grid) {
  return window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').length;
}

async function getImageSrcs() {
  const response = await fetch('./photos/');
  const html = await response.text();
  const regex = /"(.+\.jpg)"/g;
  const matches = html.matchAll(regex);
  for (const match of matches) {
    photos.push(`./photos/${match[1]}`);
  }
}

async function loadImages() {
  let i = 0;
  while (i < images.length) {
    const img = await imagePromise(photos[i]);
    photos[i] = img;
    i++;
  }
}

function imagePromise(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}

function packImages(minWidth, minHeight, maxWidth, maxHeight, container, images) {
  const gridSpacing = getComputedGridSpacing(container);
  const numCols = getColumnCount(container);
  const displayGrid = [];
  let w = 0;
  while (w < numCols {
    displayGrid.push([]);
    w++;
  }



  return displayGrid;
}


function getGridSpans(imageIndex, table) {
  // Get width span
  let yStartPosition = -1;
  let yEndPosition = -1;
  let x = 0;
  ySearchLoop:
  while (x < table.length) {
    let y = 0;
    while (y < table[x].length) {
      if (table[x][y] === imageIndex && yStartPosition === -1) {
        yStartPosition = y;
      } else if (table[x][y] !== imageIndex && yStartPosition !== -1) {
        yEndPosition = y;
        break ySearchLoop;
      }
      y++;
    }
    if (yStartPosition !== -1 && yEndPosition === -1) {
      yEndPosition = y - 1;
      break ySearchLoop;
    }
    x++;
  }

  let xStartPosition = -1;
  let xEndPosition = -1;
  x = 0;
  while (x < table.length) {
    if (table[x][yStartPosition] === imageIndex && xStartPosition === -1) {
      xStartPosition = x;
    } else if (table[x][yStartPosition] !== imageIndex && xStartPosition !== -1) {
      xEndPosition = x;
      break;
    }
    x++;
  }
  if (xStartPosition !== -1 && xEndPosition === -1) {
    xEndPosition = x - 1;
  }

  return {
    xStart: xStartPosition,
    xEnd: xEndPosition,
    xSpan: xEndPosition - xStartPosition + 1,
    yStart: yStartPosition,
    yEnd: yEndPosition,
    ySpan: yEndPosition - yStartPosition + 1,
  }
}
