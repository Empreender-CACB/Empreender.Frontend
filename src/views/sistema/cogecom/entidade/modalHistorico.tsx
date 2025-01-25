import React, { useEffect, useState } from 'react';
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';
import { format } from 'date-fns';
import { AxiosResponse } from 'axios';
import { FaSort } from 'react-icons/fa';

interface HistoricoModalProps {
    isOpen: boolean;
    onClose: () => void;
    idObjeto: number;
}

const HistoricoCogecomModal: React.FC<HistoricoModalProps> = ({ isOpen, onClose, idObjeto }) => {
    const [historico, setHistorico] = useState<any[]>([]);
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        if (isOpen) {
            const fetchHistorico = async () => {
                try {
                    const response: AxiosResponse = await ApiService.fetchData({
                        url: `/cogecom/historico/${idObjeto}`,
                        method: 'get',
                        params: { order: orderBy },
                    });
                    setHistorico(response.data);
                } catch (error) {
                    console.error('Erro ao buscar histórico do COGECOM:', error);
                }
            };

            fetchHistorico();
        }
    }, [isOpen, idObjeto, orderBy]);

    const toggleOrder = () => {
        setOrderBy((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={800}>
            <div>
                <div className="flex items-center mb-4">
                    <h5 className="mr-4">Histórico do COGECOM</h5>
                    <Button type="button" onClick={toggleOrder} className="flex items-center">
                        {orderBy === 'asc' ? 'Mais antigos' : 'Mais recentes'} <FaSort className="ml-2" />
                    </Button>
                </div>
                <div className="overflow-y-auto max-h-96">
                    {historico.length > 0 ? (
                        historico.map((entry) => (
                            <div key={entry.id} className="mb-4 border-b pb-2">
                                <p>
                                    <strong>Usuário/Data:</strong> {entry.usuarioAutor.nmusuario} -{' '}
                                    {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm')}
                                </p>
                                <p>
                                    <strong>Status:</strong> {entry.status}
                                </p>
                                <p>
                                    <strong>Comentário:</strong> {entry.comentario || '-'}
                                </p>
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

export default HistoricoCogecomModal;
