/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, useEffect, useState } from 'react'
import Slider from 'react-slick'
import Button from '@/components/ui/Button'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAppSelector } from '@/store'
import { apiGetImages, apiGetVideos } from '@/services/TelaInicialServices'
import ApiService from '@/services/ApiService'
import { AxiosResponse } from 'axios'
import { Card } from '@/components/ui'
import UserAlerts from '@/components/template/UserAlerts'
import Dialog from '@/components/ui/Dialog';

type Noticia = {
    titulo: string
    descricao?: string
    link: string
}

const greetingMessage = (capitalize = true) => {
    const currentHour = new Date().getHours()

    let greeting = ''
    if (currentHour < 12) {
        greeting = 'bom dia'
    } else if (currentHour < 18) {
        greeting = 'boa tarde'
    } else {
        greeting = 'boa noite'
    }

    return capitalize
        ? greeting.charAt(0).toUpperCase() + greeting.slice(1)
        : greeting
}

const settingsImages = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
}

const Inicio = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const settingsVideos = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: window.innerWidth <= 640 ? 1 : 4,
        slidesToScroll: window.innerWidth <= 640 ? 1 : 4,
        prevArrow: <button style={{ color: 'black', zIndex: 1 }}>{'<'}</button>,
        nextArrow: <button style={{ color: 'black', zIndex: 1 }}>{'>'}</button>,
    }

    const { nmusuario } = useAppSelector(
        (state) => state.auth.user
    )
    const [noticiasBlog, setNoticiasBlog] = useState<Noticia[]>([])

    // let num_noticias = '3'

    // if (preferencias && preferencias.num_noticias) {
    //     num_noticias = preferencias.num_noticias
    // }
    // console.log('preferencias', preferencias)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response: AxiosResponse = await ApiService.fetchData({
                    url: '/blog',
                    method: 'get',
                })

                if (response.data) {
                    setNoticiasBlog(response.data)
                }
            } catch (error) {
                console.error('Erro ao buscar notícias:', error)
            }
        }

        fetchNews()
    }, [])

    const [images, setImages] = useState<any>([])
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response: AxiosResponse = await apiGetImages()
                setImages(response.data)
            } catch (error) {
                console.error('Não foi possível carregar as imagens:', error)
            }
        }
        fetchImages()
    }, [])

    const [videos, setVideos] = useState<any>([])
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response: AxiosResponse = await apiGetVideos()
                setVideos(response.data)
            } catch (error) {
                console.error('Não foi possível carregar os vídeos:', error)
            }
        }
        fetchVideos()
    }, [])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4 w-full">
                <h2>
                    {greetingMessage()},{' '}
                    {nmusuario ? nmusuario.split(' ')[0] : ''}
                </h2>
                <UserAlerts />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 w-full items-start">
                <div className="lg:col-span-4 col-span-1">
                    {/* Bloco de Notícias */}
                    <div className="my-7 w-full">
                        <div className="flex justify-between align-center">
                            <h2 className="text-lg font-bold mb-2">
                                Últimas Notícias
                            </h2>
                            <a
                                href="https://blog.cacbempreenderapp.org.br"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="xs" variant="solid">
                                    Leia mais
                                </Button>
                            </a>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-${noticiasBlog.length} gap-4`}>

                            {noticiasBlog.map((news, index) => (
                                <Card key={index}>
                                    <a
                                        href={news.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h3 className="font-medium mb-2">
                                            {news.titulo}
                                        </h3>
                                    </a>
                                    {news.descricao && (
                                        <p>
                                            {news.descricao.substr(0, 100) +
                                                '...'}
                                        </p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Bloco de boas-vindas */}
                    <div
                        className="bg-no-repeat bg-cover py-6 px-12 min-h-[360px] pb-4 flex flex-col rounded-lg"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1670364781788-29998f919471?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                            backgroundPosition: '-10% 9%',
                        }}
                    >
                        <div className="text-white font-bold mt-4 flex-grow w-full lg:w-1/2">
                            <h2 className="text-white mb-4">
                                Estamos em obras!
                            </h2>
                            <h6 className="text-white mb-4">
                                Vamos trocar de pneu. Andando.
                            </h6>
                            <h6 className="text-white mb-4">
                                A viagem levará algum tempo, precisamos ir
                                devagar, mas confiamos que chegaremos bem. Aos
                                poucos teremos um novo portal.
                            </h6>

                            <h6 className="text-white mb-4">
                                Bom momento para enviar críticas e sugestões{' '}
                                <a href="#" className="underline">
                                    (clique aqui)
                                </a>
                                . São muito bem-vindas.
                            </h6>

                            <Button
                                className="w-full lg:w-auto"
                                variant="solid"
                                size="sm"
                            >
                                Saiba mais
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Segunda Coluna: Carrossel de Imagens */}
                <div className="lg:col-span-2 col-span-1 w-full">
                    <Slider {...settingsImages} className="max-h-[800px]">
                        {images.map((image: { link: string }, index: Key) => (
                            <div key={index} className="w-full">
                                {image.link ? (
                                    <a
                                        target="_blank"
                                        href={image.link}
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            style={{
                                                border: '2px solid black',
                                            }}
                                            src={`/img/slide1.png`}
                                            alt={`Slide ${index}`}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        style={{ border: '2px solid black' }}
                                        src={`/img/slide1.png`}
                                        alt={`Slide ${index}`}
                                    />
                                )}
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            <div className="mt-20">
                <h4 className="mb-4">Galeria de vídeos</h4>
                <Slider {...settingsVideos}>
                    {videos.map(
                        (video: {
                            link: string
                            id: Key
                            titulo_carousel: string
                        }) => {
                            const videoIdMatch = video.link.match(/v=([^&]+)/)
                            const videoId =
                                videoIdMatch && videoIdMatch[1]
                                    ? videoIdMatch[1]
                                    : ''

                            return (
                                <div
                                    key={video.id}
                                    className="p-2 sm:w-1/4 w-full"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setSelectedVideoId(videoId);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <a
                                        href="#"
                                        className="js-modal-btn block"
                                        data-video-id={videoId}
                                    >
                                        <div
                                            className="thumb bg-center bg-no-repeat bg-black"
                                            style={{
                                                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/0.jpg)`,
                                                width: 'auto',
                                                height: '200px',
                                            }}
                                        ></div>
                                        <h6 className="mt-2 text-center">
                                            {video.titulo_carousel}
                                        </h6>
                                    </a>
                                </div>
                            )
                        }
                    )}
                </Slider>
                <Dialog
                    width={800}
                    height={600}
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onRequestClose={() => setIsDialogOpen(false)}
                >
                    {selectedVideoId && (
                        <>
                        <iframe
                        style={{ marginTop: '15px', paddingBottom: '-15px' }}
                            width="100%"
                            height="500px"
                            src={`https://www.youtube.com/embed/${selectedVideoId}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        </>                
        
                        
                    )}
                </Dialog>
            </div>
        </div>
    )
}

export default Inicio
