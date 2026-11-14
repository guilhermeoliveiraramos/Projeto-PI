package com.senai.apiusuarios.repository;

import com.senai.apiusuarios.model.Ciclo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CicloRepository extends JpaRepository<Ciclo, Long> {
}