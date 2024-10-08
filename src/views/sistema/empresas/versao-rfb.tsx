import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'
import { Container } from '@/components/shared'
import ApiService from '@/services/ApiService'
import { useNavigate } from 'react-router-dom'

const VersaoRFB = () => {
    const [rfbData, setRfbData] = useState('')

    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await ApiService.fetchData({
                url: `/rfb/versao`,
                method: 'get'
            })
            setRfbData(response.data.rfbVersion || 'Informação indisponível')
        } catch (error) {
            console.error('Error fetching data:', error)
            setRfbData('Erro ao obter a versão da RFB')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        
        <Container className="flex items-center justify-center my-8">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto">
                <h2 className="text-lg font-bold mb-4">Versão da RFB</h2>
                    <p>
                        {rfbData.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                <div className="flex justify-end space-x-4">
                    <Button 
                        variant="default" 
                        onClick={() => navigate('/sistema/')}
                    >
                        Voltar
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default VersaoRFB
