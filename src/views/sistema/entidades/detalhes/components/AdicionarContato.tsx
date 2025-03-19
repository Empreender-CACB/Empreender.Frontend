import { Button, Dialog, Input, Select, FormItem } from "@/components/ui";
import ApiService from "@/services/ApiService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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
        .matches(/^\d{10}$/, "Telefone inválido (somente números, 10 dígitos)"),
    nucel: Yup.string()
        .matches(/^\d{11}$/, "Celular inválido (somente números, 11 dígitos)")
        .required("Campo obrigatório"),
    cargo: Yup.string().required("Campo obrigatório"),
    nascimento: Yup.date().nullable(),
    nurg: Yup.string()
        .matches(/^\d{7,9}$/, "RG inválido (somente números, 7 a 9 dígitos)"),
});

const sexoOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Feminino", label: "Feminino" },
    { value: "Prefiro não declarar", label: "Prefiro não declarar" },
];

const AdicionarContato = ({ isOpen, onClose, onConfirm, initialData, entidadeId }: ModalProps) => {
    const initialValues = initialData || {
        nmcontato: "",
        nucpf: "",
        dsemail: "",
        sexo: "Masculino",
        nufone: "",
        nucel: "",
        cargo: "",
        nascimento: "",
        nurg: "",
    };

    const handleSubmit = async (values: any) => {
        try {
            if (initialData) {
                await ApiService.fetchData({
                    url: `/entidades/${entidadeId}/diretoria/${initialData.id}`,
                    method: 'put',
                    data: values
                });
            } else {
                await ApiService.fetchData({
                    url: `/entidades/${entidadeId}/diretoria`,
                    method: 'post',
                    data: values
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
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched }) => (
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

                        <FormItem
                            label="Nascimento"
                            invalid={(touched.nascimento && errors.nascimento) as boolean | ""}
                            errorMessage={(errors.nascimento as string) ?? ""}
                        >
                            <Field name="nascimento" type="date" component={Input} />
                        </FormItem>

                        <FormItem
                            label="RG"
                            invalid={(touched.nurg && errors.nurg) as boolean | ""}
                            errorMessage={(errors.nurg as string) ?? ""}
                        >
                            <Field name="nurg" placeholder="Digite o RG (somente números)" component={Input} />
                        </FormItem>

                        <div className="flex justify-end mt-4">
                            <Button onClick={onClose} variant="default">Cancelar</Button>
                            <Button type="submit" variant="solid" className="ml-2">Salvar</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AdicionarContato;
