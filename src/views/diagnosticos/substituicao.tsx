
import { useEffect, useState } from 'react';
import ApiService from '@/services/ApiService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
import { Alert, Button } from '@/components/ui';
import { useParams } from 'react-router-dom';

interface Quesito {
  quesito: string;
  area: string;
  idAnexo: number;
  nomeArquivo?: string;
  situacao: string;
  nota: number;
  nomeDiagnostico: string;
  nomeEntidade: string;
  dataInclusaoResposta: string;
}

interface FileUploads {
  [quesitoId: number]: File;
}

function SubstituicaoEvidencias() {
  const { idEntidade } = useParams();

  const [diagnosticos, setDiagnosticos] = useState<any[]>([]);
  const [loadingSalvar, setLoadingSalvar] = useState(false)
  const [loadingGeral, setLoadingGeral] = useState(true);
  const [fileUploads, setFileUploads] = useState<FileUploads>({});
  const [uploadSuccess, setUploadSuccess] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setLoadingGeral(true);
    ApiService.fetchData({ url: `substituicao-arquivos-por-entidade/${idEntidade}`, method: 'GET' })
      .then((response: any) => {
        setDiagnosticos(response.data);
        setLoadingGeral(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados', error);
        setLoadingGeral(false);
      });

  }, []);

  const handleFileUpload = (file: File, quesitoId: number): void => {
    const newFileUploads = { ...fileUploads, [quesitoId]: file };
    setFileUploads(newFileUploads);
  };

  const handleCancelUpload = (quesitoId: number): void => {
    const newFileUploads = { ...fileUploads };
    delete newFileUploads[quesitoId];
    setFileUploads(newFileUploads);
    setUploadSuccess(prev => ({ ...prev, [quesitoId]: false }));
  };

  const handleSubmit = async (anexoId: number) => {
    setLoadingSalvar(true);
    const file = fileUploads[anexoId];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('anexoId', String(anexoId));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/substituicao-arquivos-por-entidade-store`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadSuccess(prev => ({ ...prev, [anexoId]: true }));
      }
    } catch (error) {
      console.error('Erro ao enviar arquivos', error);
    }

    setLoadingSalvar(false);
  };

  const SemSubstituicaoComponent = () => {
    return (
      <div className="bg-indigo-700">
        <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              A sua entidade não possuí nenhum arquivo a ser substituído.
              <br />
            </h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-center items-center tracking-tight sm:w-45'>
      <div className=' bg-white sm:w-full lg:w-6/12' id="login">
        <div className="flex items-center space-x-4 mb-4">
          <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
            <div className="grid grid-cols-4 gap-8">
              <div className="col-span-2 flex justify-center sm:col-span-1">
                <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
              </div>
              <div className="col-span-2 flex justify-center sm:col-span-1">
                <img className=" w-11/12 img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
              </div>
              <div className="col-span-2 flex justify-center sm:col-span-1">
                <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" />
              </div>
              <div className="col-span-2 flex justify-center sm:col-span-1">
                <img
                  className="img object-contain sm:h-12"
                  src="https://empreender.cacbempreenderapp.org.br/img/logo/sebrae.svg"
                />
              </div>
            </div>
          </div>
        </div>


        {loadingGeral ? (
          <div className="text-center py-10">
            <span>Carregando dados...</span>
          </div>
        ) : (diagnosticos && diagnosticos.length > 0) ?
          <div>
            <div className='px-10 mb-4'>
              <h2 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mt-4">{diagnosticos[0].nomeEntidade}</h2>
            </div>

            {diagnosticos.map((diagnostico, index) => (
              <div key={index} className="dark:bg-gray-800 px-10 mb-10">
                <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
                  <div className="xl:w-full pb-5 bg-white dark:bg-gray-800">
                    <div className="flex flex-col">
                      <h3 className="text-xl text-gray-700 dark:text-gray-200 font-semibold mt-2">Diagnóstico: {diagnostico.nomeDiagnostico}</h3>
                    </div>
                  </div>

                  <div className="mx-auto">
                    {diagnostico.quesitos.map((quesito: Quesito) => (
                      <div key={quesito.idAnexo} className="border-b pb-4 mb-4">
                        <p className="text-gray-800 mb-1 text-base"><strong>Área:</strong> {quesito.area}</p>
                        <p className="text-gray-800 mb-1 text-base"><strong>Quesito:</strong> {quesito.quesito}</p>
                        <p className="text-gray-800 mb-1 text-base">
                          <strong>Resposta:</strong> {quesito.nota === 2 ? "Sim" : quesito.nota === 1 ? "Parcialmente" : "Não"}
                        </p>
                        <p className="text-gray-800 mb-1 text-base"><strong>Nome do arquivo:</strong> {quesito.nomeArquivo}</p>
                        <p className="text-gray-800 text-base">
                          <strong>Data de inclusão:</strong> {format(parseISO(quesito.dataInclusaoResposta), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                        </p>
                        <div className="mt-4 flex items-center">
                          {uploadSuccess[quesito.idAnexo] || quesito.situacao == 'di' ? (
                            <Alert showIcon className="mb-4" type="success">
                              Enviado com sucesso!
                            </Alert>
                          ) : (
                            <>
                              {fileUploads[quesito.idAnexo] ? (
                                <>
                                  <span className="text-gray-800 text-lg">{fileUploads[quesito.idAnexo].name}</span>
                                  <Button size="sm" onClick={() => handleCancelUpload(quesito.idAnexo)} variant="solid" color="red-600" className="ml-4">
                                    Cancelar
                                  </Button>
                                  <Button size="sm" loading={loadingSalvar} onClick={() => handleSubmit(quesito.idAnexo)} variant="solid" color="green-600" className="ml-4">
                                    Salvar
                                  </Button>
                                </>
                              ) : (
                                <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                  Substituir arquivo
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={e => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        handleFileUpload(e.target.files[0], quesito.idAnexo);
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          :
          <SemSubstituicaoComponent />
        }



        <div className="bg-gray-100 flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
          <p className="pl-4 text-sm text-gray-500">
            Programa Empreender 1999-2024 - Versão 5
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubstituicaoEvidencias;

