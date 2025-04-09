import { useAppSelector } from "@/store";
import { verificarDireito, VerificarDireitosParams } from "../verificarDireito";

export const usePermission = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (params: Omit<VerificarDireitosParams, "user">) =>
    verificarDireito({ ...params, user });
};
