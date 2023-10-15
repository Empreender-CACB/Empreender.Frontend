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
import { Alert, Card } from '@/components/ui'
import { HiFire } from 'react-icons/hi'
import UserAlerts from '@/components/template/UserAlerts'

type Noticia = {
    titulo: string
    descricao?: string
    link: string
}

const greetingMessage = () => {
    const currentHour = new Date().getHours()
    if (currentHour < 12) return 'Bom dia'
    if (currentHour < 18) return 'Boa tarde'
    return 'Boa noite'
}

const settingsImages = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
}

const Inicio = () => {
    const settingsVideos = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: window.innerWidth <= 640 ? 1 : 4,
        slidesToScroll: window.innerWidth <= 640 ? 1 : 4,
        prevArrow: <button style={{ color: 'black', zIndex: 1 }}>{'<'}</button>,
        nextArrow: <button style={{ color: 'black', zIndex: 1 }}>{'>'}</button>,
    }

    const { nmusuario } = useAppSelector((state) => state.auth.user)
    const [noticiasBlog, setNoticiasBlog] = useState<Noticia[]>([])

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
            <div className="mb-4 w-full">
                <h2>
                    {greetingMessage()},{' '}
                    {nmusuario ? nmusuario.split(' ')[0] : ''}
                </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start justify-between w-full">
                <div className="w-full sm:w-[60%] mb-4 sm:mb-0">
                    {/* <MapHeat /> */}
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
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
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
                    <UserAlerts />
                </div>
                <div className="w-full sm:w-1/2 sm:max-w-[492px] mx-auto sm:mx-0">
                    <Slider {...settingsImages} className="max-h-[616px]">
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
                                            // src={`https://teste.cacbempreenderapp.org.br/sistema/anexo/download-anexo/aid/${btoa(
                                            //     image.id_anexo
                                            // )}`}

                                            src={`/img/slide1.png`}
                                            alt={`Slide ${index}`}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        style={{
                                            border: '2px solid black',
                                        }}
                                        // src={`https://teste.cacbempreenderapp.org.br/sistema/anexo/download-anexo/aid/${btoa(
                                        //     image.id_anexo
                                        // )}`}
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
            </div>
        </div>
    )
}

export default Inicio
