/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '@inovua/reactdatagrid-community/theme/green-light.css'
import '@inovua/reactdatagrid-community/theme/blue-light.css'
import Radio from '@/components/ui/Radio'
import { Button, Tag } from '@/components/ui'
import classNames from 'classnames'
import { useState, useEffect } from 'react'
import Select from '@/components/ui/Select'
import axios from 'axios'

import {
    HiDownload,
    HiOutlineReply,
    HiPlusCircle,
} from 'react-icons/hi'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

moment.locale('pt-br')

type StatusType = 'S' | 'N'

const statusMapping: Record<StatusType, { label: string; class: string }> = {
    S: {
        label: 'Ativa',
        class: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100',
    },
    N: {
        label: 'Inativa',
        class: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100',
    },
}


const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
]
const estadosBrasileiros = [
    { sigla: 'AC', nome: 'ACRE' },
    { sigla: 'AL', nome: 'ALAGOAS' },
    { sigla: 'AP', nome: 'AMAPA' },
    { sigla: 'AM', nome: 'AMAZONAS' },
    { sigla: 'BA', nome: 'BAHIA' },
    { sigla: 'CE', nome: 'CEARA' },
    { sigla: 'DF', nome: 'DISTRITO FEDERAL' },
    { sigla: 'ES', nome: 'ESPIRITO SANTO' },
    { sigla: 'GO', nome: 'GOIAS' },
    { sigla: 'MA', nome: 'MARANHAO' },
    { sigla: 'MT', nome: 'MATO GROSSO' },
    { sigla: 'MS', nome: 'MATO GROSSO DO SUL' },
    { sigla: 'MG', nome: 'MINAS GERAIS' },
    { sigla: 'PA', nome: 'PARA' },
    { sigla: 'PB', nome: 'PARAIBA' },
    { sigla: 'PR', nome: 'PARANA' },
    { sigla: 'PE', nome: 'PERNAMBUCO' },
    { sigla: 'PI', nome: 'PIAUI' },
    { sigla: 'RJ', nome: 'RIO DE JANEIRO' },
    { sigla: 'RN', nome: 'RIO GRANDE DO NORTE' },
    { sigla: 'RS', nome: 'RIO GRANDE DO SUL' },
    { sigla: 'RO', nome: 'RONDONIA' },
    { sigla: 'RR', nome: 'RORAIMA' },
    { sigla: 'SC', nome: 'SANTA CATARINA' },
    { sigla: 'SP', nome: 'SAO PAULO' },
    { sigla: 'SE', nome: 'SERGIPE' },
    { sigla: 'TO', nome: 'TOCANTINS' }
]

const columns = [
    { name: 'idempresa', header: 'ID', type: 'string', defaultFlex: 0.6 },
    {
        name: 'nmuf', header: 'UF', type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            multiple: true,
            dataSource: estadosBrasileiros.map(state => {
                return { id: state.nome, label: state.sigla }
            }),
        }
    },
    { name: 'nmcidade', header: 'Cidade', type: 'string' },
    {
        name: 'nmfantasia',
        header: 'Nome',
        defaultFlex: 1.5,
        type: 'Nome',
        render: ({ data }: any) => (
            <div>
                <Link to={`/sistema/empresas/${data.idempresa}`}>
                    {data.nmfantasia}
                </Link>
            </div>
        ),
    },
    { name: 'nucnpjcpf', header: 'CNPJ', defaultFlex: 1 },
    {
        name: 'dtultimaalteracao',
        header: 'Última Alteração',
        defaultFlex: 1,
        dateFormat: 'DD-MM-YYYY',
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
    { name: 'nmramoativ', header: 'Ramo', defaultFlex: 1 },
    {
        name: 'empresa.flativo', header: 'Ativa', type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: activeValue.map(option => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ value }: any) => (
            <div className="flex items-center justify-center">
                <Tag
                    className={classNames(
                        'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                        statusMapping[value as StatusType]?.class || ''
                    )}
                >
                    {statusMapping[value as StatusType]?.label || ''}
                </Tag>
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
        name: 'nmuf',
        operator: "inlist",
        type: 'select',
        value: ''
    },
    {
        name: 'nmcidade',
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
    { name: 'dtultimaalteracao', operator: 'after', type: 'date', value: '' },
    {
        name: 'nmramoativ',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'empresa.flativo',
        operator: "equals",
        type: 'select',
        value: ''
    },
]

const Empresas = () => {


    const [nameValue, setNameValue] = useState('nmfantasia')
    const [empresaType, setEmpresaType] = useState('todas')
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        // Fazer a solicitação à API
        axios.get('http://localhost:3333/segmentos')
            .then((response) => {
                // Mapear os dados da API para o formato esperado pelo Select
                const mappedOptions = response.data.map((segmento) => ({
                    value: segmento.idsegmento.toString(),
                    label: segmento.dssegmento,
                }));
                // Definir as opções no estado
                setOptions(mappedOptions);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados da API:', error);
            });
    }, []);

    const onChangeSegmentos = (e: any) => {
        console.log(e)
    }

    const onChange = (val: string) => {
        setNameValue(val)
    }


    const onChangeEmpresa = (val: string) => {
        setEmpresaType(val)
    }

    const radioGroup = (

        <div className='pb-4'>
            <Radio.Group className="lg:mb-0" value={nameValue} onChange={onChange}>
                <span className="pr-2 font-black">Nome: </span>
                <Radio value={'nmfantasia'}>Fantasia</Radio>
                <Radio value={'nurazaosocial'}>Razão Social</Radio>
            </Radio.Group>
            <Radio.Group className=" pb-4 lg:mb-0" value={empresaType} onChange={onChangeEmpresa}>
                <span className="pr-2 font-black">Empresa: </span>
                <Radio value={'todas'}>Todas</Radio>
                <Radio value={'somente_nucleadas'}>Somente nucleadas</Radio>
                <Radio value={'nao_nucleadas'}>Somente não nucleadas</Radio>
                <Radio value={'projetos'}>Projeto</Radio>
            </Radio.Group>

            {empresaType === 'somente_nucleadas' && (
                <div>

                    <div className='col-span-1'>
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
                            to={`${import.meta.env.VITE_API_URL}/sistema/empresa/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    >
                    </Link>
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
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/empresas?nameValue=${nameValue}&empresaType=${empresaType}`}
                options={radioGroup}
            />

        </AdaptableCard>
    )
}

export default Empresas
