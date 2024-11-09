import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { HiPlusCircle } from 'react-icons/hi'
import { Button, Select, Tooltip } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import { useState, useEffect } from 'react'
import { NucleosCard } from '@/components/shared/TableCards/NucleosCard'
import ApiService from '@/services/ApiService'
//import { FaEye, FaPen } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi'


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
        defaultFlex: 0.5,
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
        name: 'nufone', 
        header: 'Telefone', 
        type: 'string', 
        operator: 'contains', 
        defaultFlex: 0.2,
        render: ({ data }: any) => {
            const formatPhoneNumber = (phone: string | null | undefined) => {
                if (!phone) return '' 
                const cleaned = phone.replace(/\D/g, '')
                const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
                return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone
            }
    
            return (
                <span>{formatPhoneNumber(data.nufone)}</span>
            )
        },
    },    
    {
        name: 'nucel', header: 'Celular', type: 'string', operator:'contains', defaultFlex: 0.2
    },
    {
        name: 'idtipoentidade', header: 'Tipo de Ente', type: 'string', operator:'contains', defaultFlex: 0.2
    },
    {
        name: 'entidade_vinculada',
        header: 'Ente',
        type: 'string',
        defaultFlex: 0.7,
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
                            label: vinculoItem.idtipoentidade === 'EMP' ? 'Empresa' : 'Entidade',
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
                });
            } catch (error) {
                console.error(error);
            }
        }

        getVinculos()
        getMarcadores()
    }, [])

    const onChangeVinculos = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setVinculosType(values)
    }

    const onChangeMarcador = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setMarcadorType(values)
    }

    const radioGroup = (
        <div className='flex items-center'>
                    <div className='flex items-center pr-5'>
                        <span className="pr-2 font-black">Ente: </span>
                        <Select
                            isMulti
                            options={optionsVinculos}
                            onChange={onChangeVinculos}
                            placeholder="Todos"
                        >
                        </Select>
                        <span className="ml-4 pr-2 font-black">Marcadores: </span>
                        <Select
                            isMulti
                            options={optionsMarcador}
                            onChange={onChangeMarcador}
                            placeholder="Todos"
                        >
                        </Select>
                    </div>
        </div>
    )

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
            <div className="flex items-center">
                <h3 className="mb-4 lg:mb-0">Contatos</h3>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">

                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`/contatos/adicionar/`}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={ <HiDownload />}
                            disabled={true}
                        >
                            Exportar contatos
                        </Button>
                    </Link>

                    <Link
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
                </div>
            </div>
            <CustomReactDataGrid
                filename='Contatos'
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/contatos?vinculoType=${vinculoType}&marcador=${MarcadorType}`}
                options={radioGroup}
                CardLayout={NucleosCard}
                autorizeExport={false}
            />
            
        </AdaptableCard>
    )
}

export default Contatos
