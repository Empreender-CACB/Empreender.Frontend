import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { useState, useEffect } from 'react'
import ParametrosGeraisService from '@/services/ParametrosGeraisService';
import { BsTwitterX, BsFacebook, BsInstagram, BsYoutube, BsLinkedin } from "react-icons/bs";
import { FaFlickr } from "react-icons/fa";
export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}
const navigation = [
    {
        name: 'Facebook',
        href: 'https://facebook.com/programaempreendercacb',
        icon: () => (
            <BsFacebook />
        ),
        color: 'text-blue-600',
    },
    {
        name: 'Instagram',
        href: 'https://instagram.com/_cacb',
        icon: () => (
            <BsInstagram />
        ),
        color: 'text-pink-500',
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com/cacbnoticias',
        icon: () => (
            <BsTwitterX />
        ),
        color: 'text-blue-300',
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/cacbnoticias',
        icon: () => (
            <BsYoutube />
        ),
        color: 'text-red-500',
    },
    {
        name: 'Flickr',
        href: 'https://www.flickr.com/photos/_cacb/',
        icon: () => (
            <FaFlickr />
        ),
    },
    {
        name: 'Linkedin',
        href: 'https://www.linkedin.com/company/cacbconfederacao',
        icon: () => (
            <BsLinkedin />
        ),
        color: 'text-blue-500',
    },
]

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

        <>
            <footer className='bg-white'>
                <div className="flex-auto w-full pb-12 px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        {navigation.map((item) => (
                            <a target='__blank' key={item.name} href={item.href} className={`text-lg ${item.color} hover:text-gray-500`}>
                                <span className="sr-only">{item.name}</span>
                                <item.icon />
                            </a>
                        ))}
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center leading-5 text-gray-500">
                            <span className="font-semibold">{parametro.valor}</span><br />
                            <span className="italic" >Versão 4.91</span>
                        </p>
                    </div>
                </div>
            </footer>
        </>

    )
}

export default function Footer({
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                // `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
            )}
        >
            {pageContainerType === 'contained' ? (
                <div className='mx-full bg-white'>
                    
                    <div className='border border-gray-300 mb-5'>
                    <div className=" mx-auto container py-6 lg:px-8 ">
                    <div className="grid grid-cols-2 gap-7 md:grid-cols-5 lg:grid-cols-5">
                        <div className="col-span-1 justify-end md:col-span- lg:col-span-1">
                            <img className="h-11" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-cacb-mini-novo.png" alt="CACB" />
                        </div>
                        <div className="col-span-1 justify-end flex md:col-span-2 lg:col-span-1">
                            <img className="h-11" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-empreender-mini.png" alt="Empreender" />
                        </div>
                        <div className="col-span-1 justify-end flex md:col-span-2 lg:col-span-1">
                            <img className="h-11" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-alinvest-mini.png" alt="Al-invest" />
                        </div>
                        <div className="col-span-1 justify-end flex md:col-span-2 lg:col-span-1">
                            <img className="h-16" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-cmec.png" alt="CMEC" />
                        </div>
                        <div className="col-span-1 justify-end flex md:col-span-2 lg:col-span-1">
                            <img className="h-11" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-sebrae-mini.png" alt="SEBRAE" />
                        </div>

                    </div>
                </div>
                    </div>

                    <div className='mx-auto container'>
                        
                        <FooterContent />

                    </div>
                </div>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
