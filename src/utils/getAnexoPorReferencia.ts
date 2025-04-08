import axios from 'axios'

export type AnexoReferencia = {
  id: number
  nome: string
  nome_arquivo: string
  descricao?: string
}

export const getAnexoPorReferencia = async (
  referencia: string
): Promise<AnexoReferencia | null> => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/documento/${referencia}`)
    const anexo = response.data

    return anexo;
  } catch (error) {
    console.error(`Erro ao buscar anexo para referência "${referencia}"`, error)
    return null
  }
}
