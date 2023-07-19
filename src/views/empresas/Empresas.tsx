import '@inovua/reactdatagrid-community/index.css'

import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import ReactDataGrid, { DateFilter } from '@inovua/reactdatagrid-community'
import { HiArrowDown } from 'react-icons/hi'
import { Button } from '@/components/ui'

const SEPARATOR = ','

const columns = [
    { name: 'idempresa', header: 'ID', type: 'string' },
    {
        name: 'nmfantasia',
        header: 'Nome Fantasia',
        defaultFlex: 2,
        type: 'Nome',
        render: ({ value, data }) => (
            <div>
                <Link to={`/empresas/${data.idempresa}`}>
                    {data.nmfantasia}
                </Link>
            </div>
        ),
    },
    { name: 'nucnpjcpf', header: 'CNPJ', defaultFlex: 1 },
    {
        name: 'dtinicioatividade',
        header: 'Inicio da Atividade',
        defaultFlex: 1,
        dateFormat: 'YYYY-MM-DD',
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
    {
        name: 'ramoAtividade',
        header: 'Ramo',
        defaultFlex: 1,
        render: ({ data }) => (
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {data.ramoAtividade?.nmramoativ}
            </div>
        ),
    },
]

const defaultFilterValue = [
    {
        name: 'idempresa',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'nmfantasia',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    { name: 'nucnpjcpf', operator: 'contains', type: 'string', value: '' },
    { name: 'dtinicioatividade', operator: 'after', type: 'date', value: '' },
    {
        name: 'ramoAtividade',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    { name: 'valor_antigo', operator: 'contains', type: 'string', value: '' },
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
    return fetch('https://cacbempreenderapp.org.br/api/empresas/').then((response) => {
        return response.json()
    })
}

const Empresas = () => {
    const dataSource = useCallback(loadData, [])

    const exportCSV = () => {
        return 1
    }

    const gridStyle = { minHeight: 750, width: '100%' }

    return (
        <div className="">
            <div className="lg:flex items-center justify-between mb-4 gap-3">
                <div className="mb-4 lg:mb-0">
                    <h3>Empresas</h3>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <Button
                        size="sm"
                        icon={<HiArrowDown />}
                        onClick={exportCSV}
                    >
                        Exportar Tabela
                    </Button>
                </div>
            </div>
            <div>
                <ReactDataGrid
                    i18n={i18n}
                    defaultFilterValue={defaultFilterValue}
                    columns={columns}
                    dataSource={dataSource}
                    style={gridStyle}
                />
            </div>
        </div>
    )
}

export default Empresas
