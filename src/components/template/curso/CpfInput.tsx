import React, { useState } from 'react';
import Input from '@/components/ui/Input'; 
import useAuth from '@/utils/hooks/useAuth'
import { setUser, signInSuccess, useAppDispatch, useAppSelector } from '@/store'

function formataCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function validaCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(9))) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

interface CpfInputProps {
  isValid: boolean;
  setIsValid: (isValid: boolean) => void;
}

function CpfInput({ isValid, setIsValid }: CpfInputProps) {
  const { signIn, signUp, signOut } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const [cpf, setCPF] = useState(user ? user.nucpf : '');

  function checaCPF(e: React.ChangeEvent<HTMLInputElement>) {
    const formattedCPF = formataCPF(e.target.value);
    setCPF(formattedCPF);
    setIsValid(validaCPF(formattedCPF));
  }

  return (
    <div>
      <Input
        type="text"
        value={cpf}
        onChange={checaCPF}
        size = 'sm'
        required
      />
      {isValid ? true : <span style={{ color: 'red' }}>CPF inválido</span>}
    </div>
  );
}

export default CpfInput;
