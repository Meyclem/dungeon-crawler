// Our custom tile mapping with:
// - Single index for putTileAt
// - Array of weights for weightedRandomize
// - Array or 2D array for putTilesAt

const TILE_MAPPING = {
  BLANK: 3,
  WALL: {
    TOP_LEFT: 181,
    TOP_RIGHT: 182,
    BOTTOM_RIGHT: 202,
    BOTTOM_LEFT: 201,
    TOP: [{ index: 162, weight: 7 }, { index: [184, 164], weight: 1 }],
    BOTTOM: [{ index: 162, weight: 7 }, { index: [184, 164], weight: 1 }],
    LEFT: [{ index: 200, weight: 7 }, { index: [204, 224], weight: 1 }],
    RIGHT: [{ index: 200, weight: 7 }, { index: [204, 224], weight: 1 }]
  },
  FLOOR: [{ index: 0, weight: 4 }, { index: [20, 21, 23, 43], weight: 1 }],
  POT: [{ index: 336, weight: 1 }, { index: 337, weight: 1 }],
  DOOR: {
    TOP: [202, 0, 201],
    // prettier-ignore
    LEFT: [
      [202],
      [0],
      [182]
    ],
    BOTTOM: [182, 0, 181],
    // prettier-ignore
    RIGHT: [
      [201],
      [0],
      [181]
    ]
  },
  CHEST: 334,
  STAIRS: 327,
  // prettier-ignore
  TOWER: [[347], [367]]
}

export default TILE_MAPPING;
