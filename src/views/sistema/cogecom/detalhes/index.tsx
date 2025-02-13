import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ApiService from '@/services/ApiService'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import CustomerProfile from './components/CustomerProfile'
import StatusHistory from './components/StatusHistory'
import StatusUpdateButton from './components/StatusUpdateButton'
import CompanyDetails from './components/CompanyDetails'
import FileList from './components/FileList'
import { Button } from '@/components/ui'
import { AiOutlineDownload } from 'react-icons/ai'
import { FaArrowLeft } from "react-icons/fa";
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { ArrowLeftCircleIcon } from '@heroicons/react/20/solid'

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>()

  const [cogecomData, setCogecomData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchCogecomData = async () => {
      setLoading(true)
      try {
        const response = await ApiService.fetchData({
          url: `/cogecom/${id}`,
          method: 'get'
        })
        // Cria uma nova referência usando o spread operator
        setCogecomData(response.data)
        console.log('Dados da empresa:', response.data)
      } catch (err) {
        console.error('Erro ao buscar dados da empresa:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCogecomData()
    }
  }, [id])

  const handleStatusUpdate = async (newStatus: string) => {
    if (cogecomData?.status !== 'analise') {
      toast.push(
        <Notification title="Ação Inválida">
          O status só pode ser atualizado caso a candidatura esteja em análise.
        </Notification>
      )
      return
    }

    try {
      const formData = new FormData()
      formData.append('status', newStatus)

      try {
        const response = await ApiService.fetchData({
          url: `/cogecom/status/${id}`,
          method: 'post',
          data: formData
        })

        // Cria nova referência com o spread operator
        setCogecomData({ ...response.data.data })
      } catch (err) {
        console.error(`Erro ao atualizar status para ${newStatus}:`, err)
      }

      toast.push(
        <Notification title="Sucesso">
          Status da adesão foi atualizado e um e-mail foi enviado.
        </Notification>
      )
    } catch (err) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err)
      toast.push(
        <Notification title="Erro">
          Não foi possível atualizar o status da adesão.
        </Notification>
      )
    }
  }

  const handleApprove = () => {
    handleStatusUpdate('aprovada')
  }

  const handleReject = () => {
    handleStatusUpdate('negada')
  }

  if (loading) return <Loading />
  if (error) return <div>Erro: {error.message}</div>

  return (
    cogecomData && (
      <Container className="h-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Detalhes da adesão - #{cogecomData.id}
          </h1>
          <div className="flex space-x-2">
            <Button
              className="mb-2 flex items-center"
              size="sm"
              variant="solid"
              color="blue-800"
              onClick={() => {

                window.open(`${import.meta.env.VITE_API_URL}/cogecom/relatorio?id=${cogecomData.id}`, '_blank');
              
            }}
            >
              <AiOutlineDownload className="mr-2"
                 /> Transferência de documentos
            </Button>
            <StatusUpdateButton id={cogecomData.id} status_atual={cogecomData.status} setCogecomData={setCogecomData} />
            <Button
              className="mb-2 flex items-center"
              size="sm"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="mr-2" /> Voltar para lista
            </Button>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-4">
          <div>
            <CustomerProfile />
          </div>
          <div className="w-full">
            <AdaptableCard>
              <CompanyDetails companyData={cogecomData} />
              <FileList anexos={cogecomData.anexos} />
              <StatusHistory
                criada={cogecomData.created_at}
                atualizada={cogecomData.updated_at}
                status={cogecomData.status}

              />
            </AdaptableCard>
          </div>
        </div>
      </Container>
    )
  );
}

export default CustomerDetail
