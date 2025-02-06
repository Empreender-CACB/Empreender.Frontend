import { useEffect, useState } from 'react';
import { Button, Tag } from '@/components/ui';
import Dialog from '@/components/ui/Dialog';
import ApiService from '@/services/ApiService';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import AnexosComponent from '../anexos/AnexosComponent';
import { HiPencil, HiPlusCircle } from 'react-icons/hi';

const situacaoDivulgada = 'di';

const situacaoLabels: Record<string, { label: string; color: string }> = {
    ec: { label: 'Em cadastramento', color: 'bg-blue-600' },
    di: { label: 'Divulgada', color: 'bg-green-600' },
};

const privacidadeLabels: Record<string, string> = {
    si: 'Sem Indicação',
    pr: 'Próprio',
    ep: 'Empresários',
    ge: 'Gestores',
    na: 'Nacional',
};

interface AnotacaoModalProps {
    idAnotacao: number;
    onClose: () => void;
    isOpen: boolean;
    temAnexos: boolean;
}

const AnotacaoModal: React.FC<AnotacaoModalProps> = ({ idAnotacao, onClose, isOpen, temAnexos }) => {
    const [anotacao, setAnotacao] = useState<any>(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isRead, setIsRead] = useState(false);

    useEffect(() => {
        if (isOpen && idAnotacao) {
            fetchAnotacao();
        }
    }, [idAnotacao, isOpen]);

    const fetchAnotacao = async () => {
        try {
            const response = await ApiService.fetchData({
                url: `/anotacoes/fetchAnotacao/${idAnotacao}`,
                method: 'get',
            });
            setAnotacao(response.data);
            setIsAuthor(response.data.autor === response.data.usuarioAtual);
            setIsRead(response.data.isRead);
        } catch (error) {
            console.error('Erro ao buscar anotação:', error);
        }
    };

    const handleMarkAsRead = async () => {
        try {
            await ApiService.fetchData({
                url: `/anotacoes/marcar-como-lido/${idAnotacao}`,
                method: 'post',
            });
            setIsRead(true);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja excluir esta anotação?")) return;

        try {
            await ApiService.fetchData({
                url: `/anotacoes/excluir/${idAnotacao}`,
                method: 'delete',
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Erro ao excluir anotação:', error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={1200}>
            {anotacao && (
                <div className="max-h-[75vh] overflow-y-auto p-6">
                    <div className="bg-white rounded-lg shadow-lg border-2 p-4 relative mb-4">
                        <div className="absolute top-2 right-2 flex space-x-2">
                            {isAuthor && (
                                <>
                                    <Link
                                        className="block lg:inline-block md:mb-0 mb-4"
                                        to={`${APP_PREFIX_PATH}/anotacoes/adicionar/${anotacao.tipo_vinculo}/${anotacao.id_vinculo}/${anotacao.id}`}
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

                                    <Button variant="solid" color="red" onClick={handleDelete} size="sm">
                                        Excluir
                                    </Button>

                                    {Boolean(temAnexos) && (
                                        <Link
                                            className="block lg:inline-block md:mb-0 mb-4"
                                            to={{
                                                pathname: `${APP_PREFIX_PATH}/anexos/adicionar/anotacao/${anotacao.id}`,
                                                search: `?redirectUrl=${encodeURIComponent(`${APP_PREFIX_PATH}/anotacoes/${anotacao.tipo_vinculo}/${anotacao.id_vinculo}`)}`,
                                            }}
                                        >
                                            <Button
                                                block
                                                variant="solid"
                                                size="sm"
                                                icon={<HiPlusCircle />}
                                            >
                                                Anexar Arquivo
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                            {!isRead && anotacao.situacao === situacaoDivulgada && !isAuthor && (
                                <Button variant="solid" color="green" onClick={handleMarkAsRead} size="sm">
                                    Marcar como lida
                                </Button>
                            )}
                        </div>

                        {/* Conteúdo da anotação */}
                        <div className="flex items-center mb-4">
                            <div className="flex items-center space-x-4 mr-5">
                                <h2 className="text-xl font-bold text-gray-800">Anotação {anotacao.id}</h2>
                                <span className="text-gray-600">
                                    {anotacao.situacao === situacaoDivulgada ? (
                                        `Criado em ${moment(anotacao.data_inclusao).format('DD/MM/YYYY HH:mm')}`
                                    ) : (
                                        <Tag className={`${situacaoLabels[anotacao.situacao]?.color || 'bg-gray-400'} text-white border-0 rounded`}>
                                            {situacaoLabels[anotacao.situacao]?.label || 'Indisponível'}
                                        </Tag>
                                    )}
                                </span>
                            </div>
                            <div className="flex space-x-4">
                                <div>
                                    <strong>Privacidade: </strong>
                                    {privacidadeLabels[anotacao.privacidade] || 'Indisponível'}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700">{anotacao.descricao}</p>
                        </div>
                    </div>

                    {temAnexos && (
                        <section className="p-6 mt-4 bg-white rounded-lg shadow-lg border-2">
                            <AnexosComponent
                                url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`}
                                title="Documentos"
                                minHeight={300}
                                tipoVinculo={'anotacao'}
                                idVinculo={anotacao.id}
                            />
                        </section>
                    )}
                </div>
            )}
        </Dialog>
    );
};

export default AnotacaoModal;
