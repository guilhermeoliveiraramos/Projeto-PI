import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Login() {
  // Controla se a tela mostra o formulário de Login (false) ou Cadastro (true)
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (modoCadastro) {
      // MODO CADASTRO (POST /api/usuarios)
      try {
        await api.post('/usuarios', {
          nomeUsuario,
          cargo,
          email,
          senha,
        });

        setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login para entrar.' });
        setModoCadastro(false); // Volta para a tela de login automaticamente
        setSenha('');
      } catch (err) {
        console.error('Erro ao cadastrar:', err);
        setMensagem({ tipo: 'erro', texto: 'Erro ao criar conta. Verifique se o e-mail já está em uso.' });
      }
          if (modoCadastro) {
      // Expressão Regular (Regex) para validar e-mail no React
      const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(email)) {
        setMensagem({ tipo: 'erro', texto: 'Digite um e-mail válido (ex: nome@dominio.com)!' });
        return; // Para a execução aqui e não envia para o Java
      }

      try {
        await api.post('/usuarios', {
          nomeUsuario,
          cargo,
          email,
          senha,
        });

        setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login para entrar.' });
        setModoCadastro(false);
        setSenha('');
      } catch (err) {
        const mensagemServidor = err.response?.data || 'Erro ao criar conta.';
        setMensagem({ tipo: 'erro', texto: mensagemServidor });
      }
    }

    } else {
      // MODO LOGIN (POST /api/usuarios/login)
      try {
        const resposta = await api.post('/usuarios/login', { email, senha });

        // Salva o usuário logado no navegador
        localStorage.setItem('usuarioLogado', JSON.stringify(resposta.data));

        // Redireciona para o painel principal
        navigate('/inicio');
      } catch (err) {
        console.error('Erro no login:', err);
        setMensagem({ tipo: 'erro', texto: 'E-mail ou senha inválidos!' });
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      fontFamily: 'sans-serif',
      padding: '1rem'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '0.5rem' }}>
          {modoCadastro ? 'Criar Nova Conta' : 'Acesso ao Projeto PI'}
        </h2>

        {mensagem.texto && (
          <div style={{
            backgroundColor: mensagem.tipo === 'erro' ? '#fee2e2' : '#dcfce7',
            color: mensagem.tipo === 'erro' ? '#b91c1c' : '#15803d',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {mensagem.texto}
          </div>
        )}

       
        {modoCadastro && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Guilherme Silva"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Cargo</label>
              <input
                type="text"
                placeholder="Ex: Engenheiro / Operador"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            padding: '12px',
            backgroundColor: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {modoCadastro ? 'Cadastrar' : 'Entrar'}
        </button>

        {/* Botão para alternar entre Login e Cadastro */}
        <button
          type="button"
          onClick={() => {
            setModoCadastro(!modoCadastro);
            setMensagem({ tipo: '', texto: '' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}
        >
          {modoCadastro ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se aqui'}
        </button>
      </form>
    </div>
  );
}
