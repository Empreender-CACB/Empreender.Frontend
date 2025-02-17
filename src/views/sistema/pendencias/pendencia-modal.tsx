import { useEffect, useState } from 'react';
import { Button, Tag } from '@/components/ui';
import Dialog from '@/components/ui/Dialog';
import ApiService from '@/services/ApiService';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import AnexosComponent from '../anexos/AnexosComponent';
import { HiPencil } from 'react-icons/hi';

const statusLabels: Record<string, { label: string; color: string }> = {
    nr: { label: 'Não Resolvido', color: 'bg-red-600' },
    re: { label: 'Resolvido', color: 'bg-green-600' },
};

const bloqueioLabels: Record<string, string> = {
    bo: 'Bloqueado',
    de: 'Não bloqueado',
};

interface PendenciaModalProps {
    idPendencia: number;
    onClose: () => void;
    isOpen: boolean;
    temBloqueio: boolean;
    temAnexos: boolean;
}


const PendenciaModal: React.FC<PendenciaModalProps> = ({ idPendencia, onClose, isOpen, temBloqueio, temAnexos }) => {
    const [pendencia, setPendencia] = useState<any>(null);

    useEffect(() => {
        if (isOpen && idPendencia) {
            fetchPendencia();
        }
    }, [idPendencia, isOpen]);

    const fetchPendencia = async () => {
        try {
            const response = await ApiService.fetchData({
                url: `/pendencias/fetchPendencia/${idPendencia}`,
                method: 'get',
            });
            setPendencia(response.data);

            console.log(response.data)
        } catch (error) {
            console.error('Erro ao buscar pendência:', error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={1200}>
            {pendencia && (
                <div className="max-h-[75vh] overflow-y-auto p-6">
                    <div className="bg-white rounded-lg shadow-lg border-2 p-4 relative mb-4">
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <Link
                                className="block lg:inline-block md:mb-0 mb-4"
                                to={`${APP_PREFIX_PATH}/pendencias/adicionar/${temBloqueio.toString()}/${pendencia.tipo_vinculo}/${pendencia.id_vinculo}/${pendencia.tipo_vinculo_aux}/${pendencia.id_vinculo_aux}/${pendencia.id}?temAnexos=${temAnexos}&redirectUrl=${encodeURIComponent(window.location.href)}`}
                            >
                                <Button
                                    block
                                    variant="solid"
                                    size="sm"
                                    icon={<HiPencil />}
                                >
                                    Editar
                                </Button>
                            </Link>
                            <Tag className={`${statusLabels[pendencia.status]?.color || 'bg-gray-400'} text-white border-0 rounded`}>
                                {statusLabels[pendencia.status]?.label || 'Indisponível'}
                            </Tag>
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="flex items-center space-x-4 mr-5">
                                <h2 className="text-xl font-bold text-gray-800">Pendência {pendencia.id}</h2>
                                <span className="text-gray-600">
                                    Criada em {moment(pendencia.data_inclusao).format('DD/MM/YYYY HH:mm')}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <strong className="text-gray-900">Título:</strong>
                                <p className="text-gray-700">{pendencia.titulo}</p>
                            </div>

                            <div className="flex flex-col">
                                <strong className="text-gray-900">Descrição:</strong>
                                <p className="text-gray-700">{pendencia.descricao}</p>
                            </div>

                            <div className="flex items-center">
                                <strong className="text-gray-900 mr-2">Data Prevista para Solução:</strong>
                                <p>{moment(pendencia.data_prevista_solucao).format('DD/MM/YYYY')}</p>
                            </div>

                            <div className="flex items-center">
                                <strong className="text-gray-900 mr-2">Bloqueio Financeiro:</strong>
                                <Tag className="bg-red-600 text-white border-0 rounded">
                                    {bloqueioLabels[pendencia.bloqueio_financeiro] || 'Indisponível'}
                                </Tag>
                            </div>
                        </div>

                        {pendencia.status === 're' && (
                            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                                <strong className="text-gray-900">Resolvida em:</strong> {moment(pendencia.data_solucao).format('DD/MM/YYYY')}
                                <div className="text-gray-600">Por: {pendencia.usuario_solucao}</div>
                            </div>
                        )}

                        {pendencia.usuario_bloqueio && (
                            <div className="mt-4 p-4 bg-yellow-100 rounded-lg shadow-sm">
                                <strong className="text-gray-900">Bloqueada em:</strong> {moment(pendencia.data_bloqueio).format('DD/MM/YYYY HH:mm')}
                                <div className="text-gray-600">Por: {pendencia.usuario_bloqueio}</div>
                            </div>
                        )}

                        {pendencia.usuario_liberacao && (
                            <div className="mt-4 p-4 bg-green-100 rounded-lg shadow-sm">
                                <strong className="text-gray-900">Liberada em:</strong> {moment(pendencia.data_liberacao).format('DD/MM/YYYY HH:mm')}
                                <div className="text-gray-600">Por: {pendencia.usuario_liberacao}</div>
                            </div>
                        )}

                    </div>

                    {temAnexos && (
                        <section className="p-6 mt-4 bg-white rounded-lg shadow-lg border-2">
                            <AnexosComponent
                                url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`}
                                title="Documentos"
                                minHeight={300}
                                tipoVinculo={'pendencia'}
                                idVinculo={pendencia.id}
                            />
                        </section>
                    )}
                </div>
            )}
        </Dialog>
    );
};

export default PendenciaModal;
