import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { HiPlusCircle } from 'react-icons/hi'
import { GrCloudDownload } from 'react-icons/gr'
import { Button, Select, Tooltip, Dropdown, Notification } from '@/components/ui'
import toast from '@/components/ui/toast'
import { AdaptableCard } from '@/components/shared'
import { useState, useEffect } from 'react'
import { ContatoCard } from '@/components/shared/TableCards/contatoCard'
import ApiService from '@/services/ApiService'
//import { FaEye, FaPen } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi'
import { FaQuestion } from "react-icons/fa"


moment.locale('pt-br')


const columns = [
    { name: 'idcontato',
      header: 'ID',
      type: 'number',
      operator:'eq',
      defaultFlex: 0.15

    },
    {
        name: 'nmcontato', header: 'Nome', type: 'string', operator:'contains', defaultFlex: 0.5
    },
    {
        name: 'cargo', header: 'Cargo', type: 'string', operator:'contains', defaultFlex: 0.2
    },
    {
        name: 'dsemail', 
        header: 'E-mail', 
        type: 'string', 
        operator: 'contains', 
        defaultFlex: 0.4,
        render: ({ data, value }: any) => (
            <a 
                href={`mailto:${data.dsemail}`} 
                className="menu-item-link max-w-md text-blue-500"
            >
                {value}
            </a>
        ),
    },    
    {
        name: 'telefone', 
        header: 'Telefone', 
        type: 'string', 
        operator: 'contains', 
        defaultFlex: 0.35,
        render: ({ data }: any) => {
            const text = data.telefone
            return (
                <Tooltip
                    placement='left'
                    title={
                        <div>
                            {text}
                        </div>
                    }
                >
                    <span className="cursor-pointer">{text}</span>
                </Tooltip>
            )
        },
    },    
    {
        name: 'tipo', header: 'Vínculo', type: 'string', operator:'contains', defaultFlex: 0.14
    },
    {
        name: 'entidade_vinculada',
        header: 'Razão Social',
        type: 'string',
        defaultFlex: 0.55,
        operator: 'contains',
        render: ({ data }: any) => {
            const text = data.entidade_vinculada
            const tooltipText = data.entidade_vinculada
    
            let linkTo = ''
    
            if (data.tipo === 'Empresa') { 
                linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/empresa/detalhe/eid/${btoa(String(data.id_ente))}`
            } else {
                linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(data.id_ente))}`
            }
    
            return (
                <div>
                    <Tooltip
                        placement="left"
                        title={<div>{tooltipText}</div>}
                    >
                        <Link to={linkTo} className='text-blue-500'>
                            {text}
                        </Link>
                    </Tooltip>
                </div>
            )
        },
    },    
    {
        name: 'iduf',
        header: 'UF',
        type: 'string',
        defaultFlex: 0.1,
        operator:'contains'
    },
    {
        name: 'nmcidade',
        header: 'Cidade',
        type: 'string',
        defaultFlex: 0.2,
        operator:'contains'
    },
    /*{
        name: 'id',
        header: 'Ações',
        defaultFlex: 0.3,
        operator: 'contains',
        // visible: user.recursos.includes('e_como'),
        render: ({ data }: any) => (
            <>

                <div className="flex justify-center text-lg">
                <Tooltip title="Ver">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaEye />}
                    />
                </Tooltip>
                <Tooltip title="Alterar">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaPen />}
                        className='ml-4'
                    />
                </Tooltip>
                </div>
                
            </>

        ),
    }*/
]


const Contatos = () => {
    const [optionsVinculos, setOptionsVinculos] = useState([])
    const [vinculoType, setVinculosType] = useState<string[]>([])
    const [optionsMarcador, setOptionsMarcador] = useState([])
    const [MarcadorType, setMarcadorType] = useState<string[]>([])
    const [optionsEntidade, setOptionsEntidade] = useState([])
    const [EntidadeType, setEntidadeType] = useState<string[]>([])
    const [filters, setFilters] = useState<any>(null)
    const [loading, setLoading] = useState(false)


    const handleFiltersChange = (newFilters: any) => {
        setFilters(newFilters);
    }



    useEffect(() => {
        const getVinculos = async () => {
            try {
                await ApiService.fetchData({
                    url: 'contatos/vinculos',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((vinculoItem: any) => {
                        return {
                            value: vinculoItem.idtipoentidade,
                            label: vinculoItem.dstipoentidade,
                        }
                    })
                    setOptionsVinculos(mappedOptions)
                })
            } catch (error) {
                console.error(error);
            }
        }

        const getMarcadores = async () => {
            try {
                await ApiService.fetchData({
                    url: 'empresas/origens',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((marcadorItem: any) => {
                        return ({
                            value: marcadorItem.origem,
                            label: marcadorItem.origem,
                        })
                    })
                    setOptionsMarcador(mappedOptions)
                })
            } catch (error) {
                console.error(error);
            }
        }

        const getTiposEntidade = async () => {
            try {
                await ApiService.fetchData({
                    url: 'contatos/tipos-entidade',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((tipoEntidade: any) => {
                        return ({
                            value: tipoEntidade.id,
                            label: tipoEntidade.nome,
                        })
                    })
                    setOptionsEntidade(mappedOptions)
                })
            } catch (error) {
                console.error(error);
            }
        }

        getVinculos()
        getMarcadores()
        getTiposEntidade()
    }, [])

    const onChangeVinculos = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setVinculosType(values)
    }

    const onChangeMarcador = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setMarcadorType(values)
    }

    const onChangeEntidade = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setEntidadeType(values)
    }

    const notify_download = (
        <Notification title="Download" customIcon={<GrCloudDownload className="text-2xl text-indigo-600" />        }>
            Download iniciado
        </Notification>
    )

    const handleExportOptionClick = async (option: string) => {
        setLoading(true)
        toast.push(notify_download)
        try {
            let endpoint = ''
            if (option === 'vcard') endpoint = 'contatos/download/vcard'
            if (option === 'csv') endpoint = 'contatos/download/csv'
            if (option === 'excel') endpoint = 'contatos/download/excel'
    
            const response = await ApiService.fetchData({
                url: endpoint,
                method: 'post',
                data: {
                    filtro: vinculoType,
                    marcador: MarcadorType,
                    entidade: EntidadeType,
                    tablefilters: filters,
                },
            })
    
            if (response?.data?.url) {
                const url = `${import.meta.env.VITE_API_URL}${response.data.url}`
                
                const link = document.createElement('a')
                link.href = url                
                document.body.appendChild(link)
                link.click() 
                document.body.removeChild(link)
            } else {
                console.error('URL não encontrada na resposta')
            }
        } catch (error) {
            console.error('Erro ao obter a URL para download', error)
        } finally {
            setLoading(false)
        }
    }
    
    
        
    const radioGroup = (
        <div className='flex items-center'>
          <div className='flex items-center pr-5'>
            <span className="pr-2 font-black">Vínculo: </span>
            <Select
              isMulti
              options={optionsVinculos}
              onChange={onChangeVinculos}
              placeholder="Todos"
            />
            
            <span className="ml-4 pr-2 font-black">Marcadores do Vínculo: </span>
            <Select
              isMulti
              options={optionsMarcador}
              onChange={onChangeMarcador}
              placeholder="Todos"
            />
            
            {vinculoType.includes('ENT') && (
              <span className="ml-4 pr-2 font-black">Tipo de Entidade: </span>
            )}
            {vinculoType.includes('ENT') && (
              <Select
                isMulti
                options={optionsEntidade}
                onChange={onChangeEntidade}
                placeholder="Todas"
              />
            )}
          </div>
        </div>
      )
           

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
            <div className="flex items-center">
                <h3 className="mb-4 lg:mb-0">Contatos</h3>
                <Tooltip title="Para saber mais sobre o uso da Lista de Contatos clique aqui" placement="right-end">
                <Button
                    shape="circle"
                    size="xs"
                    icon={<FaQuestion />}
                    className="ml-2"
                    onClick={() => {
                        window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTM5MjQ4')
                    }}
                />
            </Tooltip>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">


                <Dropdown
                        renderTitle={
                            <Button block variant="solid" size="sm" loading={loading} icon={<HiDownload />}>
                                Exportar contatos
                            </Button>
                        }
                    >
                        <Dropdown.Item eventKey="csv" onClick={() => handleExportOptionClick('csv')}>
                            Exportar como CSV
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="excel" onClick={() => handleExportOptionClick('excel')}>
                            Exportar como Excel
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="vcard" onClick={() => handleExportOptionClick('vcard')}>
                            Exportar como Vcard
                        </Dropdown.Item>
                    </Dropdown>
{/*                     <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`/contatos/adicionar/`}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                            disabled={true}
                        >
                            Adicionar contato
                        </Button>
                    </Link>
                    */}
                </div> 
            </div>
            <CustomReactDataGrid
                filename='Contatos'
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/contatos?vinculoType=${vinculoType}&marcador=${MarcadorType}&entidade=${EntidadeType}`}
                options={radioGroup}
                CardLayout={ContatoCard}
                autorizeExport={false}
                onFilterChange={handleFiltersChange}
            />
            
        </AdaptableCard>
    )
}

export default Contatos
