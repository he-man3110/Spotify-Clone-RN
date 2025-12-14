export type FeatureFlag = {
  REDUX_LOGS: `${boolean}` | "auto";
};

const config: FeatureFlag = {
  REDUX_LOGS: "true",
};

export default config;
