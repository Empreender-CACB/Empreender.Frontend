import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { HiPlusCircle, HiOutlineTrash } from "react-icons/hi";
import CustomReactDataGrid from "@/components/shared/CustomReactDataGrid";
import Tooltip from "@/components/ui/Tooltip";
import Dialog from "@/components/ui/Dialog";
import VincularEmpresaModal from "./components/VincularEmpresa";
import ApiService from "@/services/ApiService";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import { AdaptableCard } from "@/components/shared";

const EmpresasVinculadas = () => {
    const { id } = useParams();
    const [reload, setReload] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<any>(null);

    const handleDelete = (data: any) => {
        setEmpresaSelecionada(data);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${id}/vinculos/${empresaSelecionada.idempresa}`,
                method: 'delete',
            })

            setReload(prev => !prev)
            setDeleteConfirmOpen(false)
            setEmpresaSelecionada(null)
        } catch (error) {
            console.error("Erro na requisição de exclusão:", error);
        }
    };

    const handleConfirmVinculo = () => {
        setReload(prev => !prev);
        setModalOpen(false);
    };

    const columnsEmpresas = [
        {
            name: "idempresa",
            header: "ID",
            type: "number",
            defaultFlex: 1,
            operator: 'contains',
        },
        {
            name: "empresa.nmfantasia",
            header: "Nome",
            type: 'string',
            operator: 'contains',
            defaultFlex: 2,
        },
        {
            name: 'entidades_vinculos.data_inclusao',
            header: "Data Vínculo",
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            operator: 'after',
            value: '',
            filterEditor: DateFilter,
            filterEditorProps: ({ index }: any) => ({
                dateFormat: 'DD-MM-YYYY',
                placeholder: 'DD-MM-AAAA',
            }),
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date' ? '-' : moment(value).format(dateFormat),
        },
        {
            name: "actions",
            header: "Ações",
            defaultFlex: 1,
            render: ({ data }: any) => (
                <div className="flex space-x-2">
                    <Tooltip title="Excluir">
                        <Button variant="solid" size="xs" icon={<HiOutlineTrash />} onClick={() => handleDelete(data)} />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (

        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex items-center justify-between my-2">
                <h3 className="mb-4 lg:mb-0">Empresas Vínculadas</h3>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setModalOpen(true)}
                >
                    Vincular Empresa
                </Button>
            </div>
            <CustomReactDataGrid
                filename="Empresas Vinculadas"
                columns={columnsEmpresas}
                url={`${import.meta.env.VITE_API_URL}/entidades/${id}/empresas-vinculadas?reload=${reload}`}
            />

            <div className="flex justify-end mb-2">
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setModalOpen(true)}
                >
                    Vincular Empresa
                </Button>
            </div>

            <Dialog
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <div>
                    <h4>Remover vínculo</h4>
                    <p className="mt-4">Tem certeza que deseja remover o vínculo com a empresa <strong>{empresaSelecionada?.nmfantasia}</strong>?</p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="default" onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                        <Button variant="solid" onClick={confirmDelete}>Remover</Button>
                    </div>
                </div>
            </Dialog>

            <VincularEmpresaModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmVinculo}
                entidadeId={id!}
            />
        </AdaptableCard>
    );
};

export default EmpresasVinculadas;
