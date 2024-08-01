export type SignInCredential = {
    login: string
    password: string
}

export type SignInResponse = {
    token: {
        type: string;
        token: string;
        expires_at: string;
    };
    user: {
        nucpf: string;
        nmusuario: string;
        dsemail: string;
        cdsexo: string;
        perfil: string;
        cod_perfil: number;
        recursos: string[];
        preferencias: string[];
        associacoes: any[];
        fotouser?: string;
    };
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string,
    token: string
}
