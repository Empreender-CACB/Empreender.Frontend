import React, { useState } from 'react'; 
import { Dialog, Button } from '@/components/ui';
import ApiService from '@/services/ApiService';

interface ConfirmarInscricaoProps {
    isOpen: boolean;
    idEntidade: string | undefined;
    onClose: () => void;
    onConfirm: () => void; // Atualiza o estado do componente pai
}

const ConfirmarInscricao: React.FC<ConfirmarInscricaoProps> = ({ isOpen, idEntidade, onClose, onConfirm }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = async () => {
        try {
            await ApiService.fetchData({
                url: `cogecom/inscricao`,
                method: 'post',
                data: { idEntidade },
            });
            setIsConfirmed(true);
            onConfirm();
        } catch (error) {
            console.error('Erro ao confirmar inscrição:', error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <h5 className="text-lg font-bold mb-4">{isConfirmed ? 'Inscrição Confirmada' : 'Confirmar Inscrição'}</h5>

                {isConfirmed ? (
                    <p className="my-4 text-green-700">
                        Sua inscrição foi confirmada com sucesso! Acompanhe o status no portal.
                    </p>
                ) : (
                    <>
                        <p className="my-4">
                            As entidades elegíveis podem indicar seu interesse e acessar materiais exclusivos, regras do
                            projeto e documentos necessários para credenciamento. Acompanhe também o status de sua
                            adesão diretamente no portal.
                        </p>
                        <div className="w-full flex justify-center">
                            <Button type="button" onClick={handleConfirm} color="green-600" variant="solid">
                                Confirmar Inscrição
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Dialog>
    );
};

export default ConfirmarInscricao;
