import { useState, useEffect } from "react";
import { useParams, Link, Route, Routes, useLocation } from "react-router-dom";
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

const EntidadeIndex = () => {
    const { id } = useParams();
    const location = useLocation();

    const [associacao, setAssociacao] = useState<Associacao | null>(null);
    const [loading, setLoading] = useState(true);

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

    const optionsList = [
        { value: "detalhes", label: "Detalhes", href: `${APP_PREFIX_PATH}/entidades/${id}`, isActive: location.pathname === `${APP_PREFIX_PATH}/entidades/${id}` },
        { value: "al_invest", label: "AL Invest", href: `${APP_PREFIX_PATH}/entidades/${id}/al_invest`, isActive: location.pathname.includes("/al_invest") },
        { value: "diagnosticos", label: "Diagnósticos", href: `${APP_PREFIX_PATH}/entidades/${id}/diagnosticos`, isActive: location.pathname.includes("/diagnosticos") },
        { value: "empresas_vinculadas", label: "Empresas Vinculadas", href: `${APP_PREFIX_PATH}/entidades/${id}/empresas_vinculadas`, isActive: location.pathname.includes("/empresas_vinculadas") },
        { value: "entidades_vinculadas", label: "Entidades Vinculadas", href: `${APP_PREFIX_PATH}/entidades/${id}/entidades_vinculadas`, isActive: location.pathname.includes("/entidades_vinculadas") },
        { value: "nucleos_vinculados", label: "Núcleos Vinculados", href: `${APP_PREFIX_PATH}/entidades/${id}/nucleos_vinculados`, isActive: location.pathname.includes("/nucleos_vinculados") },
        { value: "perfil", label: "Perfil", href: `${APP_PREFIX_PATH}/entidades/${id}/perfil`, isActive: location.pathname.includes("/perfil") },
        { value: "projetos", label: "Projetos", href: `${APP_PREFIX_PATH}/entidades/${id}/projetos`, isActive: location.pathname.includes("/projetos") },
    ];

    return (
        <Loading loading={loading}>
            {associacao && (
                <LayoutWithMenus title="Entidade" groupList={optionsList}>
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
                        subtitle={`Cód. ${associacao.idassociacao} - CNPJ: ${associacao.nucnpj}`}
                        statusTags={{
                            S: { label: "Ativo", class: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100" },
                            N: { label: "Inativo", class: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100" },
                        }}
                        actions={
                            <div className="flex-wrap inline-flex xl:flex items-center gap-2">
                                <Button size="xs" icon={<HiOutlineReply />}>
                                    <Link className="menu-item-link" to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(associacao.idassociacao))}`}>
                                        Versão antiga
                                    </Link>
                                </Button>
                                <Dropdown renderTitle={<Button size="xs" variant="solid" icon={<HiOutlinePencil />}>Opções</Button>}>
                                    <Dropdown.Item eventKey="vincular">Vincular Entidades</Dropdown.Item>
                                    <Dropdown.Item eventKey="alterar">Alterar dados</Dropdown.Item>
                                </Dropdown>
                            </div>
                        }
                    >
                        <Routes>
                            <Route index element={<Detalhes data={associacao} />} />
                            {/* <Route path="al_invest" element={<AlInvest />} />
                            <Route path="diagnosticos" element={<Diagnosticos />} /> */}
                            <Route path="empresas_vinculadas" element={<p>Conteúdo de Empresas Vinculadas</p>} />
                            <Route path="entidades_vinculadas" element={<p>Conteúdo de Entidades Vinculadas</p>} />
                            <Route path="nucleos_vinculados" element={<p>Conteúdo de Núcleos Vinculados</p>} />
                            <Route path="perfil" element={<p>Conteúdo de Perfil</p>} />
                            <Route path="projetos" element={<p>Conteúdo de Projetos</p>} />
                        </Routes>
                    </LayoutDetailSimple>
                </LayoutWithMenus>
            )}
        </Loading>
    );
};

export default EntidadeIndex;
