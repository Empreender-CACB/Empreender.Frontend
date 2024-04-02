/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
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

moment.locale('pt-br')

const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
]

const columns = [
    {
        name: 'empresa.idempresa',
        header: 'ID',
        columnName: 'empresa.idempresa',
        type: 'number',
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
        // filterEditorProps: {
        //     multiple: true,
        //     dataSource: estadosBrasileiros.map((state) => {
        //         return { id: state.nome, label: state.sigla }
        //     }),
        // },
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
    },
    {
        name: 'dtultimaalteracao',
        header: 'Última Alteração',
        defaultFlex: 1,
        dateFormat: 'DD-MM-YYYY',
        type: 'date',
        operator: 'after',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD-MM-YYYY',
                placeholder:
                    index === 1
                        ? 'A data é anterior à...'
                        : 'A data é posterior à',
            }
        },
        render: ({ value, cellProps: { dateFormat } }: any) =>
            moment(value).format(dateFormat) === 'Invalid date'
                ? '-'
                : moment(value).format(dateFormat),
    },
    {
        name: 'st_cnae',
        header: 'CNAE principal',
        defaultFlex: 1,
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'empresa.flativo',
        header: 'Ativa',
        type: 'select',
        operator: 'equals',
        value: '',
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

const Empresas = () => {
    const [nameValue, setNameValue] = useState('nmfantasia')
    const [empresaType, setEmpresaType] = useState('todas')
    const [options, setOptions] = useState([])
    const [optionsOrigem, setOptionsOrigem] = useState([])

    // const [selectedOptions, setSelectedOptions] = useState([]);

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

    const onChange = (val: string) => {
        setNameValue(val)
    }

    const onChangeEmpresa = (option: any) => {
        return setEmpresaType(option.value)
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
                            defaultValue={{ value: 'PORTAL', label: 'PORTAL' }}
                            options={optionsOrigem}
                            onChange={onChangeEmpresa}
                            customWidth={'160px'}>
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
                            to={`${import.meta.env.VITE_PHP_URL
                                }/sistema/empresa/`}
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
                        to="/app/sales/product-new"
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
                url={`${import.meta.env.VITE_API_URL
                    }/empresas?nameValue=${nameValue}&empresaType=${empresaType}`}
                options={radioGroup}
                CardLayout={EmpresasCard}
            />
        </AdaptableCard>
    )
}

export default Empresas
