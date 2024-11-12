import { useState } from 'react'
import axios from 'axios'
import Steps from '@/components/ui/Steps'
import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import { HiCheckCircle } from 'react-icons/hi'
import { CgClose as CloseIcon } from 'react-icons/cg'
import Input from '@/components/ui/Input'
import { IMaskInput } from 'react-imask';
import { FaBuilding, FaUser, FaHome } from 'react-icons/fa';
import Alert from '@/components/ui/Alert'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineMail } from 'react-icons/ai';
import { BsTelephone, BsFilePdf } from 'react-icons/bs';
import { MdWork } from 'react-icons/md'





const validationSchema = Yup.object().shape({
    singleCheckbox: Yup.boolean().oneOf([true], 'Você deve aceitar os termos.'),
    segment: Yup.array().min(1, 'Selecione um contato.'),
    nomeContato: Yup.string().when('isManualContact', {
        is: true,
        then: (schema) => schema.required('Nome do contato é obrigatório'),
    }),
    cpfContato: Yup.string().when('isManualContact', {
        is: true,
        then: (schema) => schema.required('CPF é obrigatório'),
    }),
    emailContato: Yup.string().when('isManualContact', {
        is: true,
        then: (schema) => schema.email('Email inválido').required('Email é obrigatório'),
    }),
    celularContato: Yup.string().when('isManualContact', {
        is: true,
        then: (schema) => schema.required('Celular é obrigatório'),
    }),
    tipoCadastro: Yup.string().required('Tipo de cadastro é obrigatório'),

    upload: Yup.object().shape({
        faturaEnergia: Yup.mixed().required('Cópia da Fatura de Energia é obrigatória'),
        documentoIdentidade: Yup.mixed().required('Documento de Identidade é obrigatória'),
        contratoSocial: Yup.mixed().when('tipoCadastro', {
            is: 'empresa',
            then: (schema) => schema.required('Contrato social é obrigatório para empresas'),
        }),
        cartaoCnpj: Yup.mixed().when('tipoCadastro', {
            is: (value) => value === 'empresa' || value === 'condominio',
            then: (schema) => schema.required('Cartão do CNPJ é obrigatório para empresas e condomínios'),
        }),
        ataAssembleia: Yup.mixed().when('tipoCadastro', {
            is: 'condominio',
            then: (schema) => schema.required('Ata da assembleia é obrigatória para condomínios'),
        }),
    }),
});


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
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(true) // Estado para deixar o form inativo
    const [cnpj, setCnpj] = useState('');
    const [empresaData, setEmpresaData] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [tipoCadastro, setTipoCadastro] = useState('');
    const [isManualContact, setIsManualContact] = useState(false);


    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            if ((cnpj.length === 11 && tipoCadastro == 'pessoa_fisica' || cnpj.length === 14 && tipoCadastro !== 'pessoa_fisica')) {
                verify();
            }
            else {
                alert("Insira um número de CNPJ ou CPF válido.")
            }
        }
    }

    const [step, setStep] = useState(0)

    const onChange = (nextStep: number) => {
        if (step < 1) {

            setEmpresaData(null)

        }
        if (nextStep < 0) {
            setStep(0)
        } else if (nextStep > 3) {
            setStep(3)
        } else {
            setStep(nextStep)
        }
    }

    const onNext = () => onChange(step + 1)

    const onPrevious = () => { onChange(0), setError(false), setIsManualContact(false) }

    // const stepConditions: { [key: number]: () => boolean } = {
    //     0: () => tipoCadastro !== '',
    //     1: () => empresaData?.permissao?.habil === true,
    //     2: () => false,
    // };


    // const canAdvance = stepConditions[step]();

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


    const verify = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/cogecom/status/${cnpj}`);
            if(response.data.permissao.habil === false) {
                setError(!response.data.permissao.habil);
                setErrorMessage(response.data.permissao.mensagem);
            }
            else{
                await setEmpresaData(response.data);
                await setStatus(response.data.status);
                onNext();
            }
            
        } catch (err) {
            setError(true);
        }
        finally {
            setIsLoading(false);
        }
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
                                <p className=" font-extrabold text-gray-200 text-2xl  mb-2">Projeto COGECOM</p>

                                <p className="mb-4 text-white">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde molestias, accusantium expedita adipisci rerum similique nihil? Cupiditate temporibus esse nulla reprehenderit. Temporibus earum neque quas obcaecati eum nam quaerat magni?Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime assumenda vel quibusdam, deserunt voluptas iste earum distinctio in provident beatae, excepturi quidem commodi repudiandae fugiat asperiores, eum debitis quisquam. Quaerat!
                                    ipsum dolor sit amet consectetur adipisicing elit. Maxime assumenda vel quibusdam, deserunt voluptas iste earum distinctio in provident beatae, excepturi quidem commodi repudiandae fugiat asperiores, eum debitis quisquam. Quaerat!
                                </p>

                                <div className="flex">
                                    <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTM5MDY3" className="flex items-center text-base pt-2 font-semibold leading-7 mt-10 text-white mr-5" rel="noreferrer">
                                        <span className='text-red-600 font-bold'><BsFilePdf /></span>  <i className='text-ms'>Termo de Adesão</i>
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                            <h1 className="text-2xl font-semibold mb-4">Adesão de empresas e pessoas físicas</h1>

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


                        </div>


                        <div className=" max-w-4xl mx-auto px-2 pt-10">


                            <Steps current={step} status={error ? 'error' : undefined}>
                                <Steps.Item title="Tipo de Cadastro" />
                                <Steps.Item title="Dados" />
                                <Steps.Item title="Cadastro" />
                            </Steps>
                            <div className="mt-6  bg-gray-50 dark:bg-gray-700 rounded ">
                                {step === 0 && (
                                    <div className="mt-6 grid grid-cols-3 gap-6 pt-8 flex items-center justify-center">
                                        <div
                                            className={`p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer shadow-lg hover:bg-blue-50 transition ${tipoCadastro === 'empresa' ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            onClick={() => { setTipoCadastro('empresa'), onNext() }}
                                        >
                                            <FaBuilding className="text-4xl text-blue-500 mx-auto mb-4" />
                                            <h4 className="text-center font-semibold">Empresa</h4>
                                        </div>

                                        <div
                                            className={`p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer shadow-lg hover:bg-green-50 transition ${tipoCadastro === 'pessoa_fisica' ? 'ring-2 ring-green-500' : ''
                                                }`}
                                            onClick={() => { setTipoCadastro('pessoa_fisica'), onNext() }}
                                        >
                                            <FaUser className="text-4xl text-green-500 mx-auto mb-4" />
                                            <h4 className="text-center font-semibold">Pessoa Física</h4>
                                        </div>

                                        <div
                                            className={`p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer shadow-lg hover:bg-yellow-50 transition ${tipoCadastro === 'condominio' ? 'ring-2 ring-yellow-500' : ''
                                                }`}
                                            onClick={() => { setTipoCadastro('condominio'), onNext() }}
                                        >
                                            <FaHome className="text-4xl text-yellow-500 mx-auto mb-4" />
                                            <h4 className="text-center font-semibold">Condomínio</h4>
                                        </div>
                                    </div>

                                )}

                                {step === 1 && (
                                    <div className="mt-6">

                                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">Informe o {tipoCadastro === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}</label>
                                        <IMaskInput
                                            mask={tipoCadastro === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                            unmask={true}
                                            onKeyDown={handleKeyDown}
                                            onAccept={(value) => setCnpj(value)}
                                            placeholder={tipoCadastro === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />




                                        <div className='mt-6'>
                                            <Button
                                                variant="solid"
                                                disabled={!(cnpj.length === 11 && tipoCadastro == 'pessoa_fisica' || cnpj.length === 14 && tipoCadastro !== 'pessoa_fisica')}
                                                color="indigo-700"
                                                className="w-full mb-10"
                                                loading={isLoading}
                                                onClick={verify}

                                            >
                                                Avançar
                                            </Button>

                                            {error && (
                                                <Alert showIcon className="mb-4" type="danger">
                                                    {errorMessage ? (
                                                        <>{errorMessage}</>
                                                    ) : (
                                                        tipoCadastro === 'pessoa_fisica' ? (
                                                            <>Essa pessoa não está em nossa base de dados. Por favor, entre em contato com <a href="mailto:contato@cacb.org.br">contato@cacb.org.br</a>.</>
                                                        ) : (
                                                            <>Esta empresa não está em nossa base de dados da “Receita Federal”. Por favor, entre em contato com <a href="mailto:contato@cacb.org.br">contato@cacb.org.br</a>.</>
                                                        )
                                                    )}
                                                </Alert>
                                            )}


                                        </div>

                                    </div>
                                )}

                                {step === 2 && (
                                    
                                    <div className="">
{empresaData && (
                                                <div className="w-full max-w-4xl mx-auto p-2">
                                                    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
                                                        <div className="p-6">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h2 className="text-2xl font-bold text-gray-800">{empresaData.empresa.nurazaosocial}</h2>
                                                                <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                                    {'fonte: ' + empresaData.fonte}
                                                                </span>
                                                            </div>

                                                            <div className="text-gray-700 space-y-2">
                                                                <p><strong>Nome Fantasia:</strong>{empresaData.empresa.nmfantasia}</p>
                                                                <p><strong>CNPJ:</strong>{empresaData.empresa.nucnpjcpf}</p>
                                                                <p>{empresaData.empresa.iduf} - {empresaData.empresa.nmcidade}  </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}


                                        <div className=" mt-5 py-2 py-2">
                                            <div>
                                                <Formik
                                                    enableReinitialize
                                                    initialValues={{
                                                        segment: '',
                                                        nomeContato: '',
                                                        cpfContato: '',
                                                        emailContato: '',
                                                        celularContato: '',
                                                        isManualContact: false,
                                                        tipoCadastro: tipoCadastro,
                                                        upload: {
                                                            faturaEnergia: [],
                                                            documentoIdentidade: [],
                                                            contratoSocial: [],
                                                            cartaoCnpj: [],
                                                            ataAssembleia: [],
                                                        },
                                                    }}
                                                    validationSchema={validationSchema}
                                                    onSubmit={(values, { setSubmitting }) => {
                                                        console.log('values', values)
                                                        setTimeout(() => {
                                                            alert(JSON.stringify(values, null, 2))
                                                            setSubmitting(false)
                                                        }, 400)
                                                    }}
                                                >
                                                    {({ values, touched, setFieldValue, errors, resetForm }) => (
                                                        <Form>
                                                            <FormContainer>

                                                                <FormItem
                                                                    asterisk
                                                                    label="Contato"
                                                                    invalid={Boolean(errors.segment && touched.segment)}
                                                                    errorMessage={errors.segment as string}
                                                                >
                                                                    <Field name="segment">
                                                                        {({ field, form }) => (
                                                                            <Segment
                                                                                className="w-full"
                                                                                value={field.value}
                                                                                onChange={(val) => {
                                                                                    form.setFieldValue(field.name, val);
                                                                                    setIsManualContact(val == "Informar contato");
                                                                                    const isManual = val === "Informar contato";
                                                                                    setFieldValue('isManualContact', isManual);
                                                                                }}                                                                            >
                                                                                <div className="grid grid-cols-3 gap-4 w-full">
                                                                                    <Segment.Item value="Informar contato">
                                                                                        {({ active, onSegmentItemClick, disabled }) => (
                                                                                            <div className="text-center">
                                                                                                <SegmentItemOption
                                                                                                    hoverable
                                                                                                    active={active}
                                                                                                    disabled={disabled}
                                                                                                    defaultGutter={false}
                                                                                                    className="relative min-h-[80px] w-full"
                                                                                                    customCheck={
                                                                                                        <HiCheckCircle className="text-indigo-600 absolute top-2 right-2 text-lg" />
                                                                                                    }
                                                                                                    onSegmentItemClick={(onSegmentItemClick)}
                                                                                                >
                                                                                                    <div className="flex flex-col items-start mx-4">
                                                                                                        <h6>Informar um novo contato</h6>
                                                                                                    </div>
                                                                                                </SegmentItemOption>
                                                                                            </div>
                                                                                        )}
                                                                                    </Segment.Item>

                                                                                    {/* Segmentos Dinâmicos */}
                                                                                    {empresaData?.contatos?.length > 0 &&
                                                                                        empresaData.contatos.map((segment) => (
                                                                                            <Segment.Item key={segment.nmcontato} value={Number(segment.idcontato)}>
                                                                                                {({ active, onSegmentItemClick, disabled }) => (
                                                                                                    <div className="text-center">
                                                                                                        <SegmentItemOption
                                                                                                            hoverable
                                                                                                            active={active}
                                                                                                            disabled={disabled}
                                                                                                            defaultGutter={false}
                                                                                                            className="relative min-h-[80px] w-full"
                                                                                                            customCheck={
                                                                                                                <HiCheckCircle className="text-indigo-600 absolute top-2 right-2 text-lg" />
                                                                                                            }
                                                                                                            onSegmentItemClick={onSegmentItemClick}
                                                                                                        >
                                                                                                            <div className="flex flex-col items-start mx-4">
                                                                                                                <h6>{segment.nmcontato}</h6>
                                                                                                                <p className="flex items-center">
                                                                                                                    <AiOutlineMail className="mr-2" /> {segment.dsemail || '-'}
                                                                                                                </p>
                                                                                                                <p className="flex items-center">
                                                                                                                    <BsTelephone className="mr-2" /> {segment.nucel || '-'}
                                                                                                                </p>
                                                                                                                <p className="flex items-center">
                                                                                                                    <MdWork className="mr-2" /> {segment.cargo || '-'}
                                                                                                                </p>

                                                                                                            </div>
                                                                                                        </SegmentItemOption>
                                                                                                    </div>
                                                                                                )}
                                                                                            </Segment.Item>
                                                                                        ))}
                                                                                </div>
                                                                            </Segment>
                                                                        )}
                                                                    </Field>
                                                                </FormItem>

                                                                {isManualContact && (
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <FormItem
                                                                            label="Nome do Contato"
                                                                            invalid={Boolean(errors.nomeContato && touched.nomeContato)}
                                                                            errorMessage={errors.nomeContato}
                                                                        >
                                                                            <Field
                                                                                name="nomeContato"
                                                                                as={Input}
                                                                                placeholder="Nome do Contato"

                                                                            />
                                                                        </FormItem>

                                                                        <FormItem
                                                                            label="CPF"
                                                                            invalid={Boolean(errors.cpfContato && touched.cpfContato)}
                                                                            errorMessage={errors.cpfContato}
                                                                        >
                                                                            <Field name="cpfContato">
                                                                                {({ field, form }) => (
                                                                                    <IMaskInput
                                                                                        {...field}
                                                                                        mask={'000.000.000-00'}
                                                                                        unmask={true}
                                                                                        onAccept={(value) => form.setFieldValue('cpfContato', value)}
                                                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        </FormItem>

                                                                        <FormItem
                                                                            label="Email"
                                                                            invalid={Boolean(errors.emailContato && touched.emailContato)}
                                                                            errorMessage={errors.emailContato}
                                                                        >
                                                                            <Field
                                                                                name="emailContato"
                                                                                type="email"
                                                                                as={Input}
                                                                                placeholder="Email"
                                                                            />
                                                                        </FormItem>

                                                                        <FormItem
                                                                            label="Celular"
                                                                            invalid={Boolean(errors.celularContato && touched.celularContato)}
                                                                            errorMessage={errors.celularContato}
                                                                        >
                                                                            <Field name="celularContato">
                                                                                {({ field, form }) => (
                                                                                    <IMaskInput
                                                                                        {...field}
                                                                                        mask={'(00) 00000-0000'}
                                                                                        unmask={true}
                                                                                        onAccept={(value) => form.setFieldValue('celularContato', value)}
                                                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        </FormItem>
                                                                    </div>
                                                                )}


                                                                <FormItem
                                                                    asterisk
                                                                    label="Inclusão de Documentos"
                                                                    invalid={Boolean(errors.upload && touched.upload)}
                                                                    errorMessage={errors.upload}
                                                                >
                                                                    {/* Fatura de Energia */}
                                                                    <Field name="upload.faturaEnergia">
                                                                        {({ field }) => (
                                                                            <Upload
                                                                                fileList={values.upload.faturaEnergia}
                                                                                onChange={(file) => setFieldValue(field.name, [file])}
                                                                                onFileRemove={() => setFieldValue(field.name, [])}
                                                                            >
                                                                                <Button variant="solid">Cópia da Fatura de Energia</Button>
                                                                            </Upload>
                                                                        )}
                                                                    </Field>

                                                                    {/* Documento de Identidade */}
                                                                    <Field name="upload.documentoIdentidade">
                                                                        {({ field }) => (
                                                                            <Upload
                                                                                fileList={values.upload.documentoIdentidade}
                                                                                onChange={(file) => setFieldValue(field.name, [file])}
                                                                                onFileRemove={() => setFieldValue(field.name, [])}
                                                                            >
                                                                                <Button variant="solid">Documento de Identidade</Button>
                                                                            </Upload>
                                                                        )}
                                                                    </Field>

                                                                    {/* Campos específicos para empresas */}
                                                                    {tipoCadastro === 'empresa' && (
                                                                        <>
                                                                            <Field name="upload.contratoSocial">
                                                                                {({ field }) => (
                                                                                    <Upload
                                                                                        fileList={values.upload.contratoSocial}
                                                                                        onChange={(file) => setFieldValue(field.name, [file])}
                                                                                        onFileRemove={() => setFieldValue(field.name, [])}
                                                                                    >
                                                                                        <Button variant="solid">Contrato Social</Button>
                                                                                    </Upload>
                                                                                )}
                                                                            </Field>

                                                                            <Field name="upload.cartaoCnpj">
                                                                                {({ field }) => (
                                                                                    <Upload
                                                                                        fileList={values.upload.cartaoCnpj}
                                                                                        onChange={(file) => setFieldValue(field.name, [file])}
                                                                                        onFileRemove={() => setFieldValue(field.name, [])}
                                                                                    >
                                                                                        <Button variant="solid">Cartão do CNPJ</Button>
                                                                                    </Upload>
                                                                                )}
                                                                            </Field>
                                                                        </>
                                                                    )}

                                                                    {/* Campos específicos para condomínios */}
                                                                    {tipoCadastro === 'condominio' && (
                                                                        <>
                                                                            <Field name="upload.ataAssembleia">
                                                                                {({ field }) => (
                                                                                    <Upload
                                                                                        fileList={values.upload.ataAssembleia}
                                                                                        onChange={(file) => setFieldValue(field.name, [file])}
                                                                                        onFileRemove={() => setFieldValue(field.name, [])}
                                                                                    >
                                                                                        <Button variant="solid">Ata da Assembleia de Eleição</Button>
                                                                                    </Upload>
                                                                                )}
                                                                            </Field>

                                                                            <Field name="upload.cartaoCnpj">
                                                                                {({ field }) => (
                                                                                    <Upload
                                                                                        fileList={values.upload.cartaoCnpj}
                                                                                        onChange={(file) => setFieldValue(field.name, [file])}
                                                                                        onFileRemove={() => setFieldValue(field.name, [])}
                                                                                    >
                                                                                        <Button variant="solid">Cartão do CNPJ</Button>
                                                                                    </Upload>
                                                                                )}
                                                                            </Field>
                                                                        </>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem
                                                                    invalid={
                                                                        errors.singleCheckbox &&
                                                                        touched.singleCheckbox
                                                                    }
                                                                    errorMessage={errors.singleCheckbox}
                                                                >
                                                                    <Field
                                                                        name="singleCheckbox"
                                                                        component={Checkbox}
                                                                    >
                                                                        Concordo com a manutenção dos dados fornecidos e dos obtidos automaticamente a partir da Receita Federal
                                                                    </Field>
                                                                </FormItem>

                                                                <FormItem>
                                                                    <Button variant="solid" type="submit">
                                                                        Cadastrar
                                                                    </Button>
                                                                </FormItem>
                                                            </FormContainer>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>

                                        </div>

                                    </div>




                                )}
                            </div>
                            <div className="mt-16 text-right">
                                <Button
                                    className="mx-2"
                                    disabled={step === 0}
                                    onClick={onPrevious}
                                >
                                    Recomeçar
                                </Button>
                                {/* <button
                                    hidden={step === 2}
                                    className={`py-2 px-4 ${canAdvance ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400'
                                        } text-white rounded shadow`}
                                    disabled={!canAdvance}
                                    onClick={onNext}
                                >
                                    {step === 2 ? 'Enviar' : 'Avançar'}
                                </button> */}
                            </div>
                        </div>



                        <div className="mt-8 md:order-1 md:mt-0">
                            <p className="text-center leading-5 text-gray-500">
                                <span className="font-semibold">Portal do Empreender - V5 - 2024</span><br />
                            </p>
                        </div>


                    </div>
                </div>

            )}

        </div>
    )
}

export default CadastraProposta;
