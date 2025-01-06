import { Server } from "../src/presentation/server";
import { AppRoutes } from "../src/presentation/routes";
import { envs } from "../src/config/envs";

export const testServer = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
});