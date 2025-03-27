import SignInForm from './SignInForm';

const SignIn = () => {
    return (
        <>
            <div className="mb-8 flex center justify-center">
                <img className="h-16" src="/img/logo/EMPREENDER+CACB.png" alt="Empreender e CACB" /> 
            </div>
            <div className="mb-8">
                <h3 className="mb-1">Bem-vindo</h3>
                <p>Por favor, identifique-se para acessar a plataforma!</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    );
};

export default SignIn;
