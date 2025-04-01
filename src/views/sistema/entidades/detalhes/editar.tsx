import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, Button, FormItem, Card, DatePicker } from "@/components/ui";
import ApiService from "@/services/ApiService";
import { Link, useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { MultiValue } from "react-select";
import { Container, Loading } from "@/components/shared";
import Breadcrumb from "@/components/breadCrumbs/breadCrumb";
import moment from "moment";
import ReactInputMask from "react-input-mask";

const validationSchema = Yup.object().shape({
    tipo: Yup.string().required("Campo obrigatório"),
    flativo: Yup.string().required("Campo obrigatório"),
    nmrazao: Yup.string().required("Campo obrigatório"),
    sigla: Yup.string().required("Campo obrigatório"),
});

const MaskedInput = ({ field, form, mask, ...props }: any) => {
    return (
        <ReactInputMask mask={mask} {...field} {...props}>
            {(inputProps: any) => <Input {...inputProps} />}
        </ReactInputMask>
    );
};

const EditarEntidade = () => {
    const { id } = useParams<{ id: string }>();
    const idEntidade = Number(id);

    const [formValues, setFormValues] = useState<any>(null);
    const [tipos, setTipos] = useState<{ id: number; nome: string }[]>([]);
    const [gestores, setGestores] = useState<any[]>([]);
    const [idEntidadeEstrangeira] = useState<number>(3);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

    const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dados, tiposResp, gestoresResp] = await Promise.all([
                    ApiService.fetchData({ url: `/entidades/${idEntidade}`, method: "get" }),
                    ApiService.fetchData({ url: "/tipos-entidade", method: "get" }),
                    ApiService.fetchData({ url: `/get-usuarios-gestores/${idEntidade}`, method: "get" }),
                ]);

                const dadosEntidade = dados.data;

                const gestorPrincipal = gestoresResp.data.find((g: any) => g.gestor_principal === true);
                const adicionais = gestoresResp.data.filter((g: any) => g.gestor_principal !== true);

                setFormValues({
                    tipo: dadosEntidade.id_tipo_entidade || "",
                    flativo: dadosEntidade.flativo || "S",
                    nmrazao: dadosEntidade.nmrazao || "",
                    dtfundacao: dadosEntidade.dtfundacao
                        ? moment(dadosEntidade.dtfundacao).toDate()
                        : null,
                    nucnpj: dadosEntidade.nucnpj || "",
                    nucep: dadosEntidade.nucep || "",
                    nufone: dadosEntidade.nufone || "",
                    dsemail: dadosEntidade.dsemail || "",
                    dshomepage: dadosEntidade.dshomepage || "",
                    sigla: dadosEntidade.sigla || "",
                    sigla_unica: dadosEntidade.sigla_unica || "",
                    logoentidade: null,
                    gestor_principal: gestorPrincipal?.nucpf || "",
                    gestor_principal_label: gestorPrincipal
                        ? `${gestorPrincipal.nmusuario}`
                        : "",
                    gestores_adicionais: adicionais.map((g: any) => g.nucpf),
                    gestores_labels: Object.fromEntries(
                        adicionais.map((g: any) => [
                            g.nucpf,
                            `${g.nmusuario}`,
                        ])
                    ),
                });

                setTipos(
                    tiposResp.data.map((tipo: any) => ({
                        id: tipo.id,
                        nome: tipo.nome,
                    }))
                );

                setGestores(gestoresResp.data || []);

                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    { label: 'Lista', link: '/sistema/entidades' },
                    { label: dadosEntidade.nmrazao || 'Entidade', link: `/sistema/entidades/${id}` },
                ]);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };

        if (idEntidade) fetchData();
    }, [idEntidade, idEntidadeEstrangeira]);


    const handleSubmit = async (values: any) => {
        try {

            const payload = {
                ...values,
                nucnpj: values.nucnpj?.replace(/\D/g, ""),
                nucep: values.nucep?.replace(/\D/g, ""),
            };

            await ApiService.fetchData({
                url: `/entidades/${idEntidade}`,
                method: "put",
                data: payload,
            });;
        } catch (error) {
            console.error("Erro ao salvar entidade:", error);
        }
    };

    const loadGestores = async (inputValue: string) => {
        if (!inputValue || inputValue.length < 2) return [];

        try {
            const response = await ApiService.fetchData({
                url: `/usuarios/buscar?search=${inputValue}`,
                method: "get",
            });

            return response.data.map((user: any) => ({
                value: user.nucpf,
                label: `${user.nmusuario}`,
            }));
        } catch (error) {
            console.error("Erro ao buscar gestores:", error);
            return [];
        }
    };



    const handleGestorPrincipalChange = (
        option: { value: string; label: string } | null,
        setFieldValue: Function
    ) => {
        setFieldValue("gestor_principal", option?.value || "");
        setFieldValue("gestor_principal_label", option?.label || "");
    };

    const handleGestoresAdicionaisChange = (
        options: MultiValue<{ value: string; label: string }> | null,
        setFieldValue: Function,
        currentLabels: Record<string, string> = {}
    ) => {
        const values = options?.map((opt) => opt.value) || [];
        const labels = options?.reduce((acc, opt) => {
            acc[opt.value] = opt.label;
            return acc;
        }, {} as Record<string, string>) || {};

        setFieldValue("gestores_adicionais", values);
        setFieldValue("gestores_labels", {
            ...currentLabels,
            ...labels,
        });
    };

    return (
        <Loading loading={!formValues}>
            <Container className="my-8">
                <Card>
                    <div className="w-full max-w-4xl mb-4">
                        <Breadcrumb items={breadcrumbItems} />
                        <h1 className="text-2xl font-semibold text-gray-800">Editar entidade</h1>
                    </div>

                    <Formik
                        initialValues={formValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, setFieldValue, values }) => (
                            <Form className="space-y-8">
                                {/* ===================== DADOS DA ENTIDADE ===================== */}
                                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                                    <h2 className="text-lg font-semibold mb-4">Dados da Entidade</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem
                                            label="Tipo"
                                            asterisk
                                            invalid={touched.tipo && !!errors.tipo}
                                            errorMessage={errors.tipo as string}
                                        >
                                            <Field name="tipo">
                                                {({ field }: any) => {
                                                    const options = tipos.map((tipo) => ({
                                                        value: tipo.id,
                                                        label: tipo.nome,
                                                    }));
                                                    const selectedOption = options.find((opt) => opt.value === field.value);
                                                    return (
                                                        <Select
                                                            options={options}
                                                            placeholder="Selecione"
                                                            value={selectedOption || null}
                                                            onChange={(option: any) => {
                                                                setFieldValue("tipo", option?.value);
                                                            }}
                                                        />
                                                    );
                                                }}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            label="Status"
                                            asterisk
                                            invalid={touched.flativo && !!errors.flativo}
                                            errorMessage={errors.flativo as string}
                                        >
                                            <Field name="flativo">
                                                {({ field }: any) => (
                                                    <Select
                                                        {...field}
                                                        options={[
                                                            { value: "S", label: "Ativo" },
                                                            { value: "N", label: "Inativo" },
                                                        ]}
                                                        placeholder="Selecione"
                                                        value={
                                                            field.value === "S"
                                                                ? { value: "S", label: "Ativo" }
                                                                : { value: "N", label: "Inativo" }
                                                        }
                                                        onChange={(option: any) => setFieldValue("flativo", option?.value)}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            label="Razão Social"
                                            asterisk
                                            invalid={touched.nmrazao && !!errors.nmrazao}
                                            errorMessage={errors.nmrazao as string}
                                            className="col-span-full"
                                        >
                                            <Field name="nmrazao" placeholder="Razão Social" component={Input} />
                                        </FormItem>

                                        <FormItem label="Data da Fundação">
                                            <Field
                                                name="dtfundacao"
                                                placeholder="dd/mm/aaaa"
                                                component={DatePicker}
                                                value={values.dtfundacao ? moment(values.dtfundacao).toDate() : null}
                                            />
                                        </FormItem>

                                        <FormItem label="CNPJ">
                                            <Field
                                                name="nucnpj"
                                                placeholder="00.000.000/0000-00"
                                                mask="99.999.999/9999-99"
                                                component={MaskedInput}
                                            />
                                        </FormItem>

                                        <FormItem label="CEP">
                                            <Field
                                                name="nucep"
                                                placeholder="00000-000"
                                                mask="99999-999"
                                                component={MaskedInput}
                                            />
                                        </FormItem>


                                        <FormItem label="Telefone">
                                            <Field name="nufone" placeholder="Telefone" component={Input} />
                                        </FormItem>

                                        <FormItem
                                            label="E-mail"
                                            className="col-span-full"
                                        >
                                            <Field name="dsemail" placeholder="E-mail" component={Input} />
                                        </FormItem>

                                        <FormItem label="Endereço Web" className="col-span-full">
                                            <Field name="dshomepage" placeholder="Homepage" component={Input} />
                                        </FormItem>

                                        <FormItem
                                            label="Sigla"
                                            asterisk
                                            invalid={touched.sigla && !!errors.sigla}
                                            errorMessage={errors.sigla as string}
                                        >
                                            <Field name="sigla" placeholder="Sigla" component={Input} />
                                        </FormItem>

                                        <FormItem label="Sigla Única">
                                            <Field name="sigla_unica" placeholder="Sigla Única" component={Input} />
                                        </FormItem>
                                    </div>
                                </div>


                                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                                    <h2 className="text-lg font-semibold mb-4">Logo da Entidade</h2>

                                    <FormItem label="Logo">
                                        <input
                                            type="file"
                                            accept=".jpg, .jpeg, .png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setFieldValue("logoentidade", file);

                                                if (file) {
                                                    setLogoPreviewUrl(URL.createObjectURL(file));
                                                } else {
                                                    setLogoPreviewUrl(null);
                                                }
                                            }}
                                        />
                                    </FormItem>

                                    {logoPreviewUrl && (
                                        <div className="mt-4">
                                            <span className="text-sm text-gray-600">Pré-visualização:</span>
                                            <div className="mt-2">
                                                <img
                                                    src={logoPreviewUrl}
                                                    alt="Prévia da logo"
                                                    className="max-h-40 rounded border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                                    <h2 className="text-lg font-semibold mb-4">Gestores</h2>

                                    <FormItem label="Gestor Principal">
                                        <Field name="gestor_principal">
                                            {({ field, form }: any) => (
                                                <AsyncSelect
                                                    cacheOptions
                                                    defaultOptions
                                                    placeholder="Digite o nome ou CPF"
                                                    loadOptions={loadGestores}
                                                    value={
                                                        field.value
                                                            ? {
                                                                value: field.value,
                                                                label:
                                                                    form.values.gestor_principal_label ||
                                                                    form.values.gestores_labels?.[field.value] ||
                                                                    field.value,
                                                            }
                                                            : null
                                                    }
                                                    onChange={(option: any) =>
                                                        handleGestorPrincipalChange(option, form.setFieldValue)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem label="Gestores Adicionais">
                                        <Field name="gestores_adicionais">
                                            {({ field, form }: any) => (
                                                <AsyncSelect
                                                    isMulti
                                                    cacheOptions
                                                    defaultOptions
                                                    placeholder="Digite o nome ou CPF"
                                                    loadOptions={loadGestores}
                                                    value={(field.value || []).map((nucpf: string) => ({
                                                        value: nucpf,
                                                        label: form.values.gestores_labels?.[nucpf] || nucpf,
                                                    }))}
                                                    onChange={(options: any, _actionMeta) =>
                                                        handleGestoresAdicionaisChange(
                                                            options,
                                                            form.setFieldValue,
                                                            form.values.gestores_labels || {}
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="submit" variant="default">
                                        <Link to={`/sistema/entidades/${id}`}>
                                            Cancelar
                                        </Link>
                                    </Button>
                                    <Button type="submit" variant="solid">
                                        Salvar
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Container>
        </Loading>
    );
};

export default EditarEntidade;
