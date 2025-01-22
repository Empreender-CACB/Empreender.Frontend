import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Button, FormItem, Input, Notification, Select, Tag, toast } from '@/components/ui';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import capitalize from '@/components/ui/utils/capitalize';
import { HiOutlinePlus } from 'react-icons/hi';
import { CgClose as CloseIcon } from 'react-icons/cg';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('Campo obrigatório'),
    descricao: Yup.string().required('Campo obrigatório'),
    dataPrevistaSolucao: Yup.string().required('Campo obrigatório'),
    bloqueioFinanceiro: Yup.string().required('Campo obrigatório'),
});

const bloqueioOptions = [
    { value: 'de', label: 'Desbloqueado' },
    { value: 'bo', label: 'Bloqueado' },
];

const PendenciaForm = () => {
    const [loading, setLoading] = useState(false);
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [nomeVinculoSecundario, setNomeVinculoSecundario] = useState('');
    const [inputs, setInputs] = useState([{}]);
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: 'Início', link: '/' },
        { label: 'Pendências', link: '#' },
    ]);

    const [initialValues, setInitialValues] = useState({
        titulo: '',
        descricao: '',
        dataPrevistaSolucao: '',
        bloqueioFinanceiro: '',
    });

    const { tipoVinculo, idVinculo, idPendencia } = useParams();
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get('redirectUrl') || `${APP_PREFIX_PATH}/pendencias/${tipoVinculo}/${idVinculo}`;
    const idVinculoAux = searchParams.get('idVinculoAux');
    const tipoVinculoAux = searchParams.get('tipoVinculoAux');

    const isEditMode = Boolean(idPendencia);

    useEffect(() => {
        const fetchVinculo = async () => {
            try {
                const vinculoResponse = await ApiService.fetchData({
                    url: `anexos/getVinculo/${tipoVinculo}/${idVinculo}${tipoVinculoAux && idVinculoAux ? `/${tipoVinculoAux}/${idVinculoAux}` : ''}`,
                    method: 'get',
                });
    
                const { nomeVinculo, nomeVinculoAux, breadcrumb } = vinculoResponse.data;
                setNomeVinculo(nomeVinculo);
                setNomeVinculoSecundario(nomeVinculoAux);
    
                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    ...breadcrumb.map((item: any) => ({
                        label: item.label,
                        link: item.url,
                    })),
                    { label: 'Pendência', link: '#' },
                ]);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };
    
        const fetchPendencia = async () => {
            if (!isEditMode) return;
            try {
                const response = await ApiService.fetchData({
                    url: `/pendencias/fetchPendencia/${idPendencia}`,
                    method: 'get',
                });
                setInitialValues({
                    titulo: response.data.titulo,
                    descricao: response.data.descricao,
                    dataPrevistaSolucao: response.data.dataPrevistaSolucao,
                    bloqueioFinanceiro: response.data.bloqueioFinanceiro,
                });
            } catch (error) {
                console.error('Erro ao buscar dados da pendência:', error);
            }
        };
    
        fetchVinculo();
        fetchPendencia();
    }, [tipoVinculo, idVinculo, idPendencia, isEditMode]);

    const handleSave = async (values: any, filesData: any) => {
        toast.push(<Notification title="Salvando pendência, aguarde..." type="success" />);
        setLoading(true);

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => formData.append(key, value as string));

        filesData.forEach(({ file, fileName }: { file: File; fileName: string }) => {
            formData.append('files', file);
            formData.append('fileNames', fileName);
        });

        formData.append('tipoVinculo', tipoVinculo || '');
        formData.append('idVinculo', idVinculo || '');
        formData.append('tipoVinculoAux', tipoVinculoAux || '');
        formData.append('idVinculoAux', idVinculoAux || '');

        try {
            const url = idPendencia ? `/pendencias/editar/${idPendencia}` : '/pendencias/adicionar';
            const method = idPendencia ? 'put' : 'post';

            await ApiService.fetchData({
                url,
                method,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.push(<Notification title="Pendência salva com sucesso!" type="success" />);
            window.location.href = redirectUrl;
        } catch (error) {
            toast.push(<Notification title="Erro ao salvar pendência." type="danger" />);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInput = () => {
        setInputs([...inputs, {}]);
    };

    const handleDeleteInput = (index: any) => {
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
        index.preventDefault();
        index.stopPropagation();
        return false;
    };

    return (
        <Container>
            <Breadcrumb items={breadcrumbItems} />
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSave(values, inputs);
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="mb-6">
                                <h5 className="text-xl font-semibold text-gray-700 mb-4">
                                    Adicionando pendência em:
                                </h5>
                                <div className="flex items-center space-x-2">
                                    <Tag className="bg-gray-400 text-white border-0 rounded">{capitalize(tipoVinculo || '')}</Tag>
                                    <Tag className="bg-indigo-600 text-white border-0 rounded">{nomeVinculo}</Tag>
                                    {tipoVinculoAux && <Tag className="bg-gray-400 text-white border-0 rounded">{capitalize(tipoVinculoAux || '')}</Tag>}
                                    {nomeVinculoSecundario && <Tag className="bg-indigo-600 text-white border-0 rounded">{nomeVinculoSecundario}</Tag>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <FormItem asterisk label="Título" invalid={!!errors.titulo && touched.titulo} errorMessage={errors.titulo}>
                                    <Field name="titulo" as={Input} placeholder="Título da pendência" />
                                </FormItem>
                            </div>

                            <div className="mb-6">
                                <FormItem asterisk label="Descrição" invalid={!!errors.descricao && touched.descricao} errorMessage={errors.descricao}>
                                    <Field name="descricao" as="textarea" placeholder="Descrição da pendência" className="w-full p-2 border rounded" />
                                </FormItem>
                            </div>

                            <div className="mb-6">
                                <FormItem asterisk label="Data Prevista para Solução" invalid={!!errors.dataPrevistaSolucao && touched.dataPrevistaSolucao} errorMessage={errors.dataPrevistaSolucao}>
                                    <Field name="dataPrevistaSolucao" type="date" as={Input} />
                                </FormItem>
                            </div>

                            <div className="mb-6">
                                <FormItem asterisk label="Bloqueio Financeiro" invalid={!!errors.bloqueioFinanceiro && touched.bloqueioFinanceiro} errorMessage={errors.bloqueioFinanceiro}>
                                    <Field name="bloqueioFinanceiro">
                                        {({ field, form }: any) => (
                                            <Select
                                                {...field}
                                                options={bloqueioOptions}
                                                placeholder="Selecione o bloqueio"
                                                value={bloqueioOptions.find(option => option.value === form.values.bloqueioFinanceiro)}
                                                onChange={(option: any) => form.setFieldValue('bloqueioFinanceiro', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>

                            <div className="sm:col-span-2 pt-5">
                                <label className="block text-sm font-semibold leading-6 text-gray-600">Documentos</label>
                                <div className="mt-2 container">
                                    {inputs.map((input, index) => (
                                        <div key={index} className="input_container flex items-center space-x-4 mb-2 flex-wrap space-y-1">
                                            <label className="bg-gray-200 py-2 px-4 rounded-md cursor-pointer">
                                                <input
                                                    type="file"
                                                    name="files"
                                                    className="w-50"
                                                    accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                                                    onChange={(e: any) => setInputs(prev => prev.map((item, i) => i === index ? { ...item, file: e.target.files[0] } : item))}
                                                />
                                            </label>
                                            <input type="text" name="file_name" placeholder="Nome do documento" className="border p-2 rounded-md w-1/2" />
                                            {inputs.length > 1 && <span onClick={() => handleDeleteInput(index)}><CloseIcon /></span>}
                                        </div>
                                    ))}
                                    <div
                                        onClick={handleAddInput}
                                        className="mr-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                                    >
                                        <HiOutlinePlus className="mr-1" />
                                        Adicionar mais arquivos
                                    </div>                                
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link
                                    className="block lg:inline-block md:mb-0 mb-4"
                                    to={`${redirectUrl}`}
                                >
                                    <Button
                                        block
                                        variant="default"
                                    >
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={loading} variant="solid">{loading ? 'Salvando...' : 'Salvar'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};

export default PendenciaForm;
