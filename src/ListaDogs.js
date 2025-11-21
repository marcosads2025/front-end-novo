import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Mantive o estado em português para facilitar seu uso no formulário
  const [editData, setEditData] = useState({ nome: '', raca: '', peso: '', idade: '', proprietario: '' });
  const [editFoto, setEditFoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/dogs` : 'https://dog-api-1.onrender.com/api/dogs'; // <--- GARANTINDO A URL

  const loadDogs = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(API_URL);
      setDogs(Array.isArray(data) ? data : (data?.dogs || data?.items || data?.data || []));
    } catch (e) {
      setError('Erro ao carregar cachorros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDogs();
  }, []);

  const startEdit = (dog) => {
    setEditingId(dog._id);
    // Aqui mapeamos o que vem do banco (provavelmente em inglês) para o estado do formulário
    setEditData({
      nome: dog.name || dog.nome || '', // Tenta ler 'name' (banco) ou 'nome'
      raca: dog.breed || dog.raca || '',
      peso: dog.weight || dog.peso || '',
      idade: dog.age || dog.idade || '',
      proprietario: dog.owner || dog.proprietario || ''
    });
    setEditFoto(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ nome: '', raca: '', peso: '', idade: '', proprietario: '' });
    setEditFoto(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setEditFoto(file);
  };

  // ============================================================
  // CORREÇÃO PRINCIPAL AQUI (Função saveEdit)
  // ============================================================
  const saveEdit = async () => {
    if (!editingId) return;
    try {
      setSaving(true);
      
      const formData = new FormData();

      // CORREÇÃO 1: Mapear explicitamente Português -> Inglês (como o banco exige)
      formData.append('name', editData.nome); 
      formData.append('breed', editData.raca);
      formData.append('owner', editData.proprietario); // Verifique se no banco é 'owner' ou 'proprietario'

      // CORREÇÃO 2: Garantir que números sejam números (Int/Float)
      formData.append('age', parseInt(editData.idade)); 
      formData.append('weight', parseFloat(editData.peso)); 

      // CORREÇÃO 3: Enviar a foto com o nome certo (geralmente 'image')
      if (editFoto) {
        formData.append('image', editFoto); 
      }

      // Nota: Axios configura o Content-Type automaticamente para FormData
      const { data } = await axios.put(`${API_URL}/${editingId}`, formData);

      // Atualiza a lista local
      setDogs((prev) => prev.map((d) => (d._id === editingId ? data : d)));
      cancelEdit();
      alert('Atualizado com sucesso!'); // Feedback visual
    } catch (e) {
      console.error(e); // Para ver o erro no console se der ruim
      setError('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const removeDog = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cachorro?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDogs((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      setError('Erro ao excluir cachorro');
    }
  };

  if (loading) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <div>
      <h2 className="mb-4">Lista de Cachorros (CRUD)</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {dogs.length === 0 ? (
        <div className="alert alert-info">Nenhum cachorro cadastrado.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Raça</th>
                <th>Peso (kg)</th>
                <th>Idade</th>
                <th>Proprietário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map((dog) => (
                <tr key={dog._id}>
                  <td style={{width: 120}}>
                    {/* Tenta ler image (inglês) ou fotoUrl (português) */}
                    {(dog.image || dog.fotoUrl) && (
                      <img 
                        src={dog.image || dog.fotoUrl} 
                        alt={dog.name || dog.nome} 
                        style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 6 }} 
                      />
                    )}
                  </td>
                  {editingId === dog._id ? (
                    <>
                      <td>
                        <input className="form-control" name="nome" value={editData.nome} onChange={handleEditChange} placeholder="Nome" />
                      </td>
                      <td>
                        <input className="form-control" name="raca" value={editData.raca} onChange={handleEditChange} placeholder="Raça" />
                      </td>
                      <td>
                        <input type="number" className="form-control" name="peso" value={editData.peso} onChange={handleEditChange} placeholder="Kg" />
                      </td>
                      <td>
                        <input type="number" className="form-control" name="idade" value={editData.idade} onChange={handleEditChange} placeholder="Anos" />
                      </td>
                      <td>
                        <input className="form-control" name="proprietario" value={editData.proprietario} onChange={handleEditChange} placeholder="Dono" />
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          <input type="file" accept="image/*" onChange={handleEditFotoChange} />
                          <div className="btn-group">
                            <button className="btn btn-sm btn-success" onClick={saveEdit} disabled={saving}>{saving ? '...' : 'Salvar'}</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancelar</button>
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Exibindo dados considerando que podem vir em inglês ou português */}
                      <td>{dog.name || dog.nome}</td>
                      <td>{dog.breed || dog.raca}</td>
                      <td>{dog.weight || dog.peso}</td>
                      <td>{dog.age || dog.idade}</td>
                      <td>{dog.owner || dog.proprietario}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(dog)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeDog(dog._id)}>Excluir</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaDogs;
