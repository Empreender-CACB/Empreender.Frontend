import React from 'react';

interface ErrorPageProps {
  errorCode: string;
  title: string;
  message?: string;
  buttonText?: string;
  buttonLink?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode, title, message, buttonText, buttonLink }) => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="max-w-sm mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div className="text-9xl font-bold text-indigo-600 mb-4">{errorCode}</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">{message || ''}</p>
        <a
          href={buttonLink || 'https://cacb.org.br/empreender/'}
          className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          {buttonText || 'Voltar para a página inicial'}
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
