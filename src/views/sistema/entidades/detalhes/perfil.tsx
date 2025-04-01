import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ApiService from "@/services/ApiService";
import { Container } from "@/components/shared";
import Breadcrumb from "@/components/breadCrumbs/breadCrumb";
import { Button, Card } from "@/components/ui";

const PerfilEntidade = () => {
    const { id } = useParams<{ id: string }>();
    const [perfil, setPerfil] = useState<any>(null);
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: "Início", link: "/" },
        { label: "Entidades", link: "/entidades" },
        { label: "Perfil", link: "#" },
    ]);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await ApiService.fetchData({
                    url: `/perfil-entidade/${id}`,
                    method: "get",
                });

                setPerfil(response.data);
                setBreadcrumbItems([
                    { label: "Início", link: "/" },
                    { label: "Entidades", link: "/entidades" },
                    { label: response.data?.nmrazao || "Perfil", link: "#" },
                ]);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setPerfil(undefined);
                } else {
                    console.error("Erro ao buscar perfil:", error);
                }
            }
        };

        if (id) fetchPerfil();
    }, [id]);


    if (perfil === null) {
        return <div>Carregando...</div>
    }

    if (perfil === undefined) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Perfil da Entidade</h1>
                <p className="text-gray-700 text-base mb-4">
                    Esta entidade ainda não possui um perfil cadastrado. Complete o perfil para fornecer mais informações e fortalecer a atuação institucional.
                </p>
                <Link to={`/sistema/perfil-entidade/adicionar/${id}`}>
                    <Button variant="solid">Adicionar Perfil</Button>
                </Link>
            </div>
        );
    }

    const renderItem = (label: string, value: any) => (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value || "-"}</p>
        </div>
    );

    return (

        <div className="space-y-8">

            <div className="flex items-center justify-between my-4">
                <h1 className="text-2xl font-semibold">Perfil da Entidade</h1>
                <Link to={`/sistema/perfil-entidade/adicionar/${id}`}>
                    <Button variant="solid">Editar Perfil</Button>
                </Link>
            </div>

            {/* Diretoria */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Perfil da Diretoria</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderItem("Percentual de mulheres", perfil.porcento_mulheres + "%")}
                </div>
            </div>

            {/* Associados Pagantes */}
            <div>
                <h3 className="text-lg font-semibold mb-1 border-b pb-1">Perfil dos Associados Pagantes</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Quantidade total de associados pagantes por setor da economia
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {renderItem("Serviço", perfil.pagantes_servico)}
                    {renderItem("Comércio", perfil.pagantes_comercio)}
                    {renderItem("Indústria", perfil.pagantes_industria)}
                    {renderItem("Agro", perfil.pagantes_agro)}
                    {renderItem("Liberal", perfil.pagantes_liberal)}
                    {renderItem("MEI", perfil.pagantes_mei)}
                    {renderItem("Outros", perfil.pagantes_outros)}
                </div>
            </div>

            {/* Atividade Econômica */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Atividade Econômica</h3>
                <div className="grid grid-cols-1">
                    {renderItem("Principal Atividade Econômica", perfil.atividade_economica)}
                </div>
            </div>

            {/* Atuação Comercial */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Atuação Comercial</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderItem("Possui Área Comercial", perfil.area_comercial)}
                    {renderItem("Vendedores Atuantes", perfil.vendedores_atuantes)}
                </div>
            </div>

            {/* Produtos e Serviços */}
            <div>
                <h3 className="text-lg font-semibold mb-1 border-b pb-1">Produtos e Serviços</h3>
                <p className="text-sm text-gray-600 mb-2">Produtos e serviços oferecidos aos associados</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderItem("Certificado de Origem", perfil.certificado_origem)}
                    {renderItem("Certificado Digital", perfil.certificado_digital)}
                    {renderItem("Análise de Crédito", perfil.servico_analise_credito)}
                    {renderItem("Intermediação de Estágio", perfil.servico_intermediacao_estagio)}
                    {renderItem("Concessão de Crédito", perfil.servico_concessao_credito)}
                    {renderItem("Carta de Exclusividade", perfil.carta_exclusividade)}
                    {renderItem("Plano de Saúde", perfil.plano_saude)}
                    {renderItem("Câmara de Mediação", perfil.camara_mediacao)}
                    {renderItem("FAC", perfil.faculdade_comercio)}
                    {renderItem("Aluguel de Salas", perfil.aluguel_salas)}
                </div>
            </div>

            {/* Comitês */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Conselhos ou Comitês Temáticos</h3>
                <p className="text-sm text-gray-600 mb-2">Grupos organizados para discutir assuntos específicos</p>
                <div className="grid grid-cols-1">
                    {renderItem("Comitês/Conselhos", perfil.conselho_comites)}
                </div>
            </div>

            {/* Sede */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Sede da Associação Comercial</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderItem("Local", perfil.sede_associacao)}
                    {renderItem("Condições da Sede", perfil.condicao_sede)}
                </div>
            </div>

            {/* Taxa de Associativismo */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Taxa de Associativismo</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Valores mínimos e máximos cobrados por associado
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {renderItem("Valor Mínimo", perfil.taxa_associativismo_min)}
                    {renderItem("Valor Máximo", perfil.taxa_associativismo_max)}
                </div>
            </div>

            {/* Faturamento */}
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Distribuição do Faturamento</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Percentual das receitas segundo sua origem
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {renderItem("Produtos/Serviços", perfil.faturamento_produtos_servicos)}
                    {renderItem("Taxa de Associativismo", perfil.faturamento_taxa_associativismo)}
                </div>
            </div>
        </div>
    );
};

export default PerfilEntidade;
