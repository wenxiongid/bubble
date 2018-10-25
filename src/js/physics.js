import decomp from "poly-decomp";
window.decomp = decomp;
import Matter from "matter-js";
import BallRadiusMap from "./game_param";

const debug = false;

const MyBall = 'myBall';

const Engine = Matter.Engine,
  Render = Matter.Render,
  Svg = Matter.Svg,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector,
  Composite = Matter.Composite,
  Events = Matter.Events;

class Physics{
  constructor(target, sceneSize, wallWidth){
    let _this = this;
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

    Events.on(this.engine, "collisionStart", event => {
      event.pairs.forEach(pair => {
        let bodyA = pair.bodyA,
          bodyB = pair.bodyB;
        if (bodyA.name == MyBall && bodyB.name == MyBall && !bodyA.isStatic && !bodyB.isStatic && bodyA.level == bodyB.level && bodyA.level < 7) {
          let targetBody,
            srcBody;
          if(bodyA.position.y < bodyB.position.y){
            targetBody = bodyA;
            srcBody = bodyB;
          }else{
            targetBody = bodyB;
            srcBody = bodyA;
          }
          let newLevel = Math.min(targetBody.level + 1, 7);
          let scale = BallRadiusMap[newLevel] / BallRadiusMap[targetBody.level];
          Body.scale(targetBody, scale, scale);
          Body.set(targetBody, {
            level: newLevel
          });
          Body.translate(targetBody, Vector.create(0, -10));
          World.remove(_this.engine.world, srcBody);
        }
      });
    });

    Engine.run(this.engine);
    if(debug){
      Render.run(this.render);
    }
  }
  createBall(x, y, radius, level, isStatic){
    let ball = Bodies.circle(x, y, radius, {
      isStatic,
      restitution: 0,
      name: MyBall,
      level
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
      if (body.name == MyBall){
        ballList.push(body);
      }
    });
    return ballList;
  }
}

export default Physics;