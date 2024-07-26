import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, FormContainer, FormItem, Input, Upload } from '@/components/ui';
import { FcFile, FcImageFile } from 'react-icons/fc';
import ApiService from '@/services/ApiService';

interface Anexo {
    file: File;
    descricao: string;
}

const AnexoMarcoCriticoForm = ({ onClose, marcoId, onUpdate }: { onClose: () => void, marcoId: number, onUpdate: () => void }) => {
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

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            values.anexos.forEach((anexo: Anexo, index: number) => {
                formData.append(`anexos`, anexo.file);
                formData.append(`anexos[${index}][descricao]`, anexo.descricao);
            });

            formData.append('marcoId', String(marcoId));

            await ApiService.fetchData({
                url: 'representatividade/adicionar-anexo-marco-critico',
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar anexo:', error);
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
                    <h5 className="mb-4">Adicionar Anexo ao Marco Crítico</h5>
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
                                                        label={`Descrição do arquivo: ${anexo.file.name}`}
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
                            <Button type="submit" className="mt-4" variant='solid'>
                                Adicionar
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
}

export default AnexoMarcoCriticoForm;
