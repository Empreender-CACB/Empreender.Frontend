import { useState } from "react";
import { Button, Dialog, Select, FormItem } from "@/components/ui";
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
    idVinculado: Yup.string().required("Empresa obrigatória"),
    status: Yup.boolean().required("Status obrigatório"),
});

const ModalVincularEmpresa = ({ isOpen, onClose, onConfirm, entidadeId }: ModalProps) => {
    const initialValues = {
        idVinculado: "",
        status: true,
    };

    const loadEmpresas = async (inputValue: string) => {
        if (!inputValue || inputValue.length < 2) return [];

        try {
            const response = await ApiService.fetchData({
                url: `/empresas/buscar?search=${inputValue}`,
                method: "get",
            });

            return response.data.map((empresa: any) => ({
                value: empresa.idempresa.toString(),
                label: empresa.nmfantasia,
            }));
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
            return [];
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${entidadeId}/vinculo/empresa`,
                method: "post",
                data: values,
              });              
            onConfirm();
            onClose();
        } catch (error) {
            console.error("Erro ao vincular empresa:", error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched, setFieldValue }) => (
                    <Form className="space-y-4">
                        <h3>Vincular Empresa</h3>

                        <FormItem
                            label="Empresa"
                            asterisk
                            invalid={touched.idVinculado && !!errors.idVinculado}
                            errorMessage={errors.idVinculado as string}
                        >
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadEmpresas}
                                noOptionsMessage={({ inputValue }) =>
                                    inputValue.length < 3
                                        ? "Digite 3 caracteres ou mais para iniciar a busca"
                                        : "Nenhum resultado encontrado"
                                } 
                                loadingMessage={()=>"Carregando..."}
                                placeholder="Digite o nome da empresa"
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

export default ModalVincularEmpresa;
