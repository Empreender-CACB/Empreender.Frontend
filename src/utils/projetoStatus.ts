type ProjetoStatus = {
    label: string
    className: string
}

export function getProjetoStatusInfo(status: string | null | undefined): ProjetoStatus {
    const statusMap: Record<string, ProjetoStatus> = {
        cadas: { label: 'Cadastrado', className: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100' },
        inici: { label: 'Iniciado', className: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-100' },
        andam: { label: 'Em Andamento', className: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100' },
        concl: { label: 'Concluído', className: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100' },
        cance: { label: 'Cancelado', className: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100' },
        desco: { label: 'Descontinuado', className: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100' },
        bloqu: { label: 'Bloqueado', className: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100' },
        nselc: { label: 'Não Selecionado', className: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100' },
    }

    if (!status || !statusMap[status]) {
        return { label: '-', className: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100' }
    }

    return statusMap[status]
}