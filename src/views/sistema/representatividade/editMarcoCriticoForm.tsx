import { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import ApiService from '@/services/ApiService';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { useAppSelector } from '@/store';

interface AnexoDisplay {
    id: number;
    nome: string;
    nome_arquivo: string;
    descricao: string;
}

interface EditMarcoCriticoFormProps {
    entidadeId: any;
    isGestor?: boolean;
    isConsultor?: boolean;
    onClose: () => void;
    marcoId: number;
    onUpdate: () => void;
    tipoRelacao: string;
}

const EditMarcoCriticoForm: React.FC<EditMarcoCriticoFormProps> = ({ tipoRelacao, entidadeId, isGestor, isConsultor, onClose, marcoId, onUpdate }) => {
    const [initialValues, setInitialValues] = useState({
        tipo_marco_critico: '',
        nome_marco_critico: '',
        descricao: '',
        dataPrevista: null,
        novaDataPrevista: null,
        dataEncerramento: null,
        entidadeId: '',
    });

    const user = useAppSelector((state) => state.auth.user);

    if (isGestor === undefined) {
        isGestor = user?.associacoes && user?.associacoes.some(assoc => assoc.idassociacao === entidadeId);
    }

    const [isEditing, setIsEditing] = useState(false);

    const validationSchema = Yup.object().shape({
        tipo_marco_critico: Yup.string().required('Selecione um tipo de marco crítico'),
        nome_marco_critico: Yup.string().nullable(),
        descricao: Yup.string().nullable(),
        dataPrevista: Yup.date().nullable(),
        novaDataPrevista: Yup.date().nullable()
            .min(
                Yup.ref('dataPrevista'),
                'A nova data prevista não pode ser anterior à data prevista inicial'
            ),
        dataEncerramento: Yup.date().nullable()
            .min(
                Yup.ref('dataPrevista'),
                'A data de término não pode ser anterior à data prevista'
            )
    });

    const [marcosCriticos, setMarcosCriticos] = useState<{ value: string, label: string }[]>([]);
    const [anexosExistentes, setAnexosExistentes] = useState<AnexoDisplay[]>([]);
    const [marcoCongelado, setMarcoCongelado] = useState(false);
    const [anexosParaRemover, setAnexosParaRemover] = useState<number[]>([]);
    const [marcoCritico, setMarcoCritico] = useState<any>();
    const [tipoAtual, setTipoAtual] = useState('');

    const handleTipoChange = (option: any, setFieldValue: any) => {
        setFieldValue('tipo_marco_critico', option?.value);
        setFieldValue('tipo', option?.tipo);
        setTipoAtual(option?.tipo);

        const selectedMarco: any = marcosCriticos.find(marco => marco.value === option.value);

        if (option?.tipo === 'Específico' || option?.tipo === 'outros') {
            setFieldValue('nome_marco_critico', selectedMarco?.label || '');
            setFieldValue('descricao', selectedMarco?.descricao || '');
        } else if (option?.tipo === 'outros') {
            setFieldValue('nome_marco_critico', '');
            setFieldValue('descricao', '');
        } else {
            setFieldValue('nome_marco_critico', selectedMarco?.label || '');
            setFieldValue('descricao', selectedMarco?.descricao || '');
        }
    };

    const handleRemoveAnexo = (anexoId: number) => {
        setAnexosParaRemover((prev) => [...prev, anexoId]);
    };

    useEffect(() => {
        const fetchMarcosCriticosPadrao = async (marcoId: number) => {
            try {
                const response: AxiosResponse<any[]> = await ApiService.fetchData({
                    url: `/representatividade/listar-marco-critico-padrao?tipo=${tipoRelacao}&id=${marcoId}`,
                    method: 'get'
                });

                if (response.data) {
                    const marcosOptions = response.data.map((marco: any) => ({
                        value: String(marco.id),
                        label: marco.nome,
                        tipo: marco.tipo,
                        descricao: marco.descricao
                    }));
                    marcosOptions.push({ value: 'outros', label: 'Outros', tipo: 'outros', descricao: '' });
                    setMarcosCriticos(marcosOptions);
                }
            } catch (error) {
                console.error('Erro ao buscar marcos críticos:', error);
            }
        };

        const fetchMarcoCritico = async () => {
            try {
                const response: AxiosResponse<any> = await ApiService.fetchData({
                    url: `/representatividade/marco-critico/${marcoId}`,
                    method: 'get',
                });

                if (response.data) {
                    setInitialValues({
                        tipo_marco_critico: String(response.data.relacao_1),
                        nome_marco_critico: response.data.nome_marco_critico || '',
                        descricao: response.data.descricao || '',
                        dataPrevista: response.data.data_prevista,
                        novaDataPrevista: response.data.nova_data_prevista,
                        dataEncerramento: response.data.data_encerramento,
                        entidadeId: response.data.relacao_2,
                    });

                    setTipoAtual(response.data.tipo_marco_critico);
                    setMarcoCongelado(response.data.congelado);
                    setMarcoCritico(response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar marco crítico:', error);
            }
        };

        const fetchAnexos = async () => {
            try {
                const response: AxiosResponse<any> = await ApiService.fetchData({
                    url: `/representatividade/marco-critico/${marcoId}/anexos`,
                    method: 'get',
                });
                setAnexosExistentes(response.data);
            } catch (error) {
                console.error('Erro ao buscar anexos:', error);
            }
        };

        fetchMarcosCriticosPadrao(marcoId);
        fetchMarcoCritico();
        fetchAnexos();
    }, [marcoId]);


    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            await ApiService.fetchData({
                url: `/representatividade/atualizar-marco-critico/${tipoRelacao}/${marcoId}`,
                method: 'put',
                data: {
                    ...values,
                    anexosParaRemover
                }
            });

            onClose();
            onUpdate();
        } catch (error) {
            console.error('Erro ao atualizar marco crítico:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleEdit = () => setIsEditing(!isEditing);

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, touched, errors, values }) => {
                useEffect(() => {
                    if (!marcoCongelado && isEditing) {
                        setFieldValue('novaDataPrevista', values.dataPrevista);
                    }
                }, [values.dataPrevista, setFieldValue, marcoCongelado, isEditing]);
                return (
                    <Form>
                        <h5 className="mb-4">{isEditing ? "Editar" : "Visualizar"} marco crítico</h5>
                        <FormContainer>

                            <div style={{ maxHeight: '60vh', overflowY: 'auto' }} className={isEditing ? "" : "grid grid-cols-2 gap-4"}>

                                <FormItem
                                    label="Nome"
                                    invalid={errors.tipo_marco_critico && touched.tipo_marco_critico}
                                    errorMessage={errors.tipo_marco_critico}
                                >
                                    {isEditing && !marcoCongelado ? (
                                        tipoAtual !== 'Padrão' ? (
                                            <Field name="tipo_marco_critico">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        placeholder="Selecione o nome do marco crítico"
                                                        options={marcosCriticos}
                                                        value={marcosCriticos.find(option => option.value === field.value)}
                                                        onChange={(option) => handleTipoChange(option, form.setFieldValue)}
                                                        isDisabled={!isEditing}
                                                    />
                                                )}
                                            </Field>
                                        ) : (
                                            <div>{marcosCriticos.find(option => option.value === values.tipo_marco_critico)?.label || 'Nome do marco crítico padrão'}</div>
                                        )
                                    ) : (
                                        <div>{marcosCriticos.find(option => option.value === values.tipo_marco_critico)?.label || 'Selecione o nome do marco crítico'}</div>
                                    )}
                                </FormItem>

                                {(tipoAtual === 'Específico' || tipoAtual === 'outros') && !marcoCongelado && (
                                    <>
                                        <FormItem
                                            label="Nome do Marco Crítico Personalizado"
                                            invalid={errors.nome_marco_critico && touched.nome_marco_critico}
                                            errorMessage={errors.nome_marco_critico}
                                        >
                                            {isEditing && !marcoCongelado ? (
                                                <Field
                                                    autoComplete="off"
                                                    name="nome_marco_critico"
                                                    placeholder="Nome do Marco Crítico Personalizado"
                                                    component={Input}
                                                    readOnly={!isEditing}
                                                />
                                            ) : (
                                                <div>{values.nome_marco_critico}</div>
                                            )}
                                        </FormItem>
                                    </>
                                )}

                                <FormItem
                                    label="Descrição"
                                    invalid={errors.descricao && touched.descricao}
                                    errorMessage={errors.descricao}
                                >
                                    {isEditing && !marcoCongelado && (tipoAtual === 'Específico' || tipoAtual === 'outros') ? (
                                        <Field name="descricao">
                                            {({ field, form }: FieldProps) => (
                                                <Input
                                                    {...field}
                                                    textArea
                                                    value={form.values.descricao}
                                                    placeholder="Descrição"
                                                    className="form-textarea mt-1 block w-full"
                                                />
                                            )}
                                        </Field>
                                    ) : (
                                        <div>{values.descricao}</div>
                                    )}
                                </FormItem>


                                <FormItem
                                    label="Data Prevista"
                                    invalid={errors.dataPrevista && touched.dataPrevista}
                                    errorMessage={errors.dataPrevista}
                                >
                                    {isEditing && !marcoCongelado ? (
                                        <Field
                                            name="dataPrevista"
                                            component={DatePicker}
                                            placeholder="Data Prevista"
                                            onChange={(date: Date) => setFieldValue('dataPrevista', date)}
                                            value={values.dataPrevista ? moment(values.dataPrevista).toDate() : null}
                                        />
                                    ) : (
                                        <div>{values.dataPrevista ? moment(values.dataPrevista).format('DD/MM/YYYY') : '-'}</div>
                                    )}
                                </FormItem>

                                <FormItem
                                    label="Nova Data Prevista"
                                    invalid={errors.novaDataPrevista && touched.novaDataPrevista}
                                    errorMessage={errors.novaDataPrevista}
                                >
                                    {isEditing ? (
                                        <Field
                                            name="novaDataPrevista"
                                            component={DatePicker}
                                            placeholder="Nova Data Prevista"
                                            onChange={(date: Date) => setFieldValue('novaDataPrevista', date)}
                                            value={values.novaDataPrevista ? moment(values.novaDataPrevista).toDate() : null}
                                        />
                                    ) : (
                                        <div>{values.novaDataPrevista ? moment(values.novaDataPrevista).format('DD/MM/YYYY') : '-'}</div>
                                    )}
                                </FormItem>

                                <FormItem
                                    label="Término"
                                    invalid={errors.dataEncerramento && touched.dataEncerramento}
                                    errorMessage={errors.dataEncerramento}
                                >
                                    {isEditing ? (
                                        <Field
                                            name="dataEncerramento"
                                            component={DatePicker}
                                            placeholder="Término"
                                            onChange={(date: Date) => setFieldValue('dataEncerramento', date)}
                                            value={values.dataEncerramento ? moment(values.dataEncerramento).toDate() : null}
                                        />
                                    ) : (
                                        <div>{values.dataEncerramento ? moment(values.dataEncerramento).format('DD/MM/YYYY') : '-'}</div>
                                    )}
                                </FormItem>
                            </div>

                            <Field name="entidadeId" type="hidden" />

                            {anexosExistentes.length > 0 &&
                                <div className="my-4">
                                    <h6 className="mb-2">Documentos</h6>
                                    <ul>
                                        {anexosExistentes.map(anexo => (
                                            <li key={anexo.id} className="mb-2 flex justify-between items-center">
                                                <div>
                                                    <a href={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/download-anexo/aid/${btoa(String(anexo.id))}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {anexo.nome_arquivo}
                                                    </a> - {anexo.descricao}
                                                </div>
                                                {isEditing && !anexosParaRemover.includes(anexo.id) && (
                                                    <Button type="button" onClick={() => handleRemoveAnexo(anexo.id)} variant="solid" color="red-600">
                                                        Remover
                                                    </Button>
                                                )}
                                                {anexosParaRemover.includes(anexo.id) && (
                                                    <div className="text-red-500 ml-2">Será removido</div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }

                            <div className="flex justify-end">
                                <Button type="button" onClick={onClose} className="mt-4 mr-2">
                                    Cancelar
                                </Button>
                                {isEditing ? (
                                    <Button
                                        type="submit"
                                        className="mt-4"
                                        variant="solid"
                                    >
                                        Salvar
                                    </Button>
                                ) : (
                                    <div
                                        onClick={((isGestor || isConsultor) && marcoCritico?.status === 'Não atingido') ? toggleEdit : () => { }}
                                        className={`mt-4 px-6 py-3 rounded-md text-white bg-blue-600 cursor-pointer ${(marcoCritico?.status !== 'Não atingido' || !(isGestor || isConsultor)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Editar
                                    </div>
                                )}
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default EditMarcoCriticoForm;
