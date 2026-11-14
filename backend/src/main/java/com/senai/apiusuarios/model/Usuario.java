package com.senai.apiusuarios.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario") // Garante o nome correto da tabela no banco
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario", nullable = false) // Alinha o nome do campo e define como obrigatório
    private Long idUsuario;

    @Column(name = "nome_usuario", length = 100, nullable = false) // Define o nome, tamanho máximo e obrigatoriedade
    private String nomeUsuario;

    // Construtor padrão (obrigatóriov pelo JPA)
    public Usuario() {
    }

    // Construtor completo
    public Usuario(Long idUsuario, String nomeUsuario) {
        this.idUsuario = idUsuario;
        this.nomeUsuario = nomeUsuario;
    }

    // Getters e Setters atualizados
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }
}
