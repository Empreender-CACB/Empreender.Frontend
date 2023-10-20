import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import { NucleosCard } from '@/components/shared/TableCards/NucleosCard'

const columns = [
    { name: 'idpreferencia', header: 'ID', type: 'string' },
    {
        name: 'nome',
        type: 'string',
        header: 'Nome'
    },
    {
        name: 'descricao',
        type: 'string',
        header: 'Descrição'
    },
    {
        name: 'tipo',
        type: 'string',
        header: 'Tipo'
    },
    {
        name: 'valor',
        type: 'string',
        header: 'Valor'
    },
    {
        name: 'grupo',
        type: 'string',
        header: 'Grupo'  
    },
    {
        name: 'slug',
        type: 'string',
        header: 'Slug'  
    }

   
]

const defaultFilterValue = [
    {
        name: 'idpreferencia',
        type: 'string',
        value: '',
    },
    {
        name: 'nome',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'descricao',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'tipo',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'valor',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'grupo',
        operator: 'contains',
        type: 'string' ,
        value: '',   
    },
    {
        name: 'slug',
        operator: 'contains',
        type: 'string' ,
        value: '',   
    },
]

const Preferencias = () => {

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Preferencias</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/nucleo/`}
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
                            Adicionar Preferência
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename='Preferencias'
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/preferences`}
                CardLayout={NucleosCard}
            />
            
        </AdaptableCard>
    )
}

export default Preferencias
