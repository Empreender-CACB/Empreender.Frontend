import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

type Log = {
    version: string
    date: string
    updateContent: string[]
}

type LogProps = Omit<Log, 'updateContent'> & {
    border?: boolean
    children?: ReactNode
}

const logData: Log[] = [
    {
        version: '4.93',
        date: '05 de Janeiro de 2024',
        updateContent: [
            '[Funcionalidade] Sistema de notificação para usuários',
            '[Funcionalidade] Recuperação de senha',
            '[Alteração] Imagens de fundo',
            '[Correção] Vídeos do youtube sendo reproduzidos corretamente',
        ],
    },
    {
        version: '4.92',
        date: '01 de Janeiro de 2024',
        updateContent: [
            '[Funcionalidade] Sistema de pesquisa geral',
            '[Correção] Carrousel de imagens funcionando corretamente',
            '[Funcionalidade] Download de arquivos diretamente na nova versão',
        ],
    },
]

const Log = (props: LogProps) => {
    return (
        <div className={`py-4 ${props.border && 'border-bottom'}`}>
            <div className="flex items-center">
                <h5 className="font-weight-normal mb-0 mr-3">
                    {props.version}
                </h5>
                <code>{props.date}</code>
            </div>
            <div className="api-container p-0 border-0 mt-3">
                {props.children}
            </div>
        </div>
    )
}

const Changelog = () => {
    return (
        <Container>
            <AdaptableCard>
                <h4>Atualizações</h4>
                {logData.map((elm) => (
                    <Log
                        key={elm.version}
                        version={`v${elm.version}`}
                        date={elm.date}
                    >
                        {elm.updateContent.length > 0 ? (
                            <ul>
                                {elm.updateContent.map((item, i) => (
                                    <li key={i}>- {item}</li>
                                ))}
                            </ul>
                        ) : null}
                    </Log>
                ))}
            </AdaptableCard>
        </Container>
    )
}

export default Changelog
