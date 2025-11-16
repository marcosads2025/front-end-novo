// src/Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/dogs`
    : "/api/dogs";

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
  }, []);

  if (loading)
    return <div className="text-center mt-5 fs-4 text-secondary">Carregando...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#f5fdf8", // FUNDO NOVO SEM IMAGEM
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
          📋 administrar cadastrados
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger text-center" style={{ fontSize: "1.1rem" }}>
          Erro ao buscar os dados.
        </div>
      )}

      {dogs.length === 0 ? (
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
                {dog.fotoUrl && (
                  <img
                    src={dog.fotoUrl}
                    alt={dog.nome}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
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
