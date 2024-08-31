import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { useEffect, useState } from 'react'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    login: string
    password: string
    rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    login: Yup.string().required('Insira um código de usuário, e-mail ou CPF'),
    password: Yup.string().required('Insira uma senha'),
    rememberMe: Yup.bool(),
})

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useState<any>(false);

    const { signIn } = useAuth()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { login, password } = values
        setSubmitting(true)

        const result = await signIn({ login, password })

        if (result?.status === 'failed') {
            setMessage(result.message)
        } else {
            const encodedCredentials = btoa(`${login}:${password}`);
            window.location.href = `${import.meta.env.VITE_PHP_URL}/sistema/login/index?credentials=${encodedCredentials}`;
        }

        
        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    login: '',
                    password: '',
                    rememberMe: true,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Código de usuário, e-mail ou CPF"
                                invalid={
                                    (errors.login &&
                                        touched.login) as boolean
                                }
                                errorMessage={errors.login}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="login"
                                    placeholder="Código de usuário, e-mail ou CPF"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Senha"
                                invalid={
                                    (errors.password &&
                                        touched.password) as boolean
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
                            <div className="flex justify-between mb-6">
                                {/* <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    component={Checkbox}
                                >
                                    Lembrar me
                                </Field> */}
                                <ActionLink to={forgotPasswordUrl}>
                                    Esqueci minha senha
                                </ActionLink>
                            </div>

                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Entrando ...' : 'Entrar'}
                            </Button>
                            <p className='text-xs pt-5'>
                             Se você está com dificuldades para o acesso à plataforma, por favor, confira os dados fornecidos e, se ainda for necessário, relate o fato para <a className='text-blue-600' target="__blank" href="mailto:empreender.portal@cacb.org.br">empreender.portal@cacb.org.br</a>
                            </p>
                            <div className="mt-4 text-center">
                                {/* <span>{`Ainda não possui uma conta?`} </span> */}
                                {/* <ActionLink to={signUpUrl}>Primeiro Acesso</ActionLink> */}
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
