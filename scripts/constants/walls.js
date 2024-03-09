//======
//walls
//======
const borders = [
  {x: 0, y: 0, width: 2000, height: 16},
  {x: 0, y: 16, width: 16, height: 1120},
  {x: 0, y: 1136, width: 2000, height: 16},
  {x: 1984, y: 16, width: 16, height: 1120},
];

const floors = new Array(5).fill(0).map((_,index) => {
  return {x: 16, y: 189 * (index + 1), width: 540, height: 16};
});

const floorsTwo = new Array(6).fill(0).map((_,index) => {
  return {x: 656, y: 95 + 189 * index, width: 540, height: 16};
});

const walls = [...borders, ...floors, ...floorsTwo];

const secondWalls = [
  {x: 0, y: 0, width: 400, height: 16},
  {x: 0, y: 16, width: 16, height: 80},
  {x: 0, y: 96, width: 400, height: 16},
  {x: 384, y: 16, width: 16, height: 80},
];

//======
//stairs
//======
const firstStairs = new Array(11).fill(0).map((_,index) => {
  return {x: 576, y: 47 + 95 * (index + 1), width: 60, height: 16};
});

const stairs = [...firstStairs];