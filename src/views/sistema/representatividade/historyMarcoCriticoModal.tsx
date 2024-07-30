import React, { useEffect, useState } from 'react';
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';
import { format } from 'date-fns';
import { AxiosResponse } from 'axios';

interface HistoricoModalProps {
    isOpen: boolean;
    onClose: () => void;
    marcoId: number;
}

interface Historico {
    id: number;
    acompanhamento_id: number;
    status: string;
    data: string;
    comentario: string;
    nome_usuario: string;
    acao: string;
    nome_anexo?: string;
}

const HistoryMarcoCriticoModal: React.FC<HistoricoModalProps> = ({ isOpen, onClose, marcoId }) => {
    const [historico, setHistorico] = useState<Historico[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchHistorico = async () => {
                try {
                    const response: AxiosResponse = await ApiService.fetchData({
                        url: `/representatividade/historico-acompanhamento/${marcoId}`,
                        method: 'get',
                    });
                    setHistorico(response.data);
                } catch (error) {
                    console.error('Erro ao buscar histórico do marco crítico:', error);
                }
            };

            fetchHistorico();
        }
    }, [isOpen, marcoId]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div>
                <h5 className="mb-4">Histórico</h5>
                <div className="overflow-y-auto max-h-96">
                    {historico.length > 0 ? (
                        historico.map((entry) => (
                            <div key={entry.id} className="mb-4 border-b pb-2">
                                {entry.acao === 'anexo' ? (
                                    <>
                                        <p><strong>Ação:</strong> Adição de Anexo</p>
                                        <p><strong>Descrição:</strong> {entry.comentario || '-'}</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Status:</strong> {entry.status}</p>
                                        <p><strong>Comentário:</strong> {entry.comentario || '-'}</p>
                                    </>
                                )}
                                <p><strong>Usuário:</strong> {entry.nome_usuario}</p>
                                <p><strong>Data/Hora:</strong> {format(new Date(entry.data), 'dd/MM/yyyy HH:mm')}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum histórico encontrado.</p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="button" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default HistoryMarcoCriticoModal;
