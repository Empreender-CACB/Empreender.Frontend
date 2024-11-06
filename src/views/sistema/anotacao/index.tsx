/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css';

import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { Button, Tag } from '@/components/ui';
import { AdaptableCard } from '@/components/shared';
import { useEffect, useState } from 'react';
import 'moment/locale/pt-br';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import ApiService from '@/services/ApiService';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import { useAppSelector } from '@/store';
import { capitalize } from 'lodash';
import AnotacaoModal from './anotacao-modal';
import { HiPlusCircle } from 'react-icons/hi';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

moment.locale('pt-br');

const situacaoOptions = [
    { name: 'Em Cadastramento', value: 'ec', color: 'blue-600' },
    { name: 'Divulgada', value: 'di', color: 'green-600' },
];

const leituraOptions = [
    { name: 'Lida', value: 'lida', color: 'gray-600' },
    { name: 'Não Lida', value: 'naoLida', color: 'green-600' },
];

const Anotacoes = () => {

    const { nucpf } = useAppSelector((state) => state.auth.user)

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAnotacaoId, setSelectedAnotacaoId] = useState<number | null>(null);

    const openModal = (id: number) => {
        setSelectedAnotacaoId(id);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedAnotacaoId(null);
    };

    const columns = [
        {
            name: 'id',
            header: 'ID',
            type: 'number',
            defaultFlex: 0.6,
            filterEditor: SelectFilter,
        },
        {
            name: 'descricao',
            header: 'Resumo',
            defaultFlex: 1.5,
            render: ({ value, data }: any) => (
                <button
                    className="menu-item-link max-w-md text-blue-600 underline"
                    onClick={() => openModal(data.id)}
                >
                    {value.length > 140 ? `${value.substring(0, 140)}...` : value}
                </button>
            ),
        },
        {
            name: 'nmusuario',
            header: 'Autor',
            defaultFlex: 1,
        },
        {
            name: 'data_inclusao',
            header: 'Data',
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            filterEditor: DateFilter,
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'situacao',
            header: 'Situação',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: situacaoOptions.map(option => ({
                    id: option.value,
                    label: option.name,
                })),
            },
            render: ({ value }: any) => {
                const selectedOption = situacaoOptions.find(
                    option => option.value === value
                );
                return (
                    <Button
                        variant="solid"
                        color={selectedOption ? selectedOption.color : 'gray-500'}
                        size="xs"
                    >
                        {selectedOption ? selectedOption.name : value}
                    </Button>
                );
            },
        },
        {
            name: 'leitura',
            header: 'Leitura',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: leituraOptions.map(option => ({
                    id: option.value,
                    label: option.name,
                })),
            },
            render: ({ value, data }: any) => {
                const selectedOption = leituraOptions.find(
                    option => option.value === value
                );
                const isAuthor = data.autor === nucpf;
                console.log(data, nucpf);
                return (
                    <Button
                        variant="solid"
                        color={isAuthor ? 'blue-600' : (selectedOption ? selectedOption.color : 'gray-500')}
                        size="xs"
                    >
                        {isAuthor ? 'Você escreveu' : (selectedOption ? selectedOption.name : 'Indisponível')}
                    </Button>
                );
            },
        },
    ];

    const { tipoVinculo, idVinculo } = useParams();
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: 'Início', link: '/' },
        { label: 'Anotações', link: '#' },
    ]);

    useEffect(() => {
        const fetchVinculoData = async () => {
            try {
                const response = await ApiService.fetchData({
                    url: `/anexos/getVinculo/${tipoVinculo}/${idVinculo}`,
                    method: 'get',
                });
                const { nomeVinculo, breadcrumb } = response.data;

                setNomeVinculo(nomeVinculo);
                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    ...breadcrumb.map((item: any) => ({
                        label: item.label,
                        link: item.url,
                    })),
                    { label: 'Anotações', link: '#' },
                ]);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };

        fetchVinculoData();
    }, [tipoVinculo, idVinculo]);

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center mb-4">
                <span className="font-semibold mr-2">
                    Listando Anotações em:
                </span>
                <div className="flex items-center space-x-2">
                    <Tag className="bg-gray-400 text-white border-0 rounded">
                        {capitalize(tipoVinculo || '')}
                    </Tag>
                    <Tag className="bg-indigo-600 text-white border-0 rounded">
                        {capitalize(nomeVinculo || '')}
                    </Tag>
                </div>
            </div>

            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="mb-4 lg:mb-0">Anotações</h3>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${APP_PREFIX_PATH}/anotacoes/adicionar/${tipoVinculo}/${idVinculo}`}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar anotação
                        </Button>
                    </Link>
                </div>
            </div>

            <CustomReactDataGrid
                filename="Anotações"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/anotacoes/lista/${tipoVinculo}/${idVinculo}`}
            />

            {selectedAnotacaoId && (
                <AnotacaoModal
                    idAnotacao={selectedAnotacaoId}
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                />
            )}
        </AdaptableCard>
    );
};

export default Anotacoes;
