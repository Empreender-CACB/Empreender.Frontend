import { Link } from 'react-router-dom'
import { HiSearch, HiDocumentText, HiChatAlt, HiQuestionMarkCircle, HiShieldCheck, HiClipboardCheck, HiChartBar, HiUserGroup, HiFolderOpen } from 'react-icons/hi'
import { Input } from '@/components/ui'
import Card from '@/components/ui/Card'
import { useAppSelector } from '@/store'

type HelpOption = {
    label: string
    path?: string
    recurso?: string
    description?: string
    icon: JSX.Element
    iconColor?: string
}

const AjudaAtendimentoCards = () => {
    const { recursos } = useAppSelector((state) => state.auth.user)

    const ajudaOptions: HelpOption[] = [
        {
            label: 'Aviso aos Navegantes',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/blog`,
            description: 'Confira avisos importantes para os usuários.',
            icon: <HiDocumentText className="w-12 h-12 text-yellow-500" />,
        },
        {
            label: 'Documentos',
            path: `/sistema/ajuda-atendimento/documentos`,
            description: 'Painel com informações do programa Empreender.',
            icon: <HiFolderOpen className="w-12 h-12 text-orange-500" />,
        },
        {
            label: 'FAQ',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/index`,
            description: 'Perguntas frequentes e respostas detalhadas.',
            icon: <HiQuestionMarkCircle className="w-12 h-12 text-green-500" />,
        },
        {
            label: 'Fale Conosco',
            path: 'mailto:suportepde@cacb.org.br?subject=Fale%20Conosco',
            description: 'Entre em contato com nossa equipe de suporte.',
            icon: <HiChatAlt className="w-12 h-12 text-blue-500" />,
        },
        {
            label: 'LGPD',
            path: '#',
            description: 'Informações sobre nossa política de privacidade.',
            icon: <HiShieldCheck className="w-12 h-12 text-red-500" />,
        },
        {
            label: 'Liberações',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/liberacoes/`,
            description: 'Acompanhe liberações recentes do sistema.',
            icon: <HiClipboardCheck className="w-12 h-12 text-indigo-500" />,
        },
        {
            label: 'Painel Covid',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/paineis-zoho/painel/covid`,
            description: 'Dados e informações sobre o impacto da COVID-19.',
            icon: <HiChartBar className="w-12 h-12 text-purple-500" />,
        },
        {
            label: 'Painel Empreender',
            path: `${import.meta.env.VITE_PHP_URL}/sistema/faq/paineis-zoho/painel/empreender`,
            recurso: 'paineis_zoho',
            description: 'Painel com informações do programa Empreender.',
            icon: <HiUserGroup className="w-12 h-12 text-pink-500" />,
        },
    ]

    const sortedOptions = [...ajudaOptions].sort((a, b) =>
        a.label.localeCompare(b.label, 'pt', { sensitivity: 'base' })
    )

    const filteredOptions = sortedOptions.filter(
        (option) => !option.recurso || recursos.includes(option.recurso)
    )

    return (
        <div className="p-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Ajuda e Atendimento</h1>
                <p className="text-gray-600">Encontre respostas rapidamente ou entre em contato com nosso suporte.</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOptions.map((option) => (
                    <Link key={option.label} to={option.path || '#'} target={option.path?.startsWith('http') ? '_blank' : '_self'}>
                        <Card clickable className="p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4 flex justify-center">
                                {option.icon}
                            </div>
                            <div className="text-center">
                                <h5 className="mb-2 text-lg font-semibold">{option.label}</h5>
                                <p className="text-gray-500 text-sm">{option.description}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AjudaAtendimentoCards
