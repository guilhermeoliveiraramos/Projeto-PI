package com.senai.apiusuarios.controller;

import com.senai.apiusuarios.model.*;
import com.senai.apiusuarios.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/arquivos")
public class ArquivoController {

    @Autowired
    private ArquivoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PneuRepository pneuRepository;

    @Autowired
    private CicloRepository cicloRepository;

    @Autowired
    private MedicaoRepository medicaoRepository;

    private boolean ehGerente(Long idUsuarioLogado) {
        if (idUsuarioLogado == null) return false;
        return usuarioRepository.findById(idUsuarioLogado)
                .map(u -> u.getCargo() != null && u.getCargo().equalsIgnoreCase(Cargo.GERENTE.name()))
                .orElse(false);
    }

    @GetMapping
    public List<Arquivo> listar() {
        return repository.findAll();
    }

    @PostMapping("/importar")
    public ResponseEntity<?> importarCsv(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem importar arquivos CSV.");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Selecione um arquivo CSV válido!");
        }

        try {
            Usuario usuario = usuarioRepository.findById(idUsuarioLogado).orElse(null);

            // 1. Salva o registro do Arquivo no RDS
            Arquivo arquivo = new Arquivo();
            arquivo.setNomeArquivo(file.getOriginalFilename());
            arquivo.setUsuario(usuario);
            arquivo = repository.save(arquivo);

            // Cache de pneus já cadastrados no RDS
            Map<String, Pneu> mapaPneus = new HashMap<>();
            for (Pneu p : pneuRepository.findAll()) {
                mapaPneus.put(p.getModeloPneu().trim().toLowerCase(), p);
            }

            List<Ciclo> listaCiclos = new ArrayList<>();
            List<Medicao> listaMedicoes = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

                String linha = reader.readLine(); // Pula o cabeçalho

                while ((linha = reader.readLine()) != null) {
                    if (linha.isBlank()) continue;

                    String[] col = linha.split(",");
                    if (col.length < 13) continue;

                    // Coluna 2: modelo_pneu
                    String modeloBruto = col[2].trim();
                    String chavePneu = modeloBruto.toLowerCase();

                    Pneu pneu = mapaPneus.get(chavePneu);
                    if (pneu == null) {
                        pneu = new Pneu();
                        pneu.setModeloPneu(modeloBruto);
                        pneu.setQuantidade(1);
                        pneu = pneuRepository.save(pneu);
                        mapaPneus.put(chavePneu, pneu);
                    } else {
                        pneu.setQuantidade((pneu.getQuantidade() != null ? pneu.getQuantidade() : 0) + 1);
                    }

                    // Cria o Ciclo vinculado ao Arquivo e ao Pneu
                    Ciclo ciclo = new Ciclo();
                    ciclo.setDataHora(LocalDateTime.parse(col[1].trim(), formatter));
                    ciclo.setPneu(pneu);
                    ciclo.setArquivo(arquivo);
                    ciclo.setTurno(col[3].trim());

                    String status = col[4].trim();
                    ciclo.setStatusCiclo(status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase());
                    ciclo.setTempoCicloMin(new BigDecimal(col[7].trim()));
                    ciclo.setCuraPct(new BigDecimal(col[11].trim()));
                    ciclo.setEficienciaPct(new BigDecimal(col[12].trim()));

                    // Cria a Medição vinculada ao Ciclo
                    Medicao medicao = new Medicao();
                    medicao.setCiclo(ciclo);
                    medicao.setTemperaturaC(new BigDecimal(col[5].trim()));
                    medicao.setPressaoBar(new BigDecimal(col[6].trim()));
                    medicao.setTempoValvula(new BigDecimal(col[8].trim()));
                    medicao.setVibracaoMmS(new BigDecimal(col[9].trim()));
                    medicao.setConsumoKwh(new BigDecimal(col[10].trim()));


                    listaCiclos.add(ciclo);
                    listaMedicoes.add(medicao);
                }
            }

            // Envia tudo em lote para o Amazon RDS
            pneuRepository.saveAll(mapaPneus.values());
            cicloRepository.saveAll(listaCiclos);
            medicaoRepository.saveAll(listaMedicoes);

            return ResponseEntity.ok("Salvo no RDS com sucesso! " + listaCiclos.size() + " ciclos e medições importados.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao importar CSV para o RDS: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody Arquivo arquivo,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem cadastrar arquivos.");
        }
        return ResponseEntity.ok(repository.save(arquivo));
    }

    @GetMapping("/{id}")
    public Arquivo buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Arquivo não encontrado"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Arquivo arquivo,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem editar arquivos.");
        }
        arquivo.setIdArquivo(id);
        return ResponseEntity.ok(repository.save(arquivo));
    }

       @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long idUsuarioLogado) {

        if (!ehGerente(idUsuarioLogado)) {
            return ResponseEntity.status(403).body("Sem permissão! Apenas Gerentes podem excluir arquivos.");
        }

        // 1. Busca os ciclos vinculados a esse arquivo
        List<Ciclo> ciclosDoArquivo = cicloRepository.findAll().stream()
                .filter(c -> c.getArquivo() != null && id.equals(c.getArquivo().getIdArquivo()))
                .toList();

        java.util.Set<Long> idsCiclos = ciclosDoArquivo.stream()
                .map(Ciclo::getIdCiclo)
                .collect(java.util.stream.Collectors.toSet());

        // 2. Apaga primeiro as medições desses ciclos
        List<Medicao> medicoesParaApagar = medicaoRepository.findAll().stream()
                .filter(m -> m.getCiclo() != null && idsCiclos.contains(m.getCiclo().getIdCiclo()))
                .toList();
        medicaoRepository.deleteAll(medicoesParaApagar);

        // 3. Apaga os ciclos do arquivo
        cicloRepository.deleteAll(ciclosDoArquivo);

        // 4. Apaga o arquivo
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

