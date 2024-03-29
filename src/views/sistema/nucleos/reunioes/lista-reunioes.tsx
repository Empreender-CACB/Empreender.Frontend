import '@inovua/reactdatagrid-community/index.css'

import { useState, useCallback } from 'react'
import moment from 'moment'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '@inovua/reactdatagrid-community/theme/green-light.css'
import '@inovua/reactdatagrid-community/theme/blue-light.css'

import 'moment/locale/pt-br'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'

moment.locale('pt-br')

const columns = [
    { name: 'idreuniao', header: 'ID da Reunião', type: 'number' },
    { name: 'dsmotivo', header: 'Motivo', type: 'string', defaultFlex: 1 },
    {
        name: 'dtreuniao',
        header: 'Data da Reunião',
        type: 'date',
        defaultFlex: 1,
        render: ({ value }) =>
            value ? moment(value).format('DD-MM-YYYY') : '-',
    },
    { name: 'iduf', header: 'UF', type: 'string', defaultFlex: 1 },
    { name: 'nmcidade', header: 'Cidade', type: 'string', defaultFlex: 1 },
]

const defaultFilterValue = [
    { name: 'idreuniao', operator: 'contains', type: 'number', value: '' },
    { name: 'dsmotivo', operator: 'contains', type: 'string', value: '' },
    { name: 'dtreuniao', operator: 'after', type: 'date', value: '' },
    { name: 'iduf', operator: 'contains', type: 'string', value: '' },
    { name: 'nmcidade', operator: 'contains', type: 'string', value: '' },
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

type Props = {
    idnucleo: number
}

const ListaReunioes = ({ idnucleo }: Props) => {
    const loadData = ({ skip, limit, sortInfo, groupBy, filterValue }) => {
        return fetch(
            `${import.meta.env.VITE_API_URL}/nucleos/lista-reunioes` +
                `?idnucleo=${idnucleo}` +
                '&skip=' +
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

    const [selected, setSelected] = useState({ 2: true, 5: true })
    const dataSource = useCallback(loadData, [])

    console.log(dataSource)

    const onSelectionChange = useCallback(({ selected }) => {
        setSelected(selected)
    }, [])

    const gridStyle = { minHeight: 750, width: '100%' }

    return (
        <div className="mt-4">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Reuniões</h3>
                {/* <div style={{ height: 80 }} >Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code>: 'none'}.</div> */}
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    >
                        <Button block size="xs" icon={<HiDownload />}>
                            Exportar
                        </Button>
                    </Link>
                </div>
            </div>
            <ReactDataGrid
                i18n={i18n}
                idProperty="idcontato"
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
        </div>
    )
}

export default ListaReunioes
