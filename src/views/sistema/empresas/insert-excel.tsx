import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'

const ExcelUpload = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [cpf, setCPF] = useState(user ? user.nucpf : '')

  const handleFileUpload = async (event) => {
    setLoading(true)
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, {
            type: 'array',
            cellDates: false
        })

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { rawNumbers: true })

        const modifiedData = jsonData.map((obj) => ({
            ...obj,
            cnpj: String(obj.cnpj).padStart(14, '0'),
            user_id: cpf
        }))

        const requiredColumns = ['cnpj', 'contato', 'telefone', 'email', 'idassociacao']
        const missingColumns = requiredColumns.filter((column) => !Object.keys(modifiedData[0]).includes(column))

        if (missingColumns.length > 0) {
            toast.push(
                <Notification title="Erro" type="danger">
                    {missingColumns.length === 1 ? `O arquivo Excel está sem a seguinte coluna obrigatória: ${missingColumns[0]}` : `O arquivo Excel está sem as seguintes colunas obrigatórias: ${missingColumns.join(', ')}`}
                </Notification>
            )
            setLoading(false)
            return
        }

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/empresa-excel/${cpf}`, {
                method: 'DELETE'
            })

            const response = await fetch(`${import.meta.env.VITE_API_URL}/empresa-excel/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modifiedData)
            })

            if (!response.ok) {
                throw new Error('Erro ao enviar dados para a API')
            }

            const result = await response.json()
            console.log('Dados enviados com sucesso:', result)
        } catch (error) {
            console.error('Erro:', error)
            toast.push(
                <Notification title="Erro" type="danger">
                    {`Erro ao processar dados: ${error.message}`}
                </Notification>
            )
        }

        setLoading(false)
        navigate('/sistema/show-excel')
    }

    reader.readAsArrayBuffer(file)
}


  return (
    <div className='p-4'>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Container>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant='solid'
            onClick={() => document.getElementById('file-upload').click()}
            loading={loading}
          >
            {loading ? 'Carregando...' : 'Selecionar Arquivo'}
          </Button>
        </div>
        <p style={{ color: 'red', marginTop: '10px' }}>Por favor, assegure-se de que o arquivo Excel contenha as seguintes colunas: cnpj, nmcontato, telefone, email, idassociacao.</p>
      </Container>
    </div>
  )
}

export default ExcelUpload
