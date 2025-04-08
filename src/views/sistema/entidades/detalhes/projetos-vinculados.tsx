import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { HiPlusCircle, HiOutlineTrash } from "react-icons/hi";
import CustomReactDataGrid from "@/components/shared/CustomReactDataGrid";
import Tooltip from "@/components/ui/Tooltip";
import Dialog from "@/components/ui/Dialog";
import ApiService from "@/services/ApiService";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import VincularProjetoModal from "./components/VincularProjeto";
import { getProjetoStatusInfo } from "@/utils/projetoStatus";
import { AdaptableCard } from "@/components/shared";

const ProjetosVinculados = () => {
    const { id } = useParams();
    const [reload, setReload] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [projetoSelecionado, setProjetoSelecionado] = useState<any>(null);

    const handleDelete = (data: any) => {
        setProjetoSelecionado(data);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${id}/vinculo-projeto/${projetoSelecionado.idprojeto}`,
                method: 'delete',
            });
            
            setReload(prev => !prev);
            setDeleteConfirmOpen(false);
            setProjetoSelecionado(null);
        } catch (error) {
            console.error("Erro ao excluir vínculo:", error);
        }
    };

    const handleConfirmVinculo = () => {
        setReload(prev => !prev);
        setModalOpen(false);
    };

    const columns = [
        {
            name: "idprojeto",
            header: "ID Projeto",
            type: "number",
            operator: 'contains',
            defaultFlex: 1,
        },
        {
            name: "tipo_projeto",
            header: "Tipo",
            type: 'string',
            operator: 'contains',
            defaultFlex: 1,
        },
        {
            name: "nmfantasia",
            header: "Nome Fantasia",
            type: 'string',
            operator: 'contains',
            defaultFlex: 2,
        },
        {
            name: "idprojeto_projeto_base",
            header: "Projeto Base",
            type: 'string',
            operator: 'contains',
            defaultFlex: 2,
        },
        {
            name: "tipo",
            header: "Vínculo",
            type: 'string',
            operator: 'contains',
            defaultFlex: 1,
        },
        {
            name: "flstatus",
            header: "Status",
            type: 'string',
            operator: 'contains',
            defaultFlex: 1,
            render: ({ value }: any) => {
                const statusInfo = getProjetoStatusInfo(value)
                return (
                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusInfo.className}`}>
                        {statusInfo.label}
                    </span>
                )
            }
        },
        {
            name: "data_inclusao",
            header: "Data Vínculo",
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            operator: 'after',
            filterEditor: DateFilter,
            filterEditorProps: () => ({
                dateFormat: 'DD-MM-YYYY',
                placeholder: 'DD-MM-AAAA',
            }),
            render: ({ value }: any) =>
                moment(value).format('DD-MM-YYYY') === 'Invalid date'
                    ? '-'
                    : moment(value).format('DD-MM-YYYY'),
        },
        {
            name: "actions",
            header: "Ações",
            defaultFlex: 1,
            render: ({ data }: any) => (
                <div className="flex space-x-2">
                    <Tooltip title="Excluir">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<HiOutlineTrash />}
                            onClick={() => handleDelete(data)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex items-center justify-between my-2">
                <h3 className="mb-4 lg:mb-0">Projetos Vínculados</h3>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setModalOpen(true)}
                >
                    Vincular Projeto
                </Button>
            </div>

            <CustomReactDataGrid
                filename="Projetos Vinculados"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/entidades/${id}/projetos-vinculados?reload=${reload}`}
            />

            <Dialog isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <div>
                    <h4>Remover vínculo</h4>
                    <p className="mt-4">
                        Tem certeza que deseja remover o vínculo com o projeto <strong>{projetoSelecionado?.nmfantasia}</strong>?
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="default" onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                        <Button variant="solid" onClick={confirmDelete}>Remover</Button>
                    </div>
                </div>
            </Dialog>

            <VincularProjetoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmVinculo}
                entidadeId={id!}
            />
        </AdaptableCard>
    );
};

export default ProjetosVinculados;
