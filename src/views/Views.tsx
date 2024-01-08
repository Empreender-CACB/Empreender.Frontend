import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import { authRoutes, protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'
import AuthRoute from '@/components/route/AuthRoute'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <PageContainer {...props} {...route.meta}>
                                <AppRoute
                                    routeKey={route.key + index}
                                    component={route.component}
                                    {...route.meta}
                                />
                            </PageContainer>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
            <Route path="/" element={<AuthRoute />}>
                {authRoutes.map((route,index) => (
                    <Route
                        key={route.path + index}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key + index}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route, index) => (
                    <Route
                        key={route.path + index}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key + index}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
