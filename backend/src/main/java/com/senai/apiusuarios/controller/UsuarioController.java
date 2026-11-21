package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Cargo;
import com.senai.apiusuarios.model.Usuario;
import com.senai.apiusuarios.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // --- FUNÇÃO AUXILIAR DE VERIFICAÇÃO DE CARGO ---
    private boolean ehGerente(Long idUsuarioLogado) {
        if (idUsuarioLogado == null) return false;
        return repository.findById(idUsuarioLogado)
                .map(u -> u.getCargo() != null && u.getCargo().equalsIgnoreCase(Cargo.GERENTE.name()))
                .orElse(false);
    }

    @GetMapping
    public List<Usuario> listar() {
        List<Usuario> usuarios = repository.findAll();
        usuarios.forEach(u -> u.setSenha(null)); // Nunca expõe nem o hash na listagem
        return usuarios;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        // 1. Valida formato de e-mail
        if (usuario.getEmail() == null || !EMAIL_REGEX.matcher(usuario.getEmail()).matches()) {
            return ResponseEntity.badRequest().body("Formato de e-mail inválido!");
        }

        // 2. Verifica se o e-mail já existe
        if (repository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("Este e-mail já está cadastrado!");
        }

        // 3. Valida idade >= 18 anos
        if (usuario.getDataNascimento() == null) {
            return ResponseEntity.badRequest().body("A data de nascimento é obrigatória!");
        }
        int idade = Period.between(usuario.getDataNascimento(), LocalDate.now()).getYears();
        if (idade < 18) {
            return ResponseEntity.badRequest().body("Cadastro permitido apenas para maiores de 18 anos!");
        }

        // 4. Valida sexo (HOMEM, MULHER ou TRANS)
        if (usuario.getSexo() == null ||
                (!usuario.getSexo().equalsIgnoreCase("HOMEM") &&
                 !usuario.getSexo().equalsIgnoreCase("MULHER") &&
                 !usuario.getSexo().equalsIgnoreCase("TRANS"))) {
            return ResponseEntity.badRequest().body("Selecione um sexo válido (Homem, Mulher ou Trans)!");
        }
        usuario.setSexo(usuario.getSexo().toUpperCase());

        // 5. Atribui o cargo OPERADOR diretamente para todo novo usuário
        usuario.setCargo(Cargo.OPERADOR.name());

        // 6. Criptografa a senha e salva
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        Usuario usuarioSalvo = repository.save(usuario);
        usuarioSalvo.setSenha(null);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dadosLogin) {
        return repository.findByEmail(dadosLogin.getEmail())
                .filter(usuario -> passwordEncoder.matches(dadosLogin.getSenha(), usuario.getSenha()))
                .map(usuario -> {
                    usuario.setSenha(null);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    // --- MÉTODO PARA ATRIBUIR CARGO DE GERENTE A UM USUÁRIO ---
    @PatchMapping("/{id}/atribuir-gerente")
    public ResponseEntity<?> atribuirGerente(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Acesso negado! Apenas um Gerente pode atribuir este cargo.");
        }

        return repository.findById(id)
                .map(usuario -> {
                    usuario.setCargo(Cargo.GERENTE.name());
                    Usuario atualizado = repository.save(usuario);
                    atualizado.setSenha(null);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- MÉTODO PARA ALTERAR QUALQUER CARGO (GERENTE / ENGENHEIRO / OPERADOR) ---
    @PatchMapping("/{id}/cargo")
    public ResponseEntity<?> alterarCargo(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Acesso negado! Apenas um Gerente pode alterar cargos.");
        }

        String novoCargo = body.get("cargo");
        if (novoCargo == null) {
            return ResponseEntity.badRequest().body("Informe o novo cargo.");
        }

        return repository.findById(id)
                .map(usuario -> {
                    usuario.setCargo(novoCargo.toUpperCase());
                    Usuario atualizado = repository.save(usuario);
                    atualizado.setSenha(null);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- EXCLUSÃO RESTRITA AO CARGO GERENTE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem excluir usuários.");
        }

        if (id.equals(idUsuarioLogado)) {
            return ResponseEntity.badRequest().body("Você não pode excluir seu próprio usuário!");
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setIdUsuario(id);
        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        return repository.save(usuario);
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
