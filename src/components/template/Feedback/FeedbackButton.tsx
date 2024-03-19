
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
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
                title='Relatado com sucesso!'
                type='info'
            >
               Seu relato foi recebido com sucesso. Entraremos em contato através do seu email cadastrado.
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
                <h5 className="mb-4">Compartilhar um Feedback</h5>
                <Alert showIcon className="mb-4" type="info" customIcon={<TfiCommentsSmiley />}>
                Sua opinião é importante. Obrigado!
                 </Alert>

                <Formik
                    initialValues={{
                        title: '',
                        description: '',
                    }}
                    validationSchema={createIssueSchema}
                    onSubmit={(values) => {
                        const sendIssue = async () => {
                            try {
                                const response: AxiosResponse = await ApiService.fetchData({
                                    url: '/reports/issue',
                                    method: 'post',
                                    data: {...values, url: window.location.href, size:`${window.screen.width} x ${window.screen.height}`, navigator: `${window.navigator.userAgent}`}
                                })
                
                                if (response.data) {
                                    notify()
                                    setIsOpen(false)
                                }
                            } catch (error) {
                                alert('Erro ao relatar bug. Tente mais tarde.')
                            }
                        }
                
                        sendIssue()                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Titulo"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                >
                                    <Field
                                        type="text"
                                        name="title"
                                        placeholder="Título"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Descrição"
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

