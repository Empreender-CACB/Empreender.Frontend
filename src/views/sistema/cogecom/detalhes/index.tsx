import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ApiService from '@/services/ApiService'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import CustomerProfile from './components/CustomerProfile'
import PaymentHistory from './components/PaymentHistory'
import CurrentSubscription from './components/CurrentSubscription'
import PaymentMethods from './components/PaymentMethods'
import { Button } from '@/components/ui'
import { AiOutlineCheck, AiOutlineDownload, AiOutlineClose } from 'react-icons/ai'

import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const CustomerDetail = () => {
  const { id  } = useParams<{ id: string }>()

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
        setCogecomData(response.data)
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

      const response = await ApiService.fetchData({
        url: `/cogecom/status/${id}`,
        method: 'patch',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log(`Status atualizado para ${newStatus}:`, response.data)

      toast.push(
        <Notification title="Sucesso">
          Status da adesão foi atualizado e um e-mail foi enviado.
        </Notification>
      )
      // Opcional: atualizar o estado local ou refazer a requisição para refletir a alteração na tela
    } catch (err) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err)
      toast.push(
        <Notification title="Erro">
          Não foi possível atualizar o status da adesão.
        </Notification>
      )
    }
  }

  // Funções específicas para aprovação e negação
  const handleApprove = () => {
    handleStatusUpdate('aprovada')
  }

  const handleReject = () => {
    handleStatusUpdate('negada')
  }

  if (loading) return <Loading />
  if (error) return <div>Erro: {error.message}</div>

  return (
    <Container className="h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes da adesão - #0077b5</h1>
        <div className="flex space-x-2">
          <Button className="mb-2 flex items-center" size="sm" variant="solid" color="blue-800">
            <AiOutlineDownload className="mr-2" /> Transferência de documentos
          </Button>
          <Button
            onClick={handleApprove}
            disabled={cogecomData?.status !== 'analise'}
            className="mb-2 flex items-center"
            size="sm"
            variant="solid"
            color="green-700"
          >
            <AiOutlineCheck className="mr-2" /> Aprovar Adesão
          </Button>
          <Button
            onClick={handleReject}
            disabled={cogecomData?.status !== 'analise'}
            className="mb-2 flex items-center"
            size="sm"
            variant="solid"
            color="red-900"
          >
            <AiOutlineClose className="mr-2" /> Negar Adesão
          </Button>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-4">
        <div>
          <CustomerProfile />
        </div>
        <div className="w-full">
          <AdaptableCard>
            <CurrentSubscription />
            <PaymentMethods />
            <PaymentHistory />
          </AdaptableCard>
        </div>
      </div>
    </Container>
  )
}

export default CustomerDetail
