import { useState, useEffect } from 'react';
import { Associacao } from '@/@types/generalTypes';
import Tabs from '@/components/ui/Tabs';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { noEmpty } from '@/utils/noEmpty';
import dayjs from 'dayjs';
import AnotacoesComponent from '../../anotacao/AnotacoesComponent';
import AnexosComponent from '../../anexos/AnexosComponent';
import PendenciasComponent from '../../pendencias/PendenciasComponent';
import { Button, Tooltip } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi';
import AdicionarDadosBancarios from './components/AdicionarDadosBancarios';
import AdicionarContato from './components/AdicionarContato';

const { TabNav, TabList, TabContent } = Tabs;

type DataProps = {
    data: Associacao;
};

const Detalhes = ({ data }: DataProps) => {
    const [reload, setReload] = useState(false);

    const [isBancoModalOpen, setBancoModalOpen] = useState(false);
    const [isDiretoriaModalOpen, setDiretoriaModalOpen] = useState(false);
    const [editBancoData, setEditBancoData] = useState(null);
    const [editDiretoriaData, setEditDiretoriaData] = useState(null);

    useEffect(() => {}, [reload]);

    const handleEditBanco = (rowData: any) => {
        setEditBancoData(rowData);
        setBancoModalOpen(true);
    };

    const handleEditDiretoria = (rowData: any) => {
        setEditDiretoriaData(rowData);
        setDiretoriaModalOpen(true);
    };

    const columnsBanco = [
        { name: "apelido", header: "Apelido", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "dsbanco", header: "Banco", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "dsagencia", header: "Agência", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "dsconta", header: "Conta", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "pix_tipo", header: "Tipo PIX", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "pix_chave", header: "Chave PIX", type: "string", operator: "contains", defaultFlex: 1 },
        {
            name: "actions",
            header: "Ações",
            defaultFlex: 1,
            render: ({ data }: any) => (
                <div className="flex space-x-2">
                    <Tooltip title="Editar">
                        <Button variant="solid" size="xs" icon={<HiOutlinePencil />} onClick={() => handleEditBanco(data)} />
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <Button variant="solid" size="xs" icon={<HiOutlineTrash />} onClick={() => console.log(`Excluir banco ID: ${data.id}`)} />
                    </Tooltip>
                </div>
            ),
        },
    ];

    const columnsDiretoria = [
        { name: "cargo", header: "Cargo", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "nmcontato", header: "Nome", type: "string", operator: "contains", defaultFlex: 1.5 },
        { name: "dtiniciomandato", header: "Início Mandato", type: "date", operator: "contains", defaultFlex: 1 },
        { name: "dtfimmandato", header: "Término Mandato", type: "date", operator: "contains", defaultFlex: 1 },
        { name: "dsemail", header: "E-mail", type: "string", operator: "contains", defaultFlex: 1.5 },
        { name: "nucel", header: "Celular", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "flativo", header: "Status", type: "string", operator: "contains", defaultFlex: 1 },
        {
            name: "actions",
            header: "Ações",
            defaultFlex: 1,
            render: ({ data }: any) => (
                <div className="flex space-x-2">
                    <Tooltip title="Editar">
                        <Button variant="solid" size="xs" icon={<HiOutlinePencil />} onClick={() => handleEditDiretoria(data)} />
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <Button variant="solid" size="xs" icon={<HiOutlineTrash />} onClick={() => console.log(`Excluir contato ID: ${data.idcontato}`)} />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <Tabs defaultValue="detalhes">
            <TabList>
                <TabNav value="detalhes">Detalhes</TabNav>
                <TabNav value="dadosBancarios">Dados Bancários</TabNav>
                <TabNav value="anotacoes">Anotações</TabNav>
                <TabNav value="pendencias">Pendências</TabNav>
                <TabNav value="documentos">Documentos</TabNav>
                <TabNav value="diretoria">Diretoria & Contatos</TabNav>
            </TabList>

            <div className="p-4">
                <TabContent value="dadosBancarios">
                    <div className="flex justify-end mb-2">
                        <Button variant="solid" size="sm" icon={<HiPlusCircle />} onClick={() => setBancoModalOpen(true)}>
                            Adicionar Conta Bancária
                        </Button>
                    </div>
                    <CustomReactDataGrid
                        filename={`Contas Bancárias - ${data.nmrazao}`}
                        columns={columnsBanco}
                        url={`${import.meta.env.VITE_API_URL}/entidades/${data.idassociacao}/dadosBancarios`}
                    />
                </TabContent>

                <TabContent value="diretoria">
                    <div className="flex justify-end mb-2">
                        <Button variant="solid" size="sm" icon={<HiPlusCircle />} onClick={() => setDiretoriaModalOpen(true)}>
                            Adicionar Contato
                        </Button>
                    </div>
                    <CustomReactDataGrid
                        filename="Diretoria e Contatos"
                        columns={columnsDiretoria}
                        url={`${import.meta.env.VITE_API_URL}/entidades/${data.idassociacao}/diretoria?reload=${reload}`}
                    />
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
        </Tabs>
    );
};

export default Detalhes;
