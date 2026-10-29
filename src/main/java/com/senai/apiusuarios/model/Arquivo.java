package com.senai.apiusuarios.model;

import jakarta.persistence.*;

@Entity
@Table(name = "arquivos")

public class Arquivo {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_arquivo", nullable = false)
        private Long idArquivo;

        // Chave estrangeira referenciando USUARIOS(id_usuario)
        @ManyToOne
        @JoinColumn(name = "id_usuario", nullable = false)
        private Usuario usuario;

        @Column(name = "nome_arquivo", length = 255, nullable = false)
        private String nomeArquivo;

        public Arquivo() {
        }

        public Arquivo(Long idArquivo, Usuario usuario, String nomeArquivo) {
            this.idArquivo = idArquivo;
            this.usuario = usuario;
            this.nomeArquivo = nomeArquivo;
        }

        public Long getIdArquivo() {
            return idArquivo;
        }

        public void setIdArquivo(Long idArquivo) {
            this.idArquivo = idArquivo;
        }

        public Usuario getUsuario() {
            return usuario;
        }

        public void setUsuario(Usuario usuario) {
            this.usuario = usuario;
        }

        public String getNomeArquivo() {
            return nomeArquivo;
        }

        public void setNomeArquivo(String nomeArquivo) {
            this.nomeArquivo = nomeArquivo;
        }
    }


