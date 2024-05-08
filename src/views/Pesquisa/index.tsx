import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FcFile } from 'react-icons/fc'
import { Form, Formik, Field } from 'formik'
import { FormContainer, FormItem } from '@/components/ui'
import { useState, useEffect } from 'react'
import type { FieldProps } from 'formik'
import { useParams } from 'react-router-dom'
import ApiService from '@/services/ApiService'


type FormModel = {
    upload: File[]
}

function Pesquisa() {
    const [forms, setForms] = useState(null)
    const { token } = useParams()

    useEffect(() => {
        const requisitaForm = async () => {
            try {
                const response: any = await ApiService.fetchData({
                    url: `forms/pesquisa2048/checkStatus/${token}`,
                    method: 'get',
                });        
                console.log("Response:", response)        
                if (response.status === 200) {
                    setForms(response.data)
                } else {
                    console.error('Erro ao obter formulário:', response.statusText)
                }
            } catch (error) {
                console.error('Erro ao obter formulário:', error)
            }
        }
    
        requisitaForm()
    }, [token])



    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = ['application/pdf']
        const MAX_FILE_SIZE = 100 * 1024 * 1024

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Por favor, envie apenas documentos PDF'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'O tamanho máximo de cada arquivo é 100Mb'
                }
            }
        }

        return valid
    }
    
    const SuccessComponent = () => {

        return (
            <div className="bg-white p-6 md:mx-auto h-full overflow-x-clip">
                <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                    <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path>
                </svg>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Sucesso</h3>
                </div>
            </div>
        )
    }
    
    return (
        <div>
            <div className="flex flex-col items-center">
                {/* LOGOS DAS EMPRESAS */}
                <div className="flex items-center space-x-4  bg-white sm:w-full lg:w-9/12">
                    <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
                        <div className="grid grid-cols-4 gap-8">
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className="img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
                            </div>
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className="w-11/12 img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
                            </div>
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className="img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" />
                            </div>
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className="img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/sebrae.svg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {forms?.status === 1 && (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-4  bg-white sm:w-full lg:w-9/12">
                        <SuccessComponent />
                        </div>
                        <div className="bg-gray-100 flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
                                <p className="text-sm text-gray-500">
                                    Programa Empreender 1999-2024 - Versão 5
                                </p>
                            </div>
                    </div>)}
            {forms?.status === 0 && (
                <div>
                    <Formik
                    enableReinitialize
                    initialValues={{
                        upload: [],
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log('values', values)
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2))
                            setSubmitting(false)
                        }, 400)
                }}
                    >
                        {({ values, touched, errors }) => (
                        <Form>
                            <FormContainer className='mx-auto bg-white sm:w-full lg:w-9/12'>
                <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                    <h1 className="text-4xl text-gray-800 dark:text-gray-100 font-bold texts mb-8 mt-8 ml-8">Validação de pesquisa - Projeto 2048</h1>
                </div>                    
                                {forms.documents.map((document, index) => (
                                    <div key={index} className="mb-4 ml-8 mr-8">
                                        {document.status === 1 ? (
                                            <h2 className="text-xl font-bold mb-4">
                                                {document.name}: Já enviado, para checar{' '}
                                                <a href={document.signed_url}>
                                                    <span className="text-blue-500">clique aqui</span>
                                                </a>.
                                            </h2>
                                        ) : (
                                            <div>
                                                <h2 className="text-xl font-bold mb-4">
                                                    {document.name}: <a href={document.original_url}> <span className="text-blue-500">clique aqui para fazer o download</span></a>
                                                </h2>
                                                <FormItem                                 
                                                invalid={Boolean(
                                                    errors.upload && touched.upload
                                                )}
                                                errorMessage={errors.upload as string}>
                                                <Field name="upload">
                                                {({ field, form }: FieldProps<FormModel>) => (
                                                    <Upload
                                                        draggable
                                                        beforeUpload={beforeUpload}
                                                        onChange={(files) =>
                                                            form.setFieldValue(field.name, files)
                                                        }
                                                        onFileRemove={(files) =>
                                                            form.setFieldValue(field.name, files)
                                                        }
                                                    >
                                                        <div className="my-16 text-center">
                                                            <div className="text-6xl mb-4 flex justify-center">
                                                                <FcFile />
                                                            </div>
                                                            <p className="font-semibold">
                                                                <span className="text-gray-800 dark:text-white">
                                                                    Arraste o documento assinado, ou{' '}
                                                                </span>
                                                                <span className="text-blue-500">busque nos seus arquivos</span>
                                                            </p>
                                                            <p className="mt-1 opacity-60 dark:text-white">
                                                                Formato: .pdf
                                                            </p>
                                                        </div>
                                                    </Upload>
                                                    )}
                                                    </Field>
                                                </FormItem>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <FormItem>
                                    <Button variant="solid" className='mb-5 ml-8' type='submit'>
                                        Enviar
                                    </Button>
                                </FormItem>
                            <div className="bg-gray-100 flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
                                <p className="text-sm text-gray-500">
                                    Programa Empreender 1999-2024 - Versão 5
                                </p>
                            </div>
                            </FormContainer>
                        </Form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    )
}

export default Pesquisa