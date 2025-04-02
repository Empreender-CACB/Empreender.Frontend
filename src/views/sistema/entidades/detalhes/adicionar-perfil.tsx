import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Container, Loading } from "@/components/shared";
import { Input, Button, FormItem, Card, toast, Notification } from "@/components/ui";
import { useParams, Link, useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";
import Breadcrumb from "@/components/breadCrumbs/breadCrumb";

const labelsPerfil: Record<string, string> = {
    porcento_mulheres: "Percentual de mulheres que fazem parte do quadro de colaboradores, incluindo diretoria",
    pagantes_servico: "Serviço",
    pagantes_comercio: "Comércio",
    pagantes_industria: "Indústria",
    pagantes_agro: "Agro",
    pagantes_liberal: "Liberal",
    pagantes_mei: "MEI",
    pagantes_outros: "Outros",
    atividade_economica: "Principal Atividade Econômica/Segmento da Cidade",
    area_comercial: "Possui Área Comercial",
    vendedores_atuantes: "Vendedores Atuantes",
    certificado_origem: "Certificado de Origem",
    certificado_digital: "Certificado Digital",
    servico_analise_credito: "Serviço de Análise de Crédito",
    servico_intermediacao_estagio: "Serviço de Intermediação de Estágio",
    servico_concessao_credito: "Serviço de Concessão de Crédito",
    carta_exclusividade: "Declaração / Carta de Exclusividade",
    plano_saude: "Plano de Saúde",
    camara_mediacao: "Câmara de Mediação e Arbitragem",
    faculdade_comercio: "FAC - Faculdade do Comércio",
    aluguel_salas: "Aluguel de Salas",
    conselho_comites: "Conselhos ou Comitês Temáticos",
    sede_associacao: "Local",
    condicao_sede: "Condições da Sede",
    taxa_associativismo_min: "Valor mínimo - R$",
    taxa_associativismo_max: "Valor máximo - R$",
    faturamento_produtos_servicos: "Receita obtida com PRODUTOS/SERVIÇOS",
    faturamento_taxa_associativismo: "Receita obtida com TAXA DE ASSOCIATIVISMO",
};

const camposNumericos = [
    "pagantes_servico",
    "pagantes_comercio",
    "pagantes_industria",
    "pagantes_agro",
    "pagantes_liberal",
    "pagantes_mei",
    "pagantes_outros",
    "taxa_associativismo_min",
    "taxa_associativismo_max",
];

const validationSchema = Yup.object().shape({
    porcento_mulheres: Yup.string(),
    atividade_economica: Yup.string(),
    area_comercial: Yup.string(),
    vendedores_atuantes: Yup.string(),
    certificado_origem: Yup.string(),
    certificado_digital: Yup.string(),
    servico_analise_credito: Yup.string(),
    servico_intermediacao_estagio: Yup.string(),
    servico_concessao_credito: Yup.string(),
    carta_exclusividade: Yup.string(),
    plano_saude: Yup.string(),
    camara_mediacao: Yup.string(),
    faculdade_comercio: Yup.string(),
    aluguel_salas: Yup.string(),
    conselho_comites: Yup.string(),
    sede_associacao: Yup.string(),
    condicao_sede: Yup.string(),
    faturamento_produtos_servicos: Yup.string(),
    faturamento_taxa_associativismo: Yup.string(),

    pagantes_servico: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    pagantes_comercio: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    pagantes_industria: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    pagantes_agro: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    pagantes_liberal: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    pagantes_mei: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    pagantes_outros: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    taxa_associativismo_min: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),

    taxa_associativismo_max: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .min(0, "Não pode ser negativo"),
});


const EditarPerfil = () => {
    const { id } = useParams<{ id: string }>();
    const [formValues, setFormValues] = useState<any>(null);
    const [isNovoPerfil, setIsNovoPerfil] = useState(false);

    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: "Início", link: "/" },
        { label: "Entidades", link: "/entidades" },
        { label: "Entidade", link: `/entidades/${id}` },
        { label: "Perfil", link: "#" },
    ]);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await ApiService.fetchData({
                    url: `/perfil-entidade/${id}`,
                    method: "get",
                });

                setFormValues(response.data);
                setIsNovoPerfil(false);
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    setFormValues({
                        porcento_mulheres: "",
                        pagantes_servico: "",
                        pagantes_comercio: "",
                        pagantes_industria: "",
                        pagantes_agro: "",
                        pagantes_liberal: "",
                        pagantes_mei: "",
                        pagantes_outros: "",
                        atividade_economica: "",
                        area_comercial: "",
                        vendedores_atuantes: "",
                        certificado_origem: "",
                        certificado_digital: "",
                        servico_analise_credito: "",
                        servico_intermediacao_estagio: "",
                        servico_concessao_credito: "",
                        carta_exclusividade: "",
                        plano_saude: "",
                        camara_mediacao: "",
                        faculdade_comercio: "",
                        aluguel_salas: "",
                        conselho_comites: "",
                        sede_associacao: "",
                        condicao_sede: "",
                        taxa_associativismo_min: "",
                        taxa_associativismo_max: "",
                        faturamento_produtos_servicos: "",
                        faturamento_taxa_associativismo: "",
                    });
                    setIsNovoPerfil(true);
                } else {
                    console.error("Erro ao buscar perfil:", error);
                }
            }
        };

        if (id) fetchPerfil();
    }, [id]);


    const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                idassociacao: id,
            };

            const method = isNovoPerfil ? "post" : "put";
            const url = `/perfil-entidade/${id}`;

            await ApiService.fetchData({
                url,
                method,
                data: payload,
            });

            toast.push(<Notification title="Perfil salvo com sucesso!" type="success" />);
            navigate(`/sistema/entidades/${id}/perfil`);

        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            toast.push(<Notification title="Erro ao salvar perfil." type="danger" />);
        }
    };


    if (!formValues) return <Loading loading />;

    return (
        <Container className="my-8">
            <Card>
                <div className="w-full max-w-5xl mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h1 className="text-2xl font-semibold text-gray-800">Editar Perfil da Entidade</h1>
                </div>

                <Formik
                    initialValues={formValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            {/* Diretoria */}
                            <Section title="Perfil da Diretoria">
                                <GridInput name="porcento_mulheres" label="% Mulheres" errors={errors} touched={touched} />
                            </Section>

                            {/* Associados Pagantes */}
                            <Section title="Associados Pagantes">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <GridInput name="pagantes_servico" label="Serviço" errors={errors} touched={touched} />
                                    <GridInput name="pagantes_comercio" label="Comércio" errors={errors} touched={touched} />
                                    <GridInput name="pagantes_industria" label="Indústria" errors={errors} touched={touched} />
                                    <GridInput name="pagantes_agro" label="Agro" errors={errors} touched={touched} />
                                    <GridInput name="pagantes_liberal" label="Liberal" errors={errors} touched={touched} />
                                    <GridInput name="pagantes_mei" label="MEI" errors={errors} touched={touched} />
                                    <GridInput name="pagantes_outros" label="Outros" errors={errors} touched={touched} />
                                </div>
                            </Section>

                            {/* Atividade Econômica */}
                            <Section title="Atividade Econômica">
                                <GridInput name="atividade_economica" label="Atividade Econômica" errors={errors} touched={touched} />
                            </Section>

                            {/* Comercial */}
                            <Section title="Atuação Comercial">
                                <div className="grid grid-cols-2 gap-4">
                                    <GridInput name="area_comercial" label="Área Comercial" errors={errors} touched={touched} />
                                    <GridInput name="vendedores_atuantes" label="Vendedores Atuantes" errors={errors} touched={touched} />
                                </div>
                            </Section>

                            {/* Produtos/Serviços */}
                            <Section title="Produtos e Serviços">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        "certificado_origem",
                                        "certificado_digital",
                                        "servico_analise_credito",
                                        "servico_intermediacao_estagio",
                                        "servico_concessao_credito",
                                        "carta_exclusividade",
                                        "plano_saude",
                                        "camara_mediacao",
                                        "faculdade_comercio",
                                        "aluguel_salas",
                                    ].map((field) => (
                                        <GridInput key={field} name={field} label={field.replace(/_/g, ' ')} errors={errors} touched={touched} />
                                    ))}
                                </div>
                            </Section>

                            {/* Comitês */}
                            <Section title="Conselhos ou Comitês Temáticos">
                                <GridInput name="conselho_comites" label="Conselhos ou Comitês" errors={errors} touched={touched} />
                            </Section>

                            {/* Sede */}
                            <Section title="Sede da Associação Comercial">
                                <div className="grid grid-cols-2 gap-4">
                                    <GridInput name="sede_associacao" label="Local" errors={errors} touched={touched} />
                                    <GridInput name="condicao_sede" label="Condições da Sede" errors={errors} touched={touched} />
                                </div>
                            </Section>

                            {/* Taxa */}
                            <Section title="Taxa de Associativismo">
                                <div className="grid grid-cols-2 gap-4">
                                    <GridInput name="taxa_associativismo_min" label="Valor Mínimo" errors={errors} touched={touched} />
                                    <GridInput name="taxa_associativismo_max" label="Valor Máximo" errors={errors} touched={touched} />
                                </div>
                            </Section>

                            {/* Faturamento */}
                            <Section title="Distribuição do Faturamento">
                                <div className="grid grid-cols-2 gap-4">
                                    <GridInput name="faturamento_produtos_servicos" label="Produtos/Serviços" errors={errors} touched={touched} />
                                    <GridInput name="faturamento_taxa_associativismo" label="Taxa de Associativismo" errors={errors} touched={touched} />
                                </div>
                            </Section>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="default">
                                    <Link to={`/sistema/entidades/${id}`}>Cancelar</Link>
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
    );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
    </div>
);

const GridInput = ({ name, errors, touched }: any) => {
    const label = labelsPerfil[name] || name.replace(/_/g, " ").replace(/^./, (l: string) => l.toUpperCase());
    const isNumber = camposNumericos.includes(name);

    return (
        <FormItem
            label={label}
            invalid={touched[name] && !!errors[name]}
            errorMessage={errors[name] as string}
        >
            <Field
                name={name}
                placeholder={label}
                type={isNumber ? "number" : "text"}
                component={Input}
            />
        </FormItem>
    );
};


export default EditarPerfil;
