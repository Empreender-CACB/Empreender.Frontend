import '@inovua/reactdatagrid-community/index.css'

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '@inovua/reactdatagrid-community/theme/green-light.css'
import '@inovua/reactdatagrid-community/theme/blue-light.css'

import { HiDownload, HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'

moment.locale('pt-br')
const columns = [
    { name: 'idnucleo', header: 'ID', type: 'string' },
    {
        name: 'nmnucleo',
        header: 'Nome',
        defaultFlex: 1.5,
        type: 'string',
        render: ({ value, data }) => (
            <div>
                <Link to={`/sistema/nucleos/${data.idnucleo}`}>
                    {data.nmnucleo}
                </Link>
            </div>
        ),
    },
    {
        name: 'idassociacao',
        header: 'ID Associação',
        defaultFlex: 1,
        type: 'number',
    },
    {
        name: 'idsegmento',
        header: 'ID Segmento',
        defaultFlex: 1,
        type: 'number',
    },
    {
        name: 'dtultimaalteracao',
        header: 'Última Alteração',
        defaultFlex: 1,
        dateFormat: 'MM-DD-YYYY',
        filterEditor: DateFilter,
        filterEditorProps: (props, { index }) => {
            return {
                dateFormat: 'MM-DD-YYYY',
                placeholder:
                    index === 1
                        ? 'A data é anterior à...'
                        : 'A data é posterior à',
            }
        },
        render: ({ value, cellProps: { dateFormat } }) =>
            moment(value).format(dateFormat) === 'Invalid date'
                ? '-'
                : moment(value).format(dateFormat),
    },
    { name: 'flativo', header: 'Ativo', defaultFlex: 1, type: 'string' },
]

const defaultFilterValue = [
    {
        name: 'idnucleo',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'nmnucleo',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    { name: 'idassociacao', operator: 'contains', type: 'number', value: '' },
    { name: 'idsegmento', operator: 'contains', type: 'number', value: '' },
    { name: 'dtultimaalteracao', operator: 'after', type: 'date', value: '' },
    {
        name: 'flativo',
        operator: 'contains',
        type: 'string',
        value: '',
    },
]

const i18n = Object.assign({}, ReactDataGrid.defaultProps.i18n, {
    pageText: 'Página ',
    ofText: ' de ',
    perPageText: 'Resultados por página',
    showingText: 'Mostrando ',
    clearAll: 'Limpar tudo',
    clear: 'Limpar',
    showFilteringRow: 'Mostrar linha de filtragem',
    hideFilteringRow: 'Esconder linha de filtragem',
    dragHeaderToGroup: 'Arraste o cabeçalho para agrupar',
    disable: 'Desabilitar',
    enable: 'Habilitar',
    sortAsc: 'Ordenar em ordem ascendente',
    sortDesc: 'Ordenar em ordem descendente',
    unsort: 'Remover ordenação',
    group: 'Agrupar',
    ungroup: 'Desagrupar',
    lockStart: 'Fixar início',
    lockEnd: 'Fixar fim',
    unlock: 'Desafixar',
    columns: 'Colunas',
    contains: 'Contém',
    startsWith: 'Começa com',
    endsWith: 'Termina com',
    notContains: 'Não contém',
    neq: 'Diferente',
    eq: 'Igual',
    notEmpty: 'Não vazio',
    beforeOrOn: 'Antes de',
    afterOrOn: 'A partir de',
    after: 'Após',
    empty: 'Vazio',
    inrange: 'No intervalo',
    notinrange: 'Fora do intervalo',
    lt: 'Menor que',
    lte: 'Menor ou igual a',
    gt: 'Maior que',
    gte: 'Maior ou igual a',
    'calendar.todayButtonText': 'Hoje',
    calendar: {
        todayButtonText: 'Hoje1',
        clearButtonText: 'Limpar',
        okButtonText: 'OK',
        cancelButtonText: 'Cancelar',
    },
})

const loadData = ({ skip, limit, sortInfo, groupBy, filterValue }) => {
    return fetch(
        'http://localhost:3333/nucleos' +
            '?skip=' +
            skip +
            '&limit=' +
            limit +
            (groupBy && groupBy.length ? '&groupBy=' + groupBy : '') +
            '&sortInfo=' +
            JSON.stringify(sortInfo) +
            '&filterBy=' +
            JSON.stringify(filterValue)
    ).then((response) => {
        return response.json().then((data) => {
            return { data: data.data, count: data.meta.total }
        })
    })
}

const Nucleos = () => {
    const [selected, setSelected] = useState({ 2: true, 5: true })
    const dataSource = useCallback(loadData, [])

    const onSelectionChange = useCallback(({ selected }) => {
        setSelected(selected)
    }, [])

    const gridStyle = { minHeight: 750, width: '100%' }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Núcleos</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`https://teste.cacbempreenderapp.org.br/sistema/nucleo`}
                        >
                            Visualizar versão antiga
                        </Link>
                    </Button>

                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    >
                        <Button block size="sm" icon={<HiDownload />}>
                            Exportar
                        </Button>
                    </Link>
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to="/app/sales/product-new"
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar núcleo
                        </Button>
                    </Link>
                </div>
            </div>
            <ReactDataGrid
                i18n={i18n}
                idProperty="idnucleo"
                defaultFilterValue={defaultFilterValue}
                columns={columns}
                theme="blue-light"
                emptyText={'Não há registros para serem exibidos'}
                dataSource={dataSource}
                enableFiltering={true}
                checkboxColumn
                onSelectionChange={onSelectionChange}
                style={gridStyle}
                paginante
                pagination
            />
            <div style={{ height: 80 }}>
                {' '}
                selecteds:{' '}
                {selected ? (
                    <code>{JSON.stringify(selected, null, 2)}</code>
                ) : (
                    'none'
                )}
                .
            </div>
        </AdaptableCard>
    )
}

export default Nucleos
