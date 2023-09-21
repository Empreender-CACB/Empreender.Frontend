/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, FC, useEffect } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Spinner from '@/components/ui/Spinner'
import { GrCloudDownload } from 'react-icons/gr'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import axios from 'axios'
import { Button,Dialog } from '../ui'
import { HiDownload, HiFilter, HiOutlineCog } from 'react-icons/hi'
import PaginationToolbar from '@inovua/reactdatagrid-community/packages/PaginationToolbar'
import useDarkMode from '@/utils/hooks/useDarkmode'
import Select from 'react-select';
import type { MouseEvent } from 'react'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '@inovua/reactdatagrid-community/theme/green-light.css'
import '@inovua/reactdatagrid-community/theme/blue-light.css'

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
  exportOption?: boolean;
};


const i18n = Object.assign({}, ReactDataGrid.defaultProps.i18n, {
  pageText: 'Página ',
  ofText: ' de ',
  perPageText: 'Resultados por página',
  showingText: 'Mostrando ',
  clearAll: 'Limpar tudo',
  inList: 'Na lista',
  notInList: "Fora da lista",
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
  before: " Antes",
  beforeOrOn: 'Antes de ou em',
  afterOrOn: 'A partir de',
  after: 'Após',
  empty: 'Vazio',
  inlist: 'Na lista',
  notinlist: 'Fora da lista',
  noRecords: 'Nenhum dado disponível',
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

  const valorLocalStorage = localStorage.getItem('lista_geral');
  const [dialogIsOpen, setIsOpen] = useState(false)
  const [listaGeral, setListaGeral] = useState(valorLocalStorage ? Number(valorLocalStorage) : 25);
  const [gridRef, setGridRef] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
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

  useEffect(() => {
    localStorage.setItem('lista_geral', listaGeral.toString());
  }, [listaGeral]);

  const [isDark] = useDarkMode()  

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
  ];

  
  const handleChange = (opcaoSelecionada) => {
    setListaGeral(opcaoSelecionada.value);
    localStorage.setItem('lista_geral',String(opcaoSelecionada.value))
  };

  const loadData = async (params: any, exportExcel = false) => {
    try {
      const { skip, limit, sortInfo, groupBy, filterValue } = params;

      if (exportExcel) {
        setIsDownloading(true);
        const toastId = String(await downloadAndNotify());
        await axios.get(url, {
          params: {
            skip: skip,
            limit: limit,
            exportExcel: true,
            groupBy: groupBy && groupBy.length ? groupBy : undefined,
            sortInfo: JSON.stringify(sortInfo),
            filterBy: JSON.stringify(filterValue)
          }
        })
          .then(response => {
            const relativeUrl = response.data;
            const cleanedRelativeUrl = relativeUrl.replace(/^public\//, '');
            const baseUrl = 'https://api.cacbempreenderapp.org.br'; // Remove the trailing slash
            const absoluteUrl = `${baseUrl}/${cleanedRelativeUrl}`;
            setIsDownloading(false);
            toast.remove(toastId)
            console.log("🚀 ~ file: CustomReactDataGrid.tsx:167 ~ loadData ~ toastId:", toastId)
            window.open(absoluteUrl, '_blank');
            return absoluteUrl
          });
        return false

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
    setQueryParams((prevParams) => ({
      ...prevParams,
      filterValue: newFilterValue,
    }));
  };

  const notification = (
    <Notification
      title="Exportação iniciada"
      duration={0}
      customIcon={<GrCloudDownload className="text-2xl text-indigo-600" />}
    >
      O download começará em instantes.
    </Notification>
  )

  function downloadAndNotify() {
     return toast.push(notification)
  }

  const renderPaginationToolbar = useCallback((paginationProps) => {
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    options={
      pageText: 'Página ',
      ofText: ' de ',
      perPageText: 'Resultados por página',
      showingText: 'Exibindo '
    }
    
  
    return (
      <div style={{ 'padding-top': '40px' }}>
        <PaginationToolbar {...paginationProps} {... options} bordered={true}>
          </PaginationToolbar>
          
        <div  style={{position:'absolute', right:'10px', bottom:'10px'}}>
        <HiOutlineCog onClick={() => openDialog()} size={'20px'} />
        </div>
      </div>
    );
  }, []);


  return (
    <div>
        <Dialog
                isOpen={dialogIsOpen}
 
            >
                <h5 className="mb-4">Preferências da CTable</h5>
                <p>
                  <b>Quantidade de itens padrão:</b>
      <Select
        options={opcoes}
          onChange={handleChange}
        placeholder="Selecione um número"
      />                  </p>
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
      <div style={{ marginBottom: 20 }}>
        <Button icon={<HiFilter />} size='sm' onClick={() => {
          gridRef.current.clearAllFilters()
        }}>
          Limpar filtros
        </Button>
        <Button disabled={isDownloading} icon={isDownloading ? <Spinner /> : <HiDownload />} className='mx-2' size='sm' onClick={() => {
          loadData(queryParams, true)
        }}>
          Exportar
        </Button>
      </div>

      <ReactDataGrid
        onReady={setGridRef}
        renderPaginationToolbar={renderPaginationToolbar}
        i18n={i18n}
        onFilterValueChange={handleFilterValueChange}
        idProperty="id"
        defaultFilterValue={defaultFilterValue}
        columns={columns}
        theme={isDark ? "default-dark" : "blue-light"}
        dataSource={loadData}
        defaultLimit={30}
        enableFiltering={true}
        pagination
        style={gridStyle}
        enableColumnAutosize={false}
        limit={listaGeral}
        onLimitChange={setListaGeral}
        loadingText="Carregando ... "
        emptyText="Não há dados para serem exibidos"
        disableGroupByToolbar={true}
        />
    </div>
  )
}

export default CustomReactDataGrid;
