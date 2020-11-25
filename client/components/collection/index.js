import React, { Component, Fragment } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import { connect } from "react-redux";
import GridCell from "./GridCell";
import * as actions from "../actions";

const Loader = () => {
  return (
    <div className="post-loader">
      <div className="spinner-grow bg-1a72ff "></div>
    </div>
  );
};
class Home extends Component {
  GRID = 100;
  WIDTH = 1000;
  CLICKED_BLOCKED = null;
  NEW_BLOCK_ID = React.createRef();
  NEW_BLOCK_NAME = React.createRef();
  MODEL_CLOSE = null;
  CLICKED_CORDS = null;
  state = {
    GRID_WIDTH: 1500,
    GRID_WIDTH_X: 2000,
    GRID_WIDTH_Y: 1000,
    LINES_A: [],
    LINES_B: [],
    Rectangels: [],
    loading: 0
  };

  drawGridLines() {
    this.setState({ loading: 1 });
    const linesA = [],
      linesB = [];
    const loadedBlocks = parseInt(this.state.GRID_WIDTH / this.GRID);
    for (let i = 0; i <= this.state.GRID_WIDTH / this.GRID; i++) {
      linesA.push(
        <Line
          strokeWidth={1}
          stroke={"#c7c7c7"}
          points={[i * this.GRID, 0, i * this.GRID, this.state.GRID_WIDTH]}
        />
      );

      linesB.push(
        <Line
          strokeWidth={1}
          stroke={"#c7c7c7"}
          points={[0, i * this.GRID, this.state.GRID_WIDTH, i * this.GRID]}
        />
      );
    }
    this.setState(preState => ({
      LINES_A: [...preState.LINES_A, ...linesA],
      LINES_B: [...preState.LINES_B, ...linesB]
    }));
    this.props.loadBlocks(
      { x: loadedBlocks, y: loadedBlocks },
      (er, result) => {
        this.setState({ loading: 0 });
      }
    );
  }

  componentDidMount() {
    this.drawGridLines();
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");
    // // Get the <span> element that closes the modal
    this.MODEL_CLOSE = document.getElementsByClassName("close")[0];
    // When the user clicks the button, open the modal
    // btn.onclick = function() {
    //   modal.style.display = "block";
    // }
    // // When the user clicks on <span> (x), close the modal
    this.MODEL_CLOSE.onclick = function () {
      modal.style.display = "none";
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    window.addEventListener("scroll", this.getXScroll);
    window.addEventListener("scroll", this.getYScroll);
  }

  componentDidUpdate() {
    window.addEventListener("scroll", this.getXScroll);
    window.addEventListener("scroll", this.getYScroll);
  }
  loadMoreItems(axis) {
    if (axis == "x") {
      this.setState(preState => ({
        GRID_WIDTH: parseInt(preState.GRID_WIDTH) + this.WIDTH,
        GRID_WIDTH_X: parseInt(preState.GRID_WIDTH_X) + this.WIDTH
      }));
    } else {
      this.setState(preState => ({
        GRID_WIDTH: parseInt(preState.GRID_WIDTH) + this.WIDTH,
        GRID_WIDTH_Y: parseInt(preState.GRID_WIDTH_Y) + this.WIDTH
      }));
    }
    this.drawGridLines();
  }

  getYScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("y scroll");
      window.removeEventListener("scroll", this.getScrollElement);
      this.state.GRID_WIDTH_Y <= this.WIDTH * 10 && this.loadMoreItems("y");
    }
  };

  getXScroll = () => {
    if (window.innerWidth + window.scrollX >= document.body.offsetWidth) {
      window.removeEventListener("scroll", this.getScrollElement);
      this.state.GRID_WIDTH_X <= this.WIDTH * 10 && this.loadMoreItems("x");
    }
  };

  openModel = e => {
    const { layerX, layerY } = e.evt;
    this.CLICKED_CORDS = {
      x: parseInt(layerX / this.GRID),
      y: parseInt(layerY / this.GRID)
    };
    if (!this.isAllowed(this.CLICKED_CORDS)) {
      document.getElementById("myModal").style.display = "block";
    }
  };

  submitValues = e => {
    const {
      NEW_BLOCK_ID: { current: block_id },
      NEW_BLOCK_NAME: { current: block_name }
    } = this;
    this.CLICKED_BLOCKED = {
      block_id: block_id.value,
      block_name: block_name.value
    };
    this.MODEL_CLOSE.click();
    this.props.refreshBlocks(
      this.CLICKED_CORDS,
      block_id.value,
      block_name.value,
      (err, result) => {
        // console.log("this is it");
      }
    );
  };

  isAllowed = ({ x: preX, y: preY }) => {
    let count = this.props.listOfBlocks.length;
    while (count > 0) {
      const {
        values: {
          position: { x, y }
        }
      } = this.props.listOfBlocks[count - 1];
      if (x == preX && y == preY) {
        return true;
      }
      --count;
    }
    return false;
  };

  render() {
    return (
      <Fragment>
        {this.state.loading == 1 && <Loader />}
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <p>
              <h2>Generate Rectanlges</h2>
              <label for="fname">Block Id</label>
              <br />
              <input type="text" ref={this.NEW_BLOCK_ID} />
              <br />
              <label for="lname">Block Name</label>
              <br />
              <input type="text" ref={this.NEW_BLOCK_NAME} />
              <br />
              <br />
              <button onClick={this.submitValues}>Submit</button>
            </p>
          </div>
        </div>
        <div
          style={{
            maxHeight: "380px",
            position: "fixed",
            top: "15px",
            right: "15px",
            maxWidth: "500px",
            fontSize: "18px",
            zIndex: 600,
            opacity: 0.9,
            background: "#fff"
          }}
        >
          <ul style={{ listStyle: "none" }}>
            <li>
              X Coordinate :
              {this.props.coordinates ? this.props.coordinates.x : " "}
            </li>
            <li>
              Y Coordinate :
              {this.props.coordinates ? this.props.coordinates.y : " "}{" "}
            </li>
            <li>X Index : {this.props.index ? this.props.index.x : " "} </li>
            <li>Y Index : {this.props.index ? this.props.index.y : " "} </li>
            {/* <li>Message: </li> */}
          </ul>
        </div>
        <Stage
          width={this.state.GRID_WIDTH_X}
          height={this.state.GRID_WIDTH_Y}
          onClick={this.openModel}
        >
          <Layer>
            {this.state.LINES_A}
            {this.state.LINES_B}
          </Layer>
          <Layer>
            <GridCell
              GRID={this.GRID}
              RECT={this.props.listOfBlocks}
              hoverAction={this.props.hoverUpdate}
              IS_ALLOWED={this.isAllowed}
            />
          </Layer>
        </Stage>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
    coordinates:
      state.currentPosition != {} ? state.currentPosition.coordinates : " ",
    index: state.currentPosition != {} ? state.currentPosition.index : " "
  };
};

export default connect(mapStateToProps, actions)(Home);
