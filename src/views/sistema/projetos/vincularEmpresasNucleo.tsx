import { Container } from '@/components/shared';
import { Button, Card } from '@/components/ui';
import ApiService from '@/services/ApiService';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const VincularEmpresasNucleos = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [detalhesProjetos, setDetalhesProjetos] = useState([]);
    const [hasClickedConfirm, setHasClickedConfirm] = useState(false);
    const [collapsedProjects, setCollapsedProjects] = useState<Record<number, boolean>>({});

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await ApiService.fetchData({
                url: `/projetos/vincularEmpresasNucleos`,
                method: 'get',
            });

            setHasClickedConfirm(true);
            setMessage(response.data.mensagem);
            setDetalhesProjetos(response.data.detalhesProjetos);
        } catch (error) {
            setMessage('Ocorreu um erro ao vincular as empresas.');
            setDetalhesProjetos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    const toggleCollapse = (projectId: number) => {
        setCollapsedProjects((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };

    return (
        <Container>
            <Card className="p-6 space-y-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Vincular Empresas dos Núcleos</h1>
                <p className="text-gray-600">
                    Esta funcionalidade vincula todas as empresas dos núcleos participantes a todos os projetos da classe EM, apoiados pelo projeto 2028.
                    Caso já existam vínculos, eles não serão duplicados. <br></br> <strong>Para desvincular, entre no detalhe de projeto e desvincule manualmente a empresa desejada.</strong>
                </p>
                <div className="flex space-x-4 my-4">
                    <Button onClick={handleCancel} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading} variant='solid'>
                        {isLoading ? 'Salvando...' : 'Confirmar'}
                    </Button>
                </div>
                {message && (
                    <p
                        className={`mt-4 p-3 rounded-lg ${
                            message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {message}
                    </p>
                )}
            </Card>
            {hasClickedConfirm && (
                detalhesProjetos.length > 0 ? (
                    <Card className="mt-8 p-6 space-y-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-xl font-bold text-gray-800">Empresas vinculadas aos projetos</h2>
                        <ul className="space-y-4">
                            {detalhesProjetos.map((projeto: any) => (
                                <li key={projeto.idProjeto}>
                                    <div
                                        className="flex justify-between items-center cursor-pointer bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100"
                                        onClick={() => toggleCollapse(projeto.idProjeto)}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Projeto:
                                            <Link
                                                to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/projeto-detalhe/pid/${btoa(
                                                    String(projeto.idProjeto)
                                                )}`}
                                                className="text-blue-500 hover:underline ml-1"
                                            >
                                                {projeto.idProjeto} - {projeto.projeto}
                                            </Link>
                                        </h3>
                                        <span className="text-gray-500">
                                            {collapsedProjects[projeto.idProjeto] ? '▲' : '▼'}
                                        </span>
                                    </div>
                                    {collapsedProjects[projeto.idProjeto] && (
                                        <ul className="mt-2 space-y-1 pl-4">
                                            {projeto.empresas.map((empresa: any) => (
                                                <li
                                                    key={empresa.id}
                                                    className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md shadow-sm"
                                                >
                                                    <Link
                                                        to={`${import.meta.env.VITE_PHP_URL}/sistema/empresa/detalhe/eid/${btoa(
                                                            String(empresa.id)
                                                        )}`}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {empresa.nome}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Card>
                ) : (
                    <Card className="mt-8 p-6 space-y-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-xl font-bold text-gray-800">Nenhuma nova empresa foi vinculada</h2>
                        <p className="text-gray-600">
                            Não foram encontradas novas empresas para serem vinculadas aos projetos desta operação.
                        </p>
                    </Card>
                )
            )}
        </Container>
    );
};

export default VincularEmpresasNucleos;
