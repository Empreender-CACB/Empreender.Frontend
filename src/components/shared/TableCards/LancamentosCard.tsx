import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { LancamentoStatusTag } from '@/views/sistema/prestcontas/acompanhamento-financeiro/lista-geral-lancamentos'
import { Link } from 'react-router-dom'


export const LancamentosCard = ({ data }: any) => {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(data.vllanc);
    
    const color = data.vllanc < 0 ? 'red' : 'black';

    return (
        <Link
            to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/${data['prlancamento.tplanc'] === 'recei' ? 'lancamento-receita-detalhe' : 'lancamento-despesa-detalhe'}/pid/${btoa(String(data['prlancamento.idprojeto']))}/lid/${btoa(String(data.idlanc))}`}
            smooth={true}
            duration={500}
            offset={-80}
            target='_blank'
        >
            <div className="w-full flex justify-between">
                <h5>Id Lanc: {data.idlanc} / Id Proj: {data['prlancamento.idprojeto']} </h5>
                <LancamentoStatusTag statusKey={data.stlancamento} />
            </div>

            <span style={{ textAlign: 'right', color }}>R$ {formattedValue}</span>
            <p className="mt-2">
                {data.flecofin == 'fin' ? "Financeiro" : "Econômico"} - {data.tplanc == 'recei' ? "Receita" : "Despesa"}
            </p>
        </Link>
    )
}
