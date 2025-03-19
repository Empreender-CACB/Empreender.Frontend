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
    apelido: Yup.string().required("Campo obrigatório"),
    idbanco: Yup.string().required("Campo obrigatório"),
    conta_tipo: Yup.string().required("Campo obrigatório"),
    dsagencia: Yup.string()
        .matches(/^\d{4,5}$/, "Agência inválida (4 a 5 dígitos numéricos)")
        .required("Campo obrigatório"),
    dsconta: Yup.string()
        .matches(/^\d{5,12}-\d{1}$/, "Conta inválida (5 a 12 dígitos + dígito verificador)")
        .required("Campo obrigatório"),
    pix_tipo: Yup.string(),
    pix_chave: Yup.string(),
});

const tipoContaOptions = [
    { value: "corrente", label: "Conta Corrente" },
    { value: "poupanca", label: "Conta Poupança" },
];

const tipoPixOptions = [
    { value: "Email", label: "Email" },
    { value: "Celular", label: "Celular" },
    { value: "CPF", label: "CPF/CNPJ" },
    { value: "Chave Aleatória", label: "Chave Aleatória" },
];

const AdicionarDadosBancarios = ({ isOpen, onClose, onConfirm, initialData, entidadeId }: ModalProps) => {
    const initialValues = initialData || {
        apelido: "",
        idbanco: "",
        conta_tipo: "",
        dsagencia: "",
        dsconta: "",
        pix_tipo: "",
        pix_chave: "",
    };

    const handleSubmit = async (values: any) => {
        try {
            if (initialData) {
                await ApiService.fetchData({
                    url: `/entidades/${entidadeId}/dadosBancarios/${initialData.id}`,
                    method: 'put',
                    data: values
                });
            } else {
                await ApiService.fetchData({
                    url: `/entidades/${entidadeId}/dadosBancarios`,
                    method: 'post',
                    data: values
                });
            }
            onConfirm();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar dados bancários", error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={800}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        <h3>{initialData ? "Editar Conta Bancária" : "Adicionar Conta Bancária"}</h3>

                        <FormItem
                            label="Apelido"
                            asterisk
                            invalid={(touched.apelido && errors.apelido) as boolean | ""}
                            errorMessage={(errors.apelido as string) ?? ""}
                        >
                            <Field name="apelido" placeholder="Informe um apelido" component={Input} />
                        </FormItem>

                        <FormItem
                            label="Banco"
                            asterisk
                            invalid={(touched.idbanco && errors.idbanco) as boolean | ""}
                            errorMessage={(errors.idbanco as string) ?? ""}
                        >
                            <Field name="idbanco" placeholder="Código do Banco" component={Input} />
                        </FormItem>

                        <FormItem
                            label="Tipo de Conta"
                            asterisk
                            invalid={(touched.conta_tipo && errors.conta_tipo) as boolean | ""}
                            errorMessage={(errors.conta_tipo as string) ?? ""}
                        >
                            <Field name="conta_tipo">
                                {({ field, form }: any) => (
                                    <Select
                                        {...field}
                                        options={tipoContaOptions}
                                        placeholder="Selecione o tipo de conta"
                                        value={tipoContaOptions.find(option => option.value === form.values.conta_tipo)}
                                        onChange={(option: any) => form.setFieldValue('conta_tipo', option?.value)}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Agência"
                            asterisk
                            invalid={(touched.dsagencia && errors.dsagencia) as boolean | ""}
                            errorMessage={(errors.dsagencia as string) ?? ""}
                        >
                            <Field name="dsagencia" placeholder="Número da Agência" component={Input} />
                        </FormItem>

                        <FormItem
                            label="Conta"
                            asterisk
                            invalid={(touched.dsconta && errors.dsconta) as boolean | ""}
                            errorMessage={(errors.dsconta as string) ?? ""}
                        >
                            <Field name="dsconta" placeholder="Número da Conta (com dígito)" component={Input} />
                        </FormItem>

                        <FormItem
                            label="Tipo PIX"
                            invalid={(touched.pix_tipo && errors.pix_tipo) as boolean | ""}
                            errorMessage={(errors.pix_tipo as string) ?? ""}
                        >
                            <Field name="pix_tipo">
                                {({ field, form }: any) => (
                                    <Select
                                        {...field}
                                        options={tipoPixOptions}
                                        placeholder="Selecione o tipo PIX"
                                        value={tipoPixOptions.find(option => option.value === form.values.pix_tipo)}
                                        onChange={(option: any) => form.setFieldValue('pix_tipo', option?.value)}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Chave PIX"
                            invalid={(touched.pix_chave && errors.pix_chave) as boolean | ""}
                            errorMessage={(errors.pix_chave as string) ?? ""}
                        >
                            <Field name="pix_chave" placeholder="Digite a chave PIX" component={Input} />
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

export default AdicionarDadosBancarios;
