import Button from '@/components/ui/Button';
import classNames from 'classnames';
import { AiOutlineDownload } from 'react-icons/ai';

interface Anexo {
  id: number;
  nome_arquivo: string;
  tipo_id: number;
  status: string;
  url?: string;
}

interface FileListProps {
  anexos: Anexo[];
}

const FileList = ({ anexos }: FileListProps) => {
  const getTipoNome = (tipo_id: number) => {
    switch (tipo_id) {
      case 1:
        return 'Documento Pessoal';
      case 2:
        return 'Documento Empresarial';
      case 3:
        return 'Contrato';
      default:
        return 'Outro';
    }
  };

  return (
    <>
      {anexos.length > 0 && (
        <div>
          <h6 className="mb-4">Arquivos</h6>
          <div className="rounded-lg border border-gray-200 dark:border-gray-600">
            {anexos.map((anexo, index) => (
              <div
                key={anexo.id}
                className={classNames(
                  'flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4',
                  index !== anexos.length - 1 &&
                    'border-b border-gray-200 dark:border-gray-600',
                )}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-gray-900 dark:text-gray-100 font-semibold">
                      {anexo.nome_arquivo}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tipo: {getTipoNome(anexo.tipo_id)}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <Button
                    className="mr-2 rtl:ml-2"
                    variant="solid"
                    size="sm"
                    icon={<AiOutlineDownload />}
                    color="blue-800"
                    onClick={() => {
                      if (anexo.url) {
                        window.open(anexo.url, '_blank');
                      } else {
                        window.open(`${import.meta.env.VITE_API_URL}/anexo/${anexo.id}/download`, '_blank'); 
                      }
                    }}
                  >
                    Visualizar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FileList;