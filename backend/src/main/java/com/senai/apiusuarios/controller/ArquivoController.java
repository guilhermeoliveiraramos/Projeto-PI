package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Arquivo;
import com.senai.apiusuarios.repository.ArquivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/arquivos") // URL base para arquivos
public class ArquivoController {

    @Autowired
    private ArquivoRepository repository;

    @GetMapping
    public List<Arquivo> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Arquivo criar(@RequestBody Arquivo arquivo) {
        return repository.save(arquivo);
    }

    @GetMapping("/{id}")
    public Arquivo buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Arquivo não encontrado"));
    }

    @PutMapping("/{id}")
    public Arquivo atualizar(@PathVariable Long id, @RequestBody Arquivo arquivo) {
        arquivo.setIdArquivo(id); // Alinhado com o campo idArquivo do modelo
        return repository.save(arquivo);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
