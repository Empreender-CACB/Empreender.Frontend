
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Radio from '@/components/ui/Radio'
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PiMegaphoneSimpleDuotone } from 'react-icons/pi'
import type { MouseEvent } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import ApiService from '@/services/ApiService';
import { AxiosResponse } from 'axios'
import { Alert } from '@/components/ui';
const createIssueSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Digite 3 caracteres ou mais.')
        .max(200, 'No máximo 200 caracteres.')
        .required('Obrigatório'),
    description: Yup.string()
        .min(3, 'Digite 3 caracteres ou mais.')
        .max(200, 'No máximo 200 caracteres.')
        .required('Obrigatório'),
    improvement: Yup.string()
        .min(3, 'Digite 3 caracteres ou mais.')
        .max(200, 'No máximo 500 caracteres.'),
    avaliacao: Yup.string().required('Por favor, selecione uma opção'),
});
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { TfiCommentsSmiley } from "react-icons/tfi";


const FeedbackButton = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        // console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const notify = ( ) => {
        toast.push(
            <Notification
                title='Opinião enviada com sucesso!'
                type='info'
            >
               Sua opinião foi recebida com sucesso. Se necessário, em contato através do seu email cadastrado.
            </Notification>
        )
    }

    return (
        <div className="fixed right-0 top-1/2 z-25 rotate-[90deg] origin-right mr-6">

            <Button  variant="solid"  size="xs" onClick={() => openDialog()} className="mr-2" icon={<PiMegaphoneSimpleDuotone />}>
                <span>Por favor,  opine!</span>
            </Button>



            <Dialog
                width={1000}
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <Alert showIcon className="mb-4 mt-4" type="info" customIcon={<TfiCommentsSmiley />}>
                Obrigado, sua opinião é muito importante!
                 </Alert>

                <Formik
                    initialValues={{
                        improvement: '',
                        description: '',
                        avaliacao: '',
                        
                    }}
                    validationSchema={createIssueSchema}
                    onSubmit={(values) => {
                        const sendIssue = async () => {
                            try {
                                const response: AxiosResponse = await ApiService.fetchData({
                                    url: '/reports/feedback',
                                    method: 'post',
                                    data: {...values, url: window.location.href, size:`${window.screen.width} x ${window.screen.height}`, navigator: `${window.navigator.userAgent}`}
                                })
                
                                if (response.data) {
                                    notify()
                                    setIsOpen(false)
                                }
                            } catch (error) {
                                alert('Erro ao enviar opinião. Tente mais tarde.')
                            }
                        }
                
                        sendIssue()                    }}
                >
                    {({ values,errors, touched }) => (
                        <Form>
                            <FormContainer>


                            <FormItem
                                asterisk
                                label="Como você avalia o nosso novo portal?"
                                invalid={errors.avaliacao && touched.avaliacao}
                                errorMessage={errors.avaliacao}
                            >
                                <Field name="avaliacao">
                                    {({ field, form }:any) => (
                                        <Radio.Group
                                            value={values.avaliacao}
                                            onChange={(val) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }
                                        >
                                            <Radio value={'Muito Bom'}>Muito bom!</Radio>
                                            <Radio value={'Bom'}>Bom</Radio>
                                            <Radio value={'Mediano'}>Mediano</Radio>
                                            <Radio value={'Precisa melhorar'}>Precisa melhorar</Radio>
                                        </Radio.Group>
                                    )}
                                </Field>
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Qual sua opinião geral sobre o novo portal?"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                >
                                    <Field
                                        textArea
                                        name="description"
                                        placeholder="Descrição"
                                        component={Input}
                                    />
                                </FormItem>


                                
                                <FormItem
                                    label="O que poderia ser melhorado?"
                                    invalid={errors.improvement && touched.improvement}
                                    errorMessage={errors.improvement}
                                >
                                    <Field
                                        textArea
                                        name="improvement"
                                        placeholder="Nos conte o que poderia ser melhorado."
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button type="submit" variant="solid">
                                        Enviar
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>

            </Dialog>
        </div>
    )
}

export default FeedbackButton

