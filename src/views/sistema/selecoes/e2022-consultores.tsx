/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import { Button, Dropdown, Notification, Select } from '@/components/ui'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { useEffect, useRef, useState } from 'react'
import ApiService from '@/services/ApiService'
import moment from 'moment'
import { CandidaturaCard } from '@/components/shared/TableCards/CandidaturaCard'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import TagTrueFalse from '@/components/ui/Tag/TagTrueFalse'

const E2022Consultores = () => {
    const activeValue = [
        { name: 'Sim', value: 'true' },
        { name: 'Não', value: 'false' },
    ]

    const columns = [
        {
            name: 'id',
            header: 'ID',
            defaultFlex: 1,
            type: 'number',
            operator: 'eq',
            filterEditor: NumberFilter,
        },
        {
            name: 'nome',
            header: 'Nome ',
            defaultFlex: 2,
            operator: 'contains',
            type: 'string',
        },
        {
            name: 'cpf',
            header: 'CPF',
            defaultFlex: 1.5,
            operator: 'contains',
            type: 'string',
        },
        {
            name: 'uf',
            header: 'UF',
            defaultFlex: 1,
            operator: 'contains',
            type: 'string',
        },
        {
            name: 'cidade',
            header: 'Cidade',
            defaultFlex: 2,
            operator: 'contains',
            type: 'string',
        },
        {
            name: 'telefone',
            header: 'Telefone',
            defaultFlex: 1.5,
            operator: 'contains',
            type: 'string',
        },
        {
            name: 'email',
            header: 'Email',
            defaultFlex: 2,
            operator: 'contains',
            type: 'string',
        },
        {
            name: 'created_at',
            header: 'Data de Inscrição',
            defaultFlex: 1.5,
            type: 'date',
            dateFormat: 'DD/MM/YYYY',
            operator: 'eq',
            filterEditor: DateFilter,
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'apto',
            header: 'Apto',
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
                    <TagTrueFalse isActive={value} trueText='Sim' falseText='Não' />
                </div>
            ),
        },
        {
            name: 'selecionado',
            header: 'Selecionado',
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
                    <TagTrueFalse isActive={value} trueText='Sim' falseText='Não' />
                </div>
            ),
        },
    ];

    const [origem, setOrigem] = useState<any>(['2']);
    const [origemOptions, setOrigemOptions] = useState<string[]>([]);
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const handleSelectedRowsChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const [filters, setFilters] = useState<any>(null);

    const handleFiltersChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleExportDocuments = async () => {
        setIsDownloading(true);
        toast.push(
            <Notification title="O download será iniciado em instantes." type="info" />
        );

        await ApiService.fetchData<Blob>({
            url: '/selecoes/e2022-consultores-download',
            method: 'post',
            data: { candidaturaIds: selectedRows }
        }).then((data: any) => {
            window.open(import.meta.env.VITE_API_URL + data.data.url);
        }).catch((error: any) => {
            toast.push(
                <Notification title="Erro ao realizar download." type="danger">
                    {error.response.data}
                </Notification>
            );
        }).finally(() => {
            setIsDownloading(false);
        });
    };

    const handleExportAllDocuments = async () => {
        setIsDownloading(true);
        toast.push(
            <Notification title="O download será iniciado em instantes." type="info" />
        );

        await ApiService.fetchData<Blob>({
            url: `/selecoes/e2022-consultores-download-todos/${origem}`,
            method: 'post',
            data: { filters },
        }).then((data: any) => {
            window.open(import.meta.env.VITE_API_URL + data.data.url);
        }).catch((error: any) => {
            toast.push(
                <Notification title="Erro ao realizar download." type="danger">
                    {error.response.data}
                </Notification>
            );
        }).finally(() => {
            setIsDownloading(false);
        });
    };

    const url = `${import.meta.env.VITE_API_URL}/selecoes/e2022-consultores?origem=${origem}`;

    const onChangeOrigem = (selectedOptions: any) => {
        setOrigem([selectedOptions.value]);
    };

    useEffect(() => {
        const getOrigens = async () => {
            try {
                await ApiService.fetchData({
                    url: 'selecoes/get-origens-candidaturas',
                    method: 'get',
                }).then((response: any) => {
                    const mappedOptions = response.data.map((origemItem: any) => {
                        return ({
                            value: origemItem.tipo,
                            label: origemItem.tipo == 1 ? "ENEM - Brasil Sustentável - 1ª chamada" : "ENEM - Brasil Sustentável - 2ª chamada",
                        });
                    });
                    setOrigemOptions(mappedOptions);
                });
            } catch (error) {
                console.error(error);
            }
        };

        getOrigens();
    }, []);

    useEffect(() => {
        // Resetar as linhas selecionadas ao mudar a origem
        setSelectedRows([]);
    }, [origem]);

    const optionsGroup = (
        <div className="pb-4 sm:flex sm:items-center">
            <div className={`w-1/2 pl-2`}>
                <span className="font-black">Chamada </span>
                <Select
                    placeholder="Selecione uma opção"
                    options={origemOptions}
                    noOptionsMessage={() => 'Sem dados!'}
                    loadingMessage={() => 'Carregando'}
                    onChange={onChangeOrigem}
                    value={origemOptions.find((opt: any) => opt.value === parseInt(origem))}
                />
            </div>
        </div>
    );



    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Lista de inscrição de consultores - E2022</h3>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/selecoes/e2022-consultores`}
                        >
                            Versão antiga
                        </Link>
                    </Button>

                    <Button size="sm" variant="solid">
                        <a
                            href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTE0OTY="
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Resultado
                        </a>
                    </Button>
                    <Button size="sm" variant='solid'>
                        <Link
                            className="menu-item-link"
                            to={`/sistema/selecoes/painel-inscricoes`}
                        >
                            Painel de inscrições
                        </Link>
                    </Button>

                    <Dropdown
                        renderTitle={
                            <Button
                                block
                                variant="solid"
                                size="sm"
                                icon={<HiPlusCircle />}
                            >
                                Exportar Documentos
                            </Button>
                        }
                        trigger="hover"
                        className="mr-2"
                    >
                        <Dropdown.Item
                            disabled={selectedRows.length === 0 || isDownloading}
                            onClick={handleExportDocuments}
                        >
                            <Tooltip
                                placement='left-start'
                                title={selectedRows.length === 0 ? 'É necessário selecionar uma ou mais linhas' : 'Exportar Documentos'}
                            >
                                <span>Exportar documentos selecionados</span>
                            </Tooltip>
                        </Dropdown.Item>
                        <Dropdown.Item
                            disabled={isDownloading}
                            onClick={handleExportAllDocuments}
                        >
                            Exportar todos os documentos
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
            <CustomReactDataGrid
                options={optionsGroup}
                filename="Inscrições de Consultores"
                columns={columns}
                url={url}
                isSelectable
                onSelectedRowsChange={handleSelectedRowsChange}
                CardLayout={CandidaturaCard}
                onFilterChange={handleFiltersChange}
            />
        </AdaptableCard>
    );
}

export default E2022Consultores;
