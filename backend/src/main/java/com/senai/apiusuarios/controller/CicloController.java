package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Cargo;
import com.senai.apiusuarios.model.Ciclo;
import com.senai.apiusuarios.repository.CicloRepository;
import com.senai.apiusuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ciclos") // URL base para a gestão de ciclos
public class CicloController {

    @Autowired
    public CicloRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    // Listar todos os ciclos registrados
    @GetMapping
    public List<Ciclo> listar() {
        return repository.findAll();
    }

    // Criar/Registrar um novo ciclo de vulcanização
    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody Ciclo ciclo,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!podeEditar(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Operadores só podem visualizar ciclos.");
        }

        return ResponseEntity.ok(repository.save(ciclo));
    }

    // Buscar um ciclo específico pelo ID
    @GetMapping("/{id}")
    public Ciclo buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ciclo não encontrado"));
    }

    // Atualizar os dados de um ciclo existente
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Ciclo ciclo,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!podeEditar(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Operadores só podem visualizar ciclos.");
        }

        ciclo.setIdCiclo(id);
        return ResponseEntity.ok(repository.save(ciclo));
    }

    // Excluir um registro de ciclo (restrito ao GERENTE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem excluir ciclos.");
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
