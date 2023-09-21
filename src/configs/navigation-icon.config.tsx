import {
    HiOutlineChartSquareBar,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineChip,
    HiOutlineBriefcase,
    HiOutlineUserGroup,
    HiOutlineDocumentReport,
    HiOutlineDocumentDuplicate,
    HiOutlineClipboardList,
    HiOutlineCog,
    
} from 'react-icons/hi'

import {
    
    FcBusinessman,
    FcCollaboration,
    FcDepartment,
    FcDiploma2,
    FcDocument,
    FcFile,
    FcHome,
    FcMenu,
    FcParallelTasks,
    FcSettings,
    FcShop,
} from 'react-icons/fc'

export type NavigationIcons = Record<string, JSX.Element>

// const navigationIcon: NavigationIcons = {
//     apps: <HiOutlineViewGridAdd />,
//     project: <HiOutlineChartSquareBar />,
//     home: <HiOutlineHome />,
//     entities: <HiOutlineOfficeBuilding />,
//     nucleos: <HiOutlineChip />,
//     companies: <HiOutlineBriefcase />,
//     users: <HiOutlineUserGroup />,
//     reports: <HiOutlineDocumentReport />,
//     files: <HiOutlineDocumentDuplicate />,
//     curriculos: <HiOutlineClipboardList />,
//     adm: <HiOutlineCog />,
// }

export const navigationIcon: NavigationIcons = {
    apps: <FcMenu />,
    project: <FcParallelTasks />,
    home: <FcHome />,
    entities: <FcDepartment />,
    nucleos: <FcCollaboration />,
    companies: <FcShop />,
    users: <FcBusinessman />,
    reports: <FcDocument />,
    files: <FcFile />,
    curriculos: <FcDiploma2 />,
    adm: <FcSettings />,
}

export default navigationIcon
