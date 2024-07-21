import { useState } from 'react'
import * as XLSX from 'xlsx'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import ApiService from '@/services/ApiService'
import Breadcrumb from '@/components/breadCrumbs/breadCrumb'

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
            await ApiService.fetchData({ // não precisa dessa requisição - fazer na própria requisição de post a exclusão
                url: `/empresa-excel/${cpf}`,
                method: 'DELETE'
            })

            await ApiService.fetchData({
                url: '/empresa-excel/',
                method: 'POST',
                data: modifiedData
            })

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

  const breadcrumbItems = [
    { label: 'Início', link: '/' },
    { label: 'Inserir novo Lote', link: '/sistema/insert-excel' },
  ]

  return (
    <div className='p-4'>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Container>
      <Breadcrumb items={breadcrumbItems} /> 
      <h3 className="mb-4 lg:mb-3">Inserir Novo Lote</h3>
      <div className="flex justify-end items-center space-x-4 mb-4">
      <div className="flex-grow flex flex-col items-start">
        <p className="text-red-500 text-lg text-left">
          1 - Por favor, assegure-se de que o arquivo Excel (Extensão .xlsx) contenha as seguintes colunas: cnpj, contato, telefone, email e idassociacao.
        </p>
        <p className="text-red-500 mt-2 text-lg text-left">
          2 - Atenção, a inserção de um novo arquivo apaga informações de uma importação anterior. Caso precise dos dados, exporte a tabela previamente.
        </p>
        <p className="text-red-500 mt-2 text-lg text-left">
          3 - Caso precise de um molde de arquivo ".xlsx",{' '}
          <a
            href="#"
            className="text-blue-500 underline"
            onClick={() => window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTIwMzQ=')}
          >
            clique aqui
          </a>
          {' '}para baixar.
        </p>

      </div>
      <Button
        variant='solid'
        onClick={() => document.getElementById('file-upload').click()}
        loading={loading}
      >
        {loading ? 'Carregando...' : 'Selecionar Arquivo'}
      </Button>
      <Button
        variant='solid'
        onClick={() => navigate('/sistema/show-excel')}
      >
        Visualizar Lote Atual
      </Button>
    </div>

      </Container>
    </div>
  )
}

export default ExcelUpload
