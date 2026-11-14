package com.senai.apiusuarios.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pneus")
public class Pneu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pneu", nullable = false)
    private Long idPneu;

    @Column(name = "modelo_pneu", length = 100, nullable = false)
    private String modeloPneu;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    public Pneu() {
    }

    public Pneu(Long idPneu, String modeloPneu, Integer quantidade) {
        this.idPneu = idPneu;
        this.modeloPneu = modeloPneu;
        this.quantidade = quantidade;
    }

    public Long getIdPneu() {
        return idPneu;
    }

    public void setIdPneu(Long idPneu) {
        this.idPneu = idPneu;
    }

    public String getModeloPneu() {
        return modeloPneu;
    }

    public void setModeloPneu(String modeloPneu) {
        this.modeloPneu = modeloPneu;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
