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
import { useAppSelector } from '@/store'
import formatCPFCNPJ from '@/utils/MaskService'
import ApiService from '@/services/ApiService'
import Breadcrumb from '@/components/breadCrumbs/breadCrumb'
import { FaQuestion } from "react-icons/fa"
import Tooltip from '@/components/ui/Tooltip'
import { useNavigate } from 'react-router-dom'
import isValidEmail from '@/utils/email'

const columns = [
    {
        name: 'cnpj',
        header: 'CNPJ',
        defaultFlex: 0.22,
        type: 'string',
        operator: 'contains',
        value: '',
        render: ({ data }: any) => {
            const formattedValue = formatCPFCNPJ(data.cnpj)
            return (
                <div style={{ color: formattedValue ? 'inherit' : 'red' }}>
                    {formattedValue || data.cnpj}
                </div>
            )
        },
    },
    {
        name: 'excessao',
        header: 'Situação',
        type: 'string',
        value: '',
        defaultFlex: 0.3,
        render: ({ data }: any) => (
        <div style={{ color: data.excessao && data.excessao.startsWith('Erro') ? 'red' : 'green' }}>
            {data.excessao}
        </div>
        )
    },
    { name: 'telefone_empresa', header: 'Tel. da Emp.', type: 'string', value: '', defaultFlex: 0.2 },
    { name: 'celular_empresa', header: 'Cel. da Emp.', type: 'string', value: '', defaultFlex: 0.2 },
    { name: 'email_empresa',
        header: 'E-mail da Emp.',
        type: 'string',
        value: '',
        defaultFlex: 0.3,
        render: ({ data }: any) => {
          const isValid = isValidEmail(data.email_empresa)
          return (
              <div style={{ color: isValid ? 'inherit' : 'red' }}>
                  {data.email_empresa}
              </div>
          )
      },    
    },
    { name: 'nmcontato', header: 'Contato', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'telefone_contato', header: 'Tel. do cont.', type: 'string', value: '', defaultFlex: 0.20 },
    { name: 'celular_contato', header: 'Cel. do cont.', type: 'string', value: '', defaultFlex: 0.20 },
    { name: 'email_contato',
      header: 'E-mail do cont.',
      type: 'string',
      value: '',
      defaultFlex: 0.3,
      render: ({ data }: any) => {
        const isValid = isValidEmail(data.email_contato)
        return (
            <div style={{ color: isValid ? 'inherit' : 'red' }}>
                {data.email_contato}
            </div>
        )
    },    
    },
    { name: 'idprojeto1', header: 'Projeto', type: 'string', value: '', defaultFlex: 0.17 },
    { name: 'nome_pr1', header: 'Nome do Projeto', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'idassociacao', header: 'ID da Entidade', type: 'number', value: '', defaultFlex: 0.25, filterEditor: NumberFilter },
    { name: 'nmrazao', header: 'Nome da Entidade', type: 'string', value: '', defaultFlex: 0.3 },
    { name: 'iduf', header: 'UF', type: 'string', value: '', defaultFlex: 0.12 },
    { name: 'nmcidade', header: 'Cidade', type: 'string', value: '', defaultFlex: 0.2 }
]

const defaultFilterValue = [
    { name: 'cnpj', value: '', operator: 'contains' },
    { name: 'nmcontato', value: '', operator: 'contains' },
    { name: 'telefone_contato', value: '', operator: 'contains' },
    {name: 'celular_contato', value:'', operator:'contains'},
    {name: 'celular_empresa', value:'', operator:'contains'},
    {name: 'telefone_empresa', value:'', operator:'contains'},
    {name: 'email_contato', value:'', operator:'contains'},
    { name: 'email_empresa', value: '', operator: 'contains' },
    { name: 'idassociacao', value: '', operator: 'contains' },
    { name: 'iduf', value: '', operator: 'contains' },
    {name: 'idprojeto1', value:'', operator:'contains'},
    {name: 'nome_pr1', value:'', operator:'contains'},
    { name: 'nmcidade', value: '', operator: 'contains' },
    { name: 'nmrazao', value: '', operator: 'contains' },
    { name: 'excessao', value: '', operator: 'contains' }
]

const InsertExcel = () => {
    const [nameValue, setNameValue] = useState('cnpj')
    const [empresaType, setEmpresaType] = useState('todas')
    const [excelData, setExcelData] = useState([])
    const [loading, setLoading] = useState(false)
    const [optionsOrigem, setOptionsOrigem] = useState([])
    const [origemType, setOrigemType] = useState<string[]>([])
    const [selectedOrigens, setSelectedOrigens] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newOrigem, setNewOrigem] = useState('')
    const user = useAppSelector((state) => state.auth.user)
    const [cpf, setCPF] = useState(user ? user.nucpf : '')

    const navigate = useNavigate()

    const onChange = (val) => {
        setNameValue(val)
    }

    const onChangeOrigem = (selectedOption: any) => {
        setSelectedOrigens(selectedOption)
    }

    const fetchData = async () => {
        try {
            const response = await ApiService.fetchData({
                url: `/empresa-excel?nameValue=${nameValue}&empresaType=${empresaType}&cpf=${cpf}`,
                method: 'get'
            })
            setExcelData(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const fetchOrigens = async () => {
        try {
            const response = await ApiService.fetchData({
                url: 'empresas/origens',
                method: 'get',
            })
            const mappedOptions = response.data.map((origemItem: any) => {
                return ({
                    value: origemItem.origem,
                    label: origemItem.origem,
                })
            })
            setOptionsOrigem(mappedOptions)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchOrigens()
    }, [cpf])

    const handleInsertClick = async () => {
        setLoading(true)

        try {
            const payload = excelData.map(empresa => ({
                ...empresa,
                origem: selectedOrigens.value,
                cpf: cpf
            }))

            const response = await ApiService.fetchData({
                url: '/rfb/cadastra-excel',
                method: 'post',
                data: payload
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

    const handleSaveOrigem = () => {
        const newOption = { value: newOrigem, label: newOrigem }
        setOptionsOrigem((prevOptions) => [...prevOptions, newOption])
        setSelectedOrigens(newOption)
        handleCloseModal()
    }

    const radioGroup = (
        <div className='pr-4 flex items-center'>
            <Select
                options={optionsOrigem}
                value={selectedOrigens}
                onChange={onChangeOrigem}
                placeholder="Marcador"
            />
            <Button
                variant="default"
                className="ml-4"
                onClick={handleOpenModal}
            >
                Cadastrar Novo Marcador
            </Button>
            <Tooltip title="Para saber mais sobre como é feita a importação de empresas em lote clique aqui" placement='right-end'>
                <Button shape="circle" size='xs' icon={<FaQuestion />} className='ml-12'
                    onClick={() => {
                        window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTE2OTg=')
                    }}
                /> 
            </Tooltip> 
        </div>
    )

    const breadcrumbItems = [
        { label: 'Início', link: '/' },
        { label: 'Inserir novo Lote', link: '/sistema/insert-excel' },
        { label: 'Verificar Lote em Andamento', link: '/sistema/show-excel' },
    ]

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <Breadcrumb items={breadcrumbItems} /> 
             <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-3">Inclusão de Empresas em Lote</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button
                        variant="solid"
                        icon={<HiPlusCircle />}
                        className="mr-4"
                        onClick={() => {
                            navigate('/sistema/insert-excel')
                        }}
                    >
                        Realizar nova inserção
                    </Button>
                <Tooltip title="Antes de realizar a inserção dos dados é necessário selecionar um marcador" placement='top-end' isOpen={selectedOrigens}>
                    <Button
                        block
                        variant="solid"
                        icon={<HiPlusCircle />}
                        onClick={handleInsertClick}
                        loading={loading}
                        disabled={!selectedOrigens}
                    >
                        {loading ? 'Inserindo...' : 'Inserir empresas no banco de dados'}
                    </Button>
                    </Tooltip> 
                </div>
            </div>
            <CustomReactDataGrid
                filename='Excel'
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/empresa-excel?nameValue=${nameValue}&empresaType=${empresaType}&cpf=${cpf}`}
                options={radioGroup}
                CardLayout={EmpresaExcelCard}
            />
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Novo Marcador"
                ariaHideApp={false}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
                    <h2 className="text-lg font-bold mb-4">Cadastrar novo Marcador</h2>
                    <Input
                        value={newOrigem}
                        onChange={(e) => setNewOrigem(e.target.value)}
                        placeholder="Digite o novo marcador"
                        className="mb-4 w-full"
                    />
                    <div className="flex justify-end space-x-4">
                        <Button variant="default" onClick={handleCloseModal}>Cancelar</Button>
                        <Button variant="solid" onClick={handleSaveOrigem}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </AdaptableCard>
    )
}

export default InsertExcel
