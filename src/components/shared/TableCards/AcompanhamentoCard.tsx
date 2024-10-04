import { Tag } from "@/components/ui";
import { TarefaStatusTag } from "@/views/sistema/representatividade/acompanhamento";
import moment from "moment";

export const AcompanhamentoCard = ({ data }: any) => {
    return (
        <div>
            <div className="flex justify-between items-center">
                <h5 className="text-lg font-semibold">{data['marcos_criticos.nome']}</h5>
                <TarefaStatusTag statusKey={data.status} />
            </div>
            <div className="text-gray-500 text-sm">
                <p><strong>Entidade:</strong> {data.sigla}</p>
                <p><strong>Nova Data Prevista:</strong> {data.nova_data_prevista ? moment(data.nova_data_prevista).format('DD-MM-YYYY') : '-'}</p>
                <p><strong>Data de Término:</strong> {data.data_encerramento ? moment(data.data_encerramento).format('DD-MM-YYYY') : '-'}</p>
            </div>
            <div className="mt-4">
                <div className="mr-2 rtl:ml-2">
                    <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                        Para visualizar as ações, utilize o modo de tabela normal.
                    </Tag>
                </div>
            </div>
        </div>
    );
};
