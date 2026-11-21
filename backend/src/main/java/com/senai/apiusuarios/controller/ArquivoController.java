package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Arquivo;
import com.senai.apiusuarios.model.Cargo;
import com.senai.apiusuarios.repository.ArquivoRepository;
import com.senai.apiusuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/arquivos") // URL base para arquivos
public class ArquivoController {

    @Autowired
    private ArquivoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Apenas GERENTE pode criar, editar ou excluir arquivos
    private boolean ehGerente(Long idUsuarioLogado) {
        if (idUsuarioLogado == null) return false;
        return usuarioRepository.findById(idUsuarioLogado)
                .map(u -> u.getCargo() != null && u.getCargo().equalsIgnoreCase(Cargo.GERENTE.name()))
                .orElse(false);
    }

    @GetMapping
    public List<Arquivo> listar() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody Arquivo arquivo,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem cadastrar arquivos.");
        }

        return ResponseEntity.ok(repository.save(arquivo));
    }

    @GetMapping("/{id}")
    public Arquivo buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Arquivo não encontrado"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Arquivo arquivo,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem editar arquivos.");
        }

        arquivo.setIdArquivo(id);
        return ResponseEntity.ok(repository.save(arquivo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem excluir arquivos.");
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
