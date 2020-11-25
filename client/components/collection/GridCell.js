import React, { Fragment, Component } from "react";
import { Rect, Group, Text, Line, Image } from "react-konva";

class GridCell extends Component {
  Lines = [];
  prevCords = {
    x: 0,
    y: 0
  };
  ids = [];
  currentCoordinate = {
    x: 550,
    y: 550
  };
  RectForLines = [];
  state = {
    drawLines: []
  };

  drawLinesBetweenRectangels = Rectangels => {
    Rectangels.forEach(node => {
      let {
        values: {
          next_node,
          previous_node,
          position: { x, y }
        }
      } = node;
      let endX = Math.round(x) * this.props.GRID,
        endY = Math.round(y) * this.props.GRID;

      this.RectForLines.forEach(result => {
        let { startX, startY, id } = result;

        if (id == previous_node || id == next_node) {
          this.Lines.push(
            <Line
              strokeWidth={3}
              stroke={"red"}
              points={[parseInt(startX) + 50, parseInt(startY) + 50, 0, 0]}
            />
          );
        }
      });
    });
    // //console.log(this.Lines);
    return this.Lines;
  };

  drawLinesBetween = ({ x, y }, result) => {
    if (result) {
      const { endX2: x1, endY2: y1 } = result.prev;
      const { endX3: x2, endY3: y2 } = result.next;

      this.setState(preState => ({
        drawLines: [
          ...preState.drawLines,
          <Line strokeWidth={3} stroke={"red"} points={[x1, y1, x2, y2]} />
        ]
      }));
    } else {
      this.setState(preState => ({
        drawLines: [
          ...preState.drawLines,
          <Line
            strokeWidth={3}
            stroke={"red"}
            points={[x, y, this.currentCoordinate.x, this.currentCoordinate.y]}
          />
        ]
      }));
      this.currentCoordinate = {
        x,
        y
      };
    }
  };

  componentDidUpdate() {
    // return false;
    //console.log("updated")
  }

  addRectangelsToGrid(Rectangels) {
    //  Rectangels = Rectangels.slice(-this.props.SPLITFROM);
    const finalArray = [];
    Rectangels.forEach(rect => {
      let isLine = true;
      const {
        name,
        color,
        values: {
          id,
          position: { x, y },
          previous_node,
          next_node
        }
      } = rect;

      let startX = Math.round(x) * this.props.GRID,
        startY = Math.round(y) * this.props.GRID;
      let endX2, endX3, endY2, endY3;
      if (!previous_node || !next_node) {
        isLine = false;
        this.currentCoordinate = {
          x: startX + 50,
          y: startY + 50
        };
      } else {
        const {
          position: { x: x2, y: y2 }
        } = previous_node;
        const {
          position: { x: x3, y: y3 }
        } = next_node;
        (endX2 = Math.round(x2) * this.props.GRID),
          (endY2 = Math.round(y2) * this.props.GRID);
        (endX3 = Math.round(x3) * this.props.GRID),
          (endY3 = Math.round(y3) * this.props.GRID);

        this.currentCoordinate = {
          x: endX3 + 50,
          y: endY3 + 50
        };
      }

      //console.log(this.ids);

      finalArray.push(
        <Fragment>
          <Group
            x={startX}
            y={startY}
            width={this.props.GRID}
            height={this.props.GRID}
            onDragStart={e => {
              this.prevCords = {
                x: e.target.x(),
                y: e.target.y()
              };
            }}
            onDragEnd={e => {
              const check = this.props.IS_ALLOWED({
                x: Math.round(e.target.x() / this.props.GRID),
                y: Math.round(e.target.y() / this.props.GRID)
              });
              if (check) {
                e.target.to({
                  x: this.prevCords.x,
                  y: this.prevCords.y
                });
              } else {
                e.target.to({
                  x:
                    Math.round(e.target.x() / this.props.GRID) *
                    this.props.GRID,
                  y:
                    Math.round(e.target.y() / this.props.GRID) * this.props.GRID
                });
              }
            }}
            draggable={true}
            onMouseMove={e => {
              // onMouseEnter={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "pointer";
              let coordinates = e.currentTarget.getStage().getPointerPosition();
              // console.log("Coordinates :- " + JSON.stringify(coordinates));
              this.props.hoverAction(coordinates, {
                x: Math.ceil(coordinates.x / this.props.GRID),
                y: Math.ceil(coordinates.y / this.props.GRID)
              });
            }}
            onMouseLeave={e => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}
          >
            <Rect
              width={this.props.GRID}
              height={this.props.GRID}
              fill={color}
            />
            <Text
              text={id}
              fontSize={18}
              fontFamily="Calibri"
              x={20}
              y={10}
              padding={5}
              verticalAlign="top"
              align="center"
            />
            <Text
              x={40}
              y={35}
              text={isLine ? "-" : "+"}
              fontSize={30}
              fill="black"
              onClick={e => {
                let { x, y } = e.target.parent.attrs;
                x += 50;
                y += 50;
                if (e.target.attrs.text == "-") {
                  e.currentTarget.text("+");
                  this.drawLinesBetween(
                    { x, y },
                    { prev: { endX2, endY2 }, next: { endX3, endY3 } }
                  );
                } else if (e.target.attrs.text == "+") {
                  //console.log("inside + text");
                  this.drawLinesBetween({ x, y });
                }
              }}
            />
            <Text
              text={name}
              fontSize={16}
              fontFamily="Calibri"
              x={10}
              y={60}
              verticalAlign="bottom"
              align="center"
            />
          </Group>
          {isLine == true && (
            <Line
              strokeWidth={3}
              stroke={"red"}
              points={[startX + 50, startY + 50, endX3 + 50, endY3 + 50]}
            />
          )}
        </Fragment>
      );
      this.ids.indexOf(id) == -1 && this.ids.push(id);
    });

    return finalArray;
  }

  render() {
    return (
      <Fragment>
        {this.state.drawLines}
        {this.addRectangelsToGrid(this.props.RECT)}
        {/* {this.drawLinesBetweenRectangels()} */}
      </Fragment>
    );
  }
}

export default GridCell;
