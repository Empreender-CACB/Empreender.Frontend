import React, { useState } from 'react';
import { Dialog, Button, Input } from '@/components/ui';

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (status: string, comentario: string, currentDate: any) => void;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({ isOpen, onClose, onSave }) => {
    const [consultorComentario, setConsultorComentario] = useState('');

    const handleSave = (status: string) => {
        const currentDate = new Date(); // Data atual
        onSave(status, consultorComentario, status === 'Atingido' ? currentDate : undefined);
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div>
                <h5>Alterar Status</h5>
                
                <div className="my-4">
                    <label htmlFor="consultorComentario" className="block text-sm mb-2 text-gray-700">
                        Comentário do Consultor
                    </label>
                    <Input
                        placeholder="O comentário ficará no histórico, disponível para o gestor da entidade."
                        textArea
                        value={consultorComentario}
                        onChange={(e) => setConsultorComentario(e.target.value)}
                    />
                </div>
                
                <div className="flex justify-between">
                    <Button type="button" onClick={onClose} className="mr-2">
                        Cancelar
                    </Button>
                    <div className="flex space-x-2">
                        <Button type="button" onClick={() => handleSave('Não atingido')} color="red-600" variant='solid'>
                            Não Atingido
                        </Button>
                        <Button type="button" onClick={() => handleSave('Atingido')} color="green-600" variant='solid'>
                            Aprovar
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default StatusChangeModal;
