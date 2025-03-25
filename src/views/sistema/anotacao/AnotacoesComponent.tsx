/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css';

import { Link } from 'react-router-dom';
import moment from 'moment';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { Button, Tag, Tooltip } from '@/components/ui';
import { AdaptableCard } from '@/components/shared';
import { useState } from 'react';
import 'moment/locale/pt-br';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { useAppSelector } from '@/store';
import AnotacaoModal from './anotacao-modal';
import { HiPlusCircle } from 'react-icons/hi';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import { AnotacaoCard } from '@/components/shared/TableCards/AnotacoesCard';
import { FaQuestion } from 'react-icons/fa';

moment.locale('pt-br');

const situacaoOptions = [
    { name: 'Em Cadastramento', value: 'ec', color: 'bg-blue-600' },
    { name: 'Divulgada', value: 'di', color: 'bg-green-600' },
];

const leituraOptions = [
    { name: 'Lida', value: 'lida', color: 'bg-gray-600' },
    { name: 'Não Lida', value: 'naoLida', color: 'bg-green-600' },
];

interface AnotacoesComponentProps {
    tipoVinculo: string;
    idVinculo: number | string;
    tipoVinculoAux?: string;
    idVinculoAux?: string;
    temAnexos: boolean;
}

const AnotacoesComponent: React.FC<AnotacoesComponentProps> = ({
    tipoVinculo,
    idVinculo,
    tipoVinculoAux,
    idVinculoAux,
    temAnexos,
}) => {
    const { nucpf } = useAppSelector((state) => state.auth.user);

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
            defaultFlex: 0.2,
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
            defaultFlex: 0.5,
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: situacaoOptions.map(option => ({
                    id: option.value,
                    label: option.name,
                })),
            },
            render: ({ value }: any) => {
                const selectedOption = situacaoOptions.find(option => option.value === value);
                return (
                    <div className="flex justify-center">
                        <Tag className={`text-white ${selectedOption ? selectedOption.color : 'bg-gray-500'} border-0 rounded`}>
                            {selectedOption ? selectedOption.name : value}
                        </Tag>
                    </div>
                );
            },
        },
        {
            name: 'leitura',
            header: 'Leitura',
            defaultFlex: 0.5,
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: leituraOptions.map(option => ({
                    id: option.value,
                    label: option.name,
                })),
            },
            render: ({ value, data }: any) => {
                const selectedOption = leituraOptions.find(option => option.value === value);
                const isAuthor = data.autor === nucpf;
                return (
                    <div className="flex justify-center">
                        <Tag className={`text-white ${isAuthor ? 'bg-blue-600' : (selectedOption ? selectedOption.color : 'bg-gray-500')} border-0 rounded`}>
                            {isAuthor ? 'Você escreveu' : (selectedOption ? selectedOption.name : 'Indisponível')}
                        </Tag>
                    </div>
                );
            },
        }
    ];

    const generateUrl = (tipoVinculo: string, idVinculo: number | string, tipoVinculoAux?: string, idVinculoAux?: string) => {
        let baseUrl = `${import.meta.env.VITE_API_URL}/anotacoes/lista/${tipoVinculo}/${idVinculo}`;
        if (tipoVinculoAux && idVinculoAux) {
            baseUrl += `/${tipoVinculoAux}/${idVinculoAux}`;
        }
        return baseUrl;
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="mb-4 lg:mb-0">Anotações</h3>
                    <Tooltip title="Para saber mais sobre o módulo de anotações, clique aqui" placement="right-end">
                        <Button
                            shape="circle"
                            size="xs"
                            icon={<FaQuestion />}
                            className="ml-2"
                            onClick={() => {
                                window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTM5MTEy')
                            }}
                        />
                    </Tooltip>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${APP_PREFIX_PATH}/anotacoes/adicionar/${tipoVinculo}/${idVinculo}?temAnexos=${temAnexos}&redirectUrl=${encodeURIComponent(window.location.href)}${tipoVinculoAux && idVinculoAux ? `&tipoVinculoAux=${encodeURIComponent(tipoVinculoAux)}&idVinculoAux=${encodeURIComponent(idVinculoAux)}` : ''}`}
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
                url={generateUrl(tipoVinculo, idVinculo, tipoVinculoAux, idVinculoAux)}
                CardLayout={AnotacaoCard}
            />

            {selectedAnotacaoId && (
                <AnotacaoModal
                    idAnotacao={selectedAnotacaoId}
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    temAnexos={temAnexos}
                />
            )}
        </AdaptableCard>
    );
};

export default AnotacoesComponent;
