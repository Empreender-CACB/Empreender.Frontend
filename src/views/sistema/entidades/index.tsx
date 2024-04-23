/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button, Checkbox, Tooltip } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
import { FcInfo } from 'react-icons/fc'
// import { associacaoCard } from '@/components/shared/TableCards/associacaoCard'

moment.locale('pt-br')
const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
]

const columns = [
    { name: 'idassociacao', header: 'ID', type: 'number', defaultFlex: 0.3 },
    { name: 'nome', header: 'Tipo de Entidade', type: 'string', defaultFlex: 1 },
    { name: 'nmpais', header: 'País', type: 'string', defaultFlex: 1 },
    {
        name: 'iduf', header: 'UF', type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: estadosBrasileiros.map(state => ({ id: state.sigla, label: state.sigla }))
        },
        defaultFlex: 0.3
    },
    { name: 'nmcidade', header: 'Cidade', type: 'string', defaultFlex: 1 },
    { name: 'sigla', header: 'Sigla', type: 'string', defaultFlex: 0.5 },
    { name: 'nmrazao', header: 'Razão Social', type: 'string', defaultFlex: 1.5 },
    { name: 'dsemail', header: 'Email', type: 'string', defaultFlex: 1 },
    {
        name: 'flativo', 
        header: 'Ativo', 
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
];


const associacaos = () => {
    const [checkedMostrarTudo, setMostrarTudo] = useState(true)

    const radioGroup = (
        <div className='flex items-center'>
            <span className="font-black">Mostrar tudo</span>

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
    );
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Associações</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to="/app/sales/product-new"
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
                </div>
            </div>
            <CustomReactDataGrid
                filename='entidades'
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/entidades?mostrarTudo=${checkedMostrarTudo}`}
                options={radioGroup}
            // CardLayout={associacaosCard}
            />

        </AdaptableCard>
    )
}

export default associacaos
