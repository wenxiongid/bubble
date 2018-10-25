import { getResponseDist } from "./helper";

const BallRadiusMap = {
  1: getResponseDist(20),
  2: getResponseDist(30),
  3: getResponseDist(40),
  4: getResponseDist(50),
  5: getResponseDist(60),
  6: getResponseDist(70),
  7: getResponseDist(80)
};

export {
  BallRadiusMap as default
};