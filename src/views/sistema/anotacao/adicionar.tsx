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
import { CgClose as CloseIcon } from 'react-icons/cg'
import { APP_PREFIX_PATH } from '@/constants/route.constant';

const validationSchema = Yup.object().shape({
    descricao: Yup.string().required('Campo obrigatório'),
    situacao: Yup.string().required('Campo obrigatório'),
    privacidade: Yup.string().required('Campo obrigatório'),
});

const situacaoOptions = [
    { value: 'ec', label: 'Em Cadastramento' },
    { value: 'di', label: 'Divulgada' },
];

const privacidadeOptions = [
    { value: 'si', label: 'Sem indicação' },
    { value: 'pr', label: 'Próprio' },
    { value: 'ep', label: 'Empresários participantes' },
    { value: 'ge', label: 'Gestores' },
    { value: 'na', label: 'Nacional' },
];

interface FileInput {
    file?: File;
    fileName?: string;
}

const AnotacaoForm = () => {
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [nomeVinculoSecundario, setNomeVinculoSecundario] = useState('');
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState<FileInput[]>([{ fileName: '' }]);

    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: 'Início', link: '/' },
        { label: 'Anotação', link: '#' },
    ]);
    const [initialValues, setInitialValues] = useState({
        descricao: '',
        situacao: '',
        privacidade: '',
    });

    const { tipoVinculo, idVinculo, idAnotacao } = useParams();
    const searchParams = new URLSearchParams(window.location.search);

    const redirectUrl = searchParams.get('redirectUrl') || `${APP_PREFIX_PATH}/anotacoes/${tipoVinculo}/${idVinculo}`;
    const idVinculoAux = searchParams.get('idVinculoAux');
    const tipoVinculoAux = searchParams.get('tipoVinculoAux');
    const temAnexos = searchParams.get('temAnexos') === 'true';

    const navigate = useNavigate();
    const isEditMode = Boolean(idAnotacao);

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
                    { label: 'Anotação', link: '#' },
                ]);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };

        const fetchAnotacao = async () => {
            if (!isEditMode) return;
            try {
                const response = await ApiService.fetchData({
                    url: `/anotacoes/fetchAnotacao/${idAnotacao}`,
                    method: 'get',
                });
                setInitialValues({
                    descricao: response.data.descricao,
                    situacao: response.data.situacao,
                    privacidade: response.data.privacidade,
                });
            } catch (error) {
                console.error('Erro ao buscar dados da anotação:', error);
            }
        };

        fetchVinculo();
        fetchAnotacao();
    }, [tipoVinculo, idVinculo, idAnotacao, isEditMode]);

    const handleSave = async (values: any, filesData: any, tipoVinculo?: string, idVinculo?: string, tipoVinculoAux?: string, idVinculoAux?: string) => {
        setLoading(true);
        toast.push(
            <Notification title={`${idAnotacao ? 'Editando' : 'Salvando'} anotação, aguarde...`} type="success" />
        );

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
            const url = idAnotacao ? `/anotacoes/editar/${idAnotacao}` : '/anotacoes/adicionar';
            const method = idAnotacao ? 'put' : 'post';

            await ApiService.fetchData({
                url,
                method,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.push(<Notification title="Anotação salva com sucesso!" type="success" />);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                navigate(`/sistema/anotacoes/${tipoVinculo}/${idVinculo}${tipoVinculoAux && idVinculoAux ? `/${tipoVinculoAux}/${idVinculoAux}` : ''}`);
            }

        } catch (error) {
            toast.push(<Notification title="Erro ao salvar anotação." type="danger" />);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileName = file.name;

            setInputs((prev) =>
                prev.map((item, i) =>
                    i === index ? { ...item, file, fileName } : item
                )
            );
        }
    };

    const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        setInputs((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, fileName: value } : item
            )
        );
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
                        handleSave(
                            values,
                            inputs,
                            tipoVinculo,
                            idVinculo,
                            tipoVinculoAux || undefined,
                            idVinculoAux || undefined
                        );
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="mb-6">
                                <h5 className="text-xl font-semibold text-gray-700 mb-4">
                                    Adição de anotação
                                </h5>
                                {/* <div className="flex items-center space-x-2">
                                    <Tag className="bg-gray-400 text-white border-0 rounded">{capitalize(tipoVinculo || '')}</Tag>
                                    <Tag className="bg-indigo-600 text-white border-0 rounded">{nomeVinculo}</Tag>
                                    {tipoVinculoAux && <Tag className="bg-gray-400 text-white border-0 rounded">{capitalize(tipoVinculoAux || '')}</Tag>}
                                    {nomeVinculoSecundario && <Tag className="bg-indigo-600 text-white border-0 rounded">{nomeVinculoSecundario}</Tag>}
                                </div> */}
                            </div>

                            <div className="mb-6">
                                <FormItem asterisk label="Descrição" invalid={!!errors.descricao && touched.descricao} errorMessage={errors.descricao}>
                                    <Field name="descricao" as="textarea" textArea placeholder="Descrição da anotação" component={Input} />
                                </FormItem>
                            </div>

                            <div className="flex gap-4">
                                <FormItem label="Situação" asterisk invalid={!!errors.situacao && touched.situacao} errorMessage={errors.situacao} className="w-full md:w-auto">
                                    <Field name="situacao">
                                        {({ field, form }: any) => (
                                            <Select
                                                {...field}
                                                options={situacaoOptions}
                                                placeholder="Selecione a situação"
                                                value={situacaoOptions.find(option => option.value === form.values.situacao)}
                                                onChange={(option: any) => form.setFieldValue('situacao', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem label="Privacidade" asterisk invalid={!!errors.privacidade && touched.privacidade} errorMessage={errors.privacidade} className="w-full md:w-auto">
                                    <Field name="privacidade">
                                        {({ field, form }: any) => (
                                            <Select
                                                {...field}
                                                options={privacidadeOptions}
                                                placeholder="Selecione a privacidade"
                                                value={privacidadeOptions.find(option => option.value === form.values.privacidade)}
                                                onChange={(option: any) => form.setFieldValue('privacidade', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>

                            {!idAnotacao && temAnexos &&
                                <div className="sm:col-span-2 pt-5">
                                    <label className="block text-sm font-semibold leading-6 text-gray-600">Documentos</label>
                                    <div className="mt-2 container">
                                        {inputs.map((input, index) => (
                                            <div key={index} className="input_container flex items-center space-x-4 mb-2 flex-wrap space-y-1">
                                                <label className="bg-gray-200 py-2 px-4 rounded-md cursor-pointer">
                                                    <input
                                                        type="file"
                                                        name={`file-${index}`}
                                                        className="w-50"
                                                        accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                                                        onChange={(e) => handleFileChange(e, index)}
                                                    />
                                                </label>
                                                <input
                                                    type="text"
                                                    name={`file_name-${index}`}
                                                    placeholder="Nome do documento"
                                                    className="border p-2 rounded-md w-1/2"
                                                    value={input.fileName || ''}
                                                    onChange={(e) => handleFileNameChange(e, index)}
                                                />
                                                {inputs.length > 1 && (
                                                    <span onClick={() => handleDeleteInput(index)}>
                                                        <CloseIcon />
                                                    </span>
                                                )}
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
                            }

                            <div className="flex justify-end gap-4">
                                <Link
                                    className="block lg:inline-block md:mb-0 mb-4"
                                    to={`${redirectUrl ? redirectUrl : APP_PREFIX_PATH}/anotacoes/${tipoVinculo}/${idVinculo}`}
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

export default AnotacaoForm;
