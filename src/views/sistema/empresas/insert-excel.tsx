import React, { useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'
import * as XLSX from 'xlsx'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import Container from '@/components/shared/Container'
import { useNavigate } from 'react-router-dom'

const { Tr, Th, Td, THead, TBody } = Table

const ExcelPreview = () => {
  const [excelData, setExcelData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  const handleFileUpload = (event) => {
    setLoading(true)
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

      const columnDefs = jsonData[0].map((header, index) => ({
        header: header,
        accessorKey: header,
      }))

      const rowData = jsonData.slice(1).map((row) =>
        row.reduce((acc, cell, index) => {
          acc[jsonData[0][index]] = cell
          return acc
        }, {})
      )

      setColumns(columnDefs)
      setExcelData(rowData)
      setLoading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = async () => {
    const requiredColumns = ['cnpj', 'nmcontato', 'telefone', 'email', 'idassociacao']
    const missingColumns = requiredColumns.filter(column => !columns.some(col => col.accessorKey === column))

    if (missingColumns.length > 0) {
      toast.push(
        <Notification title="Erro" type='danger'>
          {missingColumns.length === 1 ? 
            `O arquivo Excel está sem a seguinte coluna obrigatória: ${missingColumns[0]}` : 
            `O arquivo Excel está sem as seguintes colunas obrigatórias: ${missingColumns.join(', ')}`
          }
        </Notification>
      )
      return
    }    

    const totalRows = excelData.length
    let completedRows = 0

  //  for (const row of excelData) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/empresas/excel/cadastro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(excelData),
        })

        if (!response.ok) {
          throw new Error('Erro ao enviar dados para a API')
        }

        const result = await response.json()
        console.log('Dados enviados com sucesso:', result)

        completedRows++
        setProgress((completedRows / totalRows) * 100)
      } catch (error) {
        console.error('Erro:', error)
      }
    //}

    navigate('/sistema/show-excel')
  }

  const table = useReactTable({
    data: excelData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const onPaginationChange = (page) => {
    table.setPageIndex(page - 1)
  }

  const onSelectChange = (value) => {
    table.setPageSize(Number(value))
  }

  const pageSizeOptions = [
    { value: 10, label: '10 registros por página' },
    { value: 20, label: '20 registros por página' },
    { value: 30, label: '30 registros por página' },
    { value: 40, label: '40 registros por página' },
    { value: 50, label: '50 registros por página' },
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
        <div className="flex justify-between items-center mb-4">
          <Button
            variant='solid'
            onClick={() => document.getElementById('file-upload').click()}
            loading={loading}
          >
            {loading ? 'Carregando...' : 'Selecionar Arquivo'}
          </Button>
          {excelData.length > 0 && (
            <Button
              variant='solid'
              onClick={handleSubmit}
            >
              Enviar Dados
            </Button>
          )}
        </div>
        {progress > 0 && (
          <div className="mb-4">
            <Progress percent={parseFloat(progress).toFixed(2)} />
          </div>
        )}
        <p style={{ color: 'red', marginTop: '10px' }}>Por favor, assegure-se de que o arquivo Excel contenha as seguintes colunas: cnpj, nmcontato, telefone, email, idassociacao.</p>
      </Container>
      {excelData.length > 0 && (
        <div className="w-full sm:w-auto mb-4">
          <Container>
            <Table>
              <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id} colSpan={header.colSpan}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </THead>
              <TBody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <Pagination
                pageSize={table.getState().pagination.pageSize}
                currentPage={table.getState().pagination.pageIndex + 1}
                total={excelData.length}
                onChange={onPaginationChange}
              />
              <div style={{ minWidth: 130 }}>
                <Select
                  size="sm"
                  isSearchable={false}
                  value={pageSizeOptions.filter(
                    (option) => option.value === table.getState().pagination.pageSize
                  )}
                  options={pageSizeOptions}
                  onChange={(option) => onSelectChange(option?.value)}
                />
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  )
}

export default ExcelPreview
