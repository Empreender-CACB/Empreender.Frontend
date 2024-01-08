/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import { Button } from '@/components/ui'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { useState } from 'react'
import axios from 'axios'
import ApiService from '@/services/ApiService'

const E2022Consultores = () => {
    const columns = [
        {
            name: 'id',
            header: 'ID',
            defaultFlex: 1,
            type: 'number',
            filterEditor: NumberFilter,
        },
        {
            name: 'nome',
            header: 'Nome',
            defaultFlex: 2,
            type: 'string',
        },
        {
            name: 'cpf',
            header: 'CPF',
            defaultFlex: 1.5,
            type: 'string',
        },
        {
            name: 'uf',
            header: 'UF',
            defaultFlex: 1,
            type: 'string',
        },
        {
            name: 'cidade',
            header: 'Cidade',
            defaultFlex: 2,
            type: 'string',
        },
        {
            name: 'telefone',
            header: 'Telefone',
            defaultFlex: 1.5,
            type: 'string',
        },
        {
            name: 'email',
            header: 'Email',
            defaultFlex: 2,
            type: 'string',
        },
        {
            name: 'data',
            header: 'Data de Inscrição',
            defaultFlex: 1.5,
            type: 'date',
            dateFormat: 'DD/MM/YYYY',
            filterEditor: DateFilter,
        },
    ];

    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const handleSelectedRowsChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const handleExportDocuments = async () => {
        try {
            const response = await ApiService.fetchData<Blob>({
                url: '/selecoes/e2022-consultores-download',
                method: 'post',
                responseType: 'blob',
                data: { candidaturaIds: selectedRows }
            });            
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'anexos.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar documentos:', error);
        }
    };
    

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Lista de inscrição de consultores - E2022</h3>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL
                                }/sistema/selecoes/e2022-consultores`}
                        >
                            Versão antiga
                        </Link>
                    </Button>

                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={handleExportDocuments}
                    >
                        Exportar Documentos
                    </Button>
                </div>
            </div>
            <CustomReactDataGrid
                filename="Empresas"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL
                    }/selecoes/e2022-consultores`}
                isSelectable
                onSelectedRowsChange={handleSelectedRowsChange}
            />
        </AdaptableCard>
    );
};

export default E2022Consultores;
