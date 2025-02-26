import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Documento, GrupoDocumento } from '@/@types/navigation'
import { apiGetDocumentos } from '@/services/MenuService'
import Card from '@/components/ui/Card'
import classNames from 'classnames'
import { format } from 'date-fns'

import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaFileArchive, FaFilePowerpoint, FaFile, FaSearch } from 'react-icons/fa'

const Documentos = () => {
    const [documentosData, setDocumentosData] = useState<GrupoDocumento[]>([])
    const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await apiGetDocumentos()
                setDocumentosData(response.data)
                if (response.data.length > 0) {
                    setSelectedGroupName(response.data[0].grupo)
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchDocumentos()
    }, [])

    const getFileIcon = (extensao: string) => {
        const iconSize = 32
        switch (extensao) {
            case 'pdf':
                return <FaFilePdf size={iconSize} className="text-red-500" />
            case 'doc':
            case 'docx':
                return <FaFileWord size={iconSize} className="text-blue-500" />
            case 'xls':
            case 'xlsx':
                return <FaFileExcel size={iconSize} className="text-green-500" />
            case 'ppt':
            case 'pptx':
                return <FaFilePowerpoint size={iconSize} className="text-orange-500" />
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage size={iconSize} className="text-purple-500" />
            case 'zip':
            case 'rar':
                return <FaFileArchive size={iconSize} className="text-yellow-500" />
            case 'txt':
                return <FaFileAlt size={iconSize} className="text-gray-500" />
            default:
                return <FaFile size={iconSize} className="text-gray-400" />
        }
    }

    // Filtra os grupos e documentos com base no termo de busca
    const filteredGrupos = documentosData
        .map((grupo) => {
            const filteredDocs = grupo.subMenu.filter(doc =>
                doc.nome.toLowerCase().includes(searchTerm.toLowerCase())
            )

            const matchesGroup = grupo.grupo.toLowerCase().includes(searchTerm.toLowerCase())

            if (matchesGroup || filteredDocs.length > 0) {
                return {
                    ...grupo,
                    subMenu: matchesGroup ? grupo.subMenu : filteredDocs
                }
            }
            return null
        })
        .filter((grupo) => grupo !== null) as GrupoDocumento[]

    const selectedGroup = filteredGrupos.find(grupo => grupo.grupo === selectedGroupName) || filteredGrupos[0] || null

    return (
        <div className="flex h-full p-6 gap-6">
            <div className="w-1/4 border-r border-gray-300 pr-4">
                <h2 className="text-xl font-semibold mb-4">Grupos</h2>
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Buscar grupo ou documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>

                <ul className="space-y-2">
                    {filteredGrupos.length > 0 ? (
                        filteredGrupos.map((grupo) => (
                            <li
                                key={grupo.grupo}
                                className={classNames(
                                    'cursor-pointer p-2 rounded flex justify-between items-center transition-all duration-200',
                                    {
                                        'bg-blue-100 font-semibold': selectedGroupName === grupo.grupo,
                                        'hover:bg-gray-100 hover:border-l-4 hover:border-blue-400': selectedGroupName !== grupo.grupo,
                                    }
                                )}
                                onClick={() => setSelectedGroupName(grupo.grupo)}
                            >
                                <span>{grupo.grupo}</span>
                                {grupo.temNovidade && <span className="text-red-500 text-sm ml-2">Recente!</span>}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">Nenhum grupo encontrado.</p>
                    )}
                </ul>
            </div>

            <div className="w-3/4">
                <h2 className="text-xl font-semibold mb-4">
                    {selectedGroup ? selectedGroup.grupo : 'Nenhum grupo selecionado'}
                </h2>

                {selectedGroup && selectedGroup.subMenu.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedGroup.subMenu.map((doc: Documento) => (
                            <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow relative">
                                {doc.temNovidade && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                        Recente
                                    </span>
                                )}

                                <Link
                                    target="_blank"
                                    to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/download-anexo/aid/${btoa(String(doc.id))}`}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        {getFileIcon(doc.tipoArquivo)}
                                    </div>

                                    <h5
                                        className={classNames('text-lg font-medium', {
                                            'text-red-600': doc.temNovidade,
                                        })}
                                    >
                                        {doc.nome}
                                    </h5>

                                    {doc.descricao && (
                                        <p className="text-gray-500 text-sm mt-2">{doc.descricao}</p>
                                    )}

                                    {doc.dataInclusao && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Adicionado em: {format(new Date(doc.dataInclusao), 'dd/MM/yyyy')}
                                        </p>
                                    )}
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Nenhum documento encontrado neste grupo.</p>
                )}
            </div>
        </div>
    )
}

export default Documentos
