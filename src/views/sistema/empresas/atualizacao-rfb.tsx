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
            { name: 'Atualização da Empresa', status: 'Pendente' },
            { name: 'Atualização do Simples', status: 'Pendente' },
            { name: 'Atualização dos Contatos (Empresas)',  status: 'Pendente' },
            { name: 'Atualização dos Contatos (Entidades)',  status: 'Pendente' },
            { name: 'Atualização do Estabelecimento (Empresas)', status: 'Pendente' },
            { name: 'Atualização do Estabelecimento (Entidades)', status: 'Pendente' },
        ]
    )

    const scripts = [
        { name: 'Atualização da Empresa', script: 'update_empresas.py' },
        { name: 'Atualização do Simples', script: 'update_simples.py' },
        { name: 'Atualização dos Contatos (Empresas)', script: 'update_contatos.py' },
        { name: 'Atualização dos Contatos (Entidades)', script: 'update_contatos_ent.py' },
        { name: 'Atualização do Estabelecimento (Empresas)', script: 'update_estabelecimento.py' },
        { name: 'Atualização do Estabelecimento (Entidades)', script: 'update_estabelecimento_ent.py' },
    ]

    const downloadLog = (logContent: string, scriptName: string) => {
        const today = new Date()

        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0')
        const hours = today.getHours().toString().padStart(2, '0')
        const minutes = today.getMinutes().toString().padStart(2, '0')
        const seconds = today.getSeconds().toString().padStart(2, '0')
        
        const formattedDate = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`
        
        const cleanContent = logContent
        .replace(/\\/g, "")
        .replace(/{"output":"/g,"")
        .replace(/"}/,"")

        scriptName = scriptName.slice(0, -3)
      
        const fileName = `log_${scriptName}_${formattedDate}.json`
      
        const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

    const iniciarAtualizacaoParcial = async () => {
        setIsRunning(true)
        setErrorMessage(null)

        for (let i = 0; i < scripts.length; i++) {
            const { script } = scripts[i]
            const endpoint = `/rfb/execute-update/${script}/partial`
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

    const iniciarAtualizacaoCompleta = async () => {
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
                        onClick={iniciarAtualizacaoParcial}
                        disabled={isRunning}
                    >
                        {isRunning ? 'Executando...' : 'Atualização Parcial'}
                    </Button>
                    <Button
                        onClick={iniciarAtualizacaoCompleta}
                        disabled={isRunning}
                        variant='solid'
                    >
                        {isRunning ? 'Executando...' : 'Atualização Completa'}
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
