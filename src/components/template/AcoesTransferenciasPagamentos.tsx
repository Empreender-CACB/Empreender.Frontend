import { Button, Dialog, Notification } from '@/components/ui';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HiCalendar, HiCurrencyDollar, HiOutlineXCircle } from 'react-icons/hi'
import { useState } from 'react';
import ApiService from '@/services/ApiService';
import toast from '@/components/ui/toast'

const AcoesTransferencaisPagamentos = ( data: any) => {
    const [dialogIsOpen, setIsOpen] = useState<boolean>(false)

    const handleRejectLancDiagModal = () => {
        setIsOpen(!dialogIsOpen)
    }
    const navigate = useNavigate();


    const RejectLancamento = async () => {
        try {
            await ApiService.fetchData({
                url: 'esg/alterar-status-diag',
                method: 'POST',
                data: {
                    id: 1,
                    status: 'Encerrado'
                }
            });
            navigate(`/esg2/diagnostico/visualizacao/`);
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
                
            <Link
                    className="block lg:inline-block md:mb-0 mb-4"
                    to="/app/sales/product-new"
                >
                    <Button
                        block
                        variant="solid"
                        size="lg"
                        color="white"
                        title="Calendar"
                        icon={<HiCalendar />}
                    >
                    </Button>
            </Link>
            <Link
                    className="block lg:inline-block md:mb-0 mb-4"
                    to="/app/sales/product-new"
                >
                    <Button
                        block
                        variant="solid"
                        size="lg"
                        color="white"
                        icon={<HiCurrencyDollar />}
                    >
                    </Button>
            </Link>
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

export default AcoesTransferencaisPagamentos