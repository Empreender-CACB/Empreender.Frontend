import React, { useEffect, useState } from 'react';
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';
import { format } from 'date-fns';
import { AxiosResponse } from 'axios';
import { FaSort } from 'react-icons/fa';

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
    id_anexo?: number;  // Adiciona a propriedade id_anexo para o histórico de anexos
}

const HistoryMarcoCriticoModal: React.FC<HistoricoModalProps> = ({ isOpen, onClose, marcoId }) => {
    const [historico, setHistorico] = useState<Historico[]>([]);
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        if (isOpen) {
            const fetchHistorico = async () => {
                try {
                    const response: AxiosResponse = await ApiService.fetchData({
                        url: `/representatividade/historico-acompanhamento/${marcoId}`,
                        method: 'get',
                        params: { order: orderBy },
                    });
                    setHistorico(response.data);
                } catch (error) {
                    console.error('Erro ao buscar histórico do marco crítico:', error);
                }
            };

            fetchHistorico();
        }
    }, [isOpen, marcoId, orderBy]);

    const toggleOrder = () => {
        setOrderBy((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={1000}>
            <div>
                <div className="flex items-center mb-4">
                    <h5 className='mr-4'>Histórico</h5>
                    <Button type="button" onClick={toggleOrder} className="flex items-center">
                        {orderBy === 'asc' ? 'Mais antigos' : 'Mais recentes'} <FaSort className="ml-2" />
                    </Button>
                </div>
                <div className="overflow-y-auto max-h-96">
                    {historico.length > 0 ? (
                        historico.map((entry) => (
                            <div key={entry.id} className="mb-4 border-b pb-2">
                                <p><strong>Usuário/Data:</strong> {entry.nome_usuario} - {format(new Date(entry.data), 'dd/MM/yyyy HH:mm')}</p>
                                {entry.acao === 'anexo' ? (
                                    <>
                                        <p><strong>Ação:</strong> Adição de Anexo</p>
                                        <p><strong>Descrição:</strong> {entry.comentario || '-'}</p>
                                        {entry.nome_anexo && entry.id_anexo && (
                                            <div className="mt-2">
                                                <a
                                                    href={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/download-anexo/aid/${btoa(String(entry.id_anexo))}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {entry.nome_anexo}
                                                </a>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Status:</strong> {entry.status}</p>
                                        <p><strong>Comentário:</strong> {entry.comentario || '-'}</p>
                                    </>
                                )}
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
