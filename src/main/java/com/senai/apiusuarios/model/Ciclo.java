package com.senai.apiusuarios.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ciclos")
public class Ciclo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciclo", nullable = false)
    private Long idCiclo;

    // Chave estrangeira referenciando PNEUS(id_pneu)
    @ManyToOne
    @JoinColumn(name = "id_pneu", nullable = false)
    private Pneu pneu;

    // Chave estrangeira referenciando ARQUIVOS(id_arquivo) - Permite nulo (Sim/Não no PDF)
    @ManyToOne
    @JoinColumn(name = "id_arquivo", nullable = true)
    private Arquivo arquivo;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(name = "turno", length = 20, nullable = false)
    private String turno;

    @Column(name = "status_ciclo", length = 50, nullable = false)
    private String statusCiclo;

    @Column(name = "tempo_ciclo_min", precision = 8, scale = 2, nullable = true)
    private BigDecimal tempoCicloMin;

    @Column(name = "cura_pct", precision = 5, scale = 2, nullable = true)
    private BigDecimal curaPct;

    @Column(name = "eficiencia_pct", precision = 5, scale = 2, nullable = true)
    private BigDecimal eficienciaPct;

    public Ciclo() {
    }

    public Ciclo(Long idCiclo, Pneu pneu, Arquivo arquivo, LocalDateTime dataHora, String turno, String statusCiclo, BigDecimal tempoCicloMin, BigDecimal curaPct, BigDecimal eficienciaPct) {
        this.idCiclo = idCiclo;
        this.pneu = pneu;
        this.arquivo = arquivo;
        this.dataHora = dataHora;
        this.turno = turno;
        this.statusCiclo = statusCiclo;
        this.tempoCicloMin = tempoCicloMin;
        this.curaPct = curaPct;
        this.eficienciaPct = eficienciaPct;
    }

    public Long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public Pneu getPneu() {
        return pneu;
    }

    public void setPneu(Pneu pneu) {
        this.pneu = pneu;
    }

    public Arquivo getArquivo() {
        return arquivo;
    }

    public void setArquivo(Arquivo arquivo) {
        this.arquivo = arquivo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getStatusCiclo() {
        return statusCiclo;
    }

    public void setStatusCiclo(String statusCiclo) {
        this.statusCiclo = statusCiclo;
    }

    public BigDecimal getTempoCicloMin() {
        return tempoCicloMin;
    }

    public void setTempoCicloMin(BigDecimal tempoCicloMin) {
        this.tempoCicloMin = tempoCicloMin;
    }

    public BigDecimal getCuraPct() {
        return curaPct;
    }

    public void setCuraPct(BigDecimal curaPct) {
        this.curaPct = curaPct;
    }

    public BigDecimal getEficienciaPct() {
        return eficienciaPct;
    }

    public void setEficienciaPct(BigDecimal eficienciaPct) {
        this.eficienciaPct = eficienciaPct;
    }
}
