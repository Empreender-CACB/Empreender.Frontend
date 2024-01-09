import authRoute from './authRoute'
import appsRoute from './appsRoute'
import publicRoute from './publicRoute'
import docsRoute from './docsRoute'
import type { Routes } from '@/@types/routes'

export const authRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [...appsRoute,...docsRoute,]

export const publicRoutes: Routes = [...publicRoute]
