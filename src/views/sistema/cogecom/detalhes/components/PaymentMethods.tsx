import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import classNames from 'classnames'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'

const mockFiles = [
    {
        nomeOriginal: 'Carteira_RG.jpg',
        tipo: 'RG',
        status: 'aprovado',
    },
    {
        nomeOriginal: 'Documento_CNPJ.pdf',
        tipo: 'CNPJ',
        status: 'pendente', // Status pode ser 'pendente', 'aprovado' ou 'recusado'
    },
    {
        nomeOriginal: 'Contrato_Social.docx',
        tipo: 'Contrato Social',
        status: 'pendente',
    },

]

const FileList = () => {
    const handleApprove = (file) => {
        console.log('Arquivo aprovado:', file.nomeOriginal)
        // Lógica para aprovar o arquivo
    }

    const handleReject = (file) => {
        console.log('Arquivo recusado:', file.nomeOriginal)
        // Lógica para recusar o arquivo
    }

    return (
        <>
            {mockFiles.length > 0 && (
                <div>
                    <h6 className="mb-4 ">Arquivos</h6>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                        {mockFiles.map((file, index) => (
                            <div
                                key={file.nomeOriginal}
                                className={classNames(
                                    'flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4',
                                    index !== mockFiles.length - 1 &&
                                        'border-b border-gray-200 dark:border-gray-600',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                            {file.nomeOriginal}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Tipo: {file.tipo}
                                        </span>
                                    </div>
                                    {file.status === 'aprovado' && (
                                        <Tag className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 rounded-md border-0 mx-2">
                                            <span className="capitalize"> Aprovado </span>
                                        </Tag>
                                    )}
                                    {file.status === 'recusado' && (
                                        <Tag className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 rounded-md border-0 mx-2">
                                            <span className="capitalize"> Recusado </span>
                                        </Tag>
                                    )}
                                </div>
                                <div className="flex">
                                    <Button
                                        className="mr-2 rtl:ml-2"
                                        variant="solid"
                                        size="sm"
                                        icon={<AiOutlineCheck />}
                                        color='green-800'
                                        onClick={() => handleApprove(file)}
                                        disabled={file.status !== 'pendente'}
                                    >
                                        Aprovar
                                    </Button>
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        color='red-800'
                                        icon={<AiOutlineClose />}
                                        onClick={() => handleReject(file)}
                                        disabled={file.status !== 'pendente'}
                                    >
                                        Recusar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default FileList