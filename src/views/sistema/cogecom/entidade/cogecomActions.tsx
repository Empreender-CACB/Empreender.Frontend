import { useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import AtualizarStatusModal from './modalAtualizarStatus';
import { FaHistory } from 'react-icons/fa';
import HistoricoCogecomModal from './modalHistorico';

interface CogecomActionsProps {
    status: string;
    isGestor: boolean;
    isAnalista: boolean;
    idEntidade: number;
    idCogecom: number;
    fetchDetalhes: () => void;
}

const CogecomActions: React.FC<CogecomActionsProps> = ({ status, isGestor, isAnalista, idEntidade, idCogecom, fetchDetalhes }) => {
    const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
    const [novoStatus, setNovoStatus] = useState<string>('');

    const openStatusModal = (status: string, title: string, message?: string) => {
        setNovoStatus(status);
        setModalTitle(title);
        setModalMessage(message || undefined);
        setIsStatusModalOpen(true);
    };

    return (
        <div className="flex-wrap inline-flex xl:flex items-center gap-2">
            {(status === 'Novo' || status === 'Desvinculada') && isGestor && (
                <Button type="button" size="sm" variant="solid" onClick={() => openStatusModal('Em avaliação', 'Confirmar Adesão', 'Deseja iniciar seu processor de adesão ao Poup Max?')}>
                    Adesão PoupMax
                </Button>
            )}

            {status === 'Em avaliação' && isAnalista && (
                <>
                    <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        color="yellow-600"
                        onClick={() => openStatusModal('Pendente', 'Tornar pendente', 'Deseja tornar essa adesão pendente?')}
                    >
                        Tornar pendente
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        color="green-600"
                        onClick={() => openStatusModal('Habilitada', 'Aprovar Adesão', 'Deseja aprovar esta adesão?')}
                    >
                        Aprovar Adesão
                    </Button>
                </>
            )}

            {status === 'Em avaliação' && isGestor && (
                <Button
                    type="button"
                    size="sm"
                    variant="solid"
                    color="gray-600"
                    onClick={() => openStatusModal('Cancelada', 'Cancelar Adesão', 'Tem certeza que deseja cancelar a adesão?')}
                >
                    Cancelar Adesão
                </Button>
            )}


            {status === 'Pendente' && (
                <>
                    {isAnalista && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="green-600"
                            onClick={() => openStatusModal('Habilitada', 'Aprovar Adesão', 'Deseja aprovar esta adesão?')}
                        >
                            Aprovar Adesão
                        </Button>
                    )}
                    {isGestor && (
                        <Tooltip title="Essa ação devolve a adesão para o status de avaliação.">
                            <Button
                                type="button"
                                size="sm"
                                variant="solid"
                                color="green-600"
                                onClick={() => openStatusModal('Em avaliação', 'Voltar para Avaliação', 'Deseja retornar esta adesão para avaliação?')}
                            >
                                Devolver
                            </Button>
                        </Tooltip>
                    )}
                    {(isGestor || isAnalista) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="gray-600"
                            onClick={() => openStatusModal('Cancelada', 'Cancelar Adesão', 'Tem certeza que deseja cancelar a adesão?')}
                        >
                            Cancelar Adesão
                        </Button>
                    )}
                </>
            )}

            {status === 'Habilitada' && (
                <>
                    {(isGestor || isAnalista) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="red-600"
                            onClick={() => openStatusModal('Não habilitada', 'Desabilitar Entidade', 'Deseja desabilitar esta entidade?')}
                        >
                            Desvincular
                        </Button>
                    )}
                </>
            )}

            {status === 'Cancelada' && isGestor && (
                <Tooltip title="Essa ação devolve a adesão para o status de avaliação.">
                    <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        color="purple-600"
                        onClick={() => openStatusModal('Em avaliação', 'Voltar para Avaliação', 'Deseja retornar esta adesão para avaliação?')}
                    >
                        Retomar
                    </Button>
                </Tooltip>
            )}

            <Tooltip title="Visualizar histórico">
                <Button
                    type="button"
                    variant="solid"
                    size="sm"
                    icon={<FaHistory />}
                    onClick={() => setIsHistoricoModalOpen(true)}
                    className="rounded-full p-2"
                />
            </Tooltip>

            <HistoricoCogecomModal
                isOpen={isHistoricoModalOpen}
                onClose={() => setIsHistoricoModalOpen(false)}
                idObjeto={idCogecom}
            />

            <AtualizarStatusModal
                isOpen={isStatusModalOpen}
                idEntidade={idEntidade}
                novoStatus={novoStatus}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={fetchDetalhes}
            />
        </div>
    );
};

export default CogecomActions;
