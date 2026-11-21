package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.Ciclo;
import com.senai.apiusuarios.model.Medicao;
import com.senai.apiusuarios.model.Pneu;
import com.senai.apiusuarios.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired private CicloRepository cicloRepository;
    @Autowired private MedicaoRepository medicaoRepository;
    @Autowired private PneuRepository pneuRepository;
    @Autowired private ArquivoRepository arquivoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    @GetMapping("/resumo")
    public Map<String, Object> getResumo(
            @RequestParam(defaultValue = "TODOS") String arquivoId,
            @RequestParam(defaultValue = "TODOS") String turno) {

        List<Ciclo> todosCiclos = cicloRepository.findAll();

        // Filtra ciclos no servidor (muito mais rápido)
        List<Ciclo> ciclosFiltrados = todosCiclos.stream()
                .filter(c -> {
                    boolean passaArq = arquivoId.equals("TODOS") ||
                            (c.getArquivo() != null && String.valueOf(c.getArquivo().getIdArquivo()).equals(arquivoId));
                    boolean passaTurno = turno.equals("TODOS") ||
                            (c.getTurno() != null && c.getTurno().equalsIgnoreCase(turno));
                    return passaArq && passaTurno;
                })
                .collect(Collectors.toList());

        Set<Long> idsCiclos = ciclosFiltrados.stream()
                .map(Ciclo::getIdCiclo)
                .collect(Collectors.toSet());

        List<Medicao> medicoesFiltradas = medicaoRepository.findAll().stream()
                .filter(m -> m.getCiclo() != null && idsCiclos.contains(m.getCiclo().getIdCiclo()))
                .collect(Collectors.toList());

        double mediaEficiencia = ciclosFiltrados.stream()
                .mapToDouble(c -> c.getEficienciaPct() != null ? c.getEficienciaPct().doubleValue() : 0.0)
                .average().orElse(0.0);

        double mediaTemperatura = medicoesFiltradas.stream()
                .mapToDouble(m -> m.getTemperaturaC() != null ? m.getTemperaturaC().doubleValue() : 0.0)
                .average().orElse(0.0);

        double totalConsumoKwh = medicoesFiltradas.stream()
                .mapToDouble(m -> m.getConsumoKwh() != null ? m.getConsumoKwh().doubleValue() : 0.0)
                .sum();

        int totalEstoquePneus = pneuRepository.findAll().stream()
                .mapToInt(p -> p.getQuantidade() != null ? p.getQuantidade() : 0)
                .sum();

        // Envia apenas os últimos 50 registros para os gráficos não travarem
        int inicioCiclos = Math.max(0, ciclosFiltrados.size() - 50);
        int inicioMedicoes = Math.max(0, medicoesFiltradas.size() - 50);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("totalCiclos", ciclosFiltrados.size());
        resposta.put("totalMedicoes", medicoesFiltradas.size());
        resposta.put("mediaEficiencia", Math.round(mediaEficiencia * 10.0) / 10.0);
        resposta.put("mediaTemperatura", Math.round(mediaTemperatura * 10.0) / 10.0);
        resposta.put("totalConsumoKwh", Math.round(totalConsumoKwh * 10.0) / 10.0);
        resposta.put("totalEstoquePneus", totalEstoquePneus);
        resposta.put("totalModelosPneus", pneuRepository.count());
        resposta.put("totalArquivos", arquivoRepository.count());
        resposta.put("totalUsuarios", usuarioRepository.count());
        resposta.put("arquivos", arquivoRepository.findAll());
        resposta.put("graficosCiclos", ciclosFiltrados.subList(inicioCiclos, ciclosFiltrados.size()));
        resposta.put("graficosMedicoes", medicoesFiltradas.subList(inicioMedicoes, medicoesFiltradas.size()));

        return resposta;
    }
}
