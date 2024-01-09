import { lazy } from 'react'
import { DOCS_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

const docsRoute: Routes = [
    {
        key: 'docs.changeLog',
        path: `${DOCS_PREFIX_PATH}/changelog`,
        component: lazy(() => import('@/views/docs/ChangeLog')),
    },
]

export default docsRoute
