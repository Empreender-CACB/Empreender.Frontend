import { useState, useEffect } from 'react';

function PesquisaTeste() {
    const [participou, setParticipou] = useState(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }} className=" bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" alt="CACB"/>
            <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" alt="Empreender"/>
            <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" alt="Al Invest"/>
            <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/sebrae.svg" alt="Sebrae"/>
        </div>
    </div>

            <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Programa de Parceria CACB e Caixa Econômica Federal</h1>
            <p className="text-gray-600 font-medium">Por favor, responda às seguintes questões:</p>
        </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Sua empresa participou da parceria CACB-CEF?
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setParticipou("sim")}
                            className={`px-4 py-2 rounded-md font-semibold ${participou === "sim" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"} transition-colors`}
                        >
                            Sim
                        </button>
                        <button
                            onClick={() => setParticipou("nao")}
                            className={`px-4 py-2 rounded-md font-semibold ${participou === "nao" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"} transition-colors`}
                        >
                            Não
                        </button>
                    </div>
                </div>

                {/* SE NÃO PARTICIPOU, MOSTRAR BOTÃO "SAIBA MAIS" */}
                {participou === "nao" && (
                    <div className="text-center">
                        <p className="text-gray-700">Saiba mais sobre a parceria clicando abaixo:</p>
                        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer"
                            className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                            Saiba mais
                        </a>
                    </div>
                )}

                {/* SE PARTICIPOU, MOSTRAR FORMULÁRIO */}
                {participou === "sim" && (
                    <form className="space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">1. Houve obtenção de financiamento?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input type="radio" name="financiamento" className="h-4 w-4 text-blue-600 border-gray-300"/>
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="financiamento" className="h-4 w-4 text-blue-600 border-gray-300"/>
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">2. O acesso ao recurso permitiu a criação ou manutenção de empregos verdes e/ou digitais?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input type="radio" name="empregos" className="h-4 w-4 text-blue-600 border-gray-300"/>
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="empregos" className="h-4 w-4 text-blue-600 border-gray-300"/>
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                            <label className="block text-sm font-semibold text-gray-900">3. Quantidade de empregos formais e informais por gênero:</label>
                            <div className="grid grid-cols-3 gap-4 text-sm font-semibold">
                                <div></div>
                                <div className="text-center">Feminino</div>
                                <div className="text-center">Masculino</div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <span className="text-gray-700">Formais</span>
                                    <input type="number" className="p-2 border rounded-md" placeholder="Quantidade"/>
                                    <input type="number" className="p-2 border rounded-md" placeholder="Quantidade"/>
                                </div>
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <span className="text-gray-700">Informais</span>
                                    <input type="number" className="p-2 border rounded-md" placeholder="Quantidade"/>
                                    <input type="number" className="p-2 border rounded-md" placeholder="Quantidade"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">4. Houve aumento no seu faturamento no último ano?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input type="radio" name="faturamento" className="h-4 w-4 text-blue-600 border-gray-300"/>
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="faturamento" className="h-4 w-4 text-blue-600 border-gray-300"/>
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                            Enviar Respostas
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default PesquisaTeste;
