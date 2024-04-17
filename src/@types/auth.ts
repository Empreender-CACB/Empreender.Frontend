import { Associacao, Empresa, Nucleo } from "./generalTypes";

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
        perfil: string;
        cod_perfil: number;
        idobjeto: number;
        recursos: string[];
        preferencias: string[];
        fotouser?: string;
        associacoes?: Associacao[],
        empresas?: Empresa[]
        nucleos?: Nucleo[],
        projetos?: any[]
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
