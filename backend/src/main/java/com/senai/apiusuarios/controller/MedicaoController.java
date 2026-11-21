package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Cargo;
import com.senai.apiusuarios.model.Medicao;
import com.senai.apiusuarios.repository.MedicaoRepository;
import com.senai.apiusuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicoes") // URL base para as medições
public class MedicaoController {

    @Autowired
    private MedicaoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Apenas GERENTE pode criar, editar ou excluir medições
    private boolean ehGerente(Long idUsuarioLogado) {
        if (idUsuarioLogado == null) return false;
        return usuarioRepository.findById(idUsuarioLogado)
                .map(u -> u.getCargo() != null && u.getCargo().equalsIgnoreCase(Cargo.GERENTE.name()))
                .orElse(false);
    }

    // Listar todas as medições coletadas (todos podem ver)
    @GetMapping
    public List<Medicao> listar() {
        return repository.findAll();
    }

    // Salvar uma nova medição de sensores
    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody Medicao medicao,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem registrar medições.");
        }

        return ResponseEntity.ok(repository.save(medicao));
    }

    // Buscar os dados de uma medição específica pelo ID
    @GetMapping("/{id}")
    public Medicao buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medição não encontrada"));
    }

    // Atualizar dados de uma medição existente
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Medicao medicao,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem editar medições.");
        }

        medicao.setIdMedicao(id);
        return ResponseEntity.ok(repository.save(medicao));
    }

    // Deletar o registro de uma medição
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem excluir medições.");
        }

        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
