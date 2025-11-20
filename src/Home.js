// src/Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Definimos a URL base do Backend (Render)
  const BASE_URL = process.env.REACT_APP_API_URL || "https://dog-api-1.onrender.com";
  
  // 2. URL da API para buscar os dados
  const API_URL = `${BASE_URL}/api/dogs`;

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL);

        const data = response.data;
        let dogsArray = [];

        if (Array.isArray(data)) dogsArray = data;
        else if (Array.isArray(data.dogs)) dogsArray = data.dogs;
        else if (Array.isArray(data.items)) dogsArray = data.items;
        else if (data?.data && Array.isArray(data.data)) dogsArray = data.data;

        setDogs(dogsArray);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [API_URL]);

  // Função auxiliar para montar a URL da imagem corretamente
  const getImageUrl = (path) => {
    if (!path) return "";
    // Se a imagem já tiver "http" (for um link externo), usa ela direto
    if (path.startsWith("http")) return path;
    
    // Se não, monta o endereço do Render + a pasta uploads (se necessário)
    // OBS: Verifique se no seu banco o path já vem com "uploads/" ou não.
    // Se vier sem, use: return `${BASE_URL}/uploads/${path}`;
    return `${BASE_URL}/${path}`; 
  };

  if (loading)
    return <div className="text-center mt-5 fs-4 text-secondary">Carregando...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#f5fdf8",
      }}
    >
      {/* CABEÇALHO */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "700",
            fontSize: "2.3rem",
            color: "#2a7f62",
          }}
        >
          🏥 Clínica Veterinária
        </h1>
        <p
          style={{
            textAlign: "center",
            marginTop: "-5px",
            fontSize: "1rem",
            color: "#4e4e4e",
          }}
        >
          Saúde, cuidado e carinho para o seu melhor amigo ❤️🐾
        </p>
      </div>

      {/* Botões */}
      <div className="d-flex justify-content-end mb-4">
        <Link
          to="/cadastro"
          className="btn"
          style={{
            background: "#2a7f62",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: "500",
          }}
        >
          ➕ Cadastrar Novo pet
        </Link>

        <Link
          to="/lista"
          className="btn ms-2"
          style={{
            background: "#0d6efd",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: "500",
          }}
        >
          📋 Administrar cadastrados
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger text-center" style={{ fontSize: "1.1rem" }}>
          Erro ao buscar os dados. Verifique se o Backend está online.
        </div>
      )}

      {dogs.length === 0 && !loading && !error ? (
        <div className="alert alert-info text-center" style={{ fontSize: "1.1rem" }}>
          Nenhum cachorro cadastrado ainda.
        </div>
      ) : (
        <div className="row">
          {dogs.map((dog) => (
            <div key={dog._id || dog.id} className="col-md-4 mb-4">
              <div
                className="card shadow-lg h-100"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "none",
                  background: "white",
                }}
              >
                {/* CORREÇÃO AQUI: Usando a função para buscar a imagem no Render */}
                {dog.fotoUrl && (
                  <img
                    src={getImageUrl(dog.fotoUrl)}
                    alt={dog.nome}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    // Adicionei um tratamento de erro caso a imagem não exista
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Sem+Foto"; }}
                  />
                )}

                <div className="card-body">
                  <h4 className="card-title" style={{ fontWeight: "700", color: "#2a7f62" }}>
                    {dog.nome}
                  </h4>

                  <p className="card-text" style={{ lineHeight: "1.5" }}>
                    <strong>Raça:</strong> {dog.raca || "—"} <br />
                    <strong>Peso:</strong> {dog.peso || "—"} kg <br />
                    <strong>Idade:</strong> {dog.idade || "—"} anos <br />
                    <strong>Dono:</strong> {dog.proprietario || "—"}
                  </p>
                </div>

                <div
                  style={{
                    background: "#2a7f62",
                    padding: "8px",
                    textAlign: "center",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Paciente Veterinário 🐶
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
