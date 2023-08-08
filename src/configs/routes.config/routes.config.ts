import authRoute from './authRoute'
import appsRoute from './appsRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    ...appsRoute
]
