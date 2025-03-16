import { Associacao } from '@/@types/generalTypes';
import Tabs from '@/components/ui/Tabs';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { noEmpty } from '@/utils/noEmpty';
import dayjs from 'dayjs';

const { TabNav, TabList, TabContent } = Tabs;

type DataProps = {
    data: Associacao;
};

const columnsBanco = [
    { name: "apelido", header: "Apelido", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "idbanco", header: "Banco", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "pix_tipo", header: "Tipo PIX", type: "string", operator: "contains", defaultFlex: 1 },
    { name: "pix_chave", header: "Chave PIX", type: "string", operator: "contains", defaultFlex: 1 },
];

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
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                            {details.map(({ label, value }, index) => (
                                <div className="sm:col-span-1" key={index}>
                                    <dt className="text-sm font-extrabold text-black dark:text-white">{label}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </TabContent>

                <TabContent value="dadosBancarios">
                    <CustomReactDataGrid
                        filename={`Contas Bancárias - ${data.nmrazao}`}
                        columns={columnsBanco}
                        url={`${import.meta.env.VITE_API_URL}/entidades/accounts/${data.idassociacao}`}
                    />
                </TabContent>

                <TabContent value="anotacoes">
                    <p>Aqui ficarão as anotações da entidade.</p>
                </TabContent>

                <TabContent value="pendencias">
                    <p>Listagem de pendências relacionadas à entidade.</p>
                </TabContent>

                <TabContent value="documentos">
                    <p>Listagem de documentos associados à entidade.</p>
                </TabContent>

                <TabContent value="diretoria">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">Nome</th>
                                <th className="border px-2 py-1">E-mail</th>
                                <th className="border px-2 py-1">Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {data.gestores?.length ? (
                                    data.gestores.map((gestor, index) => (
                                        <tr key={index}>
                                            <td className="border px-2 py-1">{gestor.nome}</td>
                                            <td className="border px-2 py-1">{gestor.dsemail}</td>
                                            <td className="border px-2 py-1">{gestor.nufone}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="border px-2 py-1 text-center">Nenhum contato cadastrado</td>
                                    </tr>
                                )} */}
                        </tbody>
                    </table>
                </TabContent>
            </div>
        </Tabs>
    );
};

export default Detalhes;
