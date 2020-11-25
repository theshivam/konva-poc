import { LOAD_BLOCKS, HOVER } from "../actions/types";

let reserverArray = [];

export const listOfBlocksReducer = (state = [], action) => {
  let payload = (data = []) => {
    reserverArray = [...reserverArray, ...data];
    return reserverArray;
  };
  switch (action.type) {
    case LOAD_BLOCKS:
      return payload(action.payload);
    default:
      return state;
  }
};
export const hoverReducer = (
  //   state = { coordinates: { x: 0, y: 0 }, index: { x: 0, y: 0 } },
  state = {},
  action
) => {
  switch (action.type) {
    case HOVER:
      return {
        coordinates: action.payload.coordinates,
        index: action.payload.index
      };
    default:
      return state;
  }
};
