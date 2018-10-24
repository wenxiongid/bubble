import decomp from "poly-decomp";
window.decomp = decomp;
import Matter from "matter-js";

let Engine = Matter.Engine,
  Render = Matter.Render,
  Svg = Matter.Svg,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector;

class Physics{
  constructor(target, sceneSize, wallWidth, birthPos, startV){
    this.target = target;
    this.sceneSize = sceneSize;
    this.wallWidth = wallWidth;
    this.birthPos = birthPos;
    this.startV = startV;

    this.engine = Engine.create();
    this.engine.world.gravity.y = -1;

    this.render = Render.create({
      element: target,
      engine: this.engine,
      options: {
        width: sceneSize.width,
        height: sceneSize.height
      }
    });

    // add top
    let path = document.getElementById('path');
    let points = Svg.pathToVertices(path, 30);
    World.add(
      this.engine.world,
      Bodies.fromVertices(
        sceneSize.width / 2 - wallWidth,
        sceneSize.width / 4 - wallWidth * 5,
        [points],
        {
          isStatic: true,
          render: {
            fillStyle: "#fff",
            strokeStyle: "#fff",
            lineWidth: 1
          }
        },
        true
      )
    );

    // add walls
    World.add(this.engine.world, [
      // left
      Bodies.rectangle(
        wallWidth / 2,
        sceneSize.height / 2,
        wallWidth,
        sceneSize.height,
        { isStatic: true }
      ),
      // right
      Bodies.rectangle(
        sceneSize.width - wallWidth / 2,
        sceneSize.height / 2,
        wallWidth,
        sceneSize.height,
        { isStatic: true }
      ),
      // bottom
      Bodies.rectangle(
        sceneSize.width / 2,
        sceneSize.height - wallWidth / 2,
        sceneSize.width,
        wallWidth,
        { isStatic: true }
      )
    ]);

    Engine.run(this.engine);
    Render.run(this.render);
  }
  createball(x, y, radius){
    let ball = Bodies.circle(x, y, radius, {
      restitution: 0.5
    });
    World.add(this.engine.world, [ball]);
  }
  addStillBall(radius){
    this.stillBall = Bodies.circle(this.birthPos.x, this.birthPos.y, radius, {
      isStatic: true,
      restitution: 0.5
    });
    World.add(this.engine.world, [this.stillBall]);
  }
  shoot(pos, newBallRadius){
    if (this.stillBall) {
      let v = Vector.create(pos.x - this.birthPos.x, pos.y - this.birthPos.y);
      v = Vector.normalise(v);
      v = Vector.mult(v, this.startV);
      Body.setStatic(this.stillBall, false);
      Body.setVelocity(this.stillBall, v);
      this.addStillBall(newBallRadius);
    }
  }
}

export default Physics;