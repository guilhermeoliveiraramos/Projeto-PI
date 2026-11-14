package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Ciclo;
import com.senai.apiusuarios.repository.CicloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ciclos") // URL base para a gestão de ciclos
public class CicloController {

    @Autowired
    public CicloRepository repository;

    // Listar todos os ciclos registrados
    @GetMapping
    public List<Ciclo> listar() {
        return repository.findAll();
    }

    // Criar/Registrar um novo ciclo de vulcanização
    @PostMapping
    public Ciclo criar(@RequestBody Ciclo ciclo) {
        return repository.save(ciclo);
    }

    // Buscar um ciclo específico pelo ID
    @GetMapping("/{id}")
    public Ciclo buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ciclo não encontrado"));
    }

    // Atualizar os dados de um ciclo existente
    @PutMapping("/{id}")
    public Ciclo atualizar(@PathVariable Long id, @RequestBody Ciclo ciclo) {
        ciclo.setIdCiclo(id); // Alinhado com a nomenclatura idCiclo que definimos para o modelo
        return repository.save(ciclo);
    }

    // Excluir um registro de ciclo
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}