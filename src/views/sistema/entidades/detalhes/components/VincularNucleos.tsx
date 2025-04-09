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
    idVinculado: Yup.string().required("Núcleo obrigatório"),
});

const VincularNucleoModal = ({ isOpen, onClose, onConfirm, entidadeId }: ModalProps) => {
    const initialValues = {
        idVinculado: "",
        status: true,
    };

    const loadNucleos = async (inputValue: string) => {
        if (!inputValue || inputValue.length < 2) return [];

        try {
            const response = await ApiService.fetchData({
                url: `/nucleos/buscar?search=${inputValue}`,
                method: "get",
            });

            return response.data.map((nucleo: any) => ({
                value: nucleo.idnucleo.toString(),
                label: nucleo.nmnucleo,
            }));
        } catch (error) {
            console.error("Erro ao buscar núcleos:", error);
            return [];
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            await ApiService.fetchData({
                url: `/entidades/${entidadeId}/vinculo/nucleo`,
                method: "post",
                data: values,
            });
            onConfirm();
            onClose();
        } catch (error) {
            console.error("Erro ao vincular núcleo:", error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ errors, touched, setFieldValue }) => (
                    <Form className="space-y-4">
                        <h3>Vincular Núcleo</h3>

                        <FormItem
                            label="Núcleo"
                            asterisk
                            invalid={touched.idVinculado && !!errors.idVinculado}
                            errorMessage={errors.idVinculado as string}
                        >
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={loadNucleos}
                                noOptionsMessage={({ inputValue }) =>
                                    inputValue.length < 3
                                        ? "Digite 3 caracteres ou mais para iniciar a busca"
                                        : "Nenhum resultado encontrado"
                                } 
                                loadingMessage={()=>"Carregando..."}
                                placeholder="Digite o nome do núcleo"
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

export default VincularNucleoModal;
