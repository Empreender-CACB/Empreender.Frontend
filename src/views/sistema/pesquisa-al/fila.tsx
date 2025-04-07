import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AdaptableCard } from '@/components/shared'
import { HiPlusCircle, HiUpload, HiOutlineClipboardList, HiOutlineDocumentReport } from 'react-icons/hi'
import Papa from 'papaparse'
import ApiService from '@/services/ApiService'

export default function ImportarCSVPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedHeader, setSelectedHeader] = useState<string>('')
  const [selectedEmailHeader, setSelectedEmailHeader] = useState<string>('')

  const [previewRows, setPreviewRows] = useState<any[]>([])

  const [stats, setStats] = useState({
    fila: 0,
    enviados: 0,
    ultimaCarga: '-',
    respondidos: 0
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      Papa.parse(selected, {
        header: true,
        preview: 5,
        complete: (results: any) => {
          if (results.meta?.fields) {
            setHeaders(results.meta.fields)
            setSelectedHeader(results.meta.fields[0])
            setPreviewRows(results.data.slice(0, 5))
          }
        },
      })
    }
  }

  const handleUpload = async () => {
    if (!file || !selectedHeader) return alert('Selecione um arquivo CSV e uma coluna.');

    const formData = new FormData();
    formData.append('csv', file);
    formData.append('colunaCnpj', selectedHeader);
    formData.append('colunaEmail', selectedEmailHeader);

    setLoading(true);
    setFeedback('');

    try {
      const res = await ApiService.fetchData({
        url: 'pesquisa-al/import-cnpj',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { inseridos } = res.data;
      setFeedback(`${inseridos} empresas adicionadas à fila com sucesso.`);
      fetchStats();
    } catch (err) {
      console.error(err);
      setFeedback('Erro ao processar o arquivo.');
    } finally {
      setLoading(false);
    }
  };


  const fetchStats = async () => {
    try {
      const res = await ApiService.fetchData({
        url: '/pesquisa-al/stats',
        method: 'get',
      });

      setStats(res.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas', error);
    }
  };

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Pesquisa AL - Fila</h3>

      </div>
      <div className="max-w-5xl mx-auto mt-10 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><div className="p-4"><p className="text-sm text-gray-500 flex items-center gap-2"><HiOutlineClipboardList /> Na fila</p><p className="text-2xl font-semibold">{stats.fila}</p></div></Card>
          <Card><div className="p-4"><p className="text-sm text-gray-500 flex items-center gap-2"><HiUpload /> Enviados</p><p className="text-2xl font-semibold">{stats.enviados}</p></div></Card>
          <Card><div className="p-4"><p className="text-sm text-gray-500 flex items-center gap-2"><HiOutlineDocumentReport /> Respondidos</p><p className="text-2xl font-semibold">{stats.respondidos}</p></div></Card>
          <Card><div className="p-4"><p className="text-sm text-gray-500 flex items-center gap-2"><HiPlusCircle /> Última carga</p><p className="text-2xl font-semibold">{stats.ultimaCarga}</p></div></Card>
        </div>

        <Card>
          <div className="space-y-6 p-6">
            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-200">
              Faça o upload de um arquivo CSV contendo a coluna de CNPJs. Após selecionar o arquivo, você poderá escolher qual coluna utilizar para importar as empresas para a fila de envio.
            </div>

            <div className="space-y-2">
              <label htmlFor="csv" className="font-medium text-gray-800">Importar CSV com CNPJs</label>
              <Input type="file" id="csv" accept=".csv" onChange={handleFileChange} />
            </div>

            {headers.length > 0 && (
              <>
                <div className="space-y-2">
                  <label className="font-medium text-gray-800">Selecione a coluna com CNPJs</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedHeader}
                    onChange={(e) => setSelectedHeader(e.target.value)}
                  >
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>

                  <label className="font-medium text-gray-800">Selecione a coluna com E-mails</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedEmailHeader}
                    onChange={(e) => setSelectedEmailHeader(e.target.value)}
                  >
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>

                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Pré-visualização dos primeiros registros:</p>
                  <table className="table-auto w-full text-sm">
                    <thead>
                      <tr>
                        {headers.map((header) => (
                          <th
                            key={header}
                            className={`text-left px-2 py-1 border-b border-gray-300 ${header === selectedHeader ? 'bg-blue-100 text-blue-800' : ''}`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, index) => (
                        <tr key={index} className="border-b">
                          {headers.map((header) => (
                            <td
                              key={header}
                              className={`px-2 py-1 ${header === selectedHeader ? 'bg-blue-50 font-semibold text-blue-900' : ''}`}
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <Button onClick={handleUpload} disabled={loading}>
              {loading ? 'Enviando...' : 'Importar'}
            </Button>

            {feedback && <p className="text-sm text-gray-700 mt-2">{feedback}</p>}
          </div>
        </Card>
      </div>
    </AdaptableCard>
  )
}
