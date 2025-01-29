import Card from '@/components/ui/Card'
import { HiGlobe, HiMail, HiLocationMarker, HiDocumentText } from 'react-icons/hi'

const CompanyDetails = () => {
    const mockCompanyData = {
        name: 'César Tech',
        cnpj: '12.345.678/0001-99',
        address: 'QBR 6, BLOCO A, APARTAMENTO 11 - BRASÍLIA - DF',
        email: 'email@email.com',
        website: 'https://sitefalso.com',
    }

    return (
        <div className="mb-8">
            <h6 className="mb-4">Detalhes da Empresa</h6>
            <Card bordered>
                <div className="space-y-4">
                    {/* Nome da empresa em destaque */}
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {mockCompanyData.name}
                    </h4>

                    {/* Informações lado a lado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <HiDocumentText className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong>CNPJ:</strong> {mockCompanyData.cnpj}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <HiLocationMarker className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong>Endereço:</strong> {mockCompanyData.address}
                            </span>
                        </div>
                    </div>

                    {/* Informações embaixo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <HiMail className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong>E-mail:</strong> {mockCompanyData.email}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <HiGlobe className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong>Site:</strong>{' '}
                                <a
                                    href={mockCompanyData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    {mockCompanyData.website}
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CompanyDetails