import { Tag } from '@/components/ui';
import moment from 'moment';

const statusOptions = [
    { name: 'Não Resolvido', value: 'nr', color: 'bg-red-600' },
    { name: 'Resolvido', value: 're', color: 'bg-green-600' },
];

export const PendenciaCard = ({ data, openModal }: { data: any; openModal: (id: number) => void }) => {
    const status = statusOptions.find(option => option.value === data.status) || { name: data.status, color: 'bg-gray-500' };

    return (
        <div
            onClick={() => openModal(data.id)}
            className="cursor-pointer border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
        >
            <div className="w-full flex justify-between items-center">
                <h5 className="text-lg font-semibold text-gray-800">{data.titulo.length > 50 ? `${data.titulo.substring(0, 50)}...` : data.titulo}</h5>
                <Tag className={`text-white ${status.color} border-0 rounded px-2 py-1 text-sm`}>
                    {status.name}
                </Tag>
            </div>

            <div className="mt-2 text-sm text-gray-600">
                <p>
                    <strong>Autor:</strong> {data.nmusuario || '-'}
                </p>
                <p>
                    <strong>Criação:</strong>{' '}
                    {moment(data.data_inclusao).isValid()
                        ? moment(data.data_inclusao).format('DD-MM-YYYY')
                        : '-'}
                </p>
                <p>
                    <strong>Data Prevista:</strong>{' '}
                    {moment(data.data_prevista).isValid()
                        ? moment(data.data_prevista).format('DD-MM-YYYY')
                        : '-'}
                </p>
            </div>
        </div>
    );
};
