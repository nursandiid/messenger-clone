import { AxiosInstance } from "axios";
import Echo from "laravel-echo";
import { route as ziggyRoute } from "ziggy-js";

declare global {
  interface Window {
    axios: AxiosInstance;
    Pusher: unknown;
    Echo: Echo;
  }

  var route: typeof ziggyRoute;
}
