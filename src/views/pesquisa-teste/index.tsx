import { useState, useEffect } from 'react';

function PesquisaTeste() {
    const [cnpj, setCnpj] = useState('') // caso você queira preenchê-lo manualmente

    const [resposta1, setResposta1] = useState('')
    const [resposta2, setResposta2] = useState('')
    const [resposta3, setResposta3] = useState('')
    const [resposta4, setResposta4] = useState('')
    const [resposta5, setResposta5] = useState('')
    const [resposta6, setResposta6] = useState('')
    const [resposta7, setResposta7] = useState('')
    const [resposta8, setResposta8] = useState('')
    
    const [certificacao, setCertificacao] = useState('')
    const [faixaAumento, setFaixaAumento] = useState('')
    
    // Práticas sustentáveis (pergunta 3)
    const [praticas, setPraticas] = useState({
      residuos: false,
      energia: false,
      plastico: false,
      digitalizacao: false,
      insumos: false,
      transporte: false,
      outra: ''
    })
    
    // Colaboradores em práticas sustentáveis (pergunta 4)
    const [colabSustentaveis, setColabSustentaveis] = useState({
      total: 0,
      homens: 0,
      mulheres: 0
    })
    
    // Colaboradores em empregos digitais (pergunta 5)
    const [colabDigitais, setColabDigitais] = useState({
      total: 0,
      homens: 0,
      mulheres: 0
    })
    
    // Redução de recursos (pergunta 6)
    const [reducao, setReducao] = useState({
      agua: false,
      energia: false,
      combustivel: false,
      papel: false,
      materia_prima: false,
      otimizacao: false,
      outra: ''
    })
    
    // Participação (se aplicável)
    const [participou, setParticipou] = useState(null)


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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
      
        const payload = {
          cnpj,
      
          pergunta1: resposta1 === 'sim',
          pergunta2: resposta2 === 'sim',
      
          adota_praticas: resposta3 === 'sim',
          praticas: {
            residuos: praticas.residuos,
            energia: praticas.energia,
            plastico: praticas.plastico,
            digitalizacao: praticas.digitalizacao,
            insumos: praticas.insumos,
            transporte: praticas.transporte,
            outra: praticas.outra
          },
      
          colab_sustentabilidade: resposta4 === 'sim',
          colab_sustent_total: colabSustentaveis.total,
          colab_sustent_homens: colabSustentaveis.homens,
          colab_sustent_mulheres: colabSustentaveis.mulheres,
      
          colab_digital: resposta5 === 'sim',
          colab_digital_total: colabDigitais.total,
          colab_digital_homens: colabDigitais.homens,
          colab_digital_mulheres: colabDigitais.mulheres,
      
          reduziu_recursos: resposta6 === 'sim',
          reducao: {
            agua: reducao.agua,
            energia: reducao.energia,
            combustivel: reducao.combustivel,
            papel: reducao.papel,
            materia_prima: reducao.materia_prima,
            otimizacao: reducao.otimizacao,
            outra: reducao.outra
          },
      
          aumento_faturamento: resposta7 === 'sim',
          faixa_aumento: faixaAumento,
      
          possui_certificacao: resposta8,
          nome_certificacao: certificacao
        }
      
        try {
          const response = await fetch('http://localhost:3333/pesquisa-al', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
      
          if (response.ok) {
            alert('Formulário enviado com sucesso!')
          } else {
            alert('Erro ao enviar formulário. Verifique os dados e tente novamente.')
          }
        } catch (error) {
          console.error('Erro na requisição:', error)
          alert('Erro ao conectar com o servidor.')
        }
      }
      


    return (
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }} className="h-auto bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                    <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" alt="CACB" />
                    <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" alt="Empreender" />
                    <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" alt="Al Invest" />
                    <img className="h-12 mx-auto object-contain" src="https://beta.cacbempreenderapp.org.br/img/logo/sebrae.svg" alt="Sebrae" />
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
                                1. Sua empresa teve acesso a orientações sobre fontes de financiamento? [2.6]
                            </label>
                            <div className="flex gap-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta1"
                                            value={valor}
                                            checked={resposta1 === valor}
                                            onChange={() => setResposta1(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Pergunta 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                2. Sua empresa conseguiu o financiamento junto à instituição financeira? [2.6]
                            </label>
                            <div className="flex gap-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta2"
                                            value={valor}
                                            checked={resposta2 === valor}
                                            onChange={() => setResposta2(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Pergunta 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                3. Sua empresa adota práticas sustentáveis? [OE 1.1]
                            </label>
                            <div className="flex gap-4 mb-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta3"
                                            value={valor}
                                            checked={resposta3 === valor}
                                            onChange={() => setResposta3(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                            {resposta3 === 'sim' && (
                                <div className="space-y-2 ml-2">
                                    <label className="block">
                                        <input type="checkbox" checked={praticas.residuos} onChange={(e) => setPraticas({ ...praticas, residuos: e.target.checked })} className="mr-2" /> Gestão de resíduos e reciclagem
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" checked={praticas.energia} onChange={(e) => setPraticas({ ...praticas, energia: e.target.checked })} className="mr-2" /> Uso eficiente de energia e água
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" checked={praticas.plastico} onChange={(e) => setPraticas({ ...praticas, plastico: e.target.checked })} className="mr-2" /> Redução do uso de plástico e papel
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" checked={praticas.digitalizacao} onChange={(e) => setPraticas({ ...praticas, digitalizacao: e.target.checked })} className="mr-2" /> Digitalização de processos para reduzir desperdícios
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" checked={praticas.insumos} onChange={(e) => setPraticas({ ...praticas, insumos: e.target.checked })} className="mr-2" /> Uso de insumos ecológicos ou reaproveitamento de materiais
                                    </label>
                                    <label className="block">
                                        <input type="checkbox" checked={praticas.transporte} onChange={(e) => setPraticas({ ...praticas, transporte: e.target.checked })} className="mr-2" /> Incentivo ao trabalho remoto ou transporte sustentável
                                    </label>
                                    <label className="block">
                                        Outra:
                                        <input type="text" value={praticas.outra} onChange={(e) => setPraticas({ ...praticas, outra: e.target.value })} placeholder="Outra prática (especifique)" className="border mt-2 rounded px-2 py-1 w-full" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Pergunta 4 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                4. Sua empresa conta com colaboradores que atuam diretamente em práticas sustentáveis? [OE 1.2]
                            </label>
                            <div className="flex gap-4 mb-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta4"
                                            value={valor}
                                            checked={resposta4 === valor}
                                            onChange={() => setResposta4(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                            {resposta4 === 'sim' && (
                                <div className="space-y-2 ml-2">
                                    <span className="ml-2 text-gray-700 font-medium">Quantos são no total?</span>
                                    <input type="number" value={colabSustentaveis.total} onChange={(e) => setColabSustentaveis({ ...colabSustentaveis, total: Number(e.target.value) })} className="border rounded px-2 py-1 w-full" placeholder="Total" />
                                    <span className="ml-2 text-gray-700 font-medium">Quantos são homens?</span>
                                    <input type="number" value={colabSustentaveis.homens} onChange={(e) => setColabSustentaveis({ ...colabSustentaveis, homens: Number(e.target.value) })} className="border rounded px-2 py-1 w-full" placeholder="Homens" />
                                    <span className="ml-2 text-gray-700 font-medium">Quantos são mulheres??</span>
                                    <input type="number" value={colabSustentaveis.mulheres} onChange={(e) => setColabSustentaveis({ ...colabSustentaveis, mulheres: Number(e.target.value) })} className="border rounded px-2 py-1 w-full" placeholder="Mulheres" />
                                </div>
                            )}
                        </div>

                        {/* Pergunta 5 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                5. Sua empresa conta com colaboradores que atuam diretamente em empregos digitais? [OE 1.2]
                            </label>
                            <div className="flex gap-4 mb-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta5"
                                            value={valor}
                                            checked={resposta5 === valor}
                                            onChange={() => setResposta5(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                            {resposta5 === 'sim' && (
                                <div className="space-y-2 ml-2">
                                     <span className="ml-2 text-gray-700 font-medium">Quantos são no total?</span>
                                    <input type="number" value={colabDigitais.total} onChange={(e) => setColabDigitais({ ...colabDigitais, total: Number(e.target.value) })} className="border rounded px-2 py-1 w-full" placeholder="Total" />
                                    <span className="ml-2 text-gray-700 font-medium">Quantos são homens?</span>
                                    <input type="number" value={colabDigitais.homens} onChange={(e) => setColabDigitais({ ...colabDigitais, homens: Number(e.target.value) })} className="border rounded px-2 py-1 w-full" placeholder="Homens" />
                                    <span className="ml-2 text-gray-700 font-medium">Quantos são mulheres??</span>
                                    <input type="number" value={colabDigitais.mulheres} onChange={(e) => setColabDigitais({ ...colabDigitais, mulheres: Number(e.target.value) })} className="border rounded px-2 py-1 w-full" placeholder="Mulheres" />
                                </div>
                            )}
                        </div>

                        {/* Pergunta 6 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                6. Sua empresa conseguiu reduzir o consumo de recursos no período de 2022 e 2025? [1.4]
                            </label>
                            <div className="flex gap-4 mb-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta6"
                                            value={valor}
                                            checked={resposta6 === valor}
                                            onChange={() => setResposta6(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                            {resposta6 === 'sim' && (
                                <div className="space-y-2 ml-2">
                                    {Object.entries(reducao).slice(0, 6).map(([key, checked]) => (
                                        <label key={key} className="block">
                                            <input type="checkbox" checked={checked as boolean} onChange={(e) => setReducao({ ...reducao, [key]: e.target.checked })} className="mr-2" /> {key.replace(/_/g, ' ')}
                                        </label>
                                    ))}
                                    <label className="block">
                                        Outro:
                                        <input type="text" value={reducao.outra} onChange={(e) => setReducao({ ...reducao, outra: e.target.value })} placeholder="Outra economia (especifique)" className="border mt-2 rounded px-2 py-1 w-full" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Pergunta 7 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                7. Houve aumento no volume de negócios e/ou no faturamento no período de 2022 a 2025? [1.3]
                            </label>
                            <div className="flex gap-4 mb-4">
                                {['sim', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="pergunta7"
                                            value={valor}
                                            checked={resposta7 === valor}
                                            onChange={() => setResposta7(valor)}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">{valor === 'sim' ? 'Sim' : 'Não'}</span>
                                    </label>
                                ))}
                            </div>
                            {resposta7 === 'sim' && (
                                <div className="space-y-2 ml-2">
                                    {['1% a 20%', '21% a 40%', '41% a 60%', '60% a 80%', '80% a 100%'].map((faixa) => (
                                        <label key={faixa} className="block">
                                            <input type="radio" name="faixaAumento" value={faixa} checked={faixaAumento === faixa} onChange={() => setFaixaAumento(faixa)} className="mr-2" /> {faixa}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pergunta 8 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                8. Sua empresa possui alguma norma, selo, padrão e/ou certificação em sustentabilidade no período de 2022 a 2025? [1.2]
                            </label>
                            <div className="space-y-2">
                                {['sim', 'interesse', 'nao'].map((valor) => (
                                    <label key={valor} className="flex items-center">
                                        <input type="radio" name="pergunta8" value={valor} checked={resposta8 === valor} onChange={() => setResposta8(valor)} className="h-4 w-4 text-blue-600 border-gray-300" />
                                        <span className="ml-2 text-gray-700 font-medium">
                                            {valor === 'sim' ? 'Sim' : valor === 'interesse' ? 'Não, mas tenho interesse' : 'Não'}
                                        </span>
                                    </label>
                                ))}
                                {resposta8 === 'sim' && (
                                    <input type="text" name="nome_certificacao" value={certificacao} onChange={(e) => setCertificacao(e.target.value)} className="mt-2 border rounded px-2 py-1 w-full" placeholder="Nome da norma ou certificação" />
                                )}
                            </div>
                        </div>

                        {/* Botão de envio */}
                        <div className="text-end">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition">
                                Enviar formulário
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default PesquisaTeste;
