import Tag from '@/components/ui/Tag';
import { Link } from 'react-router-dom';
import moment from 'moment';

export const AnotacaoCard = ({ data }: any) => {
    const situacaoColors: any = {
        ec: 'bg-blue-600',
        di: 'bg-green-600',
    };

    return (
        <Link
            to={`${import.meta.env.VITE_PHP_URL}/sistema/anotacao/detalhe/aid/${btoa(String(data.id))}`}
        >
            <div className="w-full flex justify-between items-center">
                <h5 className="text-lg font-semibold">{data.descricao}</h5>
                <Tag className={`${situacaoColors[data.situacao] || 'bg-gray-500'} text-white border-0 rounded`}>
                    {data.situacao === 'ec' ? 'Em Cadastramento' : 'Divulgada'}
                </Tag>            
            </div>

            <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-500 text-sm">Privacidade:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${data.privacidade === 'pr' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {data.privacidade === 'pr' ? 'Privado' : data.privacidade === 'ep' ? 'Empresários' : 'Público'}
                </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
                {data.nmusuario || 'Desconhecido'}
            </p>

            <p className="text-xs text-gray-500">
                {moment(data.data_inclusao).format('DD/MM/YYYY HH:mm')}
            </p>
        </Link>
    );
};
