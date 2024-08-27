import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import { HiOutlineReply, HiBell } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import Iframe from 'react-iframe'
import ApiService from '@/services/ApiService'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useEffect } from 'react'

function openNotification(data: any) {
    const toastNotification = (
        <Notification title="Sucesso!" type='success'>
            {data.message}
        </Notification>
    );

    toast.push(toastNotification);
}

const notifyBlogPDE = async () => {
    try {
        const response = await ApiService.fetchData({
            url: '/notifications/notifyBlogPDE',
            method: 'post',
        });
        openNotification(response.data)

    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


const setBlogRead = async () => {
    try {
        await ApiService.fetchData({
            url: '/notifications/setBlogRead',
            method: 'post',
        });
        // Handle successful response
    } catch (error) {
        // Handle errors
        //console.error('Error setting blog to read:', error);
    }
};


const Blog = () => {

    useEffect(() => {
        setBlogRead();
    }, [])

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Aviso aos navegantes</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button className='mr-2' size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/faq/blog`}
                        >
                            Versão antiga
                        </Link>
                    </Button>

                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiBell />}
                        onClick={notifyBlogPDE}
                    >
                        Marcar novidades
                    </Button>
                </div>
            </div>

            <div className='h-full pb-10'>
                <Iframe url="https://blog.cacbempreenderapp.org.br/"
                    width="100%"
                    height="100%"

                    position="static" />
            </div>

        </AdaptableCard>
    )
}

export default Blog
