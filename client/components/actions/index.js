import { LOAD_BLOCKS, HOVER } from "./types";
import CONFIG from "../../../config";
import axios from "axios";

export const loadBlocks = ({ x, y }, cb) => {
  return async dispatch => {
    let err = null,
      result = [];
    try {
      let { data } = await axios.get(
        `${CONFIG.API_URL}/api/poc/new/grid/${x}/${y}`
      );
      result = data;
    } catch (e) {
      console.log(e);
      err = e;
    }
    dispatch({
      type: LOAD_BLOCKS,
      payload: result
    });
    cb(null, result);
  };
};

export const refreshBlocks = ({ x, y }, id, name, cb) => {
  const result = [
    {
      name: name,
      color: "#d2fce3",
      values: {
        id: id,
        previous_node: null,
        next_node: null,
        position: {
          x,
          y
        }
      }
    }
  ];
  return async dispatch => {
    dispatch({
      type: LOAD_BLOCKS,
      payload: result
    });
    cb(null, result);
  };
};

// export const swapBlocks = ({}, cb)=>{
//     const result = [{
//         "name" :"New Block",
//         "color":"#d2fce3",
//         "values":{
//            "id":1689,
//            "previous_node":null,
//            "next_node":null,
//            "position":{
//               x, y
//            }
//         }
//      }];
//     return async (dispatch)=>{
//            dispatch({
//                type: LOAD_BLOCKS,
//                payload: result
//            })
//            cb(null, result);
//     }
// }

export const hoverUpdate = (coordinates, index) => async dispatch => {
  dispatch({
    type: HOVER,
    payload: { coordinates, index }
  });
};
