package com.senai.apiusuarios.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "medicoes") // Evite usar ç ou til em nomes de tabelas de banco se possível
public class Medicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medicao", nullable = false)
    private Long idMedicao;

    // Chave estrangeira referenciando CICLOS(id_ciclo)
    @ManyToOne
    @JoinColumn(name = "id_ciclo", nullable = false)
    private Ciclo ciclo;

    @Column(name = "temperatura_c", precision = 5, scale = 2, nullable = true)
    private BigDecimal temperaturaC;

    @Column(name = "pressao_bar", precision = 6, scale = 2, nullable = true)
    private BigDecimal pressaoBar;

    @Column(name = "vibracao_mm_s", precision = 6, scale = 2, nullable = true)
    private BigDecimal vibracaoMmS;

    @Column(name = "consumo_kwh", precision = 8, scale = 2, nullable = true)
    private BigDecimal consumoKwh;

    @Column(name = "tempo_valvula", precision = 8, scale = 2, nullable = true)
    private BigDecimal tempoValvula;

    public Medicao() {
    }

    public Medicao(Long idMedicao, Ciclo ciclo, BigDecimal temperaturaC, BigDecimal pressaoBar, BigDecimal vibracaoMmS, BigDecimal consumoKwh, BigDecimal tempoValvula) {
        this.idMedicao = idMedicao;
        this.ciclo = ciclo;
        this.temperaturaC = temperaturaC;
        this.pressaoBar = pressaoBar;
        this.vibracaoMmS = vibracaoMmS;
        this.consumoKwh = consumoKwh;
        this.tempoValvula = tempoValvula;
    }

    public Long getIdMedicao() {
        return idMedicao;
    }

    public void setIdMedicao(Long idMedicao) {
        this.idMedicao = idMedicao;
    }

    public Ciclo getCiclo() {
        return ciclo;
    }

    public void setCiclo(Ciclo ciclo) {
        this.ciclo = ciclo;
    }

    public BigDecimal getTemperaturaC() {
        return temperaturaC;
    }

    public void setTemperaturaC(BigDecimal temperaturaC) {
        this.temperaturaC = temperaturaC;
    }

    public BigDecimal getPressaoBar() {
        return pressaoBar;
    }

    public void setPressaoBar(BigDecimal pressaoBar) {
        this.pressaoBar = pressaoBar;
    }

    public BigDecimal getVibracaoMmS() {
        return vibracaoMmS;
    }

    public void setVibracaoMmS(BigDecimal vibracaoMmS) {
        this.vibracaoMmS = vibracaoMmS;
    }

    public BigDecimal getConsumoKwh() {
        return consumoKwh;
    }

    public void setConsumoKwh(BigDecimal consumoKwh) {
        this.consumoKwh = consumoKwh;
    }

    public BigDecimal getTempoValvula() {
        return tempoValvula;
    }

    public void setTempoValvula(BigDecimal tempoValvula) {
        this.tempoValvula = tempoValvula;
    }
}
