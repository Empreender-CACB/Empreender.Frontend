import { useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { FaHistory } from 'react-icons/fa';
import { 
    IoCheckmarkCircle, 
    IoCloseCircle, 
    IoArrowForward, 
    IoWarning,
    IoRefresh,
    IoUnlinkSharp,
    IoReturnUpBack
} from 'react-icons/io5';
import HistoricoCogecomModal from './modalHistorico';
import AtualizarStatusModal from './modalAtualizarStatus';

const ListaCogecomActions = ({ data, onUpdate }: { data: any, onUpdate?: () => void }) => {
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
    const [novoStatus, setNovoStatus] = useState<string>('');

    const openStatusModal = (status: string, title: string, message?: string) => {
        setNovoStatus(status);
        setModalTitle(title);
        setModalMessage(message || undefined);
        setIsStatusModalOpen(true);
    };

    const handleCloseHistoricoModal = () => setIsHistoricoModalOpen(false);
    const handleCloseStatusModal = () => setIsStatusModalOpen(false);

    const actionItems = [];

    if (data.status === 'Novo' || data.status === 'Desvinculada') {
        actionItems.push({
            label: 'Adesão PoupMax',
            icon: <IoArrowForward />,
            onClick: () => openStatusModal('Em avaliação', 'Confirmar Adesão', 'Deseja iniciar seu processo de adesão ao COGECOM?')
        });
    }

    if (data.status === 'Em avaliação') {
        actionItems.push(
            {
                label: 'Tornar pendente',
                icon: <IoWarning />,
                onClick: () => openStatusModal('Pendente', 'Tornar pendente', 'Deseja indicar pendências para esta adesão?')
            },
            {
                label: 'Aprovar Adesão',
                icon: <IoCheckmarkCircle />,
                onClick: () => openStatusModal('Habilitada', 'Aprovar Adesão', 'Deseja aprovar esta adesão?')
            }
        );
    }

    if (data.status === 'Em avaliação') {
        actionItems.push({
            label: 'Cancelar Adesão',
            icon: <IoCloseCircle />,
            onClick: () => openStatusModal('Cancelada', 'Cancelar Adesão', 'Tem certeza que deseja cancelar a adesão?')
        });
    }

    if (data.status === 'Pendente') {
        if (data.isAnalista) {
            actionItems.push({
                label: 'Aprovar Adesão',
                icon: <IoCheckmarkCircle />,
                onClick: () => openStatusModal('Habilitada', 'Aprovar Adesão', 'Deseja aprovar esta adesão?')
            });
        }
        if (data.isGestor) {
            actionItems.push({
                label: 'Devolver para Avaliação',
                icon: <IoReturnUpBack />,
                onClick: () => openStatusModal('Em avaliação', 'Voltar para Avaliação', 'Deseja retornar esta adesão para avaliação?')
            });
        }
        if (data.isGestor) {
            actionItems.push({
                label: 'Cancelar Adesão',
                icon: <IoCloseCircle />,
                onClick: () => openStatusModal('Cancelada', 'Cancelar Adesão', 'Tem certeza que deseja cancelar a adesão?')
            });
        }
    }

    if (data.status === 'Habilitada') {
        actionItems.push({
            label: 'Desabilitar Entidade',
            icon: <IoUnlinkSharp />,
            onClick: () => openStatusModal('Não habilitada', 'Desabilitar Entidade', 'Deseja desabilitar esta entidade?')
        });
    }

    if (data.status === 'Cancelada') {
        actionItems.push({
            label: 'Retomar Adesão',
            icon: <IoRefresh />,
            onClick: () => openStatusModal('Em avaliação', 'Voltar para Avaliação', 'Deseja retornar esta adesão para avaliação?')
        });
    }

    return (
        <div className="flex space-x-2">
            {actionItems.map((item, index) => (
                <Tooltip key={index} title={item.label}>
                    <Button
                        variant="solid"
                        size="xs"
                        icon={item.icon}
                        onClick={item.onClick}
                    />
                </Tooltip>
            ))}

            <Tooltip title="Histórico">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaHistory />}
                    onClick={() => setIsHistoricoModalOpen(true)}
                />
            </Tooltip>

            <HistoricoCogecomModal
                isOpen={isHistoricoModalOpen}
                onClose={handleCloseHistoricoModal}
                idObjeto={data.id}
            />

            <AtualizarStatusModal
                isOpen={isStatusModalOpen}
                idEntidade={data.idassociacao}
                novoStatus={novoStatus}
                title={modalTitle}
                message={modalMessage}
                onClose={handleCloseStatusModal}
                onConfirm={() => {
                    onUpdate?.();
                    handleCloseStatusModal();
                }}
            />
        </div>
    );
};

export default ListaCogecomActions;
