import { Button, Dialog, Notification } from '@/components/ui';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react';
import ApiService from '@/services/ApiService';
import toast from '@/components/ui/toast'
import { HiOutlineXCircle } from 'react-icons/hi'


const RecusarLancamento = ( data : any ) => {

    const [dialogIsOpen, setIsOpen] = useState<boolean>(false)

    const handleRejectLancDiagModal = () => {
        setIsOpen(!dialogIsOpen)
    }
    const navigate = useNavigate();

    const RejectLancamento = async () => {
        try {
            await ApiService.fetchData({
                url: 'lancamentos/recusar',
                method: 'POST',
                data: {
                    idlanc: data.idlanc,
                }
            });
            navigate(`/sistema/lancamentos/transferencias-pagamentos/`);
        } catch (error: any) {
            toast.push(
                <Notification title={error.response?.data?.message} type="danger" />
            );
        }
    }

    return ( 
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleRejectLancDiagModal}
                onRequestClose={handleRejectLancDiagModal}
                style={{
                    content: {
                        marginTop: 250,
                    },
                }}
            >
                <h5 className="mb-4">Deseja realmente recusar o lançamento {data.idlanc}?</h5>
                <p>
                    O lançamento ficará com status Pendente após o processo.
                </p>

                <div className="text-right mt-6 flex flex-col sm:flex-row justify-between">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleRejectLancDiagModal}
                    >
                        Cancelar
                    </Button>
                    <Button variant="solid" onClick={RejectLancamento}>
                        Recusar
                    </Button>
                </div>
            </Dialog>
        
            <Button
                onClick={handleRejectLancDiagModal}
                block
                variant="solid"
                size="lg"
                color="white"
                icon={<HiOutlineXCircle />}
            >
                </Button>
        </div>
    )
}

export default RecusarLancamento