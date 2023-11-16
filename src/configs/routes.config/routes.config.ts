import authRoute from './authRoute'
import appsRoute from './appsRoute'
import publicRoute from './publicRoute'

import type { Routes } from '@/@types/routes'

export const authRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [...appsRoute]

export const publicRoutes: Routes = [...publicRoute]
