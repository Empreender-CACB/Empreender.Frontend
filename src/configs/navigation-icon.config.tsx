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

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    apps: <HiOutlineViewGridAdd />,
    project: <HiOutlineChartSquareBar />,
    home: <HiOutlineHome />,
    entities: <HiOutlineOfficeBuilding />,
    nucleos: <HiOutlineChip />,
    companies: <HiOutlineBriefcase />,
    users: <HiOutlineUserGroup />,
    reports: <HiOutlineDocumentReport />,
    files: <HiOutlineDocumentDuplicate />,
    curriculos: <HiOutlineClipboardList />,
    adm: <HiOutlineCog />,
}

export default navigationIcon
