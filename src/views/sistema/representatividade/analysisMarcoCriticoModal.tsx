import React, { useState } from 'react';
import { Dialog, Button, Input } from '@/components/ui';

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (comentario: string, status: string) => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, onSave }) => {
    const [comentario, setComentario] = useState('');

    const handleSave = () => {
        onSave('Em análise', comentario);
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div>
                <h5>Remeter para Análise</h5>

                <div className="my-4">
                    <label htmlFor="comentario" className="block text-sm mb-2 text-gray-700">
                        Comentário
                    </label>
                    <Input
                        placeholder="Digite seu comentário"
                        textArea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                </div>

                <div className="flex justify-between">
                    <Button type="button" onClick={onClose} className="mr-2">
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSave} color="blue-600" variant="solid">
                        Confirmar
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default AnalysisModal;
