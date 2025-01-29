import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'

const { Tr, Th, Td, THead, TBody } = Table

const mockPaymentHistoryData = [
    {
        id: 'INV001',
        item: 'Adesão em análise',
        status: 'analise',
        date: "	31/12/2024",
        amount: 29.99,
    },
    {
        id: 'INV002',
        item: 'Adesão negada',
        status: 'negada',
        date: "	04/01/2025",
        amount: 99.99,
    },
]

const statusColor = {
    analise: 'bg-yellow-500',
    aprovada: 'bg-green-400',
    negada: 'bg-red-400',
}

const PaymentHistory = () => {
    return (
        <div className="mb-8 mt-5">
            <h6 className="mb-4">Histórico</h6>
            <Table>
                <THead>
                    <Tr>
                        <Th>Ação</Th>
                        <Th>Status</Th>
                        <Th>Data</Th>
                    </Tr>
                </THead>
                <TBody>
                    {mockPaymentHistoryData.map((row) => (
                        <Tr key={row.id}>
                            <Td>{row.item}</Td>
                            <Td>
                                <div className="flex items-center">
                                    <Badge className={statusColor[row.status]} />
                                    <span className="ml-2 rtl:mr-2 capitalize">{row.status}</span>
                                </div>
                            </Td>
                            <Td>{row.date}</Td>

                        </Tr>
                    ))}
                </TBody>
            </Table>
        </div>
    )
}

export default PaymentHistory
