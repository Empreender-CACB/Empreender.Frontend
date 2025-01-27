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
    const [novoStatus, setNovoStatus] = useState<string>('');

    const openStatusModal = (status: string) => {
        setNovoStatus(status);
        setIsStatusModalOpen(true);
    };

    return (
        <div className="flex-wrap inline-flex xl:flex items-center gap-2">
            {status === 'Novo' && (
                <Button type="button" size="sm" variant="solid" onClick={() => openStatusModal('Solicitada')}>
                    Adesão COGECOM
                </Button>
            )}

            {status === 'Solicitada' && (
                <>
                    {(isGestor || isAnalista) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="blue-600"
                            onClick={() => openStatusModal('Em avaliação')}
                        >
                            Em Avaliação
                        </Button>
                    )}
                    {isGestor && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="red-600"
                            onClick={() => openStatusModal('Cancelada')}
                        >
                            Cancelar Adesão
                        </Button>
                    )}
                </>
            )}

            {status === 'Em avaliação' && (
                <>
                    {isAnalista && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="yellow-600"
                            onClick={() => openStatusModal('Pendente')}
                        >
                            Indicar Pendências
                        </Button>
                    )}
                    {(isGestor || isAnalista) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="green-600"
                            onClick={() => openStatusModal('Vinculada')}
                        >
                            Aprovar Adesão
                        </Button>
                    )}
                </>
            )}

            {status === 'Pendente' && (
                <>
                    {isGestor && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="green-600"
                            onClick={() => openStatusModal('Vinculada')}
                        >
                            Vincular Entidade
                        </Button>
                    )}
                    {isAnalista && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="green-600"
                            onClick={() => openStatusModal('Em avaliação')}
                        >
                            Voltar para "Em avaliação"
                        </Button>
                    )}
                    {(isGestor || isAnalista) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="gray-600"
                            onClick={() => openStatusModal('Cancelada')}
                        >
                            Cancelar Adesão
                        </Button>
                    )}
                </>
            )}

            {status === 'Vinculada' && (
                <>
                    {(isGestor || isAnalista) && (
                        <Button
                            type="button"
                            size="sm"
                            variant="solid"
                            color="red-600"
                            onClick={() => openStatusModal('Desvinculada')}
                        >
                            Desvincular Entidade
                        </Button>
                    )}
                </>
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
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={fetchDetalhes}
            />
        </div>
    );
};

export default CogecomActions;
