import '@inovua/reactdatagrid-community/index.css'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { AdaptableCard } from '@/components/shared'
import { Button, Input } from '@/components/ui'
import { useState, useEffect } from 'react'
import { EmpresaExcelCard } from '@/components/shared/TableCards/EmpresaExcelCard'
import { HiPlusCircle } from 'react-icons/hi'
import Select from '@/components/ui/Select'
import Modal from 'react-modal'

// Colunas da tabela
const columns = [
    { name: 'id', header: 'ID', type: 'number', value: '', defaultFlex: 0.3 },
    { name: 'cnpj', header: 'CNPJ', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'nmcontato', header: 'Contato', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'telefone', header: 'Telefone', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'email', header: 'E-mail', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'idassociacao', header: 'ID da Entidade', type: 'number', value: '', defaultFlex: 0.3, filterEditor: NumberFilter },
    { name: 'nmrazao', header: 'Nome da Entidade', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'nmcidade', header: 'Cidade', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'iduf', header: 'UF', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'excessao', header: 'Excessão de envio', type: 'string', value: '', defaultFlex: 0.3 }
]

// Valores padrão dos filtros
const defaultFilterValue = [
    { name: 'id', value: '', operator: 'contains' },
    { name: 'cnpj', value: '', operator: 'contains' },
    { name: 'nmcontato', value: '', operator: 'contains' },
    { name: 'telefone', value: '', operator: 'contains' },
    { name: 'email', value: '', operator: 'contains' },
    { name: 'idassociacao', value: '', operator: 'contains' },
    { name: 'nmcidade', value: '', operator: 'contains' },
    { name: 'iduf', value: '', operator: 'contains' },
    { name: 'nmrazao', value: '', operator: 'contains' },
    { name: 'excessao', value: '', operator: 'contains' }
]

const InsertExcel = () => {
    const [nameValue, setNameValue] = useState('cnpj')
    const [empresaType, setEmpresaType] = useState('todas')
    const [excelData, setExcelData] = useState([])
    const [loading, setLoading] = useState(false)
    const [optionsOrigem, setOptionsOrigem] = useState([])
    const [selectedOrigens, setSelectedOrigens] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newOrigem, setNewOrigem] = useState('')

    const onChange = (val) => {
        setNameValue(val)
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/empresa-excel?nameValue=${nameValue}&empresaType=${empresaType}`)
            const data = await response.json()
            setExcelData(data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const fetchOrigens = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/empresa-excel/origens/group`)
            const data = await response.json()
            setOptionsOrigem(data)
        } catch (error) {
            console.error('Error fetching origens:', error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchOrigens()
    }, [nameValue, empresaType])

    const handleInsertClick = async () => {
        setLoading(true)

        try {
            const payload = excelData.map(empresa => ({
                ...empresa,
                origem: selectedOrigens.value
            }))

            const response = await fetch(`${import.meta.env.VITE_API_URL}/rfb/cadastra-cef`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                console.error('Error inserting data:', response.statusText)
            }

        } catch (error) {
            console.error('Error inserting data:', error)
        }

        setLoading(false)
        window.location.reload()
    }

    const handleOpenModal = () => {
        console.log('Opening modal')
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        console.log('Closing modal')
        setIsModalOpen(false)
        setNewOrigem('')
    }

    const handleSaveOrigem = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/empresa-excel/origem/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ origem: newOrigem })
            })

            if (!response.ok) {
                console.error('Error saving origem:', response.statusText)
            } else {
                fetchOrigens()
                handleCloseModal()
            }

        } catch (error) {
            console.error('Error saving origem:', error)
        }
    }

    const radioGroup = (
        <div className='pr-4 flex items-center'>
            <span className="pr-2 font-black">Origem: </span>
            <Select
                options={optionsOrigem.map(option => ({ value: option.origem, label: option.origem }))}
                value={selectedOrigens}
                onChange={setSelectedOrigens}
                placeholder="Origem"
            />
            <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={handleOpenModal}
            >
                Cadastrar Nova Origem
            </Button>
        </div>
    )

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Empresas no Excel</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={handleInsertClick}
                        loading={loading}
                        disabled={!selectedOrigens}
                    >
                        {loading ? 'Inserindo...' : 'Inserir empresas no banco de dados'}
                    </Button>
                </div>
            </div>
            <CustomReactDataGrid
                filename='Excel'
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/empresa-excel?nameValue=${nameValue}&empresaType=${empresaType}`}
                options={radioGroup}
                CardLayout={EmpresaExcelCard}
            />
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Nova Origem"
                ariaHideApp={false}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
                    <h2 className="text-lg font-bold mb-4">Cadastrar nova Origem</h2>
                    <Input
                        value={newOrigem}
                        onChange={(e) => setNewOrigem(e.target.value)}
                        placeholder="Digite a nova origem"
                        className="mb-4 w-full"
                    />
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                        <Button variant="solid" onClick={handleSaveOrigem}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </AdaptableCard>
    )
}

export default InsertExcel
