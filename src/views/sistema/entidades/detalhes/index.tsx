import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LayoutDetailSimple from "@/components/layouts/LayoutDetailSimple";
import LayoutWithMenus from "@/components/layouts/LayoutWithMenus";
import Loading from "@/components/shared/Loading";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { HiOutlinePencil, HiOutlineReply } from "react-icons/hi";
import { APP_PREFIX_PATH } from "@/constants/route.constant";
import ApiService from "@/services/ApiService";
import { Associacao } from "@/@types/generalTypes";
import Detalhes from "./detalhes";
import EmpresasVinculadas from "./empresas-vinculadas";
import EntidadesVinculadas from "./entidades-vinculadas";
import NucleosVinculados from "./nucleos-vinculados";
import ProjetosVinculados from "./projetos-vinculados";
import PerfilEntidade from "./perfil";

const EntidadeIndex = () => {
    const { id, aba } = useParams();

    const [associacao, setAssociacao] = useState<Associacao | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("detalhes");

    const allowedTabs = ["detalhes", "empresas_vinculadas", "entidades_vinculadas", "nucleos_vinculados", "projetos_vinculados", "perfil"];
    const initialTab = allowedTabs.includes(aba || "") ? aba! : "detalhes";

    useEffect(() => {
        setActiveTab(initialTab);
    }, [aba]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.fetchData({ url: `/entidades/${id}`, method: "get" });
                if (response) {
                    setAssociacao(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        };

        fetchData();
    }, [id]);

    const encodedId = btoa(String(id));

    const handleInternalTabClick = (tab: string) => {
        setActiveTab(tab);
        window.history.replaceState(null, '', `${APP_PREFIX_PATH}/entidades/${id}/${tab}`);
    };

    const optionsList = [
        {
            value: "detalhes",
            label: "Detalhes",
            href: "detalhes",
            isActive: activeTab === "detalhes",
            onClick: () => handleInternalTabClick("detalhes")
        },
        {
            value: "al_invest",
            label: "AL Invest",
            href: `${import.meta.env.VITE_PHP_URL}/sistema/concurso/e2022-alinvest/eid/${encodedId}`,
            target: "_blank",
        },
        {
            value: "diagnosticos",
            label: "Diagnósticos",
            href: `${import.meta.env.VITE_PHP_URL}/sistema/diagnosticos/lista-diagnosticos/id/${encodedId}`,
            target: "_blank",
        },
        {
            value: "empresas_vinculadas",
            label: "Empresas Vinculadas",
            href: "empresas_vinculadas",
            isActive: activeTab === "empresas_vinculadas",
            onClick: () => handleInternalTabClick("empresas_vinculadas")
        },
        {
            value: "entidades_vinculadas",
            label: "Entidades Vinculadas",
            href: "entidades_vinculadas",
            isActive: activeTab === "entidades_vinculadas",
            onClick: () => handleInternalTabClick("entidades_vinculadas")
        },
        {
            value: "nucleos_vinculados",
            label: "Núcleos Vinculados",
            href: "nucleos_vinculados",
            isActive: activeTab === "nucleos_vinculados",
            onClick: () => handleInternalTabClick("nucleos_vinculados")
        },
        {
            value: "perfil",
            label: "Perfil",
            href: "perfil",
            isActive: activeTab === "perfil",
            onClick: () => handleInternalTabClick("perfil")
        },
        {
            value: "projetos_vinculados",
            label: "Projetos Vinculados",
            href: "projetos_vinculados",
            isActive: activeTab === "projetos_vinculados",
            onClick: () => handleInternalTabClick("projetos_vinculados")
        },
        {
            value: "acompanhamento",
            label: "Acompanhamento",
            href: `/sistema/representatividade/acompanhamento/${id}`,
            target: "_blank",
        },
        {
            value: "e2022_enem",
            label: "E2022 - ENEM",
            href: `${import.meta.env.VITE_PHP_URL}/sistema/concurso/e2022-enem/eid/${encodedId}`,
            target: "_blank",
        },
        {
            value: "e2022_demandas",
            label: "E2022 - Demandas",
            href: `${import.meta.env.VITE_PHP_URL}/sistema/concurso/e2022-demandas/eid/${encodedId}`,
            target: "_blank",
        },
    ];


    const renderTabContent = () => {
        switch (activeTab) {
            case "empresas_vinculadas":
                return <EmpresasVinculadas />;
            case "entidades_vinculadas":
                return <EntidadesVinculadas />;
            case "nucleos_vinculados":
                return <NucleosVinculados />;
            case "projetos_vinculados":
                return <ProjetosVinculados />;
            case "perfil":
                return <PerfilEntidade />;
            default:
                return <Detalhes data={associacao!} />;
        }
    };

    return (
        <Loading loading={loading}>
            {associacao && (
                <LayoutWithMenus
                    title="Entidade"
                    groupList={optionsList}
                >
                    <LayoutDetailSimple
                        title={
                            <div className="flex items-center gap-4">
                                {associacao.logoentidade && (
                                    <div className="w-12 h-12 border rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/${associacao.logoentidade}`}
                                            alt="Logo Entidade"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <h3>{associacao.nmrazao}</h3>
                            </div>
                        }
                        status={associacao.flativo}
                        subtitle={`Cód. ${associacao.idassociacao}${associacao.nucnpj ? ` - CNPJ: ${associacao.nucnpj}` : ''}`}
                        statusTags={{
                            S: { label: "Ativo", class: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100" },
                            N: { label: "Inativo", class: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100" },
                        }}
                        actions={
                            <div className="flex-wrap inline-flex xl:flex items-center gap-2">
                                <Button size="xs" icon={<HiOutlineReply />}>
                                    <a
                                        className="menu-item-link"
                                        target="_blank"
                                        href={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${encodedId}`}
                                    >
                                        Versão antiga
                                    </a>
                                </Button>
                                <Dropdown renderTitle={<Button size="xs" variant="solid" icon={<HiOutlinePencil />}>Opções</Button>}>
                                    <Dropdown.Item eventKey="alterar">
                                        <Link
                                            to={`/sistema/entidades/editar/${id}`}
                                            className="block w-full h-full"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Alterar dados
                                        </Link>
                                    </Dropdown.Item>
                                </Dropdown>

                            </div>
                        }
                    >
                        {renderTabContent()}
                    </LayoutDetailSimple>
                </LayoutWithMenus>
            )}
        </Loading>
    );
};

export default EntidadeIndex;
