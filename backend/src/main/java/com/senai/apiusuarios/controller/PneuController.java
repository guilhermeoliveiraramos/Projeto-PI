package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Cargo;
import com.senai.apiusuarios.model.Pneu;
import com.senai.apiusuarios.repository.PneuRepository;
import com.senai.apiusuarios.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pneus")
public class PneuController {

    private final PneuRepository repository;
    private final UsuarioRepository usuarioRepository;

    public PneuController(PneuRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    // Verifica se o usuário é GERENTE ou ENGENHEIRO (para criar/editar)
    private boolean podeEditar(Long idUsuarioLogado) {
        if (idUsuarioLogado == null) return false;
        return usuarioRepository.findById(idUsuarioLogado)
                .map(u -> u.getCargo() != null &&
                        (u.getCargo().equalsIgnoreCase(Cargo.GERENTE.name()) ||
                         u.getCargo().equalsIgnoreCase(Cargo.ENGENHEIRO.name())))
                .orElse(false);
    }

    // Verifica se o usuário é GERENTE (único que pode excluir)
    private boolean ehGerente(Long idUsuarioLogado) {
        if (idUsuarioLogado == null) return false;
        return usuarioRepository.findById(idUsuarioLogado)
                .map(u -> u.getCargo() != null && u.getCargo().equalsIgnoreCase(Cargo.GERENTE.name()))
                .orElse(false);
    }

    @GetMapping
    public List<Pneu> listar() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody Pneu pneu,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!podeEditar(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Operadores só podem visualizar pneus.");
        }

        return ResponseEntity.ok(repository.save(pneu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Pneu pneu,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!podeEditar(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Operadores só podem visualizar pneus.");
        }

        pneu.setIdPneu(id);
        return ResponseEntity.ok(repository.save(pneu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem excluir pneus.");
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public Pneu buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Pneu não encontrado"));
    }
}
