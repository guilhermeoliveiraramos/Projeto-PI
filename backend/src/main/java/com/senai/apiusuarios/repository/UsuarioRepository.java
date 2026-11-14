package com.senai.apiusuarios.repository;
import com.senai.apiusuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {


Optional<Usuario> findByEmailAndSenha(String email, String senha);

boolean existsByEmail(String email);


}
