'use client';

import { useState, useEffect } from 'react';

export default function CargoPage() {
    const [cargos, setCargos] = useState<{id_cargo: number, nome_cargo: string}[]>([]);
    const [idSearch, setIdSearch] = useState('');
    const [nomeCargo, setNomeCargo] = useState('');
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [operacao, setOperacao] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    
    const [modoEdicao, setModoEdicao] = useState(false);
    const [statusBotoes, setStatusBotoes] = useState({
        buscar: true, incluir: false, alterar: false, excluir: false, salvar: false, cancelar: false
    });

    const API_BASE_URL = 'http://localhost:3001';

    useEffect(() => {
        carregarCargos();
    }, []);

    async function carregarCargos() {
        try {
            const response = await fetch(`${API_BASE_URL}/cargo`);
            if (response.ok) {
                const dados = await response.json();
                setCargos(dados);
            }
        } catch (error) {
            mostrarMensagem('Erro ao carregar lista', 'error');
        }
    }

    const mostrarMensagem = (texto: string, tipo: string) => {
        setMensagem({ texto, tipo });
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    };

    async function buscarCargo() {
        if (!idSearch) return mostrarMensagem('Digite um ID para buscar', 'warning');
        
        try {
            const response = await fetch(`${API_BASE_URL}/cargo/${idSearch}`);
            if (response.ok) {
                const cargo = await response.json();
                setNomeCargo(cargo.nome_cargo);
                setCurrentId(cargo.id_cargo);
                setStatusBotoes({ buscar: true, incluir: false, alterar: true, excluir: true, salvar: false, cancelar: true });
                setModoEdicao(false);
            } else {
                setModoEdicao(true);
                setStatusBotoes({ buscar: true, incluir: true, alterar: false, excluir: false, salvar: false, cancelar: true });
                mostrarMensagem('Cargo não encontrado. Você pode incluir um novo.', 'info');
            }
        } catch (error) {
            mostrarMensagem('Erro na busca', 'error');
        }
    }

    async function salvar() {
        const payload = { id_cargo: idSearch, nome_cargo: nomeCargo };
        let url = `${API_BASE_URL}/cargo`;
        let method = 'POST';

        if (operacao === 'alterar') {
            url += `/${currentId}`;
            method = 'PUT';
        } else if (operacao === 'excluir') {
            url += `/${currentId}`;
            method = 'DELETE';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: operacao !== 'excluir' ? JSON.stringify(payload) : null
            });

            if (response.ok) {
                mostrarMensagem(`Operação realizada com sucesso!`, 'success');
                cancelar();
                carregarCargos();
            }
        } catch (error) {
            mostrarMensagem('Erro na operação', 'error');
        }
    }

    const cancelar = () => {
        setIdSearch('');
        setNomeCargo('');
        setOperacao(null);
        setModoEdicao(false);
        setStatusBotoes({ buscar: true, incluir: false, alterar: false, excluir: false, salvar: false, cancelar: false });
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans">
            {/* Header Barra Verde */}
            <div className="bg-[#436b4f] w-full py-4 text-center shadow-sm">
                <h1 className="text-white text-xl font-bold tracking-wide">CRUD Cargo</h1>
            </div>

            <main className="max-w-4xl mx-auto mt-10 px-4 flex flex-col gap-8">
                
                {/* Alertas */}
                {mensagem.texto && (
                    <div className={`p-4 rounded font-bold text-center ${mensagem.tipo === 'success' ? 'bg-[#d1e7dd] text-[#0f5132]' : 'bg-[#f8d7da] text-[#842029]'}`}>
                        {mensagem.texto}
                    </div>
                )}

                {/* Card do Formulário */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-[#436b4f] mb-2">Cadastro de Cargo</h2>
                    <hr className="border-[#9fdab4] border-t-2 mb-8" />
                    
                    {/* Bloco de Busca */}
                    <div className="bg-[#f5fbf7] border border-[#aedec3] rounded p-4 mb-8">
                        <label className="block text-sm font-bold text-[#436b4f] mb-2">Buscar por ID:</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Digite o ID para buscar"
                                className="border border-gray-300 rounded px-3 py-1 w-48 focus:outline-none focus:ring-1 focus:ring-[#436b4f]"
                                value={idSearch}
                                onChange={(e) => setIdSearch(e.target.value)}
                                disabled={modoEdicao && statusBotoes.salvar}
                            />
                            {statusBotoes.buscar && (
                                <button 
                                    onClick={buscarCargo} 
                                    className="bg-[#efefef] border border-gray-300 text-black px-4 py-1 rounded shadow-sm hover:bg-gray-200 flex items-center gap-2 text-sm"
                                >
                                    <span className="text-blue-500">🔍</span> Buscar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bloco de Dados (Estilo Fieldset) */}
                    <div className="border border-[#aedec3] rounded p-6 relative">
                        <span className="absolute -top-3 left-4 bg-white px-2 text-[#436b4f] font-bold text-sm">
                            Dados da Cargo
                        </span>
                        
                        <div className="flex flex-col mb-6">
                            <label className="text-sm font-bold text-[#436b4f] mb-2">Nome do cargo:</label>
                            <input 
                                type="text" 
                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#436b4f]"
                                value={nomeCargo}
                                onChange={(e) => setNomeCargo(e.target.value)}
                                disabled={!modoEdicao}
                            />
                        </div>

                        {/* Botões de Ação Dinâmicos */}
                        <div className="flex gap-3">
                            {statusBotoes.incluir && <button onClick={() => {setOperacao('incluir'); setModoEdicao(true); setStatusBotoes({salvar: true, cancelar: true})}} className="bg-[#436b4f] text-white px-4 py-2 rounded shadow hover:bg-[#34533d]">Incluir</button>}
                            {statusBotoes.alterar && <button onClick={() => {setOperacao('alterar'); setModoEdicao(true); setStatusBotoes({salvar: true, cancelar: true})}} className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600">Alterar</button>}
                            {statusBotoes.excluir && <button onClick={() => {setOperacao('excluir'); setStatusBotoes({salvar: true, cancelar: true})}} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">Excluir</button>}
                            {statusBotoes.salvar && <button onClick={salvar} className="bg-[#436b4f] text-white px-6 py-2 rounded shadow font-bold hover:bg-[#34533d]">Salvar</button>}
                            {statusBotoes.cancelar && <button onClick={cancelar} className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400">Cancelar</button>}
                        </div>
                    </div>
                </div>

                {/* Card da Tabela */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#436b4f] text-white text-sm">
                                <th className="py-3 px-6 w-32 font-semibold">ID</th>
                                <th className="py-3 px-6 font-semibold">NOME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargos.map((cargo) => (
                                <tr key={cargo.id_cargo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-6">
                                        <button 
                                            onClick={() => {setIdSearch(cargo.id_cargo.toString()); buscarCargo();}}
                                            className="bg-[#67f2c3] text-black font-bold text-xs px-3 py-1.5 rounded shadow-sm hover:bg-[#52e0ae] transition-colors"
                                            title="Clique para buscar"
                                        >
                                            {cargo.id_cargo}
                                        </button>
                                    </td>
                                    <td className="py-3 px-6 text-gray-700 text-sm">{cargo.nome_cargo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            </main>
        </div>
    );
}