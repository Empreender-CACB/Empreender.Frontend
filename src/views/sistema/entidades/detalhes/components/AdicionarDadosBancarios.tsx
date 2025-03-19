import { Button, Dialog, Input, Select } from "@/components/ui";
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
    dsagencia: Yup.string().required("Campo obrigatório"),
    dsconta: Yup.string().required("Campo obrigatório"),
    pix_tipo: Yup.string(),
    pix_chave: Yup.string(),
});

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
        <Dialog isOpen={isOpen} onClose={onClose}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        <h2>{initialData ? "Editar Conta Bancária" : "Adicionar Conta Bancária"}</h2>
                        <Field as={Input} label="Apelido" name="apelido" error={errors.apelido && touched.apelido ? errors.apelido : ""} />
                        <Field as={Input} label="Banco" name="idbanco" error={errors.idbanco && touched.idbanco ? errors.idbanco : ""} />
                        <Field as={Input} label="Tipo de Conta" name="conta_tipo" error={errors.conta_tipo && touched.conta_tipo ? errors.conta_tipo : ""} />
                        <Field as={Input} label="Agência" name="dsagencia" error={errors.dsagencia && touched.dsagencia ? errors.dsagencia : ""} />
                        <Field as={Input} label="Conta" name="dsconta" error={errors.dsconta && touched.dsconta ? errors.dsconta : ""} />
                        <Field as={Select} label="Tipo PIX" name="pix_tipo" options={["CPF", "CNPJ", "Email", "Telefone", "Aleatória"]} />
                        <Field as={Input} label="Chave PIX" name="pix_chave" error={errors.pix_chave && touched.pix_chave ? errors.pix_chave : ""} />

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
