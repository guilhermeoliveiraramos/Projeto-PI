import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'dark');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('HOMEM');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  function alternarTema() {
    const novo = tema === 'dark' ? 'light' : 'dark';
    setTema(novo);
    document.documentElement.setAttribute('data-theme', novo);
    localStorage.setItem('tema', novo);
  }

  function calcularIdade(dataNasc) {
    const hoje = new Date();
    const [ano, mes, dia] = dataNasc.split('-').map(Number);
    let idade = hoje.getFullYear() - ano;
    const diferencaMes = hoje.getMonth() + 1 - mes;
    if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dia)) {
      idade--;
    }
    return idade;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (modoCadastro) {
      const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        setMensagem({ tipo: 'erro', texto: 'Digite um e-mail válido (ex: nome@dominio.com)!' });
        return;
      }

      const idade = dataNascimento ? calcularIdade(dataNascimento) : 0;
      if (!dataNascimento || idade < 18 || idade > 100) {
        setMensagem({ tipo: 'erro', texto: 'Cadastro permitido apenas para idades entre 18 e 100 anos!' });
        return;
      }

      setCarregando(true);
      try {
        await api.post('/usuarios', {
          nomeUsuario,
          cargo: 'OPERADOR',
          dataNascimento,
          sexo,
          email,
          senha,
        });

        setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login para entrar.' });
        setModoCadastro(false);
        setSenha('');
      } catch (err) {
        const textoErro = typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Erro ao criar conta. Verifique se o e-mail já está em uso.';
        setMensagem({ tipo: 'erro', texto: textoErro });
      } finally {
        setCarregando(false);
      }
    } else {
      setCarregando(true);
      try {
        const resposta = await api.post('/usuarios/login', { email, senha });
        localStorage.setItem('usuarioLogado', JSON.stringify(resposta.data));
        navigate('/inicio');
      } catch (err) {
        setMensagem({ tipo: 'erro', texto: 'E-mail ou senha inválidos!' });
      } finally {
        setCarregando(false);
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '1.2rem',
      position: 'relative',
      zIndex: 1
    }}>
      <button
        type="button"
        onClick={alternarTema}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: 'auto',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
          padding: '8px 16px',
        }}
      >
        {tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Noturno'}
      </button>

      <form
        key={modoCadastro ? 'cadastro' : 'login'}
        onSubmit={handleSubmit}
        className="page-transition"
        style={{
          backgroundColor: 'var(--bg-card)',
          padding: '2.4rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '0.3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--accent-soft)',
            color: 'var(--accent-blue)',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.8rem'
          }}>
            <span className="laser-dot"></span>
            Projeto Integrador
          </div>

          <h2 style={{ fontSize: '1.45rem' }}>
            {modoCadastro ? 'Criar Nova Conta' : 'Bem-vindo de volta'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            {modoCadastro ? 'Preencha seus dados para solicitar acesso' : 'Entre com suas credenciais para continuar'}
          </p>
        </div>

        {mensagem.texto && (
          <div style={{
            backgroundColor: mensagem.tipo === 'erro' ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.14)',
            color: mensagem.tipo === 'erro' ? '#f87171' : '#34d399',
            border: `1px solid ${mensagem.tipo === 'erro' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {mensagem.texto}
          </div>
        )}

        {modoCadastro && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Guilherme Silva"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Data de Nascimento (18 a 100 anos)</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Sexo</label>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                <option value="HOMEM">Homem</option>
                <option value="MULHER">Mulher</option>
                <option value="TRANS">Trans</option>
              </select>
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{
            marginTop: '0.5rem',
            padding: '12px',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            color: '#ffffff',
            border: 'none',
            fontWeight: '600',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)'
          }}
        >
          {carregando ? 'Aguarde...' : modoCadastro ? 'Criar Conta' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={() => {
            setModoCadastro(!modoCadastro);
            setMensagem({ tipo: '', texto: '' });
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-blue)',
            fontSize: '0.88rem',
            fontWeight: '500',
            padding: '6px'
          }}
        >
          {modoCadastro ? 'Já tem uma conta? Fazer login' : 'Não tem conta? Cadastre-se aqui'}
        </button>
      </form>
    </div>
  );
}
