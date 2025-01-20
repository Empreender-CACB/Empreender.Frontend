import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Button, FormItem, Input, Notification, Select, Tag, toast } from '@/components/ui';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import capitalize from '@/components/ui/utils/capitalize';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('Campo obrigatório'),
    descricao: Yup.string().required('Campo obrigatório'),
    dataPrevistaSolucao: Yup.string().required('Campo obrigatório'),
    bloqueioFinanceiro: Yup.string().required('Campo obrigatório'),
});

const bloqueioOptions = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
];

const PendenciaForm = () => {
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [nomeVinculoSecundario, setNomeVinculoSecundario] = useState('');
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

    const { tipoVinculo, idVinculo } = useParams();
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get('redirectUrl') || `${APP_PREFIX_PATH}/pendencias/${tipoVinculo}/${idVinculo}`;
    const idVinculoAux = searchParams.get('idVinculoAux');
    const tipoVinculoAux = searchParams.get('tipoVinculoAux');

    const navigate = useNavigate();

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

        fetchVinculo();
    }, [tipoVinculo, idVinculo]);

    const handleSave = async (values: any) => {
        toast.push(
            <Notification title="Salvando pendência, aguarde..." type="success" />
        );

        const formData = {
            ...values,
            tipoVinculo,
            idVinculo,
            tipoVinculoAux,
            idVinculoAux,
        };

        try {
            await ApiService.fetchData({
                url: '/pendencias/adicionar',
                method: 'post',
                data: formData,
            });

            toast.push(<Notification title="Pendência salva com sucesso!" type="success" />);
            window.location.href = redirectUrl;
        } catch (error) {
            toast.push(<Notification title="Erro ao salvar pendência." type="danger" />);
        }
    };

    return (
        <Container>
            <Breadcrumb items={breadcrumbItems} />
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSave(values)}
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

                            <div className="flex justify-end gap-4">
                                <Link className="block lg:inline-block md:mb-0 mb-4" to={redirectUrl}>
                                    <Button block variant="default">Cancelar</Button>
                                </Link>
                                <Button type="submit" variant="solid">Salvar</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};

export default PendenciaForm;
