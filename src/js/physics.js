import decomp from "poly-decomp";
window.decomp = decomp;
import Matter from "matter-js";

const debug = false;

const Engine = Matter.Engine,
  Render = Matter.Render,
  Svg = Matter.Svg,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector,
  Composite = Matter.Composite;

class Physics{
  constructor(target, sceneSize, wallWidth){
    this.target = target;
    this.sceneSize = sceneSize;
    this.wallWidth = wallWidth;

    this.engine = Engine.create();
    this.engine.world.gravity.y = -1;

    if(debug){
      this.render = Render.create({
        element: target,
        engine: this.engine,
        options: {
          width: sceneSize.width,
          height: sceneSize.height,
          background: 'transparent',
          wireframeBackground: 'transparent'
        }
      });
    }

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
    if(debug){
      Render.run(this.render);
    }
  }
  createBall(x, y, radius, isStatic){
    let ball = Bodies.circle(x, y, radius, {
      isStatic,
      restitution: 0.1,
      name: 'myBall'
    });
    if(isStatic){
      this.stillBall = ball;
    }
    World.add(this.engine.world, [ball]);
  }
  shoot(pos, startV){
    if (this.stillBall) {
      let v = Vector.create(pos.x - this.stillBall.position.x, pos.y - this.stillBall.position.y);
      v = Vector.normalise(v);
      v = Vector.mult(v, startV);
      Body.setStatic(this.stillBall, false);
      Body.setVelocity(this.stillBall, v);
    }
  }
  getAllBall(){
    let bodies = Composite.allBodies(this.engine.world);
    let ballList = [];
    bodies.forEach(body => {
      if(body.name == 'myBall'){
        ballList.push(body);
      }
    });
    return ballList;
  }
}

export default Physics;