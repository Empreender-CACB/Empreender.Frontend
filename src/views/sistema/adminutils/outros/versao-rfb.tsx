import axios from 'axios'

export async function fetchRfbVersion() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/rfb/versao`)
        const { rfbVersion } = response.data
        return rfbVersion
    } catch (error) {
        console.error('Erro ao obter a versão da RFB:', error)
    }
}

