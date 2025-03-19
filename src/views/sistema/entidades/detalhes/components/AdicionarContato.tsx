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
    cargo: Yup.string().required("Campo obrigatório"),
    nmcontato: Yup.string().required("Campo obrigatório"),
    dtiniciomandato: Yup.date().required("Campo obrigatório"),
    dtfimmandato: Yup.date().required("Campo obrigatório"),
    dsemail: Yup.string().email("E-mail inválido").required("Campo obrigatório"),
    nucel: Yup.string().required("Campo obrigatório"),
    flativo: Yup.string().required("Campo obrigatório"),
});

const AdicionarContato = ({ isOpen, onClose, onConfirm, initialData, entidadeId }: ModalProps) => {
    const initialValues = initialData || {
        cargo: "",
        nmcontato: "",
        dtiniciomandato: "",
        dtfimmandato: "",
        dsemail: "",
        nucel: "",
        flativo: "S",
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
        <Dialog isOpen={isOpen} onClose={onClose}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        <h2>{initialData ? "Editar Contato da Diretoria" : "Adicionar Contato da Diretoria"}</h2>
                        <Field as={Input} label="Cargo" name="cargo" error={errors.cargo && touched.cargo ? errors.cargo : ""} />
                        <Field as={Input} label="Nome" name="nmcontato" error={errors.nmcontato && touched.nmcontato ? errors.nmcontato : ""} />
                        <Field as={Input} label="Início Mandato" name="dtiniciomandato" type="date" error={errors.dtiniciomandato && touched.dtiniciomandato ? errors.dtiniciomandato : ""} />
                        <Field as={Input} label="Término Mandato" name="dtfimmandato" type="date" error={errors.dtfimmandato && touched.dtfimmandato ? errors.dtfimmandato : ""} />
                        <Field as={Input} label="E-mail" name="dsemail" error={errors.dsemail && touched.dsemail ? errors.dsemail : ""} />
                        <Field as={Input} label="Celular" name="nucel" error={errors.nucel && touched.nucel ? errors.nucel : ""} />
                        <Field as={Select} label="Status" name="flativo" options={[{ value: "S", label: "Ativo" }, { value: "N", label: "Inativo" }]} />

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
