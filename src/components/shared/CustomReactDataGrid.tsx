/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, FC } from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import axios from 'axios'
import { Button } from '../ui'
import { HiDownload } from 'react-icons/hi'
interface CustomReactDataGridProps {
    columns: any[];
    defaultFilterValue: any;
    url: string;
    options?: React.ReactNode;
}

type SortInfo = {
    field: string;
    order: 'ASC' | 'DESC';
};

type FilterValue = {
    [key: string]: any;
};

type LoadDataParams = {
    skip: number;
    limit: number;
    sortInfo: SortInfo;
    groupBy?: string;
    filterValue: FilterValue;
    exportOption?: boolean ;
};


const i18n = Object.assign({}, ReactDataGrid.defaultProps.i18n, {
    pageText: 'Página ',
    ofText: ' de ',
    perPageText: 'Resultados por página',
    showingText: 'Mostrando ',
    clearAll: 'Limpar tudo',
    inList: 'Na lista',
    notInList:"Fora da lista",
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
    before:" Antes",
    beforeOrOn: 'Antes de ou em',
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
        todayButtonText: 'Hoje',
        clearButtonText: 'Limpar',
        okButtonText: 'OK',
        cancelButtonText: 'Cancelar',
    },
})



const CustomReactDataGrid: FC<CustomReactDataGridProps> = ({ columns, defaultFilterValue, url, options }) => {

    const [gridRef, setGridRef] = useState(null)
    const [queryParams, setQueryParams] = useState<LoadDataParams>({
        skip: 0,
        limit: 10,
        sortInfo: {
            field: '', 
            order: 'ASC'
          },
        groupBy: '',
        filterValue: {},
      });
      
    const loadData = async (params: any, exportExcel=false) => {
        try {
            const { skip, limit, sortInfo, groupBy, filterValue } = params;
    
            if(exportExcel){
                const response = await axios.get(url, {
                    params: {
                        skip: skip,
                        limit: limit,
                        exportExcel:true,
                        groupBy: groupBy && groupBy.length ? groupBy : undefined,
                        sortInfo: JSON.stringify(sortInfo),
                        filterBy: JSON.stringify(filterValue)
                    }
                });  

                const relativeUrl = response.data;
                const cleanedRelativeUrl = relativeUrl.replace(/^public\//, '');
    
                const baseUrl = 'http://localhost:3333'; // Remove the trailing slash
                const absoluteUrl = `${baseUrl}/${cleanedRelativeUrl}`;

                alert(absoluteUrl)
                return absoluteUrl

            }
            const response = await axios.get(url, {
                params: {
                    skip: skip,
                    limit: limit,
                    groupBy: groupBy && groupBy.length ? groupBy : undefined,
                    sortInfo: JSON.stringify(sortInfo),
                    filterBy: JSON.stringify(filterValue)
                }
            });


    
            const totalCount = response.headers['x-total-count'];
            const data = response.data.data;
            const count = response.data.meta.total;
    
            return { data, count, totalCount };
    
        } catch (error) {
            console.error('An error occurred while fetching data: ', error);
            throw error;
        }
    }

    const gridStyle = { minHeight: 750, width: '100%' };

    const handleFilterValueChange = (newFilterValue: any) => {
        //console.log(newFilterValue)
        setQueryParams((prevParams) => ({
          ...prevParams,
          filterValue: newFilterValue,
        }));
      };

    return (
        <div>
            {options}
            <div style={{ marginBottom: 20 }}>
        <Button size='sm' onClick={()=> {
          gridRef.current.clearAllFilters()
        }}>
          Limpar filtros
        </Button>
        <Button icon={<HiDownload />} className='mx-2' size='sm' onClick={()=> {
          loadData(queryParams,true)
        }}>
          Exportar
        </Button>
      </div>
      <pre>{JSON.stringify(queryParams, null, 2)}</pre>

            <ReactDataGrid
                onReady={setGridRef}
                i18n={i18n}
                onFilterValueChange={handleFilterValueChange}
                idProperty="id"
                defaultFilterValue={defaultFilterValue}
                columns={columns}
                theme="blue-light"
                dataSource={loadData}
                enableFiltering={true}
                pagination
                style={gridStyle}
                enableColumnAutosize ={false}
                emptyText = "Não há dados para serem exibidos"
                disableGroupByToolbar = {true}
                
                
            />
        </div>
    )
}

export default CustomReactDataGrid;
