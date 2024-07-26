import React from 'react';
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';

interface FreezeMarcosCriticosModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    entidadeId: string;
}

const FreezeMarcosCriticosModal: React.FC<FreezeMarcosCriticosModalProps> = ({ entidadeId, isOpen, onClose, onUpdate }) => {
    const handleConfirm = async () => {
        try {
            await ApiService.fetchData({
                url: '/representatividade/congelar-marcos-criticos',
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
                <h5 className='mb-4'>Congelar Marcos Críticos</h5>
                <p>Deseja realmente congelar os marcos críticos? Esta operação é irreversível e eles não poderão ser editados.</p>
                <div className="flex justify-between mt-4">
                    <Button type="button" onClick={onClose} className="mr-2">
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleConfirm} color="red-600" variant="solid">
                        Confirmar
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default FreezeMarcosCriticosModal;
