import { useState, useEffect } from 'react';

function PesquisaTeste() {
    const [participou, setParticipou] = useState(null);

    // States to control answers
    const [resposta1, setResposta1] = useState(null); // Pergunta 1
    const [resposta2, setResposta2] = useState(null); // Pergunta 2
    const [adotaSustentaveis, setAdotaSustentaveis] = useState(null); // Pergunta 3 (Sim/Não)
    const [praticasSustentaveis, setPraticasSustentaveis] = useState([]); // Lista de checkboxes
    const [resposta4, setResposta4] = useState(null); // Pergunta 4 (Sim/Não)
    const [colaboradores4, setColaboradores4] = useState({ total: '', homens: '', mulheres: '' });

    const [resposta5, setResposta5] = useState(null); // Pergunta 5 (Sim/Não)
    const [colaboradores5, setColaboradores5] = useState({ total: '', homens: '', mulheres: '' });

    const [resposta6, setResposta6] = useState(null); // Pergunta 6 (Sim/Não)
    const [economias, setEconomias] = useState([]); // Checkboxes
    const [outraEconomia, setOutraEconomia] = useState('');

    const [resposta7, setResposta7] = useState(null); // Pergunta 7 (Sim/Não)
    const [porcentagem, setPorcentagem] = useState('');

    const [resposta8, setResposta8] = useState(null); // Pergunta 8 (Sim / Não, mas interessa / Não)
    const [nomeCertificacao, setNomeCertificacao] = useState('');

    // Effects
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const handleCheckBoxChange = (setter, value) => {
        setter(prev => {
            if (prev.includes(value)) {
                return prev.filter(v => v !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode enviar os dados para o servidor, usar fetch/axios, etc.
        console.log({
            pergunta1: resposta1,
            pergunta2: resposta2,
            pergunta3_adota: adotaSustentaveis,
            pergunta3_praticas: praticasSustentaveis,
            pergunta4: resposta4,
            colaboradores4,
            pergunta5: resposta5,
            colaboradores5,
            pergunta6: resposta6,
            economias,
            outraEconomia,
            pergunta7: resposta7,
            porcentagem,
            pergunta8: resposta8,
            nomeCertificacao
        });
        alert('Formulário enviado! Verifique o console para ver os dados.');
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }} className="h-auto bg-white py-12 px-4 sm:px-6 lg:px-8">
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
                            type="button"
                            onClick={() => setParticipou("sim")}
                            className={`px-4 py-2 rounded-md font-semibold ${participou === "sim" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"} transition-colors`}
                        >
                            Sim
                        </button>
                        <button
                            type="button"
                            onClick={() => setParticipou("nao")}
                            className={`px-4 py-2 rounded-md font-semibold ${participou === "nao" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"} transition-colors`}
                        >
                            Não
                        </button>
                    </div>
                </div>

                {/* SE NÃO PARTICIPOU, MOSTRAR LINK */}
                {participou === "nao" && (
                    <div className="text-center">
                        <p className="text-gray-700">Saiba mais sobre a parceria clicando abaixo:</p>
                        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer"
                            className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                            Saiba mais
                        </a>
                    </div>
                )}

                {/* SE PARTICIPOU, MOSTRAR 8 PERGUNTAS */}
                {participou === "sim" && (
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Pergunta 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                1. Sua empresa teve acesso a orientações sobre fontes de financiamento com condições diferenciadas para negócios que adotam boas práticas de sustentabilidade?
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta1"
                                        value="sim"
                                        checked={resposta1 === "sim"}
                                        onChange={() => setResposta1("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta1"
                                        value="nao"
                                        checked={resposta1 === "nao"}
                                        onChange={() => setResposta1("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>
                        </div>

                        {/* Pergunta 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                2. Sua empresa conseguiu o financiamento junto à instituição financeira?
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta2"
                                        value="sim"
                                        checked={resposta2 === "sim"}
                                        onChange={() => setResposta2("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta2"
                                        value="nao"
                                        checked={resposta2 === "nao"}
                                        onChange={() => setResposta2("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>
                        </div>

                        {/* Pergunta 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                3. Sua empresa adota práticas sustentáveis?
                            </label>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta3"
                                        value="sim"
                                        checked={adotaSustentaveis === "sim"}
                                        onChange={() => setAdotaSustentaveis("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta3"
                                        value="nao"
                                        checked={adotaSustentaveis === "nao"}
                                        onChange={() => setAdotaSustentaveis("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>

                            {adotaSustentaveis === "sim" && (
                                <div className="space-y-2">
                                    <label className="text-gray-700 font-medium block">Selecione as práticas adotadas:</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Gestão de resíduos e reciclagem")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Gestão de resíduos e reciclagem")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Gestão de resíduos e reciclagem</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Uso eficiente de energia e água")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Uso eficiente de energia e água")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Uso eficiente de energia e água</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Redução do uso de plástico e papel")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Redução do uso de plástico e papel")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Redução do uso de plástico e papel</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Digitalização de processos para reduzir desperdícios")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Digitalização de processos para reduzir desperdícios")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Digitalização de processos para reduzir desperdícios</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Uso de insumos ecológicos ou reaproveitamento de materiais")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Uso de insumos ecológicos ou reaproveitamento de materiais")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Uso de insumos ecológicos ou reaproveitamento de materiais</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Incentivo ao trabalho remoto ou transporte sustentável")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Incentivo ao trabalho remoto ou transporte sustentável")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Incentivo ao trabalho remoto ou transporte sustentável</span>
                                        </label>
                                    </div>
                                    {/* Espaço para "Outra" prática */}
                                    <div className="mt-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={praticasSustentaveis.includes("Outra")}
                                                onChange={() => handleCheckBoxChange(setPraticasSustentaveis, "Outra")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Outra (especifique)</span>
                                        </label>
                                        {praticasSustentaveis.includes("Outra") && (
                                            <input
                                                type="text"
                                                placeholder="Descreva outra prática"
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pergunta 4 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                4. Sua empresa conta com colaboradores que atuam diretamente em práticas sustentáveis?
                            </label>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta4"
                                        value="sim"
                                        checked={resposta4 === "sim"}
                                        onChange={() => setResposta4("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta4"
                                        value="nao"
                                        checked={resposta4 === "nao"}
                                        onChange={() => setResposta4("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>

                            {resposta4 === "sim" && (
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 font-medium block">Quantos no total?</label>
                                    <input
                                        type="number"
                                        value={colaboradores4.total}
                                        onChange={(e) => setColaboradores4({ ...colaboradores4, total: e.target.value })}
                                        className="p-2 border rounded-md w-full mb-2"
                                        placeholder="Quantidade total"
                                    />
                                    <label className="text-sm text-gray-700 font-medium block">Quantos são homens?</label>
                                    <input
                                        type="number"
                                        value={colaboradores4.homens}
                                        onChange={(e) => setColaboradores4({ ...colaboradores4, homens: e.target.value })}
                                        className="p-2 border rounded-md w-full mb-2"
                                        placeholder="Quantidade homens"
                                    />
                                    <label className="text-sm text-gray-700 font-medium block">Quantos são mulheres?</label>
                                    <input
                                        type="number"
                                        value={colaboradores4.mulheres}
                                        onChange={(e) => setColaboradores4({ ...colaboradores4, mulheres: e.target.value })}
                                        className="p-2 border rounded-md w-full mb-2"
                                        placeholder="Quantidade mulheres"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Pergunta 5 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                5. Sua empresa conta com colaboradores que atuam diretamente em empregos digitais?
                            </label>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta5"
                                        value="sim"
                                        checked={resposta5 === "sim"}
                                        onChange={() => setResposta5("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta5"
                                        value="nao"
                                        checked={resposta5 === "nao"}
                                        onChange={() => setResposta5("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>

                            {resposta5 === "sim" && (
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 font-medium block">Quantos no total?</label>
                                    <input
                                        type="number"
                                        value={colaboradores5.total}
                                        onChange={(e) => setColaboradores5({ ...colaboradores5, total: e.target.value })}
                                        className="p-2 border rounded-md w-full mb-2"
                                        placeholder="Quantidade total"
                                    />
                                    <label className="text-sm text-gray-700 font-medium block">Quantos são homens?</label>
                                    <input
                                        type="number"
                                        value={colaboradores5.homens}
                                        onChange={(e) => setColaboradores5({ ...colaboradores5, homens: e.target.value })}
                                        className="p-2 border rounded-md w-full mb-2"
                                        placeholder="Quantidade homens"
                                    />
                                    <label className="text-sm text-gray-700 font-medium block">Quantos são mulheres?</label>
                                    <input
                                        type="number"
                                        value={colaboradores5.mulheres}
                                        onChange={(e) => setColaboradores5({ ...colaboradores5, mulheres: e.target.value })}
                                        className="p-2 border rounded-md w-full mb-2"
                                        placeholder="Quantidade mulheres"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Pergunta 6 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                6. Sua empresa conseguiu reduzir o consumo de recursos nos últimos meses após sua participação?
                            </label>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta6"
                                        value="sim"
                                        checked={resposta6 === "sim"}
                                        onChange={() => setResposta6("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta6"
                                        value="nao"
                                        checked={resposta6 === "nao"}
                                        onChange={() => setResposta6("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>

                            {resposta6 === "sim" && (
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 font-medium block">Quais tipos de economia foram alcançados?</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Redução no uso de água")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Redução no uso de água")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Redução no uso de água</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Redução de energia elétrica")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Redução de energia elétrica")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Redução de energia elétrica</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Redução de uso de combustível")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Redução de uso de combustível")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Redução de uso de combustível</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Redução no uso de papel")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Redução no uso de papel")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Redução no uso de papel</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Redução no uso de matéria-prima")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Redução no uso de matéria-prima")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Redução no uso de matéria-prima</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Otimização de processos para evitar desperdícios")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Otimização de processos para evitar desperdícios")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Otimização de processos para evitar desperdícios</span>
                                        </label>
                                    </div>

                                    <div className="mt-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={economias.includes("Outro")}
                                                onChange={() => handleCheckBoxChange(setEconomias, "Outro")}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                            />
                                            <span className="ml-2">Outro (qual?)</span>
                                        </label>
                                        {economias.includes("Outro") && (
                                            <input
                                                type="text"
                                                value={outraEconomia}
                                                onChange={(e) => setOutraEconomia(e.target.value)}
                                                placeholder="Descreva"
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pergunta 7 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                7. Houve aumento no faturamento no último ano?
                            </label>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta7"
                                        value="sim"
                                        checked={resposta7 === "sim"}
                                        onChange={() => setResposta7("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta7"
                                        value="nao"
                                        checked={resposta7 === "nao"}
                                        onChange={() => setResposta7("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>

                            {resposta7 === "sim" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mencione a porcentagem:</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={porcentagem}
                                        onChange={(e) => setPorcentagem(e.target.value)}
                                        placeholder="Exemplo: 10"
                                        className="p-2 border rounded-md w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Pergunta 8 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                8. Sua empresa possui alguma norma, selo, padrão e/ou certificação em sustentabilidade no período de 2022 a 2025?
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta8"
                                        value="sim"
                                        checked={resposta8 === "sim"}
                                        onChange={() => setResposta8("sim")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Sim</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta8"
                                        value="interesse"
                                        checked={resposta8 === "interesse"}
                                        onChange={() => setResposta8("interesse")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não, mas tenho interesse em obter</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pergunta8"
                                        value="nao"
                                        checked={resposta8 === "nao"}
                                        onChange={() => setResposta8("nao")}
                                        className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 font-medium">Não</span>
                                </label>
                            </div>

                            {resposta8 === "sim" && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Por favor informe o nome do regulamento, norma ou certificação implementada:</label>
                                    <input
                                        type="text"
                                        value={nomeCertificacao}
                                        onChange={(e) => setNomeCertificacao(e.target.value)}
                                        placeholder="Digite aqui"
                                        className="p-2 border rounded-md w-full"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Enviar Respostas
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default PesquisaTeste;
