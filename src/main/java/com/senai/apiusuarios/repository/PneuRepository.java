package com.senai.apiusuarios.repository;

import com.senai.apiusuarios.model.Pneu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PneuRepository extends JpaRepository<Pneu, Long> {

}

