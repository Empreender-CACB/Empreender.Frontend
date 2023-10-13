import { useEffect, useState } from 'react'
import Slider from 'react-slick'

import xml2js from 'xml2js'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAppSelector } from '@/store'
import { apiGetImages, apiGetVideos } from '@/services/TelaInicialServices'

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
    const [avisoNavigantes, setAvisoNavigantes] = useState([])

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    'https://blog.cacbempreenderapp.org.br/?feed=rss2'
                )
                const data = await response.text()

                xml2js.parseString(data, (error, result) => {
                    if (error) {
                        console.error('Error parsing XML:', error)
                        return
                    }

                    const items = result.rss.channel[0].item
                    const newsList = items.map((item, index) => {
                        return {
                            titulo: item.title[0],
                            descricao: item.description[0]
                                .split('...')[0]
                                .substr(0, 170),
                            link_leiamais: item.link[0],
                        }
                    })

                    console.log(newsList);

                    setAvisoNavigantes(newsList)
                })
            } catch (error) {
                console.error('Failed to fetch news:', error)
            }
        }

        fetchNews()
    }, [])

    const [images, setImages] = useState([])
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await apiGetImages()
                setImages(response.data)
            } catch (error) {
                console.error('Não foi possível carregar as imagens:', error)
            }
        }
        fetchImages()
    }, [])

    const [videos, setVideos] = useState([])
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await apiGetVideos()
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
                    {avisoNavigantes.map((news, index) => (
                        <div key={index}>
                            <h1>{news.titulo}</h1>
                            <p>{news.descricao}</p>
                            <a
                                href={news.link_leiamais}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Leia mais
                            </a>
                        </div>
                    ))}
                </div>
                <div className="w-full sm:w-1/2 sm:max-w-[492px] mx-auto sm:mx-0">
                    <Slider {...settingsImages} className="max-h-[616px]">
                        {images.map((image, index) => (
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
                                            alt={`Slide ${index + 1}`}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        style={{ border: '2px solid black' }}
                                        // src={`https://teste.cacbempreenderapp.org.br/sistema/anexo/download-anexo/aid/${btoa(
                                        //     image.id_anexo
                                        // )}`}
                                        src={`/img/slide1.png`}
                                        alt={`Slide ${index + 1}`}
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
                    {videos.map((video) => {
                        // Extrair o id_video do link usando regex
                        const videoIdMatch = video.link.match(/v=([^&]+)/)
                        const videoId =
                            videoIdMatch && videoIdMatch[1]
                                ? videoIdMatch[1]
                                : ''

                        return (
                            <div key={video.id} className="p-2 sm:w-1/4 w-full">
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
                    })}
                </Slider>
            </div>
        </div>
    )
}

export default Inicio
