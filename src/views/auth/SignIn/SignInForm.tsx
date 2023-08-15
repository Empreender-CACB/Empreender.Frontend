import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'

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
    login: Yup.string().required('Insira um usuário, email ou CPF'),
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

    const [message, setMessage] = useTimeOutMessage()

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
                                label="Usuário, email ou CPF"
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
                                    placeholder="Login"
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
                                <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    component={Checkbox}
                                >
                                    Lembrar me
                                </Field>
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
                            <div className="mt-4 text-center">
                                <span>{`Ainda não possui uma conta?`} </span>
                                <ActionLink to={signUpUrl}>Primeiro Acesso</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
