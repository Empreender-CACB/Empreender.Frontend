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
    { name: 'Restrito', value: 'true' },
    { name: 'Não restrito', value: 'false' },
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
    { value: 'todas', label: 'Todas' },
    { value: 'somente_nucleadas', label: 'Somente nucleadas' },
    { value: 'nao_nucleadas', label: 'Somente não nucleadas' },
    { value: 'projetos', label: 'Projeto' },
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
    const [empresaType, setEmpresaType] = useState('todas')
    const [origemType, setOrigemType] = useState<string[]>([])
    const [segmentoType, setSegmentoType] = useState([])
    const [optionsOrigem, setOptionsOrigem] = useState([])
    const [optionsSegmento, setOptionsSegmento] = useState([])
    const [checkedVisaoLocal, setCheckedVisaoLocal] = useState(false)

    const { user } = useAppSelector((state) => state.auth)

    const isGestorEntidade = user.associacoes.length > 0;
    const isUsuarioEntidade = user.perfil == 'assoc' && user.idobjeto && !isGestorEntidade;

    const canExport = !!(user.recursos.includes('empresa_restrita') ||
        (isGestorEntidade && (
            (checkedVisaoLocal && empresaType !== 'nao_nucleadas') &&
            empresaType !== 'nao_nucleadas' &&
            empresaType !== 'projetos' &&
            empresaType !== 'todas'
        )) || (isUsuarioEntidade && checkedVisaoLocal));


    const url = `${import.meta.env.VITE_API_URL}/empresas?nameValue=${nameValue}&cnaeValue=${cnaeValue}&visaoLocal=${checkedVisaoLocal}&empresaType=${empresaType}` +
        `${origemType.length > 0 ? `&origemType=${origemType.join(',')}` : ''}` +
        `${segmentoType ? `&segmentoType=${segmentoType.join(',')}` : ''}`;

    let headerCnae;

    const parseCnae = (cnae_combined: string) => {
        const [code, ...textParts] = cnae_combined.split(' - ')
        const text = textParts.join(' - ')
        return { code, text }
    }

    switch (cnaeValue) {
        case 'principal':
            headerCnae = "CNAE Principal";
            break;
        case 'secundario':
            headerCnae = "CNAE Secundário";
            break;
        default:
            headerCnae = "CNAE";
    }

    const columns = [
        {
            name: 'empresa.idempresa',
            header: 'ID',
            columnName: 'empresa.idempresa',
            type: 'string',
            operator: 'contains',
            value: "",
            defaultFlex: 0.6,
        },
        {
            name: 'iduf',
            columnName: 'iduf',
            header: 'UF',
            type: 'string',
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmcidade',
            header: 'Cidade',
            type: 'string',
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmfantasia',
            header: nameValue === 'nmfantasia' ? 'Nome Fantasia' : 'Razão Social',
            defaultFlex: 1.5,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => (
                <div>
                    <Link to={`${import.meta.env.VITE_PHP_URL}/sistema/empresa/detalhe/eid/${btoa(String(data.idempresa))}`}>
                        {data.nmfantasia}
                    </Link>
                </div>
            ),
        },
        {
            name: 'nucnpjcpf',
            header: 'CNPJ',
            defaultFlex: 1,
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
            name: 'cnae_code',
            header: 'Código do CNAE',
            defaultFlex: 1,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => {
                const { code } = parseCnae(data.cnae_combined)
                return (
                    <Tooltip
                        placement='left'
                        title={
                            <div>
                                {code}
                            </div>
                        }
                    >
                        <span className="cursor-pointer">{code}</span>
                    </Tooltip>
                );
            },
        },
        {
            name: 'cnae_text',
            header: 'Descrição do CNAE',
            defaultFlex: 1,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => {
                const { text } = parseCnae(data.cnae_combined)
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
            defaultFlex: 1,
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
            header: 'Restrito',
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
                        customLabelFalse='Restrito'
                        customLabelTrue='Não restrito'
                    />
                </div>
            ),
        });
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
                });
            } catch (error) {
                console.error(error);
            }
        };

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
        };

        getSegmentos();
        getOrigens();
    }, [])

    const onChangeSegmentos = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value);
        setSegmentoType(values);
    }

    const onChangeEmpresa = (option: any) => {
        return setEmpresaType(option.value)
    }

    const onChangeOrigem = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value);
        setOrigemType(values);
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
                        <span className="pr-2 font-black">Empresa: </span>
                        <Select
                            defaultValue={empresaOptions[0]}
                            options={empresaOptions}
                            onChange={onChangeEmpresa}
                            customWidth={'160px'}>
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

                    {empresaType === 'somente_nucleadas' && (
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

                {empresaType === 'somente_nucleadas' && (
                    <div>
                        <div className="col-span-1">
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
                    </div>
                )}
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
