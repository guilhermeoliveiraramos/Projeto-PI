import { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaSucesso, alertaErro, confirmarExclusao } from '../utils/alertas';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function carregarUsuarios() {
    try {
      const resposta = await api.get('/usuarios');
      setUsuarios(resposta.data);
    } catch (erro) {
      console.error('Erro ao buscar usuários:', erro);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function handleCadastrar(evento) {
    evento.preventDefault();
    try {
      await api.post('/usuarios', { nomeUsuario, cargo, email, senha });
      setNomeUsuario('');
      setCargo('');
      setEmail('');
      setSenha('');
      carregarUsuarios();
      alertaSucesso('Usuário cadastrado!');
    } catch (erro) {
      alertaErro('Erro ao cadastrar usuário. Verifique se o e-mail já existe.');
    }
  }

  async function handleExcluir(id) {
    if (await confirmarExclusao()) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
        alertaSucesso('Usuário excluído!');
      } catch (erro) {
        alertaErro('Não foi possível excluir o usuário.');
      }
    }
  }

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>

      <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Nome do usuário" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Cargo (ex: Operador)" value={cargo} onChange={(e) => setCargo(e.target.value)} required style={{ padding: '8px' }} />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Cadastrar
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#e2e8f0' }}>
            <th>ID</th>
            <th>Nome</th>
            <th>Cargo</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.idUsuario}>
              <td>{user.idUsuario}</td>
              <td>{user.nomeUsuario}</td>
              <td>{user.cargo}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleExcluir(user.idUsuario)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
