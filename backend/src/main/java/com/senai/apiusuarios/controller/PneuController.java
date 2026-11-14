package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Pneu;
import com.senai.apiusuarios.repository.PneuRepository;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pneus")
public class PneuController {
    private PneuRepository repository;

    public PneuController(PneuRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Pneu> listar(){
        return repository.findAll();
    }

    @PostMapping
    public Pneu criar(@RequestBody Pneu usuario){

        return repository.save(usuario);
    }

    @PutMapping("/{id}")
    public Pneu atualizar(
            @PathVariable Long id,
            @RequestBody Pneu pneu) {
        pneu.setIdPneu(id);
        return repository.save(pneu);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id){
        repository.deleteById(id);
    }

    @GetMapping("/{id}")
    public Pneu buscarPorId(@PathVariable Long id)
    {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }


}