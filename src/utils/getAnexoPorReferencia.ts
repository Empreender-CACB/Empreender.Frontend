import axios from 'axios'

export const getAnexoPorReferencia = async (referencia: string): Promise<number | null> => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/anexo/download-anexo/aid/${referencia}`)
    return response.data.idAnexo
  } catch (error) {
    console.error(`Erro ao buscar anexo para referência "${referencia}"`, error)
    return null
  }
}
