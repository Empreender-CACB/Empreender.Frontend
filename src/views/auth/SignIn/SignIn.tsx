import React, { useState, useEffect } from 'react';
import SignInForm from './SignInForm';

const SignIn = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="mobile-message text-center p-4">
                <div className="logo mb-8 flex justify-center">
                    <img className="h-11" src="/img/logo/EMPREENDER+CACB.png" alt="Empreender e CACB" /> 
                </div>
                <p><strong>Estamos em obras!</strong></p>
                <p>Vamos trocar de pneu. Andando.</p>
                <p>A viagem levará algum tempo, precisamos ir devagar, mas confiamos que chegaremos bem. Aos poucos teremos um novo portal.</p>
                <p className="mt-4"><strong>O portal por enquanto estará disponível apenas na versão desktop.</strong></p>
            </div>
        );
    }

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
