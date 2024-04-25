import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { FcFile } from 'react-icons/fc'

const Pesquisa = () => {
    return (
        <div className="flex flex-col items-center">
        {/* LOGOS DAS EMPRESAS */}
        <div className="flex justify-center items-center space-x-4 mt-10">
        <div className="max-w-7xl pb-5 px-6">
            <div className="grid grid-cols-2 gap-8">
                <div className="col-span-1 flex justify-center">
                    <img className="img object-contain h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
                </div>
                <div className="col-span-1 flex justify-center">
                    <img className="img object-contain h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
                </div>
            </div>
            </div>
        </div>
        <h1 className="text-2xl font-bold mb-20 mt-8">Documentos da Pesquisa</h1>
            
        <div className="container mx-auto">
        <div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 1: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable   beforeUpload={(newFiles) => {
                        if (newFiles && newFiles.length > 0) {
                        for (const file of newFiles) {
                            if (!file.name.toLowerCase().endsWith('.pdf')) {
                            return 'Por favor, selecione apenas arquivos no formato PDF.'
                            }
                        }
                        }
                        return true;
                    }}>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 2: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable accept='.pdf'>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 3: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable accept='.pdf'>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 4: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable accept='.pdf'>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 5: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable accept='.pdf'>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 6: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable accept='.pdf'>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Documento 7: clique aqui para fazer o download</h2>
            </div>
            <div>
                <Upload draggable accept='.pdf'>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcFile />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o documento assinado, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Formato: .pdf
                        </p>
                    </div>
                </Upload>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />} className='mb-20'>
                        Enviar documento
                    </Button>
            </div>
        </div>
    </div>
    </div>

    )
}

export default Pesquisa

