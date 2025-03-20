import { Button, Dialog, Input, Select, FormItem } from "@/components/ui";
import ApiService from "@/services/ApiService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useEffect } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    initialData?: any;
    entidadeId: number | string;
};

const validationSchema = Yup.object({
    nmcontato: Yup.string().required("Campo obrigatório"),
    nucpf: Yup.string()
        .matches(/^\d{11}$/, "CPF inválido (somente números, 11 dígitos)")
        .required("Campo obrigatório"),
    dsemail: Yup.string().email("E-mail inválido").required("Campo obrigatório"),
    sexo: Yup.string().required("Campo obrigatório"),
    nufone: Yup.string()
        .matches(/^\d{10,11}$/, "Telefone inválido (somente números, 10 ou 11 dígitos)"),
    nucel: Yup.string()
        .matches(/^\d{10,11}$/, "Celular inválido (somente números, 10 ou 11 dígitos)")
        .required("Campo obrigatório"),
    cargo: Yup.string().required("Campo obrigatório"),
    flativo: Yup.string().oneOf(["S", "N"], "Valor inválido").required("Campo obrigatório"),
    nascimento: Yup.string().nullable(),
    dtiniciomandato: Yup.string().nullable(),
    dtfimmandato: Yup.string().nullable(),
    nurg: Yup.string().matches(/^\d{7,11}$/, "RG inválido (somente números, 7 a 11 dígitos)"),
});

const sexoOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Feminino", label: "Feminino" },
    { value: "Prefiro não declarar", label: "Prefiro não declarar" },
];

const statusOptions = [
    { value: "S", label: "Ativo" },
    { value: "N", label: "Inativo" },
];

const formatDateToDB = (date: string | null) => {
    if (!date || dayjs(date, "YYYY-MM-DD", true).isValid() === false) return null;
    return dayjs(date).format("YYYY-MM-DD");
};

const AdicionarContato = ({ isOpen, onClose, onConfirm, initialData, entidadeId }: ModalProps) => {
    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                dtiniciomandato: formatDateToDB(values.dtiniciomandato),
                dtfimmandato: formatDateToDB(values.dtfimmandato),
                nascimento: formatDateToDB(values.nascimento),
            };

            if (values.idcontato) {
                await ApiService.fetchData({
                    url: `/entidades/${entidadeId}/diretoria/${values.idcontato}`,
                    method: "put",
                    data: payload,
                });
            } else {
                await ApiService.fetchData({
                    url: `/entidades/${entidadeId}/diretoria`,
                    method: "post",
                    data: payload,
                });
            }
            onConfirm();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar dados da diretoria", error);
        }
    };


    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={800}>
            <Formik initialValues={{
                idcontato: initialData?.idcontato || "",
                nmcontato: initialData?.nmcontato || "",
                nucpf: initialData?.nucpf || "",
                dsemail: initialData?.dsemail || "",
                sexo: initialData?.sexo || "Masculino",
                nufone: initialData?.nufone || "",
                nucel: initialData?.nucel || "",
                cargo: initialData?.cargo || "",
                nascimento: initialData?.nascimento
                    ? dayjs(initialData.nascimento).format("YYYY-MM-DD")
                    : "",
                dtiniciomandato: initialData?.dtiniciomandato
                    ? dayjs(initialData.dtiniciomandato).format("YYYY-MM-DD")
                    : "",
                dtfimmandato: initialData?.dtfimmandato
                    ? dayjs(initialData.dtfimmandato).format("YYYY-MM-DD")
                    : "",
                nurg: initialData?.nurg || "",
                flativo: initialData?.flativo || "S",
            }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched, resetForm }) => {
                    useEffect(() => {
                        if (!initialData) {
                            resetForm();
                        }
                    }, [isOpen, resetForm, initialData]);

                    return (
                        <Form className="space-y-4">
                            <h3>{initialData ? "Editar Contato" : "Adicionar Contato"}</h3>

                            <FormItem
                                label="Nome"
                                asterisk
                                invalid={(touched.nmcontato && errors.nmcontato) as boolean | ""}
                                errorMessage={(errors.nmcontato as string) ?? ""}
                            >
                                <Field name="nmcontato" placeholder="Digite o nome completo" component={Input} />
                            </FormItem>

                            <FormItem
                                label="CPF"
                                asterisk
                                invalid={(touched.nucpf && errors.nucpf) as boolean | ""}
                                errorMessage={(errors.nucpf as string) ?? ""}
                            >
                                <Field name="nucpf" placeholder="Digite o CPF (somente números)" component={Input} />
                            </FormItem>

                            <FormItem
                                label="E-mail"
                                asterisk
                                invalid={(touched.dsemail && errors.dsemail) as boolean | ""}
                                errorMessage={(errors.dsemail as string) ?? ""}
                            >
                                <Field name="dsemail" placeholder="exemplo@email.com" component={Input} />
                            </FormItem>

                            <FormItem
                                label="Sexo"
                                asterisk
                                invalid={(touched.sexo && errors.sexo) as boolean | ""}
                                errorMessage={(errors.sexo as string) ?? ""}
                            >
                                <Field name="sexo">
                                    {({ field, form }: any) => (
                                        <Select
                                            {...field}
                                            options={sexoOptions}
                                            placeholder="Selecione o sexo"
                                            value={sexoOptions.find(option => option.value === form.values.sexo)}
                                            onChange={(option: any) => form.setFieldValue('sexo', option?.value)}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Status"
                                asterisk
                                invalid={(touched.flativo && errors.flativo) as boolean | ""}
                                errorMessage={(errors.flativo as string) ?? ""}
                            />
                            <Field name="flativo">
                                {({ field, form }: any) => (
                                    <Select
                                        {...field}
                                        options={statusOptions}
                                        placeholder="Selecione o status"
                                        value={statusOptions.find(option => option.value === form.values.flativo)}
                                        onChange={(option: any) => form.setFieldValue("flativo", option?.value)}
                                    />
                                )}
                            </Field>

                            <FormItem
                                label="Telefone"
                                invalid={(touched.nufone && errors.nufone) as boolean | ""}
                                errorMessage={(errors.nufone as string) ?? ""}
                            >
                                <Field name="nufone" placeholder="Digite o telefone (somente números)" component={Input} />
                            </FormItem>

                            <FormItem
                                label="Celular"
                                asterisk
                                invalid={(touched.nucel && errors.nucel) as boolean | ""}
                                errorMessage={(errors.nucel as string) ?? ""}
                            >
                                <Field name="nucel" placeholder="Digite o celular (somente números)" component={Input} />
                            </FormItem>

                            <FormItem
                                label="Cargo"
                                asterisk
                                invalid={(touched.cargo && errors.cargo) as boolean | ""}
                                errorMessage={(errors.cargo as string) ?? ""}
                            >
                                <Field name="cargo" placeholder="Cargo ocupado" component={Input} />
                            </FormItem>

                            <FormItem label="Nascimento">
                                <Field name="nascimento" type="date" component={Input} />
                            </FormItem>

                            <FormItem
                                label="RG"
                                invalid={(touched.nurg && errors.nurg) as boolean | ""}
                                errorMessage={(errors.nurg as string) ?? ""}
                            >
                                <Field name="nurg" placeholder="Digite o RG (somente números)" component={Input} />
                            </FormItem>

                            <FormItem label="Início do Mandato">
                                <Field name="dtiniciomandato" type="date" component={Input} />
                            </FormItem>

                            <FormItem label="Término do Mandato">
                                <Field name="dtfimmandato" type="date" component={Input} />
                            </FormItem>

                            <div className="flex justify-end mt-4">
                                <Button onClick={onClose} variant="default">Cancelar</Button>
                                <Button type="submit" variant="solid" className="ml-2">Salvar</Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </Dialog>
    );
};

export default AdicionarContato;
