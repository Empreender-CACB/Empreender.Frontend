import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import { apiResetPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'

interface ResetPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ResetPasswordFormSchema = {
    password: string
    confirmPassword: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Por favor, insira uma nova senha.'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'As senhas não são iguais.'
    ),
})

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const [tokenParams, setTokenParams] = useSearchParams('default');
    const [resetComplete, setResetComplete] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const navigate = useNavigate()

    const onSubmit = async (
        values: ResetPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { password } = values
         
        setSubmitting(true)
        try {
            const token = tokenParams.get("token");
            if (token === null) {
                console.error("Token is null");
                return;
            }
            const resp = await apiResetPassword({ password, token})
            if (resp.data) {
                setSubmitting(false)
                setResetComplete(true)
            }
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString()
            )
            setSubmitting(false)
        }
    }

    const onContinue = () => {
        navigate('/sign-in')
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                    {/* #{tokenParams.get("token")} */}
                        <h3 className="mb-1">Senha atualizada com sucesso !</h3>
                        <p>Agora você já pode se identificar na plataforma.</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Defina sua nova senha</h3>

                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSubmit(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {!resetComplete ? (
                                <>
                                    <FormItem
                                        label="Senha"
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Senha"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        style={{marginTop: '15px'}}
                                        label="Confirme a senha"
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder="Confirme a senha"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <Button
                                        style={{marginTop: '15px'}}
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Enviando...'
                                            : 'Enviar'}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    block
                                    variant="solid"
                                    type="button"
                                    onClick={onContinue}
                                >
                                    Continuar
                                </Button>
                            )}

                            {/* <div className="mt-4 text-center">
                                <span>Voltar para o </span>
                                <ActionLink to={signInUrl}>login</ActionLink>
                            </div> */}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ResetPasswordForm
