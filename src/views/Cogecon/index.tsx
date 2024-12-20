import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import { HiOutlinePlus } from 'react-icons/hi'
import { CgClose as CloseIcon } from 'react-icons/cg'
import Input from '@/components/ui/Input'
import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
import { IMaskInput } from 'react-imask';
import { BsFilePdf, BsFileWord } from 'react-icons/bs'
import ParametrosGeraisService from '@/services/ParametrosGeraisService'
import Alert from '@/components/ui/Alert'

const ErrorComponent = ({ errors }: any) => {
    if (!errors || errors.length === 0) {
        return null; // Não há erros, não renderiza nada
    }

    return (
        <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CloseIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-strong text-red-800">{`Há ${errors.length === 1 ? '' : ''
                        } ${errors.length} erro${errors.length === 1 ? '' : 's'} com o seu envio`}</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                            {errors.map((error, index) => (
                                <li key={index}>{error.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

function CadastraProposta() {
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(false)
    const [inputs, setInputs] = useState([{}])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(true) // Estado para deixar o form inativo
    const [parametro, setParametro] = useState('')
    const [cpf, setCpf] = useState('');
    const [apto, setApto] = useState(false);
    const [userData, setUserData] = useState(null);
    const [anexos, setAnexos] = useState(null);
    const [inapto, setInapto] = useState(false);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ParametrosGeraisService.show(46);
                setParametro(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar parâmetros gerais:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddInput = () => {
        setInputs([...inputs, {}]);
    };

    const handleDeleteInput = (index: any) => {
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
        index.preventDefault()
        index.stopPropagation()
        // index.stopImmediatePropagation()
        return false
    };

    const SuccessComponent = () => {
        // if (success == false) {
        //     return null; // Não há erros, não renderiza nada
        // }

        return (
            <div className="bg-indigo-700">
                <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white">
                            Arquivos enviados com sucesso.
                            <br />
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                            Obrigado pela participação.
                        </p>

                    </div>
                </div>
            </div>
        )
    }

    const toastNotification = (
        <Notification title="Falha na submissão." type="danger">
            Não foi possível completar a operação. Por favor, verifique os arquivos e tente novamente.
        </Notification>
    )

    const toastNotificationSucess = (
        <Notification title="Obrigado por participar." type="info">
            Atualização enviada com sucesso.
        </Notification>
    )

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData()

        const fileInputs = event.target.querySelectorAll('[name="files"]');

        fileInputs.forEach((fileInput: any) => {
            const files = fileInput.files;
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
        });

        const selectElements = event.target.querySelectorAll('[name="type_document"]');

        selectElements.forEach((selectElement: any) => {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].selected) {
                    formData.append('selectValues', selectElement.options[i].value);
                }
            }
        });


        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/candidaturas/${userData.cpf}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setErrors(null);
            setSuccess(true);
            document.getElementById("formData").reset();
            toast.push(toastNotificationSucess)
            document.getElementById('success').scrollIntoView({
                behavior: 'smooth'
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(error.response.data.errors);
            setSuccess(false);
            setIsSubmitting(false);
            toast.push(toastNotification)
            document.getElementById('errors').scrollIntoView({
                behavior: 'smooth'
            });
        }


        await verifyCPF(cpf);
        setIsSubmitting(false);

    };

    // const handleSubmit = async (event: any) => {
    //     event.preventDefault();
    //     setIsSubmitting(true);

    //     const fields = ['nome', 'email', 'sexo', 'cpf', 'uf', 'cidade', 'telefone']

    //     const formData = new FormData()
    //     for (const field of fields) {
    //         if (event.target[field] === undefined) continue;
    //         formData.append(field, event.target[field].value);
    //         console.log(event.target[field].value)
    //     }

    //     // Adiciona os arquivos
    //     const fileInputs = event.target.querySelectorAll('[name="files"]');

    //     fileInputs.forEach((fileInput) => {
    //         const files = fileInput.files;
    //         for (let i = 0; i < files.length; i++) {
    //             formData.append('files', files[i]);
    //         }
    //     });

    //     const selectElements = event.target.querySelectorAll('[name="type_document"]');

    //     selectElements.forEach((selectElement) => {
    //         for (let i = 0; i < selectElement.options.length; i++) {
    //             if (selectElement.options[i].selected) {
    //                 formData.append('selectValues', selectElement.options[i].value);
    //             }
    //         }
    //     });

    //     try {
    //         await axios.post(`${import.meta.env.VITE_API_URL}/candidaturas`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         setErrors(null);
    //         setSuccess(true);
    //         toast.push(toastNotificationSucess)

    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         setErrors(error.response.data.errors);
    //         toast.push(toastNotification)
    //         document.getElementById('errors').scrollIntoView({
    //             behavior: 'smooth'
    //         });
    //     }

    //     setIsSubmitting(false);

    // };
    const verifyCPF = async (value: any) => {
        setCpf(value);
        if (value.length === 14) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/candidaturas/verify/${value}`);

                if (response.status === 200) {
                    console.log('CPF está na base e apto.');
                    setApto(true); // Se o status for 200, apto é true
                    setUserData(response.data.candidato);
                    setAnexos(response.data.anexos);
                    setInapto(false);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 404) {
                        setMessage('O CPF informado não está na lista de inscrição.')
                    } else if (error.response.status === 403) {
                        setMessage('O CPF informado não foi selecionado para prosseguir na seleção.')
                    } else {
                        console.error('Erro desconhecido:', error.message);
                    }
                } else {
                    console.error('Erro ao buscar dados:', error);
                }
                setApto(false); // Em caso de erro, também defina apto como false
                setUserData(null);
                setAnexos(null);
                setInapto(true);
            }
        } else {
            setApto(false);
            setUserData(null);
            setAnexos(null);
            setInapto(false);
        }
    };

    const company = {
        name: "COGECOM Energia Renovável",
        cnpj: "12.345.678/0001-99",
        address: "Rua Sustentabilidade, 123 - São Paulo, SP",
        energyGenerated: "350 milhões de kWh",
        contact: "contato@cogecom.com.br",
        phone: "(11) 98765-4321",
        status: "Cadastrada no PDE"
      };

    return (
        <div className='flex justify-center items-center tracking-tight sm:w-90'>
            {isRegistrationClosed && (
                
                <div className="flex justify-center items-center tracking-tight sm:w-90 min-h-screen bg-gray-100">
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md  sm:w-full lg:w-9/12">
                    <div className="flex items-center space-x-4">
                            
                            <div className="mt-5 mx-auto center max-w-7xl pb-5 px-6">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6">
                                    <div className="col-span-1 flex justify-center items-center min-h-16">
                                        <img className="h-11" src="/img/logo/GLOBALGATEWAY.png" alt="GlobalGateway" />
                                    </div>
                                    <div className="col-span-1 flex justify-center items-center ">
                                        <img className="h-11" src="/img/logo/ALINVEST.png" alt="AL Invest" />
                                    </div>
                                    <div className="col-span-1 flex justify-center items-center ">
                                        <img className="ml-10 h-16" src="/img/logo/UNIAOEUROPEIA.png" alt="União Europeia" />
                                    </div>
                                    <div className="col-span-1 flex justify-center items-center ">
                                        <img className="h-11" src="/img/logo/SEBRAE.png" alt="SEBRAE" />
                                    </div>
                                    <div className="col-span-2 md:col-span-2 lg:col-span-2 flex justify-center items-center ">
                                        <img className="h-11" src="/img/logo/EMPREENDER+CACB.png" alt="Empreender e CACB" />
                                    </div>                                </div>
                            </div>
                            
                        </div>
                    <div className="w-full  bg-black border-t border-gray-400 rounded-t-lg">
                        <div className='p-5 max-w-4xl mx-auto'>
                            <p className=" font-extrabold text-gray-200 text-2xl  mb-2">Projeto COGECON</p>
                            <p className="mb-4 text-white">
    O Projeto COGECOM, em parceria com o Portal do Empreender (PDE), é uma iniciativa inovadora no setor de geração compartilhada de energia elétrica.
    A COGECOM conecta usinas de energia limpa, concessionárias e consumidores, promovendo a sustentabilidade por meio do compartilhamento de créditos de energia excedente.
  </p>

  <p className="mb-4 text-white">
    No âmbito do PDE, o projeto visa facilitar a adesão de empresas e entidades, promovendo o consumo de energia renovável e a redução de custos operacionais.
    Ao integrar-se ao COGECOM, empresas podem reduzir suas despesas com energia, tornar-se mais sustentáveis e investir em outras áreas de crescimento, contribuindo para um futuro mais sustentável.
  </p>

  <p className="mb-4 text-white">
    Essa parceria entre COGECOM e PDE impulsiona a transformação para um cenário energético mais limpo e acessível, com o objetivo de construir um futuro sustentável para as próximas gerações.
  </p>                        </div>
</div>

<div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <h1 className="text-2xl font-semibold mb-4">Cadastro de Empresas e Participantes</h1>
  
  <p className="mb-4">
    Nesta página, você poderá iniciar o processo de adesão ao Projeto COGECOM.
  </p>

  <p className="mb-4">
    Para começar, informe o CNPJ ou CPF da sua empresa ou pessoa física. Com base nesses dados, o sistema irá:
  </p>
  
  <ul className="list-disc list-inside mb-4">
    <li>Exibir informações principais do cadastro na Receita Federal (RFB) para conferência.</li>
    <li>Solicitar o preenchimento de informações adicionais, caso necessário.</li>
    <li>Verificar possíveis restrições aplicáveis.</li>
    <li>Incluir a empresa ou pessoa física no cadastro do Portal do Empreender (PDE).</li>
  </ul>

  <h2 className="text-xl font-semibold mb-2">Termos de Adesão:</h2>
  <p className="mb-4">
    Você também deverá concordar com a manutenção e processamento dos dados fornecidos, conforme a Lei Geral de Proteção de Dados (LGPD).
  </p>

  <p className="mb-4">
    Empresas não cadastradas no PDE serão incluídas automaticamente e identificadas como participantes do projeto através do campo "Origem", marcado como "COGECOM".
  </p>

  <div className="mt-6">
    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ ou CPF</label>
    <input
      type="text"
      id="cnpj"
      name="cnpj"
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder="Informe o CNPJ ou CPF"
    />
  </div>

  <div className="mt-6">
    <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      Iniciar Cadastro
    </button>
  </div>
</div>


<div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {company.status}
            </span>
          </div>

          <div className="text-gray-700 space-y-2">
            <p><strong>CNPJ:</strong> {company.cnpj}</p>
            <p><strong>Endereço:</strong> {company.address}</p>
            <p><strong>Email de Contato:</strong> {company.contact}</p>
            <p><strong>Telefone:</strong> {company.phone}</p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-500">
            Participante da iniciativa de energia renovável da COGECOM, contribuindo para um futuro sustentável.
          </p>
        </div>
      </div>
    </div>

                        <>
                            {apto && userData && (

                                <>

<div className="p-4 bg-white shadow-md  border-2 rounded-lg mt-2 mb-10">
                                            <h2 className="text-lg font-bold mb-2">Informações do candidato</h2>
                                            <p><strong>Nome:</strong> {userData.nome}</p>
                                            <p><strong>CPF:</strong> {userData.cpf}</p>
                                            <p><strong>Telefone:</strong> {userData.telefone}</p>
                                            <p><strong>Email:</strong> {userData.email}</p>
                                        </div>
                                    <div className="">
                                        <div className="p-4 bg-white shadow-md rounded-lg mb-10 bg-white shadow-lg  border-2 rounded-lg mt-2">

                                            <h3 className="text-gray-700 mb-4">
                                                Para seguir com o processo de seleção:
                                            </h3>
                                            <ol className="list-bullet list-inside text-gray-700 mb-4">

                                                <li>
                                                    Verifique se a documentação inserida na sua inscrição está em
                                                    conformidade com a lista de documentos exigidos no{" "}
                                                    <span className="font-semibold">
                                                        <a target='_blank' href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTMzMjM2" rel="noreferrer">Termo de Referência (TR0336/24)</a>

                                                    </span>{" "}
                                                    em anexo e realize os ajustes necessários até o dia{" "}
                                                    <span className="font-semibold">16/10/2024 (quarta-feira)</span>:
                                                </li>
                                            </ol>
                                            <ul className="list-disc list-inside text-gray-700 mb-4 ml-5">
                                                <li>
                                                    Documento de identificação onde conste o número de
                                                    inscrição no CPF.
                                                </li>
                                                <li>
                                                    Documentos comprobatórios da participação em cursos de graduação e
                                                    pós-graduação (lato sensu e stricto sensu) informados no currículo.
                                                </li>
                                                <li>
                                                    Documentos comprobatórios de cursos de especialização e extensão
                                                    informados no currículo.
                                                </li>
                                                <li>
                                                    Documentos comprobatórios da experiência profissional informada no
                                                    currículo.
                                                </li>
                                            </ul>
                                            <p className="text-gray-700 mb-4">
                                                Caso seja constatada a ausência de alguma documentação, o candidato
                                                poderá ser considerado{" "}
                                                <span className="text-red-600 font-semibold">INAPTO</span>.
                                            </p>
                                            <p className="text-gray-700 mb-4">
                                                A classificação do candidato como{" "}
                                                <span className="text-green-600 font-semibold">APTO</span> e sua
                                                posição no ranking gera apenas expectativa de contratação, não se
                                                constituindo em obrigação da CACB. A eventual efetivação da
                                                contratação observará as disposições legais e o interesse e
                                                conveniência da CACB e da Associação Comercial local.
                                            </p>
                                            <p className="text-gray-700">
                                                Ressalta-se que há o limite de até duas ACEs por consultor. Será
                                                levada em conta, também, a disponibilidade adequada de tempo para
                                                atender às necessidades e a distância entre os Municípios para a
                                                realização dos trabalhos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-2" id="errors" ><ErrorComponent errors={errors} /></div>
                                    <div id="success">
                                        {success &&
                                            (<div className='pt-2 pb-2'>
                                                <Alert showIcon className="mb-4" type="success">
                                                    Arquivos atualizados com sucesso.
                                                </Alert>
                                            </div>)}
                                    </div>

                                    <form id="formData" onSubmit={handleSubmit}>

                                        <div className="bg-white shadow-md border-2 rounded-lg mt-2 p-4">
                                            <h3 className="text-lg font-semibold mb-4">Lista de arquivos enviados</h3>
                                            <ul className="divide-y divide-gray-200">
                                                {anexos.map((anexo) => (
                                                    <li key={anexo.id} className="py-2 flex justify-between items-center">
                                                        <span className="text-sm text-gray-700">{anexo.nome_arquivo}</span>
                                                        
                                                        <Button size='xs' className='mr-4' variant="solid">  <a href={`${import.meta.env.VITE_API_URL}/anexo/${anexo.id}/download/` } target="_blank" rel="noopener noreferrer">ver documento</a>  </Button>
                                                      
                                                    </li>
                                                    
                                                ))}
                                            </ul>
                                        </div>
                                        <div>


                                            <div className="sm:col-span-2 sm:border-t sm:border-gray-200 pt-5">
                                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                                                    Documentos
                                                </label>
                                                <div className="mt-2">
                                                    <div className="container">
                                                        {inputs.map((item, index) => (
                                                            <div key={index} className="input_container">
                                                                <div className="flex items-center space-x-4 mb-2 flex-wrap space-y-1">
                                                                    {/* Input de Upload */}
                                                                    <label className=" bg-gray-200 py-2 px-4 rounded-md cursor-pointer">
                                                                        <input required type="file" name="files" className="w-50" accept=".pdf, .doc, .docx, .jpg, .jpeg, .png" />
                                                                    </label>

                                                                    {/* Select */}
                                                                    <div className='flex items-center space-x-2'>
                                                                        <select name="type_document" className="border p-2 rounded-md">
                                                                            <option value="Currículo profissional">Currículo Profissional</option>
                                                                            <option value="Formação acadêmica">Formação acadêmica</option>
                                                                            <option value="Experiência profissional">Experiência profissional</option>
                                                                            <option value="Cursos realizados">Cursos realizados</option>
                                                                            <option value="Documento de identificação">Documento de identificação</option>
                                                                        </select>
                                                                        {inputs.length > 1 && (

                                                                            <span onClick={() => handleDeleteInput(index)}>
                                                                                <CloseIcon />
                                                                            </span>
                                                                        )}
                                                                    </div>



                                                                </div>
                                                                {index === inputs.length - 1 && (
                                                                    <Button variant="twoTone" size="sm" className="mr-2" icon={<HiOutlinePlus />} onClick={() => handleAddInput()}>
                                                                        <span>Adicionar mais arquivos</span>
                                                                    </Button>)}
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="center text-center ">

                                            <Button
                                                disabled={isSubmitting}
                                                title={isSubmitting ? "Enviando informações..." : ""} variant="solid">Complementar dados</Button>

                                        </div>
                                    </form>
                                </>

                            )}

                            <div className="mt-8 md:order-1 md:mt-0">
                                <p className="text-center leading-5 text-gray-500">
                                    <span className="font-semibold">{parametro.valor}</span><br />
                                </p>
                            </div>
                        </>

                    </div>
                </div>

            )}
            {/* {isRegistrationClosed && (
                <form className='bg-white sm:w-full lg:w-9/12' id="login" onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-4">
                        <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6">
                                <div className="col-span-1 flex justify-center items-center min-h-16">
                                    <img className="h-11" src="/img/logo/GLOBALGATEWAY.png" alt="GlobalGateway" />
                                </div>
                                <div className="col-span-1 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/ALINVEST.png" alt="AL Invest" />
                                </div>
                                <div className="col-span-1 flex justify-center items-center ">
                                    <img className="ml-10 h-16" src="/img/logo/UNIAOEUROPEIA.png" alt="União Europeia" />
                                </div>
                                <div className="col-span-1 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/SEBRAE.png" alt="SEBRAE" />
                                </div>
                                <div className="col-span-2 md:col-span-2 lg:col-span-2 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/EMPREENDER+CACB.png" alt="Empreender e CACB" />
                                </div>                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center w-11/12 mx-auto xl:w-full xl:mx-0">
                        <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold">
                            Seleção de consultores de núcleos setoriais
                        </h1>
                    </div>

                    <ErrorComponent errors={errors} />
                    <SuccessComponent />
                    <div className="mx-auto max-w-2xl py-10 px-4 sm:px-6 lg:px-8">
                        <div className="space-y-4">
                            {inputs.map((input, index) => (
                                <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="relative flex flex-col gap-4 rounded-md p-4 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">Informações {index + 1}</h2>
                                            <Button type="button" onClick={() => handleDeleteInput(index)} className="text-red-500">
                                                <HiOutlinePlus />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" onClick={handleAddInput} className="mt-4 flex items-center">
                                <HiOutlinePlus className="mr-2" /> Adicionar mais
                            </Button>
                        </div>
                        <div className="mt-10 flex justify-center">
                            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : 'Enviar'}
                            </Button>
                        </div>
                    </div>
                </form>
            )} */}
        </div>
    )
}

export default CadastraProposta;
