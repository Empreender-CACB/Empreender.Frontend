/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import { Button } from '@/components/ui'
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

moment.locale('pt-br')

const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
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


const Empresas = () => {
    const [nameValue, setNameValue] = useState('nmfantasia')
    const [cnaeValue, setCnaeValue] = useState('principal')
    const [empresaType, setEmpresaType] = useState('todas')
    const [origemType, setOrigemType] = useState<string[]>(['PORTAL']);
    const [options, setOptions] = useState([])
    const [optionsOrigem, setOptionsOrigem] = useState([])

    const { recursos } = useAppSelector((state) => state.auth.user)

    const url = `${import.meta.env.VITE_API_URL}/empresas?nameValue=${nameValue}&cnaeValue=${cnaeValue}&empresaType=${empresaType}&origemType=${origemType.join(',')}`;

    let headerCnae;
    
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
            filterEditor: NumberFilter,
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
            header: 'Nome',
            defaultFlex: 1.5,
            type: 'string',
            operator: 'contains',
            value: '',
            render: ({ data }: any) => (
                <div>
                    <Link to={`/sistema/empresas/${data.idempresa}`}>
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
            name: 'st_cnae',
            header: headerCnae,
            defaultFlex: 1,
            type: 'string',
            operator: 'contains',
            value: '',
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
            header: 'Ativa',
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

    if (recursos.includes('empresa_restrita')) {
        columns.push({
            name: 'restrita',
            header: 'Restrita',
            type: 'select',
            operator: 'equals',
            value: '',
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
                    setOptions(mappedOptions)
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

    const onChangeSegmentos = (e: any) => {
        console.log(e)
    }

    const onChangeEmpresa = (option: any) => {
        return setEmpresaType(option.value)
    }

    const onChangeOrigem = (selectedOptions: any) => {
        const values = selectedOptions.map((option: { value: string }) => option.value);
        setOrigemType(values);
    }

    const empresaOptions = [
        { value: 'todas', label: 'Todas' },
        { value: 'somente_nucleadas', label: 'Somente nucleadas' },
        { value: 'nao_nucleadas', label: 'Somente não nucleadas' },
        { value: 'projetos', label: 'Projeto' },
    ];

    const nameOptions = [
        { value: 'nmfantasia', label: 'Fantasia' },
        { value: 'nurazaosocial', label: 'Razão Social' },
    ];

    const cnaeOptions = [
        { value: 'todos', label: 'Todos' },
        { value: 'principal', label: 'Principal' },
        { value: 'secundario', label: 'Secundário' },
    ];

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
                        <span className="pr-2 font-black">CNAE: </span>
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

                    <div className='flex items-center'>
                        <span className="pr-2 font-black">Origem: </span>
                        <Select
                            isMulti
                            defaultValue={[{ value: 'PORTAL', label: 'PORTAL' }]}
                            options={optionsOrigem}
                            onChange={onChangeOrigem}>
                        </Select>

                    </div>

                </div>

                {empresaType === 'somente_nucleadas' && (
                    <div>
                        <div className="col-span-1">
                            <span className="font-black">Segmento: </span>

                            <Select
                                isMulti
                                placeholder="Selecione uma opção"
                                options={options}
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
                //defaultFilterValue={defaultFilterValue}
                url={url}
                options={radioGroup}
                CardLayout={EmpresasCard}
            />
        </AdaptableCard>
    )
}

export default Empresas
