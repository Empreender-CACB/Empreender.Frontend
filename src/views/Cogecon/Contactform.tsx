import React, { useState } from 'react';

const fileFields = {
  common: [
    { name: 'faturaEnergia', label: 'Cópia da Fatura de Energia' },
    { name: 'documentoIdentidade', label: 'Documento de Identidade' },
  ],
  empresa: [
    { name: 'contratoSocial', label: 'Contrato Social' },
    { name: 'cartaoCnpj', label: 'Cartão do CNPJ' },
  ],
  condominio: [
    { name: 'ataAssembleia', label: 'Ata da Assembleia' },
    { name: 'cartaoCnpj', label: 'Cartão do CNPJ' },
  ],
};

const ContactForm = ({ tipoCadastro, empresaData, handleSave }) => {
  const [formData, setFormData] = useState({
    idContato: '00',
    nomeContato: '',
    cpfContato: '',
    emailContato: '',
    celularContato: '',
    concessionaria_energia: '',
    usuario_concessionaria: '',
    senha_concessionaria: '',
    isManualContact: true,
    maintenanceAgreement: false,
    upload: {},
  });

  // Atualiza os inputs de texto e checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      upload: { ...prev.upload, [name]: files[0] },
    }));
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      idContato: value,
      isManualContact: value === '00',
    }));
  };

  // Submissão do formulário (somente se o checkbox estiver marcado)
  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.maintenanceAgreement) {
      alert(
        'Você deve concordar com a manutenção dos dados pelo Portal Do Empreender'
      );
      return;
    }
    handleSave(formData);
  };

  return (
    <div className="mmx-auto p-2">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Formulário de adesão
        </h1>
        <form onSubmit={onSubmit}>

          {/* Seção: Contato */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Contato</h2>
            <div className="flex flex-wrap gap-4">
              {/* Novo contato */}
              <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:shadow-md">
                <input
                  type="radio"
                  name="idContato"
                  value="00"
                  checked={formData.idContato === '00'}
                  onChange={handleContactChange}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 font-black">Novo contato</span>
              </label>
              {/* Contatos existentes */}
              {empresaData?.contatos?.map((contato) => (
                <label
                  key={contato.idcontato}
                  className="flex items-center border rounded-lg p-4 cursor-pointer hover:shadow-md"
                >
                  <input
                    type="radio"
                    name="idContato"
                    value={contato.idcontato}
                    checked={formData.idContato === contato.idcontato}
                    onChange={handleContactChange}
                    className="form-radio h-5 w-5 text-indigo-600"
                  />
                  <div className="ml-2">
                    <h6 className="font-bold">{contato.nmcontato}</h6>
                    <p className="text-sm flex items-center">
                      <span className="mr-1">📧</span>
                      {contato.dsemail || '-'}
                    </p>
                    <p className="text-sm flex items-center">
                      <span className="mr-1">📞</span>
                      {contato.nucel || '-'}
                    </p>
                    <p className="text-sm flex items-center">
                      <span className="mr-1">💼</span>
                      {contato.cargo || '-'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Seção: Dados do Contato (apenas se for novo contato) */}
          {formData.isManualContact && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Dados do Contato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nomeContato"
                  placeholder="Nome do Contato"
                  value={formData.nomeContato}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  name="cpfContato"
                  placeholder="CPF"
                  value={formData.cpfContato}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  name="emailContato"
                  placeholder="Email"
                  value={formData.emailContato}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  name="celularContato"
                  placeholder="Celular"
                  value={formData.celularContato}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Seção: Dados da Concessionária */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Dados da Concessionária
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="concessionaria_energia"
                placeholder="Concessionária de energia"
                value={formData.concessionaria_energia}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                name="usuario_concessionaria"
                placeholder="Usuário da concessionária"
                value={formData.usuario_concessionaria}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="password"
                name="senha_concessionaria"
                placeholder="Senha da concessionária"
                value={formData.senha_concessionaria}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Seção: Documentos */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Documentos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fileFields.common.map((field) => (
                <div key={field.name}>
                  <label className="block mb-1">{field.label}</label>
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleFileChange}
                    required
                    className="w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:rounded-md file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              ))}
              {(fileFields[tipoCadastro] || []).map((field) => (
                <div key={field.name}>
                  <label className="block mb-1">{field.label}</label>
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleFileChange}
                    required
                    className="w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:rounded-md file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Checkbox de manutenção dos dados */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceAgreement"
                checked={formData.maintenanceAgreement}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-indigo-600 mr-2"
              />
              <span>
                De acordo com a manutenção dos dados pelo Portal Do Empreender
              </span>
            </label>
          </div>

          {/* Botão de envio */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!formData.maintenanceAgreement}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 transition-colors"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
