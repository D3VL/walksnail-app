import { kissRoutes } from 'remix-kiss-routes'

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  routes: defineRoutes => {
    return kissRoutes(defineRoutes)
  },
  tailwind: true,
};
