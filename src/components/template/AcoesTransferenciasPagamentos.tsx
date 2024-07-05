import { Button } from '@/components/ui';
import { Link } from 'react-router-dom'
import { HiCalendar, HiCurrencyDollar } from 'react-icons/hi'
import RecusarLancamento from './lancamento/RecusarLancamento'
import LancarPagamentoLancamento from './lancamento/LancarPagamentoLancamento'


const AcoesTransferencaisPagamentos = ( data: any ) => {
    
    return (
        <div>   
            <div>
                { LancarPagamentoLancamento(data) }
            </div> 
            <div>
                { RecusarLancamento(data) }
            </div>
        </div>
       
    )
}

export default AcoesTransferencaisPagamentos