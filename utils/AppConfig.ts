import configs from "../FeatureFlags";
export namespace AppConfig {
  export function shouldEnableReduxLogs() {
    return configs.REDUX_LOGS === "true";
  }
}
