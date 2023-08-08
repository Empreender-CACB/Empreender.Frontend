import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Bem vindo ao Portal Empreender</h3>
                <p>Entre com seus dados para acessar a plataforma!</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
