package com.senai.apiusuarios.repository;

import com.senai.apiusuarios.model.Medicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicaoRepository extends JpaRepository<Medicao, Long> {
}
