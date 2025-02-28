import { useState } from 'react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { SiMicrosoftexcel } from 'react-icons/si'

const TransformaArquivo = () => {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor, selecione um arquivo.')
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('input_file', file)
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/prestcontas/process-excel`, {
                method: 'POST',
                body: formData,
            })
    
            if (!response.ok) {
                throw new Error('Erro ao processar o arquivo')
            }
    
            const blob = await response.blob()
            const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '')
            const fileName = `arquivo_transformado_${timestamp}.xlsx`    
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Erro ao processar o arquivo:', error)
            alert('Erro ao processar o arquivo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="flex items-center justify-center my-8">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-lg font-bold text-center mb-4">
                    Transformação de Arquivo
                </h2>

                <div className="my-12 text-center">
                    <label className="cursor-pointer">
                        <input type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />
                        <div className="text-6xl mb-4 flex justify-center">
                            <SiMicrosoftexcel />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Arraste o arquivo, ou{' '}
                            </span>
                            <span className="text-blue-500">busque</span>
                        </p>
                    </label>
                    {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                </div>

                <div className="flex justify-center mb-6">
                    <Button
                        variant="solid"
                        icon={<HiOutlineCloudUpload />}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : 'TRANSFORMAR'}
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default TransformaArquivo
