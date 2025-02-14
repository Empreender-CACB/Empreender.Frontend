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
import { Link } from 'react-router-dom'



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
    const [camposAlinvest, setcamposAlinvest] = useState(false)

    const navigate = useNavigate()

    const onChange = (val) => {
        setNameValue(val)
    }

    const setores = [
        { id: 1, nome: "Agrícola, pecuária, pesca, mineração, florestal" },
        { id: 2, nome: "Industrial, agroindústria, manufatura, transformação, artesanal, farmacêutica" },
        { id: 3, nome: "Serviços, turismo, software, segurança, consultoria, transporte, comércio (atacado/varejo de bens e/ou serviços)" },
        { id: 4, nome: "Inovação, digitalização, conhecimento, gestão da informação" },
        { id: 5, nome: "Outro" }
    ]
    
    const tamanhosEmpresa = [
        { id: 1, nome: "MEI ou Microempresa" },
        { id: 2, nome: "Pequena" },
        { id: 3, nome: "Média" },
        { id: 4, nome: "Grande" },
        { id: 5, nome: "Outro" }
    ]
    

    const columns = [
        {
            name: 'cnpj',
            header: 'CNPJ',
            defaultFlex: 0.35,
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
        { name: 'nmcontato', header: 'Contato', type: 'string', value: '', defaultFlex: 0.3, operator: 'contains' },
        { name: 'telefone', header: 'Telefone', type: 'string', value: '', defaultFlex: 0.3, operator: 'contains' },
        { name: 'email',
          header: 'E-mail',
          type: 'string',
          value: '',
          operator: 'contains',
          defaultFlex: 0.3,
          render: ({ data }: any) => {
            const isValid = isValidEmail(data.email)
            return (
                <div style={{ color: isValid ? 'inherit' : 'red' }}>
                    {data.email}
                </div>
            )
        },   
        },
        { 
            name: 'empresa_excel.idassociacao',
            header: 'Entidade', 
            type: 'number', 
            value: '',
            operator: 'eq',
            defaultFlex: 0.25,
            render: ({ data }: any) => {
                    const text = data.nmrazao
                    const ide = data.idassociacao
                    return (
                        <Tooltip
                            placement='left'
                            title={
                                <div>
                                    {text}
                                </div>
                            }
                        >
                            <span className="cursor-pointer">{ide}</span>
                        </Tooltip>
                    )
                },
        },
        { 
            name: 'empresa_excel.idprojeto', 
            header: 'Projeto', 
            type: 'string', 
            value: '',
            operator: 'eq', 
            defaultFlex: 0.18,
            render: ({ data }: any) => {
                const text = data.nmprojeto
                const idp = data.idprojeto
                return (
                    <Tooltip
                        placement='left'
                        title={
                            <div>
                                {text}
                            </div>
                        }
                    >
                        <span className="cursor-pointer">{idp}</span>
                    </Tooltip>
                )
            },
        },
        { 
            name: 'empresa_excel.idnucleo', 
            header: 'Núcleo', 
            type: 'number', 
            value: '', 
            defaultFlex: 0.18,
            render: ({ data }: any) => {
                const text = data.nmnucleo
                const idn = data.idnucleo
                return (
                    <Tooltip
                        placement='left'
                        title={
                            <div>
                                {text}
                            </div>
                        }
                    >
                        <span className="cursor-pointer">{idn}</span>
                    </Tooltip>
                )
            },
         },
        ...(camposAlinvest ? [
            { 
                name: 'setor_alinvest', 
                header: 'Setor',
                type: 'number', 
                value: '',
                operator: 'eq',
                defaultFlex: 0.18,
                render: ({ data }: any) => {
                    const setor = setores.find(s => s.id === data.setor_alinvest)
                    const text = setor ? setor.nome : 'Desconhecido'
                    const ids = data.setor_alinvest
                    return (
                        <Tooltip
                            placement='left'
                            title={
                                <div>
                                    {text}
                                </div>
                            }
                        >
                            <span className="cursor-pointer">{ids}</span>
                        </Tooltip>
                    )
                },
            },
            { 
                name: 'porte_alinvest', 
                header: 'Porte', 
                type: 'number', 
                value: '',
                operator: 'eq',
                defaultFlex: 0.18,
                render: ({ data }: any) => {
                    const porte = tamanhosEmpresa.find(p => p.id === data.porte_alinvest)
                    const text = porte ? porte.nome : 'Desconhecido'
                    const idpo = data.porte_alinvest
                    return (
                        <Tooltip 
                            placement='left' 
                            title={
                                <div>
                                    {text}
                                </div>
                            }
                        >
                            <span className="cursor-pointer">{idpo}</span>
                        </Tooltip>
                    )
                },
            },            { 
                name: 'instagram', 
                header: 'Instagram', 
                type: 'string', 
                value: '',
                operator: 'contains', 
                defaultFlex: 0.3,
                render: ({ data }: any) => {
                    const text = data.instagram
                    const linkTo = data.instagram
                
                    return (
                        <div>
                            <Link to={linkTo} className="text-blue-500 hover:underline">
                                {text}
                            </Link>
                        </div>
                    )
                },
                
            },
            { 
                name: 'linkedin', 
                header: 'Linkedin', 
                type: 'string', 
                value: '', 
                operator: 'contains',
                defaultFlex: 0.3,
                render: ({ data }: any) => {
                    const text = data.linkedin
                    const linkTo = data.linkedin
                
                    return (
                        <div>
                            <Link to={linkTo} className="text-blue-500 hover:underline">
                                {text}
                            </Link>
                        </div>
                    )
                },
                
            },
            { 
                name: 'facebook', 
                header: 'Facebook', 
                type: 'string', 
                value: '', 
                operator: 'contains',
                defaultFlex: 0.3,
                render: ({ data }: any) => {
                    const text = data.facebook
                    const linkTo = data.facebook
                
                    return (
                        <div>
                            <Link to={linkTo} className="text-blue-500 hover:underline">
                                {text}
                            </Link>
                        </div>
                    )
                },
                
            },
        ] : []),
        {
            name: 'excessao',
            header: 'Situação',
            type: 'string',
            value: '',
            operator: 'contains',
            defaultFlex: 0.3,
            render: ({ data }: any) => (
            <div style={{ color: data.excessao && data.excessao.startsWith('Erro') ? 'red' : 'green' }}>
                {data.excessao}
            </div>
            )
        }
    ]
    
    const defaultFilterValue = [
        { name: 'cnpj', value: '', operator: 'contains' },
        { name: 'nmcontato', value: '', operator: 'contains' },
        { name: 'telefone', value: '', operator: 'contains' },
        { name: 'email', value: '', operator: 'contains' },
        { name: 'empresa_excel.idassociacao', value: '', operator: 'eq' },
        { name: 'iduf', value: '', operator: 'contains' },
        { name: 'nmcidade', value: '', operator: 'contains' },
        { name: 'nmrazao', value: '', operator: 'contains' },
        { name: 'excessao', value: '', operator: 'contains' },
        { name: 'empresa_excel.idprojeto', value: '', operator: 'eq' },
        { name: 'empresa_excel.idnucleo', value: '', operator: 'eq' },
        { name: 'setor_alinvest', value: '', operator: 'eq' },
        { name: 'porte_alinvest', value: '', operator: 'eq' },
        { name: 'instagram', value: '', operator: 'contains' },
        { name: 'facebook', value: '', operator: 'contains' },
        { name: 'linkedin', value: '', operator: 'contains' },
        { name: 'excessao', value: '', operator: 'contains' }
    ]

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

    const fetchAlinvest = async () => {
        try {
            const response = await ApiService.fetchData({
                url: `empresa-excel/alinvest?cpf=${cpf}`,
                method: 'get',
            })
            const bool = response.data
            setcamposAlinvest(bool)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchOrigens()
        fetchAlinvest()
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
                placeholder="Origem"
            />
            <Button
                variant="default"
                className="ml-4"
                onClick={handleOpenModal}
            >
                Cadastrar Nova Origem
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
                <Tooltip title="Antes de realizar a inserção dos dados é necessário selecionar uma origem" placement='top-end' isOpen={selectedOrigens}>
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
                        <Button variant="default" onClick={handleCloseModal}>Cancelar</Button>
                        <Button variant="solid" onClick={handleSaveOrigem}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </AdaptableCard>
    )
}

export default InsertExcel
