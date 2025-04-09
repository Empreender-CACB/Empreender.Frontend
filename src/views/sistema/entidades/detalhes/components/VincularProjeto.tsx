import { useState } from "react";
import { Button, Dialog, FormItem } from "@/components/ui";
import ApiService from "@/services/ApiService";
import { Formik, Form, Field } from "formik";
import AsyncSelect from "react-select/async";
import * as Yup from "yup";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    entidadeId: number | string;
};

const validationSchema = Yup.object({
    idVinculado: Yup.string().required("Projeto obrigatório"),
});

const VincularProjetoModal = ({ isOpen, onClose, onConfirm, entidadeId }: ModalProps) => {
    const initialValues = {
        idVinculado: "",
        status: true,
    };

    const loadProjetos = async (inputValue: string) => {
        if (!inputValue || inputValue.length < 2) return [];

        try {
            const response = await ApiService.fetchData({
                url: `/projetos/buscar?search=${inputValue}`,
                method: "get",
            });

            return response.data.map((projeto: any) => ({
                value: projeto.idprojeto.toString(),
                label: projeto.nmfantasia,
            }));
        } catch (error) {
            console.error("Erro ao buscar projetos:", error);
            return [];
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            await ApiService.fetchData({
                url: `/entidades/vinculo-projeto/${entidadeId}`,
                method: "post",
                data: values,
            });
            onConfirm();
            onClose();
        } catch (error) {
            console.error("Erro ao vincular projeto:", error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched, setFieldValue }) => (
                    <Form className="space-y-4">
                        <h3>Vincular Projeto</h3>

                        <FormItem
                            label="Projeto"
                            asterisk
                            invalid={touched.idVinculado && !!errors.idVinculado}
                            errorMessage={errors.idVinculado as string}
                        >
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadProjetos}
                                noOptionsMessage={({ inputValue }) =>
                                    inputValue.length < 3
                                        ? "Digite 3 caracteres ou mais para iniciar a busca"
                                        : "Nenhum resultado encontrado"
                                } 
                                loadingMessage={()=>"Carregando..."}
                                placeholder="Digite o nome do projeto"
                                onChange={(option: any) => setFieldValue("idVinculado", option?.value)}
                            />
                        </FormItem>

                        <div className="flex justify-end gap-2">
                            <Button variant="default" onClick={onClose}>Cancelar</Button>
                            <Button type="submit" variant="solid">Salvar</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default VincularProjetoModal;
