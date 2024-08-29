/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { AiFillFileExcel, AiOutlineUser } from "react-icons/ai"
import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button, Checkbox, Tooltip } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import { useAppSelector } from '@/store'
import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
import { FcInfo } from 'react-icons/fc'
import { FaQuestion } from "react-icons/fa"
import { EntidadeCard } from '@/components/shared/TableCards/EntidadeCard'

moment.locale('pt-br')
const activeValue = [
    { name: 'Ativo', value: 'S' },
    { name: 'Inativo', value: 'N' },
]

const columns = [
    { name: 'idassociacao', 
        header: 'ID',
        type: 'number',
        defaultFlex: 0.3,
        operator:'eq',
        render: ({ data }: any) => {
            const text = data.idassociacao
            
            const linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(data.idassociacao))}`
            
            return (
                <div>
                <Link to={linkTo}>
                    {text}
                </Link>
            </div>
        )
    }
},
{ name: 'nome', header: 'Tipo de Entidade', type: 'string', defaultFlex: 1 , operator:'contains'},
{ name: 'nmpais', header: 'País', type: 'string', defaultFlex: 0.7 , operator: 'contains'},
{
    name: 'iduf', header: 'UF', type: 'select', operator:'equals' ,
    filterEditor: SelectFilter,
    filterEditorProps: {
        dataSource: estadosBrasileiros.map(state => ({ id: state.sigla, label: state.sigla }))
        },
        defaultFlex: 0.4
    },
    { name: 'nmcidade', header: 'Cidade', type: 'string', defaultFlex: 1 , operator:'contains'},
    { name: 'associacao.sigla',
      header: 'Sigla',
      type: 'string',
      defaultFlex: 0.5,
      operator:'contains',
      render: ({ data }: any) => {
        const text = data.sigla
        const linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(data.idassociacao))}`
        
        return (
            <div>
            <Link to={linkTo}>
                {text}
            </Link>
        </div>
    )}
    },
    { name: 'nmrazao',
        header: 'Razão Social',
        type: 'string',
        defaultFlex: 1.5,
        operator: 'contains',
        render: ({ data }: any) => {
            const text = data.nmrazao
            const linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(data.idassociacao))}`
            
            return (
                <div>
                <Link to={linkTo}>
                    {text}
                </Link>
            </div>
        )
    }
    },
    { name: 'dsemail', header: 'E-mail', type: 'string', defaultFlex: 1 , operator:'contains' },
    {
        name: 'flativo', 
        header: 'Status', 
        type: 'select',
        operator: 'equals',
        value: 'S',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: activeValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ value }: any) => (
            <div className="flex items-center justify-center">
                <TagActiveInative value={value} activeText="S" />
            </div>
        ),
    },
]


const Entidades = () => {
    const [checkedMostrarTudo, setMostrarTudo] = useState(false)
    const { user } = useAppSelector((state) => state.auth)
    
    const radioGroup = (
        <div className='flex items-center'>
            <span className="font-black">Mostrar todos</span>
            <div className='mr-2'>
                <Tooltip
                    placement='top'
                    title={
                        <div>
                            Caso desmarcado, apresenta apenas entidades ligadas ao usuário.
                        </div>
                    }
                >
                    <FcInfo size={20} className='mt-1 ml-2' />
                </Tooltip>
            </div>
            <Checkbox checked={checkedMostrarTudo} onChange={setMostrarTudo} />
        </div>
    )

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
            <div className="flex items-center">
                <h3 className="mb-4 lg:mb-0">Entidades</h3>
                <Tooltip title="Para saber mais sobre o uso da Lista de Entidades clique aqui" placement="right-end">
                <Button
                    shape="circle"
                    size="xs"
                    icon={<FaQuestion />}
                    className="ml-2" // Ajuste o espaçamento aqui, se necessário
                    onClick={() => {
                        window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MjA2Nw==')
                    }}
                />
            </Tooltip>
            </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>

                    {user.recursos.includes('ace_expor') && (
                        <>
                            <Button size="sm" icon={<AiFillFileExcel />}>
                                <Link
                                    className="menu-item-link"
                                    to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/`}
                                >
                                    Exportar Perfis
                                </Link>
                            </Button>

                            <Button size="sm" icon={<AiOutlineUser />}>
                                <Link
                                    className="menu-item-link"
                                    to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/`}
                                >
                                    Exportar Contatos
                                </Link>
                            </Button>
                        </>
                    )}

            {user.recursos.includes('ace_adici') && (
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/adicionar`}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar Entidade
                        </Button>
                    </Link>
                    )}
                </div>
            </div>

            <CustomReactDataGrid
                filename='entidades'
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/entidades?mostrarTudo=${checkedMostrarTudo}`}
                options={radioGroup}
                CardLayout={EntidadeCard}
            />

        </AdaptableCard>
    )
}

export default Entidades

