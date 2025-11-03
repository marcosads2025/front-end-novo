import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const initialFormState = {
    nome: '',
    raca: '',
    peso: '',
    idade: '',
    proprietario: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(''); // Estado para mensagem de erro
  const [success, setSuccess] = useState(''); // Estado para mensagem de sucesso
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3000/api/dogs';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!foto) {
      setError('Por favor, selecione uma foto antes de enviar.');
      return;
    }

    // Usamos FormData porque estamos enviando um arquivo (imagem) junto com o texto.
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value);
    });
    dataToSend.append('foto', foto);

    try {
      setSubmitting(true);
      await axios.post(API_URL, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      
      // Limpa o formulário e redireciona após um pequeno delay
      setTimeout(() => {
        setFormData(initialFormState);
        setFoto(null);
        setPreview(null);
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('Erro ao cadastrar cachorro:', err.response || err.message);
      setError('Erro ao cadastrar. Verifique se o backend está rodando.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center">
              <h2 className="mb-0">Cadastro de Cachorro</h2>
            </div>
            <div className="card-body p-4">
              {submitting ? (
                <div className="text-center">
                  <p className="lead">Enviando dados...</p>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Campos do formulário (seu código original, que já estava perfeito) */}
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="raca" className="form-label">Raça</label>
                    <input type="text" className="form-control" id="raca" name="raca" value={formData.raca} onChange={handleChange} required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="peso" className="form-label">Peso (kg)</label>
                      <input type="number" step="0.1" className="form-control" id="peso" name="peso" value={formData.peso} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="idade" className="form-label">Idade (anos)</label>
                      <input type="number" className="form-control" id="idade" name="idade" value={formData.idade} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="proprietario" className="form-label">Proprietário</label>
                    <input type="text" className="form-control" id="proprietario" name="proprietario" value={formData.proprietario} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="foto" className="form-label">Foto do Cachorro</label>
                    <input type="file" className="form-control" id="foto" name="foto" accept="image/*" onChange={handleFileChange} required />
                    {preview && (
                      <div className="mt-3 text-center">
                        <img src={preview} alt="Pré-visualização" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  {/* Mensagens de erro e sucesso */}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success btn-lg" disabled={submitting}>
                      {submitting ? 'Enviando...' : 'Salvar'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/')}>
                      Voltar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
