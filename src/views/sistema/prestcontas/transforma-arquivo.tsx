import { useState } from 'react'
import { Button } from '@/components/ui'
import { Container } from '@/components/shared'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { SiGooglesheets } from 'react-icons/si'
import ApiService from '@/services/ApiService'

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
            const response = await ApiService.fetchData({
                url: '/prestcontas/process-excel',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', 
            })
    
            if (response.status !== 200) {
                throw new Error('Erro ao processar o arquivo')
            }
    
            const blob = response.data
            const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '')
            const fileName = `arquivo_transformado_${timestamp}.csv`
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error: any) {
            console.error('Erro ao processar o arquivo:', error)
            
            if (error.response && error.response.data) {
                try {
                    const reader = new FileReader()
                    reader.onload = () => {
                        const errorMsg = JSON.parse(reader.result as string).error || 'Erro desconhecido'
                        alert(errorMsg)
                    }
                    reader.readAsText(error.response.data)
                } catch (parseError) {
                    alert('Erro ao processar o arquivo.')
                }
            } else {
                alert('Erro ao processar o arquivo.')
            }
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
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                        <div className="text-6xl mb-4 flex justify-center">
                            <SiGooglesheets />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Clique aqui para{' '}
                            </span>
                            <span className="text-blue-500">buscar</span>
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
