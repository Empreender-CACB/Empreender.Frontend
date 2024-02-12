import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { useState, useEffect } from 'react'
import ParametrosGeraisService from '@/services/ParametrosGeraisService';

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}

const FooterContent = () => {
    const [parametro, setParametro] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ParametrosGeraisService.show(2);
                setParametro(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar parâmetros gerais:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex items-center justify-between flex-auto w-full">
                
            {/* <span className="font-semibold">{`${APP_NAME}`}</span> 1999 - {`${new Date().getFullYear()}`}{' '}
               . Mantido pela equipe Empreender {parametro.valor}
            </span> */}
            <span className="font-semibold">{parametro.valor}</span>
            {/* <div className="">
                <a
                    className="text-gray"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    Term & Conditions
                </a>
                <span className="mx-2 text-muted"> | </span>
                <a
                    className="text-gray"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    Privacy & Policy
                </a>
            </div> */}
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
