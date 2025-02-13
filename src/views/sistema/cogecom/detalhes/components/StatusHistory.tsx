import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'

const { Tr, Th, Td, THead, TBody } = Table

const statusColor = {
  analise: 'bg-yellow-500',
  aprovada: 'bg-green-400',
  negada: 'bg-red-400',
}

interface StatusHistoryProps {
  criada: string
  atualizada: string
  status: 'analise' | 'aprovada' | 'negada'
}

const StatusHistory = ({ criada, atualizada, status, setCogecomData }: StatusHistoryProps) => {
  return (
    <div className="mb-8 mt-5">
      <h6 className="mb-4">Histórico</h6>
      <Table>
        <THead>
          <Tr>
            <Th>Tipo</Th>
            <Th>Data</Th>
            <Th>Status</Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td>Adesão realizada</Td>
            <Td>{criada}</Td>
            <Td>
              <div className="flex items-center">
                <Badge className={statusColor['analise']} />
                <span className="ml-2 rtl:mr-2 capitalize">análise</span>
              </div>
            </Td>
          </Tr>
          {status !== 'analise' && (
            <Tr>
              <Td>Avaliada</Td>
              <Td>{atualizada}</Td>
              <Td>
                <div className="flex items-center">
                  <Badge className={statusColor[status]} />
                  <span className="ml-2 rtl:mr-2 capitalize">{status}</span>
                </div>
              </Td>
            </Tr>
          )}
        </TBody>
      </Table>
    </div>
  )
}

export default StatusHistory
