import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, FormContainer, FormItem, Input, Notification, Upload } from '@/components/ui';
import { FcFile, FcImageFile } from 'react-icons/fc';
import ApiService from '@/services/ApiService';
import toast from '@/components/ui/toast'

interface Anexo {
    file: File;
    descricao: string;
}

const AnexoMarcoCriticoForm = ({ tipo, onClose, marcoId, onUpdate }: { tipo:string, onClose: () => void, marcoId: number, onUpdate: () => void }) => {
    const [loading, setLoading] = useState(false);

    const initialValues = {
        anexos: [] as Anexo[]
    };

    const validationSchema = Yup.object().shape({
        anexos: Yup.array().of(
            Yup.object().shape({
                file: Yup.mixed().required('Arquivo é obrigatório'),
                descricao: Yup.string().required('Descrição é obrigatória')
            })
        )
    });

    const toastNotificationSucess = (
        <Notification title="Documentos(s) adicionado(s) com sucesso." type="info" />
    )

    const toastNotificationError = (
        <Notification title="Erro ao salvar documentos(s)." type="danger" />
    )

    const handleSubmit = async (values: any) => {
        setLoading(true); 
        try {
            const formData = new FormData();

            values.anexos.forEach((anexo: Anexo, index: number) => {
                formData.append(`anexos`, anexo.file);
                formData.append(`anexos[${index}][descricao]`, anexo.descricao);
            });

            formData.append('marcoId', String(marcoId));

            await ApiService.fetchData({
                url: `representatividade/adicionar-anexo-marco-critico/${tipo}`,
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.push(toastNotificationSucess)
            onUpdate();
            onClose();
        } catch (error) {
            toast.push(toastNotificationError)
            console.error('Erro ao adicionar anexo:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, touched, errors, values }) => (
                <Form>
                    <h5 className="mb-4">Adicionar Documentos</h5>
                    <FormContainer>
                        <div className='mb-4'>
                            <Upload
                                draggable
                                showList={false}
                                onChange={(files) => {
                                    const anexos = files.map((file: File) => ({ file, descricao: '' }));
                                    setFieldValue('anexos', anexos);
                                }}
                            >
                                <div className="my-16 text-center">
                                    <div className="text-6xl mb-4 flex justify-center">
                                        <FcImageFile />
                                    </div>
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Arraste seu arquivo aqui, ou{' '}
                                        </span>
                                        <span className="text-blue-500">clique para adicionar</span>
                                    </p>
                                </div>
                            </Upload>
                        </div>
                        <FieldArray
                            name="anexos"
                            render={arrayHelpers => (
                                <>
                                    {values.anexos.map((anexo, index) => (
                                        <div key={index} className="mb-4">
                                            <div className="flex items-center">
                                                <div className="w-20 h-20 mr-4">
                                                    {anexo.file && (
                                                        anexo.file.type.startsWith('image/') ? (
                                                            <img
                                                                src={URL.createObjectURL(anexo.file)}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex justify-center items-center bg-gray-200">
                                                                <FcFile size={48} />
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <FormItem
                                                        label={`Descrição do documento: ${anexo.file.name}`}
                                                    >
                                                        <Field
                                                            autoComplete="off"
                                                            name={`anexos[${index}].descricao`}
                                                            placeholder="Descrição"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="button" onClick={onClose} className="mt-4 mr-2">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="mt-4"
                                variant='solid'
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
}

export default AnexoMarcoCriticoForm;
