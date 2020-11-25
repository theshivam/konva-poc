import { combineReducers } from "redux";
import { listOfBlocksReducer, hoverReducer } from "./reducers";

export default combineReducers({
  listOfBlocks: listOfBlocksReducer,
  currentPosition: hoverReducer
});
