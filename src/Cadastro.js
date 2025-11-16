import React, { useState, useEffect, useRef } from 'react';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const isDirty = useRef(false);

  const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/dogs` : '/api/dogs';

  // Previne perda de dados ao fechar/atualizar a página
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty.current && !submitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [submitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    isDirty.current = true;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    isDirty.current = true;
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

  // Validação simples antes do envio
  const validateForm = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!String(value || '').trim()) {
        setError(`Campo "${key}" é obrigatório.`);
        // tenta focar no campo com o mesmo id
        const el = document.getElementById(key);
        if (el) el.focus();
        return false;
      }
    }
    if (!foto) {
      setError('Por favor, selecione uma foto.');
      return false;
    }
    // validações adicionais sem alterar estrutura:
    const pesoNum = Number(formData.peso);
    if (isNaN(pesoNum) || pesoNum <= 0) {
      setError('Peso inválido. Informe um número maior que 0.');
      const el = document.getElementById('peso');
      if (el) el.focus();
      return false;
    }
    const idadeNum = Number(formData.idade);
    if (isNaN(idadeNum) || idadeNum < 0) {
      setError('Idade inválida. Informe um número válido.');
      const el = document.getElementById('idade');
      if (el) el.focus();
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);

    if (!validateForm()) return;

    // Testa conexão simples ao backend (GET na rota base)
    try {
      // se a API não responder, lançará
      await axios.get(API_URL);
    } catch (connErr) {
      setError('Não foi possível conectar ao servidor. Verifique a API.');
      return;
    }

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value);
    });
    dataToSend.append('foto', foto);

    try {
      setSubmitting(true);
      // upload com progresso
      await axios.post(API_URL, dataToSend, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      isDirty.current = false;

      setTimeout(() => {
        setFormData(initialFormState);
        setFoto(null);
        setPreview(null);
        setUploadProgress(0);
        navigate('/');
      }, 1600);
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message || '';
      console.error('Erro ao cadastrar cachorro:', err);
      setError(`Erro ao cadastrar. ${serverMsg ? `Detalhes: ${serverMsg}` : 'Verifique se o backend está rodando.'}`);
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
                  <p className="lead">
                    {uploadProgress > 0 && uploadProgress < 100
                      ? `Enviando dados... ${uploadProgress}%`
                      : 'Enviando dados...'}
                  </p>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>

                  {/* barra de progresso visual (não altera estrutura do seu layout) */}
                  {uploadProgress > 0 && (
                    <div className="progress mt-3" style={{ height: '10px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Campos do formulário (seu código original) */}
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
                        <img src={preview} alt="Pré-visualização" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', objectFit: 'cover', transition: 'transform 0.25s ease' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
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
