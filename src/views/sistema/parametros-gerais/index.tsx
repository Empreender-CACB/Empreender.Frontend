import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import { NucleosCard } from '@/components/shared/TableCards/NucleosCard'


const columns = [

    {
        name: 'id',
        header: 'ID',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'nome',
        header: 'Nome',
        defaultFlex: 0.7,
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'descricao',
        header: 'Descrição',
        defaultFlex: 1,
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'valor',
        header: 'Valor',
        defaultFlex: 1,
        type: 'string',
        operator: 'contains',
        value: '',
    }
]


const ParametrosGerais = () => {

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Parâmetros gerais</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button className='mr-2' size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/parametro-geral/index`}
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
                            Adicionar parâmetro
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename='ParametrosGerais'
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/parametros-gerais`}
                CardLayout={NucleosCard}
            />
            
        </AdaptableCard>
    )
}

export default ParametrosGerais
