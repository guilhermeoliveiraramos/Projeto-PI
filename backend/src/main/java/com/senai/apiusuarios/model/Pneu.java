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

    public Pneu() {
    }

    public Pneu(Long idPneu, String modeloPneu) {
        this.idPneu = idPneu;
        this.modeloPneu = modeloPneu;
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
}
