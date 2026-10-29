package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Medicao;
import com.senai.apiusuarios.repository.MedicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicoes") // URL base para as medições
public class MedicaoController {

    @Autowired
    private MedicaoRepository repository;

    // Listar todas as medições coletadas
    @GetMapping
    public List<Medicao> listar() {
        return repository.findAll();
    }

    // Salvar uma nova medição de sensores
    @PostMapping
    public Medicao criar(@RequestBody Medicao medicao) {
        return repository.save(medicao);
    }

    // Buscar os dados de uma medição específica pelo ID
    @GetMapping("/{id}")
    public Medicao buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medição não encontrada"));
    }

    // Atualizar dados de uma medição existente
    @PutMapping("/{id}")
    public Medicao atualizar(@PathVariable Long id, @RequestBody Medicao medicao) {
        medicao.setIdMedicao(id); // Alinhado com a nomenclatura idMedicao do modelo
        return repository.save(medicao);
    }

    // Deletar o registro de uma medição
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
