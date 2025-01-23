import { Button } from '@/components/ui'
import { useState } from 'react'
import { Container } from '@/components/shared'
import ApiService from '@/services/ApiService'
import Badge from '@/components/ui/Badge'

const AtualizarEmpresas = () => {
    const [isRunning, setIsRunning] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [progress, setProgress] = useState(
        [
            { name: 'Atualização da Tabela rfb_simples', status: 'Pendente' },
            { name: 'Atualização da Tabela rfb_empresa', status: 'Pendente' },
            { name: 'Atualização da Tabela rfb_socios',  status: 'Pendente' },
            { name: 'Atualização da Tabela rfb_estabelecimento', status: 'Pendente' },
        ]
    )

    const scripts = [
        { name: 'Atualização da Tabela rfb_simples', script: 'update_tbl_simples.py' },
        { name: 'Atualização da Tabela rfb_empresa', script: 'update_tbl_empresa.py' },
        { name: 'Atualização da Tabela rfb_socios', script: 'update_tbl_socio.py' },
        { name: 'Atualização da Tabela rfb_estabelecimento', script: 'update_tbl_estabelecimento.py' },
    ]

    const downloadLog = (logContent: string, scriptName: string) => {
        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `log_${scriptName}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const iniciarAtualizacao = async () => {
        setIsRunning(true)
        setErrorMessage(null)

        for (let i = 0; i < scripts.length; i++) {
            const { script } = scripts[i]
            const endpoint = `/rfb/execute-update/${script}/full`
            try {
                setProgress((prev) => {
                    const updated = [...prev]
                    updated[i].status = 'Em andamento'
                    return updated
                })

                const response = await ApiService.fetchData({
                    url: endpoint,
                    method: 'get',
                    timeout: 60000000
                })

                if (response.data && typeof response.data === 'object') {
                    let logContent = JSON.stringify(response.data)
                    logContent = logContent.replace(/\\n/g, '\n')
                    downloadLog(logContent, script)

                    setProgress((prev) => {
                        const updated = [...prev]
                        updated[i].status = 'Concluído'
                        return updated
                    })
                } else {
                    console.error('Erro: A resposta não contém uma string ou objeto JSON válido.')
                    setErrorMessage('Erro ao processar o log.')
                    setProgress((prev) => {
                        const updated = [...prev]
                        updated[i].status = 'Erro'
                        return updated
                    })
                }
            } catch (error) {
                console.error('Erro ao executar a atualização:', error)
                setErrorMessage(`Erro ao processar o endpoint ${endpoint}`)
                setProgress((prev) => {
                    const updated = [...prev]
                    updated[i].status = 'Erro'
                    return updated
                })
            }
        }

        setIsRunning(false)
    }

    const getBadgeProps = (status: string) => {
        switch (status) {
            case 'Pendente':
                return { content: status, innerClass: 'bg-gray-300 text-gray-600' }
            case 'Em andamento':
                return { content: status, innerClass: 'bg-blue-500 text-white' }
            case 'Concluído':
                return { content: status, innerClass: 'bg-emerald-500 text-white' }
            case 'Erro':
                return { content: status, innerClass: 'bg-red-500 text-white' }
            default:
                return { content: 'Desconhecido', innerClass: 'bg-gray-300 text-gray-600' }
        }
    }

    return (
        <Container className="flex items-center justify-center my-8">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
                <h2 className="text-lg font-bold mb-4">Atualizar Empresas</h2>
                <div className="space-y-4">
                    {progress.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="font-medium">{item.name}</span>
                            <Badge
                                {...getBadgeProps(item.status)}
                                className="ml-4"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between space-x-4 mt-4">
                    <Button
                        variant="default"
                        onClick={iniciarAtualizacao}
                        disabled={isRunning}
                    >
                        {isRunning ? 'Executando...' : 'Atualização'}
                    </Button>
                </div>
                {errorMessage && (
                    <div className="text-red-600 mt-4">{errorMessage}</div>
                )}
            </div>
        </Container>
    )
}

export default AtualizarEmpresas
