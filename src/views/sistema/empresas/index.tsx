/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import { Button, Checkbox, Tooltip } from '@/components/ui'
import { useState, useEffect } from 'react'
import Select from '@/components/ui/Select'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { EmpresasCard } from '@/components/shared/TableCards/EmpresasCard'
import ApiService from '@/services/ApiService'
import { useAppSelector } from '@/store'
import formatCPFCNPJ from '@/utils/MaskService'
import { FcInfo } from 'react-icons/fc'

moment.locale('pt-br')

const activeValue = [
    { name: 'Ativo', value: 'S' },
    { name: 'Inativo', value: 'N' },
]

const restritaValue = [
    { name: 'Restrita', value: 'true' },
    { name: 'Não restrita', value: 'false' },
]

const rfbValue = [
    { name: 'RFB - Ativa', value: 'RFB - ATIVA' },
    { name: 'RFB - Suspensa', value: 'RFB - SUSPENSA' },
    { name: 'RFB - Nula', value: 'RFB - NULA' },
    { name: 'RFB - Inapta', value: 'RFB - INAPTA' },
    { name: 'RFB - Baixada', value: 'RFB - BAIXADA' },
    { name: 'CPF', value: 'CPF' },
    { name: 'CPF Inválido', value: 'CPF INVALIDO' },
    { name: 'CNPJ Inválido', value: 'CNPJ INVALIDO' },
    { name: 'Nenhum', value: 'NULL' },
]

const empresaOptions = [
    { value: 'somente_nucleadas', label: 'Nucleadas' },
    { value: 'nao_nucleadas', label: 'Não nucleadas' },
    { value: 'projetos', label: 'Projeto' },
    { value: 'vinculadas_entidades', label: 'Entidade' },
];

const nameOptions = [
    { value: 'nmfantasia', label: 'Nome Fantasia' },
    { value: 'nurazaosocial', label: 'Razão Social' },
];

const cnaeOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'principal', label: 'Principal' },
    { value: 'secundario', label: 'Secundário' },
];

const Empresas = () => {
    const [nameValue, setNameValue] = useState('nmfantasia')
    const [cnaeValue, setCnaeValue] = useState('principal')
    const [empresaType, setEmpresaType] = useState<string[]>([]) 
    const [origemType, setOrigemType] = useState<string[]>([])
    const [segmentoType, setSegmentoType] = useState([])
    const [entidadeType, setEntidadeType] = useState([])
    const [optionsOrigem, setOptionsOrigem] = useState([])
    const [optionsSegmento, setOptionsSegmento] = useState([])
    const [optionsEntidade, setOptionsEntidade] = useState([])
    const [checkedVisaoLocal, setCheckedVisaoLocal] = useState(false)

    const { user } = useAppSelector((state) => state.auth)

    const isGestorEntidade = user && Array.isArray(user.associacoes) && user.associacoes.length > 0
    const isUsuarioEntidade = user.perfil == 'assoc' && user.idobjeto && !isGestorEntidade

    const canExport = !!(user.recursos.includes('empresa_restrita') ||
        (isGestorEntidade && (
            (checkedVisaoLocal && !empresaType.includes('nao_nucleadas')) &&
            !empresaType.includes('nao_nucleadas') &&
            !empresaType.includes('projetos') &&
            !empresaType.includes('todas')
        )) || (isUsuarioEntidade && checkedVisaoLocal))


        const url = `${import.meta.env.VITE_API_URL}/empresas?nameValue=${nameValue}&cnaeValue=${cnaeValue}&visaoLocal=${checkedVisaoLocal}&empresaType=${empresaType.join(',')}` +
        `${origemType.length > 0 ? `&origemType=${origemType.join(',')}` : ''}` +
        `${segmentoType.length > 0 ? `&segmentoType=${segmentoType.join(',')}` : ''}` +
        `${entidadeType.length > 0 ? `&entidadeType=${entidadeType.join(',')}` : ''}` 


    let headerCnae

    switch (cnaeValue) {
        case 'principal':
            headerCnae = "CNAE Principal"
            break;
        case 'secundario':
            headerCnae = "CNAE Secundário"
            break;
        default:
            headerCnae = "CNAE"
    }

    const columns = [
        {
            name: 'empresa.idempresa',
            header: 'ID',
            columnName: 'empresa.idempresa',
            type: 'string',
            operator: 'contains',
            value: "",
            defaultFlex: 0.4,
        },
        {
            name: 'iduf',
            columnName: 'iduf',
            header: 'UF',
            type: 'string',
            operator: 'contains',
            value: '',
            defaultFlex: 0.32,
        },
        {
            name: 'nmcidade',
            header: 'Cidade',
            type: 'string',
            operator: 'contains',
            value: '',
            defaultFlex: 0.7,
            render: ({ data }: any) => {
                const text = data.nmcidade
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
                );
            },
        },
        {
            name: 'nome',
            header: nameValue === 'nmfantasia' ? 'Nome Fantasia' : 'Razão Social',
            defaultFlex: 1.5,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => {
                const text = data.nmfantasia
                const tooltipText = data.nmfantasia
        
                const linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/empresa/detalhe/eid/${btoa(String(data.idempresa))}`;
                
                return (
                    <div>
                        <Tooltip
                            placement='left'
                            title={<div>{tooltipText}</div>}
                        >
                            <Link to={linkTo}>
                                {text}
                            </Link>
                        </Tooltip>
                    </div>
                );
            },
        },                    
        {
            name: 'nucnpjcpf',
            header: 'CNPJ',
            defaultFlex: 0.7,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => {
                const formattedValue = formatCPFCNPJ(data.nucnpjcpf);
                return (
                    <div style={{ color: formattedValue ? 'inherit' : 'red' }}>
                        {formattedValue || data.nucnpjcpf}
                    </div>
                );
            },
        },
        {
            name: 'cd_cnae',
            header: 'CNAE',
            defaultFlex: 0.4,
            type: 'string',
            operator: 'contains',
            value: '',
        },
        {
            name: 'st_cnae',
            header: 'Descrição do CNAE',
            defaultFlex: 1.7,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => {
                const text = data.st_cnae
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
                );
            },
        },
        {
            name: 'situacao',
            header: 'Situação RFB',
            defaultFlex: 0.615,
            type: 'select',
            operator: 'equals',
            value: '',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: rfbValue.map((option) => {
                    return { id: option.value, label: option.name }
                }),
            },
        },
        {
            name: 'empresa.flativo',
            header: 'Status',
            type: 'select',
            operator: 'equals',
            value: 'S',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: activeValue.map((option) => {
                    return { id: option.value, label: option.name }
                }),
            },
            render: ({ value }: any) => (
                <div className="flex items-center justify-center">
                    <TagActiveInative value={value} activeText="S" />
                </div>
            ),
        },
    ]

    if (user.recursos.includes('empresa_restrita')) {
        columns.splice(columns.length - 1, 0, {
            name: 'restrita',
            header: 'Restrita',
            type: 'select',
            operator: 'equals',
            value: 'false',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: restritaValue.map((option) => {
                    return { id: option.value, label: option.name }
                }),
            },
            render: ({ value }: any) => (
                <div className="flex items-center justify-center">
                    <TagActiveInative
                        value={value}
                        activeText={false}
                        customClassTrue='bg-green-800 mr-2 text-white text-center'
                        customClassFalse='bg-red-800 mr-2 text-white text-center'
                        customLabelFalse='Restrita'
                        customLabelTrue='Não restrita'
                    />
                </div>
            ),
        })
    }

    useEffect(() => {
        const getSegmentos = async () => {
            try {
                await ApiService.fetchData({
                    url: '/segmentos',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((segmento: any) => ({
                        value: segmento.idsegmento.toString(),
                        label: segmento.dssegmento,
                    }))
                    setOptionsSegmento(mappedOptions)
                })
            } catch (error) {
                console.error(error);
            }
        }

        const getOrigens = async () => {
            try {
                await ApiService.fetchData({
                    url: 'empresas/origens',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((origemItem: any) => {
                        return ({
                            value: origemItem.origem,
                            label: origemItem.origem,
                        })
                    })
                    setOptionsOrigem(mappedOptions)
                });
            } catch (error) {
                console.error(error);
            }
        }

        const getEntidades = async () => {
            try {
                await ApiService.fetchData({
                    url: 'entidades/empresas',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((origemItem: any) => {
                        return ({
                            value: origemItem.idassociacao,
                            label: origemItem.nmrazao,
                        })
                    })
                    setOptionsEntidade(mappedOptions)
                });
            } catch (error) {
                console.error(error);
            }
        }

        getEntidades()
        getSegmentos()
        getOrigens()
    }, [])

    const onChangeSegmentos = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setSegmentoType(values)
    }

    const onChangeEmpresa = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setEmpresaType(values)
    }

    const onChangeOrigem = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setOrigemType(values)
    }

    const onChangeEntidade = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value)
        setEntidadeType(values)
    }

    const radioGroup =
        (
            <div>
                <div className="pb-4 flex items-center">

                    <div className='flex items-center pr-5'>
                        <span className="pr-2 font-black">Nome: </span>
                        <Select
                            defaultValue={nameOptions[0]}
                            options={nameOptions}
                            onChange={(e: any) => setNameValue(e.value)}>
                        </Select>
                    </div>

                    <div className='pr-4 flex items-center pr-5'>
                        <span className="font-black">CNAE: </span>

                        <div className='mr-2'>
                            <Tooltip
                                placement='top'
                                title={
                                    <div>
                                        Ao escolher "Secundário", empresas poderão aparecer duplicadas na lista (cada linha representa um CNAE secundário, por empresa)
                                    </div>
                                }
                            >
                                <FcInfo size={20} className='mt-1 ml-2' />
                            </Tooltip>
                        </div>

                        <Select
                            defaultValue={cnaeOptions[1]}
                            options={cnaeOptions}
                            onChange={(e: any) => setCnaeValue(e.value)}>
                        </Select>
                    </div>

                    <div className='pr-4 flex items-center'>
                        <span className="pr-2 font-black">Vínculo: </span>
                        <Select
                            isMulti
                            options={empresaOptions}
                            onChange={onChangeEmpresa}
                            placeholder="Todos"
                            >
                        </Select>
                    </div>

                    <div className='pr-4 flex items-center'>
                        <span className="pr-2 font-black">Origem: </span>
                        <Select
                            isMulti
                            options={optionsOrigem}
                            onChange={onChangeOrigem}
                            placeholder="Todas"
                        >
                        </Select>
                    </div>

                    {empresaType.includes('somente_nucleadas') && (
                        <div className='flex items-center'>
                            <span className="font-black">Visão local: </span>

                            <div className='mr-2'>
                                <Tooltip
                                    placement='top'
                                    title={
                                        <div>
                                            Apresenta apenas as empresas ligadas à entidade do usuário.
                                        </div>
                                    }
                                >
                                    <FcInfo size={20} className='mt-1 ml-2' />
                                </Tooltip>
                            </div>

                            <Checkbox checked={checkedVisaoLocal} onChange={setCheckedVisaoLocal} />
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap">
                    {empresaType.includes('somente_nucleadas') && (
                        <div className={`flex-1 ${empresaType.includes('vinculadas_entidades') ? 'w-1/2 pr-2' : 'w-full'}`}>
                            <span className="font-black">Segmento: </span>
                            <Select
                                isMulti
                                placeholder="Selecione uma opção"
                                options={optionsSegmento}
                                noOptionsMessage={() => 'Sem dados!'}
                                loadingMessage={() => 'Carregando'}
                                onChange={onChangeSegmentos}
                            />
                        </div>
                    )}

                    {empresaType.includes('vinculadas_entidades') && (
                        <div className={`flex-1 ${empresaType.includes('somente_nucleadas') ? 'w-1/2 pl-2' : 'w-full'}`}>
                            <span className="font-black">Entidade: </span>
                            <Select
                                isMulti
                                placeholder="Selecione uma opção"
                                options={optionsEntidade}
                                noOptionsMessage={() => 'Sem dados!'}
                                loadingMessage={() => 'Carregando'}
                                onChange={onChangeEntidade}
                            />
                        </div>
                    )}
                </div>

            </div>
        );

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Empresas</h3>
                {/* <div style={{ height: 80 }} >Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code>: 'none'}.</div> */}
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/empresa/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    ></Link>
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${import.meta.env.VITE_PHP_URL}/sistema/empresa/adicionar`}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar empresa
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename="Empresas"
                columns={columns}
                url={url}
                options={radioGroup}
                CardLayout={EmpresasCard}
                autorizeExport={canExport}
            />
        </AdaptableCard>
    )
}

export default Empresas
