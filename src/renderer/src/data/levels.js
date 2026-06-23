export const BOARD_RECT = {
  x: 74,
  y: 150,
  width: 752,
  height: 850
}

export const levels = [
  {
    id: 1,
    name: '交错街区',
    lines: [
      { id: 'l1', points: [{ x: 140, y: 240 }, { x: 300, y: 240 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l2', points: [{ x: 370, y: 240 }, { x: 540, y: 240 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l3', points: [{ x: 610, y: 240 }, { x: 750, y: 240 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l4', points: [{ x: 220, y: 330 }, { x: 220, y: 500 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l5', points: [{ x: 340, y: 300 }, { x: 340, y: 470 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l6', points: [{ x: 480, y: 320 }, { x: 480, y: 530 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l7', points: [{ x: 620, y: 300 }, { x: 620, y: 475 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l8', points: [{ x: 150, y: 585 }, { x: 310, y: 585 }, { x: 310, y: 690 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l9', points: [{ x: 405, y: 585 }, { x: 565, y: 585 }, { x: 565, y: 690 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l10', points: [{ x: 705, y: 540 }, { x: 705, y: 720 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l11', points: [{ x: 180, y: 800 }, { x: 360, y: 800 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l12', points: [{ x: 450, y: 800 }, { x: 690, y: 800 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l13', points: [{ x: 290, y: 410 }, { x: 415, y: 410 }, { x: 415, y: 520 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l14', points: [{ x: 545, y: 430 }, { x: 665, y: 430 }, { x: 665, y: 560 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l15', points: [{ x: 255, y: 915 }, { x: 505, y: 915 }], direction: { x: 1, y: 0 }, width: 18 }
    ]
  },
  {
    id: 2,
    name: '旋转锁',
    lines: [
      { id: 'l1', points: [{ x: 155, y: 210 }, { x: 390, y: 210 }, { x: 390, y: 315 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l2', points: [{ x: 500, y: 210 }, { x: 745, y: 210 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l3', points: [{ x: 190, y: 345 }, { x: 190, y: 555 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l4', points: [{ x: 300, y: 315 }, { x: 300, y: 520 }, { x: 410, y: 520 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l5', points: [{ x: 515, y: 315 }, { x: 515, y: 535 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l6', points: [{ x: 650, y: 330 }, { x: 650, y: 570 }, { x: 745, y: 570 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l7', points: [{ x: 130, y: 650 }, { x: 330, y: 650 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l8', points: [{ x: 395, y: 650 }, { x: 605, y: 650 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l9', points: [{ x: 700, y: 650 }, { x: 760, y: 650 }, { x: 760, y: 760 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l10', points: [{ x: 250, y: 740 }, { x: 250, y: 930 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l11', points: [{ x: 370, y: 750 }, { x: 370, y: 905 }, { x: 520, y: 905 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l12', points: [{ x: 600, y: 760 }, { x: 600, y: 940 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l13', points: [{ x: 135, y: 850 }, { x: 305, y: 850 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l14', points: [{ x: 450, y: 430 }, { x: 575, y: 430 }, { x: 575, y: 300 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l15', points: [{ x: 470, y: 1000 }, { x: 725, y: 1000 }], direction: { x: 1, y: 0 }, width: 18 }
    ]
  },
  {
    id: 3,
    name: '折线迷阵',
    lines: [
      { id: 'l1', points: [{ x: 130, y: 230 }, { x: 290, y: 230 }, { x: 290, y: 340 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l2', points: [{ x: 380, y: 225 }, { x: 560, y: 225 }, { x: 560, y: 335 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l3', points: [{ x: 640, y: 225 }, { x: 770, y: 225 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l4', points: [{ x: 170, y: 415 }, { x: 340, y: 415 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l5', points: [{ x: 430, y: 390 }, { x: 430, y: 555 }, { x: 565, y: 555 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l6', points: [{ x: 650, y: 370 }, { x: 650, y: 520 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l7', points: [{ x: 730, y: 390 }, { x: 730, y: 570 }, { x: 615, y: 570 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l8', points: [{ x: 145, y: 600 }, { x: 290, y: 600 }, { x: 290, y: 735 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l9', points: [{ x: 355, y: 690 }, { x: 540, y: 690 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l10', points: [{ x: 610, y: 700 }, { x: 770, y: 700 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l11', points: [{ x: 190, y: 815 }, { x: 190, y: 965 }], direction: { x: 0, y: 1 }, width: 18 },
      { id: 'l12', points: [{ x: 315, y: 825 }, { x: 315, y: 955 }, { x: 445, y: 955 }], direction: { x: -1, y: 0 }, width: 18 },
      { id: 'l13', points: [{ x: 520, y: 805 }, { x: 520, y: 950 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l14', points: [{ x: 640, y: 830 }, { x: 760, y: 830 }, { x: 760, y: 950 }], direction: { x: 1, y: 0 }, width: 18 },
      { id: 'l15', points: [{ x: 390, y: 500 }, { x: 275, y: 500 }, { x: 275, y: 360 }], direction: { x: 0, y: -1 }, width: 18 },
      { id: 'l16', points: [{ x: 475, y: 1030 }, { x: 690, y: 1030 }], direction: { x: 1, y: 0 }, width: 18 }
    ]
  }
]
