import Card from '@/components/ui/Card'
import { HiGlobe, HiMail, HiLocationMarker, HiDocumentText } from 'react-icons/hi'

const CompanyDetails = ({ companyData }: any) => {
  console.log('Dados da empresa:', companyData)

  // Enquanto os dados não estiverem disponíveis, exibe uma mensagem de carregamento
  if (!companyData) {
    return <div>Carregando dados da empresa...</div>
  }

  const data = companyData

  return (
    <div className="mb-8">
      <h6 className="mb-4">Detalhes da Empresa</h6>
      <Card bordered>
        <div className="space-y-4">
          {/* Nome da empresa em destaque */}
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {data.nmfantasia}
          </h4>

          {/* Informações lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <HiDocumentText className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>CNPJ:</strong> {data.cnpj}
              </span>
            </div>
            <div className="flex items-center">
              <HiLocationMarker className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Endereço:</strong> {data.email || '-'}
              </span>
            </div>
          </div>

          {/* Informações embaixo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <HiMail className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>E-mail:</strong> {data.email || '-'}
              </span>
            </div>
            <div className="flex items-center">
              <HiGlobe className="mr-2 text-lg text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Site:</strong>{data.email || '-'}
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  {data.website}
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
