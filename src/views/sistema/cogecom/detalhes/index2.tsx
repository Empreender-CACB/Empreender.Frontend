import React, { useState } from 'react';
import { Button } from '@/components/ui';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineExclamationCircle,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineCalendar,
  AiOutlineIdcard,
  AiOutlineFileText,
  AiOutlineLock,
  AiOutlineBank,
  AiOutlineHome,
  AiOutlineGlobal,
  AiOutlineContacts,
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFile,
} from 'react-icons/ai';

const CustomerDetails = () => {
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const [files, setFiles] = useState([
    { id: 1, name: 'Documento de Identidade', status: 'Pendente' },
    { id: 2, name: 'Comprovante de Residência', status: 'Pendente' },
    { id: 3, name: 'Contrato Social', status: 'Pendente' },
  ]);


  // Função para determinar o ícone do arquivo
  const getFileIcon = (fileName) => {
    if (fileName.includes('.pdf')) {
      return <AiOutlineFilePdf className="text-red-500 mr-2" size={20} />;
    } else if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <AiOutlineFileImage className="text-green-500 mr-2" size={20} />;
    } else {
      return <AiOutlineFile className="text-blue-500 mr-2" size={20} />;
    }
  };

  // Função para atualizar status do arquivo
  const updateFileStatus = (id, status) => {
    setFiles(prevFiles =>
      prevFiles.map(file => 
        file.id === id ? { ...file, status } : file
      )
    );
  };

  // Função genérica para ações
  const handleAction = (action, data) => {
    alert(`Ação: ${action}\nDados: ${JSON.stringify(data)}`);
  };


  
  

  // Dados fictícios para exemplo
  const customer = {
    name: 'Frederick Adams',
    email: 'lamfred@imaze.infotech.io',
    phone: '+12-123-1234',
    location: 'London, UK',
    dateOfBirth: '17/11/1993',
    title: 'Compliance Manager',
    company: {
      name: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-99',
      address: 'Rua das Flores, 123, Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      phone: '+55 11 98765-4321',
      email: 'contato@techsolutions.com',
      website: 'www.techsolutions.com',
    },
    paymentHistory: [
      { reference: '#36223', product: 'Mock premium pack', status: 'Pending', date: '12/10/2021', amount: '$39.90' },
      { reference: '#34283', product: 'Business board pro subscription', status: 'Paid', date: '11/13/2021', amount: '$59.90' },
      { reference: '#32234', product: 'Business board pro subscription', status: 'Paid', date: '10/12/2021', amount: '$59.90' },
      { reference: '#31554', product: 'Business board pro subscription', status: 'Paid', date: '09/13/2021', amount: '$59.90' },
    ],
    electricCompany: {
      username: 'CEB',
      password: 'Senha_Companhia',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da inscrição - #0077b5</h1>
          <div className="flex space-x-2">
          <Button className="mb-2 flex items-center" variant="solid" color="green-600">
              <AiOutlineCheck className="mr-2" /> Aprovar Candidatura
            </Button>

            <Button className="mb-2 flex items-center" variant="solid" color="yellow-600">
              <AiOutlineExclamationCircle className="mr-2" /> Informar Pendência
            </Button>
            <Button className="mb-2 flex items-center" variant="solid" color="red-600">
              <AiOutlineClose className="mr-2" /> Recusar Candidatura
            </Button>


          </div>
        </div>



        {/* Dados da Empresa */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center">
                <AiOutlineBank className="mr-2" /> <span className="font-medium">Nome da Empresa:</span> {customer.company.name}
              </p>
              <p className="flex items-center">
                <AiOutlineIdcard className="mr-2" /> <span className="font-medium">CNPJ:</span> {customer.company.cnpj}
              </p>
              <p className="flex items-center">
                <AiOutlineHome className="mr-2" /> <span className="font-medium">Endereço:</span> {customer.company.address}
              </p>
              <p className="flex items-center">
                <AiOutlineEnvironment className="mr-2" /> <span className="font-medium">Cidade/Estado:</span> {customer.company.city}, {customer.company.state}
              </p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center">
                <AiOutlineContacts className="mr-2" /> <span className="font-medium">CEP:</span> {customer.company.zipCode}
              </p>
              <p className="flex items-center">
                <AiOutlinePhone className="mr-2" /> <span className="font-medium">Telefone:</span> {customer.company.phone}
              </p>
              <p className="flex items-center">
                <AiOutlineMail className="mr-2" /> <span className="font-medium">E-mail:</span> {customer.company.email}
              </p>
              <p className="flex items-center">
                <AiOutlineGlobal className="mr-2" /> <span className="font-medium">Website:</span> {customer.company.website}
              </p>
            </div>
          </div>
        </div>

        {/* Detalhes do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Representante</h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center">
                <AiOutlineUser className="mr-2" /> <span className="font-medium">Name:</span> {customer.name}
              </p>
              <p className="flex items-center">
                <AiOutlineMail className="mr-2" /> <span className="font-medium">Email:</span> {customer.email}
              </p>
              <p className="flex items-center">
                <AiOutlinePhone className="mr-2" /> <span className="font-medium">Phone:</span> {customer.phone}
              </p>
              <p className="flex items-center">
                <AiOutlineEnvironment className="mr-2" /> <span className="font-medium">Location:</span> {customer.location}
              </p>
              <p className="flex items-center">
                <AiOutlineCalendar className="mr-2" /> <span className="font-medium">Date of Birth:</span> {customer.dateOfBirth}
              </p>
              <p className="flex items-center">
                <AiOutlineIdcard className="mr-2" /> <span className="font-medium">Title:</span> {customer.title}
              </p>
            </div>
          </div>

          {/* Dados da Companhia Elétrica */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Companhia Elétrica</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 font-medium flex items-center">
                  <AiOutlineUser className="mr-2" /> Usuário da companhia
                </p>
                <p className="text-gray-900">{customer.electricCompany.username}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium flex items-center">
                  <AiOutlineLock className="mr-2" /> Senha da companhia
                </p>
                <div className="flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={customer.electricCompany.password}
                    readOnly
                    className="bg-gray-50 p-2 rounded-md border border-gray-200 flex-1"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arquivos Enviados */}
            {/* Seção de Documentos Modificada */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos</h2>
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <span className="text-gray-900 font-medium">{file.name}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${
                    file.status === 'Aprovado' ? 'text-green-700' :
                    file.status === 'Pendente' ? 'text-yellow-700' : 
                    'text-red-700'
                  }`}>
                    Status: {file.status}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        updateFileStatus(file.id, 'Aprovado');
                        handleAction('Aprovar Documento', file);
                      }}
                      className="p-2 text-green-500 hover:text-green-700"
                    >
                      <AiOutlineCheck size={18} />
                    </button>
                    
                    <button
                      onClick={() => {
                        updateFileStatus(file.id, 'Pendente');
                        handleAction('Marcar Pendência no Documento', file);
                      }}
                      className="p-2 text-yellow-500 hover:text-yellow-700"
                    >
                      <AiOutlineExclamationCircle size={18} />
                    </button>
                    
                    <button
                      onClick={() => {
                        updateFileStatus(file.id, 'Recusado');
                        handleAction('Recusar Documento', file);
                      }}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <AiOutlineClose size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Pagamentos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-2 px-4">REFERENCE</th>
                  <th className="py-2 px-4">PRODUCT</th>
                  <th className="py-2 px-4">STATUS</th>
                  <th className="py-2 px-4">DATE</th>
                  <th className="py-2 px-4">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {customer.paymentHistory.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4">{payment.reference}</td>
                    <td className="py-2 px-4">{payment.product}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-sm ${
                          payment.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{payment.date}</td>
                    <td className="py-2 px-4">{payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;