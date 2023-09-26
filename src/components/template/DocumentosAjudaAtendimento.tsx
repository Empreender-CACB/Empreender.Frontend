import { useEffect, useState } from 'react'
import axios from 'axios'
import Dropdown from '@/components/ui/Dropdown'
import { Link } from 'react-router-dom'

const DocumentosAjudaAtendimento = () => {
    const [documentosData, setDocumentosData] = useState([])

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const userData = localStorage.getItem('admin')
                if (userData) {
                    const parsedAdminData = JSON.parse(userData)
                    const token = JSON.parse(parsedAdminData.auth).session.token

                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/documentos`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    setDocumentosData(response.data)
                }
            } catch (error) {
                console.error(
                    'Não foi possível carregar a configuração de navegação:',
                    error
                )
            }
        }

        fetchDocumentos()
    }, [])

    return (
        <Dropdown.Menu title={'Documentos'}>
            {documentosData.map((grupo) => (
                <Dropdown.Menu  openLeft key={grupo.grupo} title={grupo.grupo}>
                    {grupo.subMenu.map((sub) => (
                        <Dropdown.Item key={sub.id} className="mb-1 px-0">
                            <Link className="flex h-full w-full px-2" to={'#'}>
                                <span className="flex gap-2 items-center w-full">
                                    <span>{sub.nome}</span>
                                </span>
                            </Link>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            ))}
        </Dropdown.Menu>
    )
}

export default DocumentosAjudaAtendimento
