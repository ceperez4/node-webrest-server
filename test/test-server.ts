import { Server } from '../src/presentation/server'
import { envs } from '../src/config/envs'
import { AppRoutes } from '../src/presentation/routes'

export const testServer = new Server({
    PORT: envs.PORT,
    PUBLIC_PATH: envs.PUBLIC_PATH,
    routes: AppRoutes.routes
})