import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
        <div className="mb-8 mt-4 flex center justify-center">

            <img src="/img/logo/logo-empreender.png"/>
            <div className="logo ml-4" style="width: 180px; padding-top: 0px; padding-bottom: 0px;">
                <img src="/img/logo/logo-cacb.png" alt="Portal Empreender logo"/>
            </div>
        </div>
            <div className="mb-8">
                <h3 className="mb-1">Bem vindo</h3>
                <p>Por favor, Identifique-se para acessar a plataforma!</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
