import React, { useState, useEffect } from 'react';
import { Dialog, Button, Input } from '@/components/ui';
import DatePicker from '@/components/ui/DatePicker/DatePicker';

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (comentario: string, status: string, dataTermino?: Date) => void;
    dataTerminoInicial?: Date | null;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, onSave, dataTerminoInicial }) => {
    const [comentario, setComentario] = useState('');
    const [dataTermino, setDataTermino] = useState<Date | null>(null);

    useEffect(() => {
        if (dataTerminoInicial) {
            setDataTermino(new Date(dataTerminoInicial));
        }
    }, [dataTerminoInicial]);

    const handleSave = () => {
        const isDataTerminoAlterada =
            dataTerminoInicial && dataTermino
                ? dataTermino.getTime() !== new Date(dataTerminoInicial).getTime()
                : dataTerminoInicial !== dataTermino;
    
        const dataTerminoToSave = isDataTerminoAlterada && dataTermino ? dataTermino : undefined;
    
        onSave('Em análise', comentario, dataTerminoToSave);
        onClose();
    };    

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div>
                <h5>Remeter para Análise</h5>

                <div className="my-4">
                    <label htmlFor="comentario" className="block text-sm mb-2 text-gray-700">
                        Comentário para o gestor (opcional)
                    </label>
                    <Input
                        placeholder="Digite seu comentário"
                        textArea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                </div>

                <div className="my-4">
                    <label htmlFor="dataTermino" className="block text-sm mb-2 text-gray-700">
                        Data de Término (opcional)
                    </label>
                    <DatePicker
                        placeholder="Selecione uma data"
                        value={dataTermino}
                        onChange={(date: any) => setDataTermino(date)}
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
