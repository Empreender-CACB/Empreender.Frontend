import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'
import { Container } from '@/components/shared'
import ApiService from '@/services/ApiService'
import Badge from '@/components/ui/Badge'

const scripts = [
    { name: 'Atualização da Empresa', script: 'update_empresas.py' },
    { name: 'Atualização do Simples', script: 'update_simples.py' },
    { name: 'Atualização dos Contatos (Empresas)', script: 'update_contatos_emp.py' },
    { name: 'Atualização dos Contatos (Entidades)', script: 'update_contatos_ent.py' },
    { name: 'Atualização do Estabelecimento (Empresas)', script: 'update_estabelecimento_emp.py' },
    { name: 'Atualização do Estabelecimento (Entidades)', script: 'update_estabelecimento_ent.py' },
]

const AtualizarEmpresas = () => {
    const [isRunning, setIsRunning] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [progress, setProgress] = useState(
        scripts.map(({ name }) => ({ name, status: 'Pendente' }))
    )

    const monitorarAtualizacao = async () => {
        try {
            const response = await ApiService.fetchData({ url: '/rfb/verifica-att', method: 'get' })
            const { atAndamento, ultimaAtualizacao } = response.data
    
            atualizarProgresso(ultimaAtualizacao)
    
            if (atAndamento) {
                setIsRunning(true)
            } else {
                setIsRunning(false)
            }
        } catch (error) {
            console.error('Erro ao monitorar atualização:', error)
            setErrorMessage('Erro ao sincronizar atualização.')
        }
    }

    useEffect(() => {
        monitorarAtualizacao()
        const interval = setInterval(monitorarAtualizacao, 30000)

        return () => clearInterval(interval)
    }, [])

    const atualizarProgresso = (ultimaAtualizacao: any) => {
        setProgress([
            { name: 'Atualização da Empresa', status: ultimaAtualizacao.atualizacao_empresa ? 'Concluído' : 'Pendente' },
            { name: 'Atualização do Simples', status: ultimaAtualizacao.atualizacao_simples ? 'Concluído' : 'Pendente' },
            { name: 'Atualização dos Contatos (Empresas)', status: ultimaAtualizacao.atualizacao_socios_emp ? 'Concluído' : 'Pendente' },
            { name: 'Atualização dos Contatos (Entidades)', status: ultimaAtualizacao.atualizacao_socios_ent ? 'Concluído' : 'Pendente' },
            { name: 'Atualização do Estabelecimento (Empresas)', status: ultimaAtualizacao.atualizacao_estabelecimento_emp ? 'Concluído' : 'Pendente' },
            { name: 'Atualização do Estabelecimento (Entidades)', status: ultimaAtualizacao.atualizacao_estabelecimento_ent ? 'Concluído' : 'Pendente' },
        ])
    }    

    const iniciarAtualizacao = async (tipo: string) => {
        setIsRunning(true)
        setErrorMessage(null)
        const scriptsNames = scripts.map(script => script.script)
        console.log(scriptsNames)

        try {
            await ApiService.fetchData({
                url: '/rfb/execute-update',
                method: 'post',
                data: { scripts: scriptsNames , tipo },
                timeout: 60000000,
            })
        } catch (error) {
            console.error('Erro ao iniciar atualização:', error)
            setErrorMessage('Erro ao iniciar atualização.')
            setIsRunning(false)
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
                            <Badge content={item.status} className={`ml-4 ${getBadgeClass(item.status)}`} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between space-x-4 mt-4">
                    <Button onClick={() => iniciarAtualizacao('partial')} disabled={isRunning}>
                        {isRunning ? 'Executando...' : 'Atualização Parcial'}
                    </Button>
                    <Button onClick={() => iniciarAtualizacao('full')} disabled={isRunning}>
                        {isRunning ? 'Executando...' : 'Atualização Completa'}
                    </Button>
                </div>
                {errorMessage && <div className="text-red-600 mt-4">{errorMessage}</div>}
            </div>
        </Container>
    )
}

const getBadgeClass = (status: string) => {
    switch (status) {
        case 'Pendente': return 'bg-gray-300 text-gray-600'
        case 'Em andamento': return 'bg-blue-500 text-white'
        case 'Concluído': return 'bg-emerald-500 text-white'
        case 'Erro': return 'bg-red-500 text-white'
        default: return 'bg-gray-300 text-gray-600'
    }
}

export default AtualizarEmpresas
