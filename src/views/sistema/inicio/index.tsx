import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAppSelector } from '@/store'
import MapHeat from '@/components/template/MapHeat'
import { apiGetImages, apiGetVideos } from '@/services/TelaInicialServices'
import {
    StatisticCard,
    StatisticGroup,
} from '@/components/template/StatisticCard'
import {
    HiOfficeBuilding,
    HiOutlineClipboardCheck,
    HiOutlineClipboardList,
    HiOutlineOfficeBuilding,
} from 'react-icons/hi'

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

    // const [images, setImages] = useState([])
    // useEffect(() => {
    //     const fetchImages = async () => {
    //         try {
    //             const response = await apiGetImages()
    //             setImages(response.data)
    //         } catch (error) {
    //             console.error('Não foi possível carregar as imagens:', error)
    //         }
    //     }
    //     fetchImages()
    // }, [])

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
            <StatisticGroup>
                <StatisticCard
                    icon={<HiOfficeBuilding />}
                    backgroundColor="bg-blue-100"
                    textColor="text-blue-600"
                    label="Número de Empresas"
                    value={500}
                    growthValue={50}
                />
                <StatisticCard
                    icon={<HiOutlineOfficeBuilding />}
                    backgroundColor="bg-green-100"
                    textColor="text-green-600"
                    label="Entidades Cadastradas"
                    value={28}
                    growthValue={8}
                />
                <StatisticCard
                    icon={<HiOutlineClipboardList />}
                    backgroundColor="bg-yellow-100"
                    textColor="text-yellow-600"
                    label="Projetos em Andamento"
                    value={8}
                    growthValue={3}
                />
                <StatisticCard
                    icon={<HiOutlineClipboardCheck />}
                    backgroundColor="bg-red-100"
                    textColor="text-red-600"
                    label="Projetos Concluídos 2023"
                    value={30}
                    growthValue={5}
                />
            </StatisticGroup>

            <div className="flex flex-col sm:flex-row items-start justify-between w-full">
                <div className="w-full sm:w-[60%] mb-4 sm:mb-0">
                    <div className="mb-4 w-full">
                        <h2 className="text-lg font-bold mb-2">
                            Últimas Notícias
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded shadow-sm">
                                <h3 className="font-medium mb-2">
                                    Título da Notícia 1
                                </h3>
                                <p>Resumo da notícia 1...</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <h3 className="font-medium mb-2">
                                    Título da Notícia 2
                                </h3>
                                <p>Resumo da notícia 2...</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <h3 className="font-medium mb-2">
                                    Título da Notícia 3
                                </h3>
                                <p>Resumo da notícia 3...</p>
                            </div>
                        </div>
                        <div className="text-right mt-2">
                            <button className="text-indigo-600 hover:text-indigo-800 transition duration-150">
                                Ver mais
                            </button>
                        </div>
                    </div>
                    <MapHeat />
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
