import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { apiGetPolitica } from '@/services/CookiesService'
import { Cookie } from '@/@types/Cookies';

// const Log = (props: LogProps) => {
//     return (
//         <div className={`py-4 ${props.border && 'border-bottom'}`}>
//             <div className="flex items-center">
//                 <h5 className="font-weight-normal mb-0 mr-3">
//                     {props.version}
//                 </h5>
//                 <code>{props.date}</code>
//             </div>
//             <div className="api-container p-0 border-0 mt-3">
//                 {props.children}
//             </div>
//         </div>
//     )
// }

const Cookies = () => {
    const [politica, setPolitica] = useState<Cookie | null>(null); // Iniciando o estado com null
    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const response = await apiGetPolitica();
                setPolitica(response.data);
            } catch (error) {
                console.error('Erro ao buscar o artigo:', error);
            }
        };

        fetchArticleData();
    }, []); 

    return (
        <Container>
            <AdaptableCard>
            <div>
            {/* Renderize a política de cookies aqui */}
            {politica && (
                <div>
                    {/* Exemplo: Acessando propriedades do objeto politica */}
                    <div dangerouslySetInnerHTML={{__html: politica.texto}} />
                    {/* Adicione mais renderizações conforme necessário */}
                </div>
            )}
        </div>
            </AdaptableCard>
        </Container>
    )
}

export default Cookies
