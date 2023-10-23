/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, FC, useEffect } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Spinner from '@/components/ui/Spinner'
import { GrCloudDownload } from 'react-icons/gr'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { MdFilterAltOff, MdFilterAlt } from 'react-icons/md'
import { Button, DatePicker, Dialog, Drawer, Input, Pagination } from '@/components/ui'
import {
    HiDownload,
    HiOutlineCog,
    HiOutlineViewGrid,
    HiOutlineViewList,
} from 'react-icons/hi'
import PaginationToolbar from '@inovua/reactdatagrid-community/packages/PaginationToolbar'
import useDarkMode from '@/utils/hooks/useDarkmode'
import Select from 'react-select'
import type { MouseEvent } from 'react'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '@inovua/reactdatagrid-community/theme/blue-light.css'
import '@inovua/reactdatagrid-community/theme/blue-dark.css'
import Tooltip from '@/components/ui/Tooltip'
import CTableCards from './CTableCards'
//import './theme.css'
import i18n from './i18n'
import { TableConfigType, apiDataTable } from '@/services/DataTableService'
interface CustomReactDataGridProps {
    filename: string
    columns: any[]
    defaultFilterValue?: any
    url: string
    options?: React.ReactNode
    CardLayout?: React.ComponentType<any>
    widthSize?: number
}

type SortInfo = {
    field: string
    order: 'ASC' | 'DESC'
}

type FilterValue = {
    [key: string]: any
}

type LoadDataParams = {
    skip: number
    limit: number
    sortInfo: SortInfo
    groupBy?: string | boolean
    filterValue: FilterValue
    exportOption?: boolean
}

type Option = {
    value: number
    label: string
}

const paginateOptions: Option[] = [
    { value: 5, label: '5 / página' },
    { value: 10, label: '10 / página' },
    { value: 20, label: '20 / página' },
    { value: 50, label: '50 / página' },
]

const CustomReactDataGrid: FC<CustomReactDataGridProps> = ({
    columns,
    defaultFilterValue,
    url,
    options,
    filename,
    widthSize = 1280,
    CardLayout,
}) => {
    const [larguraDaTela, setLarguraDaTela] = useState(window.innerWidth)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const valorLocalStorage = localStorage.getItem('lista_geral')
    const [isDark] = useDarkMode()
    const [view, setView] = useState('list')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [listaGeral, setListaGeral] = useState(
        valorLocalStorage ? Number(valorLocalStorage) : 25
    )
    const [gridRef, setGridRef] = useState(null)
    const [loadedData, setLoadedData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalItems, setTotalItems] = useState()
    const [isDownloading, setIsDownloading] = useState(false)
    const [pageSize, setPageSize] = useState(paginateOptions[0].value)
    const [page, setPage] = useState(1)
    const [queryParams, setQueryParams] = useState<LoadDataParams>({
        skip: 0,
        limit: 30,
        sortInfo: {
            field: '',
            order: 'ASC',
        },
        groupBy: '',
        filterValue: {},
    })

    const onPaginationChange = (val: number) => {
        setPage(val)
        setQueryParams((prevParams) => ({
            ...prevParams,
            skip: Math.ceil(val *30 ) - 1,
        }))
        console.log(queryParams)
        dataSource(queryParams)
    }

    const openDrawer = () => {
        setDrawerOpen(true)
    }

    const onDrawerClose = () => {
        setDrawerOpen(false)
        //gridRef.current.setFilterValue(defaultFilterValue1)
    }

    const Footer = (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={() => onDrawerClose()}>
                Cancelar
            </Button>
            <Button size="sm" variant="solid" onClick={() => onDrawerClose()}>
                Filtrar
            </Button>
        </div>
    )

    const onViewToggle = () => {
        setView(view === 'grid' ? 'list' : 'grid')
    }

    useEffect(() => {
        localStorage.setItem('lista_geral', listaGeral.toString())
    }, [listaGeral])

    useEffect(() => {
        const handleResize = () => {
            setLarguraDaTela(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }
    const opcoes = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
        { value: 25, label: '25' },
        { value: 40, label: '40' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
    ]

    const handleChange = (opcaoSelecionada) => {
        setListaGeral(opcaoSelecionada.value)
        localStorage.setItem('lista_geral', String(opcaoSelecionada.value))
    }

    const OPERATOR_LABELS = {
        contains: 'Contém',
        notContains: 'Não contém',
        eq: 'Igual a',
        neq: 'Diferente de',
        empty: 'Está vazio',
        notEmpty: 'Não está vazio',
        startsWith: 'Começa com',
        endsWith: 'Termina com',
        gt: 'Maior que',
        gte: 'Maior ou igual a',
        lt: 'Menor que',
        lte: 'Menor ou igual a',
        inrange: 'Dentro do intervalo',
        notinrange: 'Fora do intervalo',
        inlist: 'Está na lista',
        notinlist: 'Não está na lista',
        after: 'Depois de',
        afterOrOn: 'Depois ou em',
        before: 'Antes de',
        beforeOrOn: 'Antes ou em',
    }

    const OPERATORS_BY_TYPE = {
        string: [
            'contains',
            'notContains',
            'eq',
            'neq',
            'empty',
            'notEmpty',
            'startsWith',
            'endsWith',
        ],
        number: [
            'eq',
            'neq',
            'gt',
            'gte',
            'lt',
            'lte',
            'inrange',
            'notinrange',
        ],
        boolean: ['eq', 'neq'],
        select: ['eq', 'neq', 'inlist', 'notinlist'],
        date: [
            'after',
            'afterOrOn',
            'before',
            'beforeOrOn',
            'eq',
            'neq',
            'inrange',
            'notinrange',
        ],
    }

    const renderInputByType = (type, column) => {
        switch (type) {
            case 'string':
                return <Input placeholder={column.header} />
            case 'number':
                return <Input placeholder={column.header} type="number" />
            case 'select':
                return (
                    <Select
                        placeholder="Selecione"
                        options={column.filterEditorProps?.dataSource || []}
                    />
                )
            case 'date':
                return <DatePicker placeholder={column.header} />
            // Adicione outros tipos conforme necessário
            default:
                return null
        }
    }

    const renderOperatorSelect = (type) => {
        const operators = OPERATORS_BY_TYPE[type] || []
        return (
            <Select
                placeholder="Operador"
                options={operators.map((op) => ({
                    value: op,
                    label: OPERATOR_LABELS[op],
                }))}
            />
        )
    }

    const loadData = async (params: any, exportExcel = false) => {
        try {
            const { skip, limit, sortInfo, groupBy, filterValue } = params

            const tableConfig: TableConfigType = {
                skip: skip,
                limit: limit,
                filename: filename,
                exportExcel: exportExcel, // TODO: exportInfo: {name: column.name, header: column.header
                groupBy: groupBy && groupBy.length ? groupBy : undefined,
                sortInfo: JSON.stringify(sortInfo),
                filterBy: JSON.stringify(filterValue),
            }

            if (exportExcel) {
                tableConfig.exportInfo = columns.map((column) => ({name: column.name, header: column.header}))
                setIsDownloading(true)
                const toastId = String(await downloadAndNotify())

                const response = await apiDataTable(url, tableConfig)

                const relativeUrl = response.data
                const cleanedRelativeUrl = relativeUrl.replace(/^public\//, '')
                const baseUrl = `${import.meta.env.VITE_API_URL}`
                const absoluteUrl = `${baseUrl}/${cleanedRelativeUrl}`

                setIsDownloading(false)
                toast.remove(toastId)
                window.open(absoluteUrl, '_blank')

                return absoluteUrl
            }

            const response = await apiDataTable(url, tableConfig)

            const data = response.data.data
            const count = response.data.meta.total
            setTotalItems(count)

            setLoadedData(data)
            setLoading(true)

            return { data, count }
        } catch (error) {
            console.error('An error occurred while fetching data: ', error)
            throw error
        }
    }

    const dataSource = useCallback(loadData, [url])

    const gridStyle = { minHeight: 750, width: '100%' }

    const handleFilterValueChange = (newFilterValue: any) => {
        setQueryParams((prevParams) => ({
            ...prevParams,
            filterValue: newFilterValue,
        }))
    }

    const notification = (
        <Notification
            title="Exportação iniciada"
            duration={0}
            customIcon={
                <GrCloudDownload className="text-2xl text-indigo-600" />
            }
        >
            O download começará em instantes.
        </Notification>
    )

    function downloadAndNotify() {
        return toast.push(notification)
    }

    const renderPaginationToolbar = useCallback((paginationProps) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        options = {
            pageText: 'Página ',
            ofText: ' de ',
            perPageText: 'Resultados por página',
            showingText: 'Exibindo ',
        }

        return (
            <div style={{ paddingTop: '40px' }}>
                <PaginationToolbar
                    {...paginationProps}
                    {...options}
                    bordered={true}
                ></PaginationToolbar>

                <div
                    style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '10px',
                    }}
                >
                    <HiOutlineCog onClick={() => openDialog()} size={'20px'} />
                </div>
            </div>
        )
    }, [])

    const hideTable = larguraDaTela <= widthSize || view === 'grid'
    const hideClass = hideTable ? 'hidden' : 'block'
    return (
        <div>
            <Dialog isOpen={dialogIsOpen}>
                <h5 className="mb-4">Preferências da CTable</h5>
                <p>
                    <b>Quantidade de itens padrão:</b>
                    <Select
                        options={opcoes}
                        onChange={handleChange}
                        placeholder="Selecione um número"
                    />{' '}
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancelar
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Salvar
                    </Button>
                </div>
            </Dialog>

            {options}
            <div
                style={{
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'end',
                }}
            >
                <Tooltip title={view === 'grid' ? 'Lista' : 'Quadros'}>
                    <Button
                        className="hidden md:flex"
                        variant="plain"
                        size="sm"
                        icon={
                            view === 'grid' ? (
                                <HiOutlineViewList />
                            ) : (
                                <HiOutlineViewGrid />
                            )
                        }
                        onClick={() => onViewToggle()}
                    />
                </Tooltip>

                <Tooltip title={'Limpar filtros'}>
                    <Button
                        icon={<MdFilterAltOff />}
                        variant="plain"
                        size="sm"
                        className="mx-2 "
                        onClick={() => {
                            gridRef.current.clearAllFilters()
                            gridRef.current.setFilterValue(defaultFilterValue)
                        }}
                    ></Button>
                </Tooltip>

                <Tooltip title={'Filtrar dados'}>
                    <Button
                        icon={<MdFilterAlt />}
                        size="sm"
                        variant="plain"
                        onClick={() => openDrawer()}
                    ></Button>
                </Tooltip>

                <Tooltip title={'Exportar dados'}>
                    <Button
                        disabled={isDownloading}
                        icon={isDownloading ? <Spinner /> : <HiDownload />}
                        className="mx-2"
                        variant="plain"
                        size="sm"
                        onClick={() => {
                            loadData(queryParams, true)
                        }}
                    ></Button>
                </Tooltip>
            </div>

            <Drawer
                title="Filtrar busca"
                isOpen={drawerOpen}
                footer={Footer}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                {columns.map((column, index) => (
                    <div key={index} className="flex flex-col mb-8">
                        <div className="font-bold mb-2">{column.header}</div>
                        <div className="mb-2">
                            {renderInputByType(column.type, column)}
                        </div>
                        <div>{renderOperatorSelect(column.type)}</div>
                    </div>
                ))}
            </Drawer>

            {(loadedData && hideTable) || view === 'grid' ? (
                <>
                    <CTableCards data={loadedData} renderItem={CardLayout} />
                    <div className="flex items-center">
                        <Pagination  pageSize={listaGeral} total={totalItems} onChange={onPaginationChange} />
                        <div style={{ minWidth: 120 }}>
                            <Select
                                size="sm"
                                defaultValue={paginateOptions[0]}
                                options={paginateOptions}
                            />
                        </div>
                    </div>                </>


            ) : null}
            <ReactDataGrid
                className={`${hideClass}`}
                renderPaginationToolbar={renderPaginationToolbar}
                i18n={i18n}
                wrapMultiple={false}
                idProperty="id"
                defaultFilterValue={defaultFilterValue || columns}
                columns={columns}
                theme={isDark ? 'blue-dark' : 'blue-light'}
                defaultLimit={30}
                enableFiltering={true}
                userSelect={true}
                columnUserSelect={true}
                pagination
                style={gridStyle}
                enableColumnAutosize={false}
                limit={listaGeral}
                loadingText="Carregando ... "
                emptyText="Não há dados para serem exibidos"
                disableGroupByToolbar={true}
                dataSource={dataSource}
                onLoadingChange={setLoading}
                onFilterValueChange={handleFilterValueChange}
                onLimitChange={setListaGeral}
                onReady={setGridRef}
            />
        </div>
    )
}

export default CustomReactDataGrid
