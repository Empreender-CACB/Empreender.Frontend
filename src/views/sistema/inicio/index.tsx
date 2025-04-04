/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Key, useEffect, useState } from 'react'
import "./style.css"
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
import { Link } from 'react-router-dom'
import { AdaptableCard } from '@/components/shared'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
// import Forbidden from '@/utils/forbidden'

type Noticia = {
    titulo: string
    descricao?: string
    link: string
}

const greetingMessage = (gender: string) => {
    const currentHour = new Date().getHours();

    let greeting = '';
    const welcome = gender === 'F' ? 'bem-vinda' : 'bem-vindo';

    if (currentHour < 12) {
        greeting = `Bom dia, seja muito ${welcome}`;
    } else if (currentHour < 18) {
        greeting = `Boa tarde, seja muito ${welcome}`;
    } else {
        greeting = `Boa noite, seja muito ${welcome}`;
    }

    return greeting;
}

const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const Arrow = (props: {
    disabled: boolean
    left?: boolean
    onClick: (e: any) => void
}) => {
    const disabled = props.disabled ? " arrow--disabled" : ""
    return (
        <svg
            className={`arrow ${props.left ? "arrow--left" : "arrow--right"
                } ${disabled}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            onClick={props.onClick}
        >
            {props.left && (
                <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
            )}
            {!props.left && (
                <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
            )}
        </svg>
    )
}

const Inicio = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [loaded, setLoaded] = useState(false)
    const [selectedVideoId, setSelectedVideoId] = useState<any>(null);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        created() {
            setLoaded(true)
        },
    })

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
    const { cdsexo } = useAppSelector(
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

    const [images, setImages] = useState(null);
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
                <div>
                    <h3>
                        {greetingMessage(cdsexo)},{' '}
                        {nmusuario ? nmusuario.split(' ')[0] : ''}
                    </h3>
                    <p>Bom trabalho !</p>
                </div>
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
                        <div
                            className={`grid grid-cols-1 ${noticiasBlog.length < 6 ? 'md:grid-cols-1' : 'md:grid-cols-3'
                                } gap-4`}
                        >
                            {noticiasBlog.map((news, index) => (
                                <Card key={index} className={`${noticiasBlog.length < 6 ? '' : 'h-48'} overflow-hidden`}>
                                    <a
                                        href={news.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h3 className="font-medium mb-2">{news.titulo}</h3>
                                    </a>
                                    {news.descricao && (
                                        <p className="text-sm line-clamp-3">
                                            {news.descricao.replace('[&#8230;]', '...')}
                                        </p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Bloco de boas-vindas */}

                </div>

                {/* Segunda Coluna: Carrossel de Imagens */}
                <div className="lg:col-span-2 col-span-1 w-full">
                    {images && (
                        <>
                            <div className="navigation-wrapper">
                                <div ref={sliderRef} className="keen-slider">
                                    {images.map((image: { link: string }, index: Key) => (


                                        <div key={index} className={`keen-slider__slide number-slide1`}>
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
                                                        src={`https://back.cacbempreenderapp.org.br/anexo/${image.id_anexo}/download`}
                                                        alt={`Slide ${index}`}
                                                    />
                                                </a>
                                            ) : (
                                                <img
                                                    style={{ border: '2px solid black' }}
                                                    src={`https://back.cacbempreenderapp.org.br/anexo/${image.id_anexo}/download`}
                                                    alt={`Slide ${index}`}
                                                />
                                            )}
                                        </div>


                                    ))}
                                </div>
                                {loaded && instanceRef.current && (
                                    <>
                                        <Arrow
                                            left
                                            onClick={(e: any) =>
                                                e.stopPropagation() || instanceRef.current?.prev()
                                            }
                                            disabled={currentSlide === 0}
                                        />

                                        <Arrow
                                            onClick={(e: any) =>
                                                e.stopPropagation() || instanceRef.current?.next()
                                            }
                                            disabled={
                                                currentSlide ===
                                                instanceRef.current.track.details.slides.length - 1
                                            }
                                        />
                                    </>
                                )}
                            </div>
                            {loaded && instanceRef.current && (
                                <div className="dots">
                                    {[
                                        ...Array(instanceRef.current.track.details.slides.length).keys(),
                                    ].map((idx) => {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    instanceRef.current?.moveToIdx(idx)
                                                }}
                                                className={"dot" + (currentSlide === idx ? " active" : "")}
                                            ></button>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

            <AdaptableCard className='mt-5'>
                <h4 className="mb-4">Galeria de vídeos</h4>
                <Slider {...settingsVideos} className='mb-5'>
                    {videos.map((video: { link: string; id: Key; titulo_carousel: string }) => {
                        const videoIdMatch = video.link.match(/(?:v=|\/shorts\/)([^&?]+)/);
                        const videoId = videoIdMatch ? videoIdMatch[1] : '';

                        
                        return (
                            <div
                                key={video.id}
                                className="p-2 sm:w-1/4 w-full mb-4"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setSelectedVideoId(videoId);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <a href="#" className="js-modal-btn block" data-video-id={videoId}>
                                <div className="thumb bg-center bg-no-repeat bg-black" style={{ width: 'auto', height: '200px' }}>
                                    <img
                                        src={getThumbnailUrl(videoId)}
                                        alt="Thumbnail do vídeo"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                    <h6 className="mt-2 text-center">{video.titulo_carousel}</h6>
                                </a>
                            </div>
                        );
                    })}

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
            </AdaptableCard>

        </div>
    )
}

export default Inicio
