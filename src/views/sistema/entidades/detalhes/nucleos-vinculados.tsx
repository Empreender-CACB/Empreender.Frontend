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
import VincularNucleoModal from "./components/VincularNucleos";

const NucleosVinculados = () => {
    const { id } = useParams();
    const [reload, setReload] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [nucleoSelecionado, setNucleoSelecionado] = useState<any>(null);

    const handleDelete = (data: any) => {
        setNucleoSelecionado(data);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${id}/vinculos/${nucleoSelecionado.idnucleo}`,
                method: 'delete',
            });

            setReload(prev => !prev);
            setDeleteConfirmOpen(false);
            setNucleoSelecionado(null);
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
            name: "idnucleo",
            header: "ID",
            type: "number",
            defaultFlex: 1,
        },
        {
            name: "nmnucleo",
            header: "Núcleo Setorial",
            defaultFlex: 2,
        },
        {
            name: "dssegmento",
            header: "Segmento",
            defaultFlex: 2,
        },
        {
            name: "datavinculo",
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
        <div>
            <div className="flex justify-end mb-2">
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setModalOpen(true)}
                >
                    Vincular Núcleo
                </Button>
            </div>

            <CustomReactDataGrid
                filename="Núcleos Vinculados"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/entidades/${id}/nucleos-vinculados?reload=${reload}`}
            />

            <Dialog isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <div>
                    <h4>Remover vínculo</h4>
                    <p className="mt-4">
                        Tem certeza que deseja remover o vínculo com o núcleo <strong>{nucleoSelecionado?.nmnucleo}</strong>?
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="default" onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                        <Button variant="solid" onClick={confirmDelete}>Remover</Button>
                    </div>
                </div>
            </Dialog>

            <VincularNucleoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmVinculo}
                entidadeId={id!}
            />
        </div>
    );
};

export default NucleosVinculados;
