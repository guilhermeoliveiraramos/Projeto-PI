package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Usuario;
import com.senai.apiusuarios.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;

    // Valida formato padrão de e-mail (ex: nome@dominio.com)
    private static final Pattern EMAIL_REGEX = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        // 1. Verifica se o formato do e-mail é válido
        if (usuario.getEmail() == null || !EMAIL_REGEX.matcher(usuario.getEmail()).matches()) {
            return ResponseEntity.badRequest().body("Formato de e-mail inválido!");
        }

        // 2. Verifica se o e-mail já está cadastrado no banco
        if (repository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("Este e-mail já está cadastrado!");
        }

        Usuario usuarioSalvo = repository.save(usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dadosLogin) {
        return repository.findByEmailAndSenha(dadosLogin.getEmail(), dadosLogin.getSenha())
                .map(usuario -> {
                    usuario.setSenha(null); // Não devolve a senha para o navegador
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setIdUsuario(id);
        return repository.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
