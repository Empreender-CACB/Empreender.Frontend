import React from 'react';
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';

interface FreezeMarcosCriticosModalProps {
    isOpen: boolean;
    isCongelado: boolean;
    onClose: () => void;
    onUpdate: () => void;
    entidadeId: string;
    tipo: string;
}

const FreezeMarcosCriticosModal: React.FC<FreezeMarcosCriticosModalProps> = ({ tipo, isCongelado, entidadeId, isOpen, onClose, onUpdate }) => {
    const handleConfirm = async () => {
        try {
            await ApiService.fetchData({
                url: `/representatividade/congelar-marcos-criticos/${tipo}`,
                method: 'put',
                data: { entidadeId }
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao congelar marcos críticos:', error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div>
                <h5 className='mb-4'>{isCongelado ? "Descongelar" : "Congelar"} Marcos Críticos</h5>
                {isCongelado ? 
                    <p>Deseja descongelar os marcos críticos? Com essa ação, Será possível editar os marcos críticos da entidade.</p>
                    : 
                    <p>Deseja congelar os marcos críticos? Com essa ação, não poderão mais ser adicionados novos marcos, ou editá-los.</p>
                }
                <div className="flex justify-between mt-4">
                    <Button type="button" onClick={onClose} className="mr-2">
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleConfirm} color="green-600" variant="solid">
                        Confirmar
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default FreezeMarcosCriticosModal;
