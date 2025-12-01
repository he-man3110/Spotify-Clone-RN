import configs from "../app.config.json";
export namespace AppConfig {
  export function shouldEnableReduxLogs() {
    return configs.REDUX_LOGS === "true";
  }
}
