import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import { FormContainer, FormItem, Notification, Select } from '@/components/ui';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import ApiService from '@/services/ApiService';
import toast from '@/components/ui/toast'
import { Usuario } from '@/@types/generalTypes';


const NewMarcoCriticoForm = ({ onClose, entidadeId, onUpdate }: { onClose: () => void, entidadeId: string, onUpdate: () => void }) => {
    const initialValues = {
        tipo_marco_critico: '',
        nome_marco_critico: '',
        descricao: '',
        responsavel: '',
        dataPrevista: null,
        novaDataPrevista: null,
        dataEncerramento: null,
        entidadeId: entidadeId,
    };

    const validationSchema = Yup.object().shape({
        tipo_marco_critico: Yup.string().required('Selecione um tipo de marco crítico'),
        nome_marco_critico: Yup.string().nullable(),
        descricao: Yup.string().nullable(),
        responsavel: Yup.string().required('Selecione um usuário responsável'),
        dataPrevista: Yup.date().nullable(),
        novaDataPrevista: Yup.date().nullable(),
        dataEncerramento: Yup.date().nullable()
    });

    const [usuarios, setUsuarios] = useState<{ value: string, label: string }[]>([]);
    const [marcosCriticos, setMarcosCriticos] = useState<{ value: string, label: string }[]>([]);
    const [showNomeMarcoCritico, setShowNomeMarcoCritico] = useState(false);

    const ErrorNotification = (
        <Notification title="Falha na inserção." type="danger">
            Não foi possível completar a operação.
        </Notification>
    )

    const SucessNotification = (
        <Notification title="Marco crítico adicionado com sucesso." type="success">
        </Notification>
    )

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response: AxiosResponse<Usuario[]> = await ApiService.fetchData({
                    url: '/usuarios-ativos',
                    method: 'get',
                });

                if (response.data) {
                    const usuariosOptions = response.data.map(usuario => ({
                        value: usuario.nucpf,
                        label: usuario.nmusuario,
                    }));
                    setUsuarios(usuariosOptions);
                }
            } catch (error) {
                console.error('Erro ao buscar usuários ativos:', error);
            }
        };

        const fetchMarcosCriticos = async () => {
            try {
                const response: AxiosResponse<any[]> = await ApiService.fetchData({
                    url: '/representatividade/listar-marco-critico-padrao',
                    method: 'get',
                });

                if (response.data) {
                    const marcosOptions = response.data.map((marco: any) => ({
                        value: marco.id,
                        label: marco.nome,
                    }));
                    marcosOptions.push({ value: 'outros', label: 'Outros' });
                    setMarcosCriticos(marcosOptions);
                }
            } catch (error) {
                console.error('Erro ao buscar marcos críticos:', error);
            }
        };

        fetchUsuarios();
        fetchMarcosCriticos();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            await ApiService.fetchData({
                url: 'representatividade/adicionar-marco-critico',
                method: 'post',
                data: values
            });
            toast.push(SucessNotification)
            onUpdate();
            onClose();
        } catch (error) {
            toast.push(ErrorNotification)
            console.error('Erro ao adicionar novo marco crítico:', error);
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
                    <h5 className="mb-4">Adicionar novo marco crítico</h5>
                    <FormContainer>
                        <FormItem
                            label="Tipo de marco crítico"
                            invalid={errors.tipo_marco_critico && touched.tipo_marco_critico}
                            errorMessage={errors.tipo_marco_critico}
                        >
                            <Field name="tipo_marco_critico">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        field={field}
                                        form={form}
                                        placeholder="Selecione o tipo de marco crítico"
                                        options={marcosCriticos}
                                        value={marcosCriticos.find(
                                            (option) => option.value === values.tipo_marco_critico
                                        )}
                                        onChange={(option) => {
                                            form.setFieldValue(field.name, option?.value);
                                            setShowNomeMarcoCritico(option?.value === 'outros');
                                            if (option?.value !== 'outros') {
                                                form.setFieldValue('nome_marco_critico', '');
                                            }
                                        }}
                                    />
                                )}
                            </Field>

                        </FormItem>

                        {showNomeMarcoCritico && (
                            <>
                                <FormItem
                                    label="Nome do Marco Crítico Personalizado"
                                    invalid={errors.nome_marco_critico && touched.nome_marco_critico}
                                    errorMessage={errors.nome_marco_critico}
                                >
                                    <Field name="nome_marco_critico">
                                        {({ field }: FieldProps) => (
                                            <Input
                                                {...field}
                                                required
                                                placeholder="Nome do Marco Crítico Personalizado"
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    label="Descrição"
                                    invalid={errors.descricao && touched.descricao}
                                    errorMessage={errors.descricao}
                                >
                                    <Field name="descricao">
                                        {({ field }: FieldProps) => (
                                            <Input
                                                {...field}
                                                textArea
                                                placeholder="Descrição"
                                                className="form-textarea mt-1 block w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </>
                        )}

                        <FormItem
                            label="Responsável"
                            invalid={errors.responsavel && touched.responsavel}
                            errorMessage={errors.responsavel}
                        >
                            <Field name="responsavel">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        field={field}
                                        form={form}
                                        placeholder="Selecione o usuário responsável"
                                        options={usuarios}
                                        value={usuarios.find(
                                            (option) => option.value === values.responsavel
                                        )}
                                        onChange={(option) =>
                                            form.setFieldValue(
                                                field.name,
                                                option?.value
                                            )
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Data Prevista"
                            invalid={errors.dataPrevista && touched.dataPrevista}
                            errorMessage={errors.dataPrevista}
                        >
                            <Field
                                name="dataPrevista"
                                component={DatePicker}
                                placeholder="Data Prevista"
                                onChange={(date: Date) => setFieldValue('dataPrevista', date)}
                            />
                        </FormItem>

                        <FormItem
                            label="Data de Encerramento"
                            invalid={errors.dataEncerramento && touched.dataEncerramento}
                            errorMessage={errors.dataEncerramento}
                        >
                            <Field
                                name="dataEncerramento"
                                component={DatePicker}
                                placeholder="Data de Encerramento"
                                onChange={(date: Date) => setFieldValue('dataEncerramento', date)}
                            />
                        </FormItem>

                        <Field name="entidadeId" type="hidden" />

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
};

export default NewMarcoCriticoForm;