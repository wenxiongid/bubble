import decomp from "poly-decomp";
window.decomp = decomp;
import Matter from "matter-js";
import BallRadiusMap from "./game_param";

const debug = false;

const MyBall = 'myBall';

const defaultCategory = 0x0001,
  mergeCategory = 0x0002;

const Engine = Matter.Engine,
  Render = Matter.Render,
  Svg = Matter.Svg,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector,
  Vertices = Matter.Vertices,
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

    // add proof
    let path = document.getElementById('path');
    let points = Svg.pathToVertices(path, 30);
    let scale = sceneSize.width / 375;
    Vertices.scale(points, scale, scale);
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

    Events.on(this.engine, 'beforeUpdate', event => {
      let collisionInfo = _this.checkCollision();
      if(collisionInfo){
        _this.collisionInfo = collisionInfo;
      }
      if(_this.collisionInfo){
        _this.mergeBall(_this.collisionInfo.srcBody, _this.collisionInfo.targetBody);
      }
    });

    Engine.run(this.engine);
    if(debug){
      Render.run(this.render);
    }
  }
  getDistSq(posA, posB){
    return (posA.x - posB.x) * (posA.x - posB.x) + (posA.y - posB.y) * (posA.y - posB.y);
  }
  mergeBall(srcBody, targetBody){
    let _this = this;
    let dist = Math.sqrt(_this.getDistSq(srcBody.position, targetBody.position));
    if(dist < srcBody.circleRadius + targetBody.circleRadius + 5){
      Body.setStatic(srcBody, true);
      srcBody.collisionFilter.mask = mergeCategory;
      if (dist < 5) {
        let newLevel = Math.min(targetBody.level + 1, 7);
        let scale = BallRadiusMap[newLevel] / BallRadiusMap[targetBody.level];
        Body.scale(targetBody, scale, scale);
        Body.set(targetBody, { level: newLevel });
        World.remove(_this.engine.world, srcBody);
        _this.collisionInfo = false;
        _this.isMerging = false;
        return;
      }
      let velovity = {
        x: targetBody.position.x - srcBody.position.x,
        y: targetBody.position.y - srcBody.position.y
      };
      velovity.x /= dist / 8;
      velovity.y /= dist / 8;
      Body.translate(srcBody, Vector.create(velovity.x, velovity.y));
    }
  }
  checkCollision(){
    let _this = this;
    let bodies = _this.getAllBall();
    let isFoundCollision = false;
    let targetBody,
      srcBody;
    if(_this.isMerging){
      return false;
    }
    for(let i = 0; i < bodies.length; i++){
      let bodyA = bodies[i];
      if(!bodyA.isStatic && !bodyA.isMerging){
        for(let j = i + 1; j < bodies.length; j++){
          let bodyB = bodies[j];
          if (!bodyB.isStatic && !bodyB.isMerging && bodyA.level == bodyB.level && _this.getDistSq(bodyA.position, bodyB.position) <= 4 * bodyA.circleRadius * bodyA.circleRadius) {
            if (bodyA.position.y < bodyB.position.y) {
              targetBody = bodyA;
              srcBody = bodyB;
            } else {
              targetBody = bodyB;
              srcBody = bodyA;
            }
            isFoundCollision = true;
            _this.isMerging = true;
            break;
          }
        }
      }
      if(isFoundCollision){
        break;
      }
    }
    if(isFoundCollision){
      return {
        srcBody,
        targetBody
      };
    }else{
      return false;
    }
  }
  createBall(x, y, radius, level, isStatic){
    let ball = Bodies.circle(x, y, radius, {
      collisionFilter: {
        mask: defaultCategory
      },
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