// src/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/api/dogs';
  const BACKEND_BASE_URL = 'http://localhost:3000/';

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
        else if (data && data.data && Array.isArray(data.data)) dogsArray = data.data;

        setDogs(dogsArray);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  if (loading) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <div className="home-container">
      <div className="d-flex justify-content-end mb-4">
        <Link to="/cadastro" className="btn btn-success">
          Cadastrar Novo Cachorro
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          Erro ao buscar cachorros. Verifique o backend e o console.
        </div>
      )}

      {dogs.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Nenhum cachorro cadastrado ainda.
        </div>
      ) : (
        <div className="row">
          {dogs.map((dog) => (
            <div key={dog._id || dog.id || Math.random()} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                {dog.foto ? (
                  <img
                    src={
                      String(dog.foto).startsWith('http')
                        ? dog.foto
                        : `${BACKEND_BASE_URL}${String(dog.foto).replace(/\\/g, '/')}`
                    }
                    className="card-img-top"
                    alt={dog.nome || 'Cachorro'}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/fallback-image.png'; // opcional: imagem de fallback
                    }}
                  />
                ) : null}
                <div className="card-body">
                  <h5 className="card-title text-primary">{dog.nome || '—'}</h5>
                  <p className="card-text">
                    <strong>Raça:</strong> {dog.raca || '—'}
                    <br />
                    <strong>Peso:</strong> {dog.peso || '—'} {dog.peso ? 'kg' : ''}
                    <br />
                    <strong>Idade:</strong> {dog.idade || '—'} {dog.idade ? 'anos' : ''}
                    <br />
                    <strong>Dono:</strong> {dog.proprietario || '—'}
                  </p>
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
