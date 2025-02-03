import React, { useState } from 'react'; 
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';

interface AtualizarStatusProps {
    isOpen: boolean;
    idEntidade: number;
    novoStatus: string;
    title: string;
    message?: string;
    onClose: () => void;
    onConfirm: () => void;
}

const statusLabels: Record<string, string> = {
    'Novo': 'Novo',
    'Solicitada': 'Solicitada',
    'Em avaliação': 'Em Avaliação',
    'Pendente': 'Pendente',
    'Cancelada': 'Cancelada',
    'Vinculada': 'Vinculada',
    'Desvinculada': 'Desvinculada',
};

const AtualizarStatusModal: React.FC<AtualizarStatusProps> = ({ isOpen, idEntidade, novoStatus, title, message, onClose, onConfirm }) => {

    const handleConfirm = async () => {
        try {
            await ApiService.fetchData({
                url: `cogecom-entidade/status/${idEntidade}`,
                method: 'put',
                data: { status: novoStatus },
            });
            onConfirm();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar status da entidade:', error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <h5 className="text-lg font-bold mb-4">{title}</h5>
                    <p className="my-4">
                        {message ? (
                            message
                        ) : (
                            <>
                                Deseja realmente alterar o status para <strong>{statusLabels[novoStatus]}</strong>?
                            </>
                        )}
                    </p>

                    <div className="w-full flex justify-between">
                        <Button type="button" onClick={onClose} variant="default">
                            Cancelar
                        </Button>
                        <Button type="button" onClick={handleConfirm} color="blue-600" variant="solid">
                            Confirmar
                        </Button>
                    </div>
            </div>
        </Dialog>
    );
};

export default AtualizarStatusModal;
