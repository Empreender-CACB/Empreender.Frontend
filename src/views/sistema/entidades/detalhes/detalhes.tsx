import { Associacao } from '@/@types/generalTypes';
import Tabs from '@/components/ui/Tabs';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { noEmpty } from '@/utils/noEmpty';
import dayjs from 'dayjs';
import AnotacoesComponent from '../../anotacao/AnotacoesComponent';
import AnexosComponent from '../../anexos/AnexosComponent';
import PendenciasComponent from '../../pendencias/PendenciasComponent';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { useEffect, useState } from 'react';

const { TabNav, TabList, TabContent } = Tabs;

type DataProps = {
    data: Associacao;
};

const columnsBanco = [
    { name: "apelido", header: "Apelido", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "dsbanco", header: "Banco", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "dsagencia", header: "Agência", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "dsconta", header: "Conta", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "pix_tipo", header: "Tipo PIX", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "pix_chave", header: "Chave PIX", type: "string", operator: "contains", defaultFlex: 1 },
];

const DiretoriaActions = ({ data, onUpdate }: { data: any; onUpdate?: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        console.log(`Excluindo contato ID: ${data.idcontato}`);
        setIsModalOpen(false);
        onUpdate?.();
    };

    return (
        <div className="flex space-x-2">
            <Tooltip title="Editar">
                <Button variant="solid" size="xs" icon={<HiOutlinePencil />} onClick={() => console.log('Editar', data)} />
            </Tooltip>

            <Tooltip title="Excluir">
                <Button variant="solid" size="xs" icon={<HiOutlineTrash />} onClick={() => setIsModalOpen(true)} />
            </Tooltip>

            <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>Tem certeza que deseja excluir o contato <strong>{data.nmcontato}</strong>?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button variant="solid" onClick={handleDelete}>Excluir</Button>
                </div>
            </Dialog>
        </div>
    );
};

const Detalhes = ({ data }: DataProps) => {
    const details = [
        { label: 'Nome', value: noEmpty(data.nmrazao) },
        { label: 'Sigla', value: noEmpty(data.sigla) },
        { label: 'ID tipo Entidade', value: noEmpty(data.id_tipo_entidade) },
        { label: 'CNPJ', value: noEmpty(data.nucnpj) },
        { label: 'Email', value: noEmpty(data.dsemail) },
        { label: 'Fundação', value: noEmpty(dayjs(data.dtfundacao).format('DD/MM/YYYY')) },
        { label: 'Endereço', value: noEmpty(data.dsendereco) },
        { label: 'Número', value: noEmpty(data.nunumero) },
        { label: 'Bairro', value: noEmpty(data.dsbairro) },
        {
            label: 'Cidade / UF',
            value: `${noEmpty(data.cidade?.nmcidade)} - ${noEmpty(data.cidade?.iduf)}`
        },
        { label: 'CEP', value: noEmpty(data.nucep) },
        { label: 'Telefone', value: noEmpty(data.nufone) },
        { label: 'Gestor', value: noEmpty(data.gestor?.nmusuario) },
        { label: 'Gestor - CPF', value: noEmpty(data.gestor?.nucpf) },
        { label: 'Gestor - E-mail', value: noEmpty(data.gestor?.dsemail) },
        { label: 'Situação RFB', value: noEmpty(data.situacao) },
        {
            label: 'Última Alteração',
            value: noEmpty(dayjs(data.data_alteracao).format('DD/MM/YYYY')),
        },
        { label: 'Status', value: data.flativo === 'S' ? 'Ativo' : 'Inativo' },
        { label: 'Homepage', value: noEmpty(data.dshomepage) },
    ];

    const columnsDiretoria = [
        { name: "cargo", header: "Cargo", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "nmcontato", header: "Nome", type: "string", operator: "contains", defaultFlex: 1.5 },
        { name: "dtiniciomandato", header: "Início Mandato", type: "date", operator: "contains", defaultFlex: 1 },
        { name: "dtfimmandato", header: "Término Mandato", type: "date", operator: "contains", defaultFlex: 1 },
        { name: "dsemail", header: "E-mail", type: "string", operator: "contains", defaultFlex: 1.5 },
        { name: "nucel", header: "Celular", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "flativo", header: "Status", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "sexo", header: "Sexo", type: "string", operator: "contains", defaultFlex: 1 },
        { name: "nascimento", header: "Nascimento", type: "date", operator: "contains", defaultFlex: 1 },
        {
            name: "actions",
            header: "Ações",
            defaultFlex: 1,
            columnName: "actions",
            render: ({ data }: any) => <DiretoriaActions data={data} onUpdate={() => setReload(prev => !prev)} />,
        },
    ];

    const [reload, setReload] = useState(false);

    useEffect(() => {
    }, [reload]);

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

                <TabContent value="detalhes">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                        {details.map(({ label, value }, index) => (
                            <div className="sm:col-span-1" key={index}>
                                <dt className="text-sm font-extrabold text-black dark:text-white">{label}</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </TabContent>

                <TabContent value="dadosBancarios">
                    <CustomReactDataGrid
                        filename={`Contas Bancárias - ${data.nmrazao}`}
                        columns={columnsBanco}
                        url={`${import.meta.env.VITE_API_URL}/entidades/${data.idassociacao}/dadosBancarios`}
                    />
                </TabContent>

                <TabContent value="anotacoes">
                    <AnotacoesComponent
                        idVinculo={data.idassociacao}
                        tipoVinculo="entidade"
                        temAnexos={true}
                    />
                </TabContent>

                <TabContent value="documentos">
                    <AnexosComponent
                        url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`}
                        idVinculo={data.idassociacao}
                        tipoVinculo="entidade"
                    />
                </TabContent>

                <TabContent value="pendencias">
                    <PendenciasComponent
                        idVinculo={data.idassociacao}
                        tipoVinculo="entidade"
                        temBloqueio={true}
                        temAnexos={true}
                    />
                </TabContent>

                <TabContent value="diretoria">
                    <CustomReactDataGrid
                        filename="Diretoria e Contatos"
                        columns={columnsDiretoria}
                        url={`${import.meta.env.VITE_API_URL}/entidades/${data.idassociacao}/diretoria?reload=${reload}`}
                    />
                </TabContent>
            </div>
        </Tabs>
    );
};

export default Detalhes;
