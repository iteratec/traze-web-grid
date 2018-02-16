# Traze Web Grid

Provides the traze web grid based on HTML and ES6 features to represent the game state with existing spawn points, bikes and their trails using multiple canvas layers.

## Getting started

To run the web ui instance execute `docker-compose up`. The compose stack will be build the web ui using Webpack and wraps the assets into a Nginx web server. Which will automatically configured to provide the correct game server and broker details to the frontend assets.

The container will be available on `<host>:8001` and the configuration for the frontend assets on `<host>:8001/app-configuration`. The connection to the mqtt broker will be established immediately after retrieving the app configuration. Afterwards the web ui subscribes to necessary channels and re-frames the grid ui with 60 fps.  

### Local development

To work locally some prerequisites must be resolved:
* node & npm are installed

If your local system is ready execute `npm run dev` or `npm run prod` to build the static assets. For further details look into the `webpack.config.babel.js`.

After a successful build the static assets will be available at `build/*`. The HTML index page could be opened in a browser of your choice. But keep in mind that the chrome browser will be perform the garbage collection much faster than firefox does and therefore the canvas re-framing works better.

### Self configured Nginx

In the case of this web ui there are no backend service which could be provided necessary configuration about the mqtt broker an so on. To solve this problem this project using a self configured Nginx pragma.

*How it works?*

The nginx contains a custom server configuration which specifies that the app configuration will be provided via `/app-configuration`. The return of this server route is defined as a placeholder like `${APP_CONFIG}` and could be resolved if the container starts up. To do this the plugin [`env-subst`](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) will be used to replace the placeholder `APP_CONFIG` with the identically named environment variable like `APP_CONFIG='{"brokerUrl":"wss://traze.iteratec.de:9443", "instanceName":"1"}'`. The value of the environment variable should be in JSON format. If the container is running. The value of the environment variable will be served by the Nginx server and provides all necessary configuration to the frontend application.  

## 3rd-party resources
We use the [orbitron font](https://github.com/theleagueof/orbitron)
