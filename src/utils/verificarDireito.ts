type User = {
    recursos: string[];
    associacoes?: { idassociacao: number }[];
    empresas?: { idempresa: number }[];
    nucleos?: { idnucleo: number }[];
    projetos?: { idprojeto: number }[];
  };
  
  type VinculoTipo = "associacao" | "empresa" | "nucleo" | "projeto";
  
  export interface VerificarDireitosParams {
    user: User;
    recurso: string;
    vinculo?: { tipo: VinculoTipo; id: number };
    ignorarVinculo?: boolean;
  }
  
  export const verificarDireito = ({
    user,
    recurso,
    vinculo,
    ignorarVinculo = false,
  }: VerificarDireitosParams): boolean => {
    if (!user || !user.recursos.includes(recurso)) return false;
  
    if (ignorarVinculo || !vinculo) return true;
  
    switch (vinculo.tipo) {
      case "associacao":
        return user.associacoes?.some((a) => a.idassociacao === vinculo.id) || false;
      case "empresa":
        return user.empresas?.some((e) => e.idempresa === vinculo.id) || false;
      case "nucleo":
        return user.nucleos?.some((n) => n.idnucleo === vinculo.id) || false;
      case "projeto":
        return user.projetos?.some((p) => p.idprojeto === vinculo.id) || false;
      default:
        return false;
    }
  };
  