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

      const iniciarAtualizacao = async (tipo: string) => {
        setIsRunning(true)
        setErrorMessage(null)
    
        const endpoint = `/rfb/execute-update`
        const scriptsList = scripts.map(script => script.script)
        try {
            setProgress(prev => prev.map(item => ({ ...item, status: 'Em andamento' })))
    
            const response = await ApiService.fetchData({
                url: endpoint,
                method: 'post',
                data: { scripts: scriptsList, tipo },
                timeout: 60000000,
            })
    
            if (response.data && response.data.output) {
                const outputData = response.data.output
                for (const scriptName of Object.keys(outputData)) {
                    downloadLog(outputData[scriptName], scriptName)
                }
    
                setProgress(prev => prev.map(item => ({ ...item, status: 'Concluído' })))
            } else {
                console.error('Erro: A resposta não contém um JSON válido.')
                setErrorMessage('Erro ao processar o log.')
                setProgress(prev => prev.map(item => ({ ...item, status: 'Erro' })))
            }
        } catch (error) {
            console.error('Erro ao executar a atualização:', error)
            setErrorMessage('Erro ao processar a atualização.')
            setProgress(prev => prev.map(item => ({ ...item, status: 'Erro' })))
        }
    
        setIsRunning(false)
    }
    
    const iniciarAtualizacaoParcial = () => iniciarAtualizacao('partial')
    const iniciarAtualizacaoCompleta = () => iniciarAtualizacao('full')

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
