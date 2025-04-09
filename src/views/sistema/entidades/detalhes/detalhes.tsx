import { useState, useEffect, ReactNode } from 'react';
import { Associacao } from '@/@types/generalTypes';
import Tabs from '@/components/ui/Tabs';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { noEmpty } from '@/utils/noEmpty';
import dayjs from 'dayjs';
import AnotacoesComponent from '../../anotacao/AnotacoesComponent';
import AnexosComponent from '../../anexos/AnexosComponent';
import PendenciasComponent from '../../pendencias/PendenciasComponent';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { HiCalendar, HiClipboardCheck, HiGlobe, HiIdentification, HiMail, HiOfficeBuilding, HiOutlinePencil, HiOutlineTrash, HiPhone, HiPlusCircle, HiUser } from 'react-icons/hi';
import AdicionarDadosBancarios from './components/AdicionarDadosBancarios';
import AdicionarContato from './components/AdicionarContato';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { AdaptableCard } from '@/components/shared';
import { usePermission } from '@/utils/hooks/usePermission';

const { TabNav, TabList, TabContent } = Tabs;

type DataProps = {
    data: Associacao;
};

interface InfoBoxProps {
    icon: ReactNode
    label: string
    value: any
    color?: string
}

const InfoBox = ({ icon, label, value, color = "gray" }: InfoBoxProps) => {
    return (
        <div className="flex items-start space-x-3">
            <div className={`rounded-full p-2 text-white bg-${color}-500 mt-1`}>
                {icon}
            </div>
            <div>
                <div className="text-sm font-semibold text-gray-700">{label}</div>
                <div className="text-sm text-gray-900">{value || "-"}</div>
            </div>
        </div>
    )
}

const Detalhes = ({ data }: DataProps) => {
    const { aba, id } = useParams();

    const [reload, setReload] = useState(false);

    const [isBancoModalOpen, setBancoModalOpen] = useState(false);
    const [isDiretoriaModalOpen, setDiretoriaModalOpen] = useState(false);
    const [editBancoData, setEditBancoData] = useState(null);
    const [editDiretoriaData, setEditDiretoriaData] = useState(null);

    useEffect(() => { }, [reload]);

    const hasPermission = usePermission();

    const permissaoGestaoEntidade =
        hasPermission({
            recurso: "ace_edita",
            vinculo: { tipo: "associacao", id: Number(id) }
        }) ||
        hasPermission({
            recurso: "entidade_docanopen",
            ignorarVinculo: true,
        });


    const handleEditBanco = (rowData: any) => {
        setEditBancoData(rowData);
        setBancoModalOpen(true);
    };

    const handleEditDiretoria = (rowData: any) => {
        setEditDiretoriaData(rowData);
        setDiretoriaModalOpen(true);
    };

    const navigate = useNavigate();

    const abasInternasValidas = ["detalhes", "dadosBancarios", "anotacoes", "pendencias", "documentos", "diretoria"];
    const [abaInterna, setAbaInterna] = useState("detalhes");

    useEffect(() => {
        if (abasInternasValidas.includes(aba || "")) {
            setAbaInterna(aba!);
        } else {
            setAbaInterna("detalhes");
        }
    }, [aba]);

    const columnsBanco = [
        { name: "apelido", header: "Apelido", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "dsbanco", header: "Banco", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "dsagencia", header: "Agência", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "dsconta", header: "Conta", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "pix_tipo", header: "Tipo PIX", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "pix_chave", header: "Chave PIX", type: "string", operator: "contains", defaultFlex: 1 },
        ...(permissaoGestaoEntidade
            ? [
                {
                    name: "actions",
                    header: "Ações",
                    defaultFlex: 1,
                    render: ({ data }: any) => (
                        <div className="flex space-x-2">
                            <Tooltip title="Editar">
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<HiOutlinePencil />}
                                    onClick={() => handleEditBanco(data)}
                                />
                            </Tooltip>
                            <Tooltip title="Excluir">
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<HiOutlineTrash />}
                                    onClick={() => handleDeleteContaBancaria(data)}
                                />
                            </Tooltip>
                        </div>
                    ),
                },
            ]
            : []),
    ];


    const columnsDiretoria = [
        { name: "cargo", header: "Cargo", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "nmcontato", header: "Nome", type: "string", operator: "contains", defaultFlex: 1.5 },
        { name: "dtiniciomandato", header: "Início Mandato", type: "date", operator: "contains", defaultFlex: 1 },
        { name: "dtfimmandato", header: "Término Mandato", type: "date", operator: "contains", defaultFlex: 1 },
        { name: "dsemail", header: "E-mail", type: "string", operator: "contains", defaultFlex: 1.5 },
        { name: "nucel", header: "Celular", type: "string", operator: "contains", defaultFlex: 1 },
        {
            name: "flativo",
            header: "Status",
            type: "string",
            operator: "contains",
            defaultFlex: 1,
            render: ({ value }: { value: string }) => (
                <span className={value === "S" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {value === "S" ? "Ativo" : "Inativo"}
                </span>
            ),
        },
        ...(permissaoGestaoEntidade
            ? [
                {
                    name: "actions",
                    header: "Ações",
                    defaultFlex: 1,
                    render: ({ data }: any) => (
                        <div className="flex space-x-2">
                            <Tooltip title="Editar">
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<HiOutlinePencil />}
                                    onClick={() => handleEditDiretoria(data)}
                                />
                            </Tooltip>
                            <Tooltip title="Excluir">
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<HiOutlineTrash />}
                                    onClick={() => handleDeleteContato(data)}
                                />
                            </Tooltip>
                        </div>
                    ),
                },
            ]
            : []),
    ];


    const [deleteContaModalOpen, setDeleteContaModalOpen] = useState(false);
    const [contaBancariaSelecionada, setContaBancariaSelecionada] = useState<any>(null);

    const handleDeleteContaBancaria = (conta: any) => {
        setContaBancariaSelecionada(conta);
        setDeleteContaModalOpen(true);
    };

    const confirmDeleteContaBancaria = async () => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${id}/dadosBancarios/${contaBancariaSelecionada.id}`,
                method: "delete",
            });
            setDeleteContaModalOpen(false);
            setContaBancariaSelecionada(null);
            setReload(prev => !prev);
        } catch (error) {
            console.error("Erro ao excluir conta bancária:", error);
        }
    };

    const [contatoSelecionado, setContatoSelecionado] = useState<any>(null);
    const [deleteContatoConfirmOpen, setDeleteContatoConfirmOpen] = useState(false);


    const handleDeleteContato = (contato: any) => {
        setContatoSelecionado(contato);
        setDeleteContatoConfirmOpen(true);
    };

    const confirmDeleteContato = async () => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${id}/diretoria/${contatoSelecionado.idcontato}`,
                method: "delete",
            });
            setDeleteContatoConfirmOpen(false);
            setContatoSelecionado(null);
            setReload(prev => !prev);
        } catch (error) {
            console.error("Erro ao excluir contato:", error);
        }
    };

    return (
        <Tabs value={abaInterna} onChange={(tabValue) => navigate(`/sistema/entidades/${id}/${tabValue}`)}>
            <TabList>
                <TabNav value="detalhes">Detalhes</TabNav>
                <TabNav value="dadosBancarios">Dados Bancários</TabNav>
                <TabNav value="anotacoes">Anotações</TabNav>
                <TabNav value="pendencias">Pendências</TabNav>
                <TabNav value="documentos">Documentos</TabNav>
                <TabNav value="diretoria">Diretoria & Contatos</TabNav>
            </TabList>

            <div className="p-4">

                <TabContent value="detalhes">
                    {/* DADOS GERAIS */}
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Dados Gerais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoBox icon={<HiUser />} label="Nome" value={data.nmrazao} color="orange" />
                            <InfoBox icon={<HiIdentification />} label="Sigla" value={data.sigla} color="amber" />
                            <InfoBox
                                icon={<HiClipboardCheck />}
                                label="CNPJ"
                                value={data.nucnpj ? data.nucnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : "-"}
                                color="blue"
                            />
                            <InfoBox
                                icon={<HiCalendar />}
                                label="Fundação"
                                value={data.dtfundacao ? dayjs(data.dtfundacao).format("DD/MM/YYYY") : "-"}
                                color="green"
                            />
                            <InfoBox
                                icon={<HiGlobe />}
                                label="Homepage"
                                value={
                                    data.dshomepage ? (
                                        <a href={data.dshomepage} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                            {data.dshomepage}
                                        </a>
                                    ) : "-"
                                }
                                color="indigo"
                            />
                            <InfoBox icon={<HiClipboardCheck />} label="Situação RFB" value={data.situacao || "-"} color="red" />
                        </div>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    {/* CONTATO */}
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Contato</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoBox icon={<HiMail />} label="Email" value={data.dsemail} color="blue" />
                            <InfoBox
                                icon={<HiPhone />}
                                label="Telefone"
                                value={data.nufone ? data.nufone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3") : "-"}
                                color="red"
                            />
                            <InfoBox
                                icon={<HiOfficeBuilding />}
                                label="CEP"
                                value={data.nucep ? String(data.nucep).replace(/^(\d{5})(\d{3})$/, "$1-$2") : "-"}
                                color="blue"
                            />
                            <InfoBox icon={<HiOfficeBuilding />} label="Endereço" value={data.dsendereco} color="gray" />
                            <InfoBox icon={<HiOfficeBuilding />} label="Número" value={data.nunumero} color="gray" />
                            <InfoBox icon={<HiOfficeBuilding />} label="Bairro" value={data.dsbairro} color="gray" />
                            <InfoBox
                                icon={<HiOfficeBuilding />}
                                label="Cidade / UF"
                                value={`${data.cidade?.nmcidade || "-"} - ${data.cidade?.iduf || ""}`}
                                color="gray"
                            />
                        </div>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    {/* GESTORES */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Gestores</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoBox icon={<HiUser />} label="Gestor" value={data.gestor?.nmusuario} color="red" />
                            <InfoBox
                                icon={<HiIdentification />}
                                label="CPF Gestor"
                                value={data.gestor?.nucpf ? data.gestor.nucpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") : "-"}
                                color="gray"
                            />
                            <InfoBox icon={<HiMail />} label="Email Gestor" value={data.gestor?.dsemail} color="blue" />
                        </div>
                    </div>
                </TabContent>


                <TabContent value="dadosBancarios">

                    <AdaptableCard className="h-full" bodyClass="h-full">
                        <div className="flex items-center justify-between my-2">
                            <h3 className="mb-4 lg:mb-0">Dados Bancários</h3>
                            {permissaoGestaoEntidade &&
                                <Button variant="solid" size="sm" icon={<HiPlusCircle />} onClick={() => setBancoModalOpen(true)}>
                                    Adicionar Conta Bancária
                                </Button>
                            }
                        </div>
                        <CustomReactDataGrid
                            filename={`Contas Bancárias - ${data.nmrazao}`}
                            columns={columnsBanco}
                            url={`${import.meta.env.VITE_API_URL}/entidades/${data.idassociacao}/dadosBancarios?reload=${reload}`}
                            CardLayout={AdicionarContato}
                        />
                    </AdaptableCard>
                </TabContent>

                <TabContent value="diretoria">
                    <AdaptableCard className="h-full" bodyClass="h-full">
                        <div className="flex items-center justify-between my-2">
                            <h3 className="mb-4 lg:mb-0">Diretoria e Contatos</h3>
                            {permissaoGestaoEntidade &&
                                <Button variant="solid" size="sm" icon={<HiPlusCircle />} onClick={() => setDiretoriaModalOpen(true)}>
                                    Adicionar Contato
                                </Button>
                            }
                        </div>
                        <CustomReactDataGrid
                            filename="Diretoria e Contatos"
                            columns={columnsDiretoria}
                            url={`${import.meta.env.VITE_API_URL}/entidades/${data.idassociacao}/diretoria?reload=${reload}`}
                        />
                    </AdaptableCard>
                </TabContent>

                <TabContent value="anotacoes">
                    <AnotacoesComponent idVinculo={data.idassociacao} tipoVinculo="entidade" temAnexos={true} />
                </TabContent>

                <TabContent value="documentos">
                    <AnexosComponent url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`} idVinculo={data.idassociacao} tipoVinculo="entidade" />
                </TabContent>

                <TabContent value="pendencias">
                    <PendenciasComponent idVinculo={data.idassociacao} tipoVinculo="entidade" temBloqueio={true} temAnexos={true} />
                </TabContent>
            </div>

            <AdicionarDadosBancarios
                isOpen={isBancoModalOpen}
                onClose={() => setBancoModalOpen(false)}
                onConfirm={() => setReload(prev => !prev)}
                initialData={editBancoData}
                entidadeId={data.idassociacao}
            />

            <AdicionarContato
                isOpen={isDiretoriaModalOpen}
                onClose={() => setDiretoriaModalOpen(false)}
                onConfirm={() => setReload(prev => !prev)}
                initialData={editDiretoriaData}
                entidadeId={data.idassociacao}
            />

            <Dialog isOpen={deleteContaModalOpen} onClose={() => setDeleteContaModalOpen(false)}>
                <div>
                    <h4>Remover Conta Bancária</h4>
                    <p className="mt-4">
                        Tem certeza que deseja remover a conta <strong>{contaBancariaSelecionada?.apelido}</strong>?
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="default" onClick={() => setDeleteContaModalOpen(false)}>Cancelar</Button>
                        <Button variant="solid" onClick={confirmDeleteContaBancaria}>Remover</Button>
                    </div>
                </div>
            </Dialog>


            <Dialog isOpen={deleteContatoConfirmOpen} onClose={() => setDeleteContatoConfirmOpen(false)}>
                <div>
                    <h4>Remover Contato</h4>
                    <p className="mt-4">
                        Tem certeza que deseja remover o contato <strong>{contatoSelecionado?.nmcontato}</strong>?
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="default" onClick={() => setDeleteContatoConfirmOpen(false)}>Cancelar</Button>
                        <Button variant="solid" onClick={confirmDeleteContato}>Remover</Button>
                    </div>
                </div>
            </Dialog>
        </Tabs>
    );
};

export default Detalhes;
