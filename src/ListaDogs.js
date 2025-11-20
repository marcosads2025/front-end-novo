import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AuthScreen from "./components/AuthScreen";
import DogTable from "./components/DogTable";
import DogFilters from "./components/DogFilters";
import Modals from "./components/Modals";

/**
 * ListaDogs.js (CORRIGIDO)
 * - URL apontando para o Render
 * - saveEdit usando FormData (suporte a arquivos)
 */
const ListaDogs = () => {
  
  // --- CORREÇÃO 1: DEFININDO A URL DO RENDER ---
  // Isso garante que o frontend sempre busque os dados e imagens no lugar certo
  const BASE_URL = "https://dog-api-1.onrender.com";
  const API_URL = `${BASE_URL}/api/dogs`;

  /* ------------------- Autenticação CRMV ------------------- */
  const [crmv, setCrmv] = useState(() => localStorage.getItem("crmv") || "");
  const [crmvInput, setCrmvInput] = useState("");
  const [veterinarios, setVeterinarios] = useState(() => {
    try {
      const raw = localStorage.getItem("veterinarios_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showVetRegister, setShowVetRegister] = useState(false);
  const [vetName, setVetName] = useState("");
  const [vetCrmvInput, setVetCrmvInput] = useState("");

  const validarCRMV = (s) => /^CRMV-[A-Z]{2} \d{5}$/.test(s);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validarCRMV(crmvInput)) {
      alert("Formato inválido. Exemplo aceito: CRMV-SP 12345");
      return;
    }
    localStorage.setItem("crmv", crmvInput);
    setCrmv(crmvInput);
    setCrmvInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("crmv");
    setCrmv("");
  };

  const saveVeterinarios = (list) => {
    setVeterinarios(list);
    try {
      localStorage.setItem("veterinarios_v1", JSON.stringify(list));
    } catch (e) {
      console.warn("Não foi possível salvar veterinários no localStorage", e);
    }
  };

  const registerVeterinario = (e) => {
    e.preventDefault();
    if (!vetName.trim()) {
      alert("Informe o nome do veterinário.");
      return;
    }
    if (!validarCRMV(vetCrmvInput)) {
      alert("Formato CRMV inválido. Ex: CRMV-SP 12345");
      return;
    }
    const exists = veterinarios.some((v) => v.crmv === vetCrmvInput);
    if (exists) {
      if (!window.confirm("CRMV já cadastrado. Deseja logar com esse CRMV?")) return;
    } else {
      const novo = { id: `VET-${Date.now()}`, nome: vetName.trim(), crmv: vetCrmvInput };
      const lista = [novo, ...veterinarios];
      saveVeterinarios(lista);
    }
    localStorage.setItem("crmv", vetCrmvInput);
    setCrmv(vetCrmvInput);
    setVetName("");
    setVetCrmvInput("");
    setShowVetRegister(false);
  };

  /* ------------------- Estados principais ------------------- */
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  // Adicionei 'novaImagem' ao estado para caso você queira implementar upload na edição
  const [editData, setEditData] = useState({
    nome: "",
    raca: "",
    peso: "",
    idade: "",
    proprietario: "",
    fotoUrl: "",
    novaImagem: null // Campo para armazenar o arquivo novo se houver edição de foto
  });
  
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [filtroRaca, setFiltroRaca] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "nome", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Agendamento / comprovante
  const [schedulingDog, setSchedulingDog] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [comprovante, setComprovante] = useState(null);

  // Menu de ações
  const [dogMenuOpen, setDogMenuOpen] = useState(null);

  // Agendamentos locais
  const [appointments, setAppointments] = useState(() => {
    try {
      const raw = localStorage.getItem("dog_appointments_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [viewingDog, setViewingDog] = useState(null);

  const saveAppointments = (list) => {
    setAppointments(list);
    try {
      localStorage.setItem("dog_appointments_v1", JSON.stringify(list));
    } catch (e) {
      console.warn("Não foi possível salvar agendamentos no localStorage", e);
    }
  };

  /* ------------------- Carregar dogs ------------------- */
  const loadDogs = async () => {
    try {
      setLoading(true);
      setError("");
      // Usa a API_URL corrigida (Render)
      const res = await axios.get(API_URL);
      const data = res.data;
      setDogs(Array.isArray(data) ? data : data?.dogs || []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar cachorros (verifique se o backend no Render está ativo).");
      setDogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------- Edição (CORRIGIDO PARA FORMDATA) ------------------- */
  const startEdit = (dog) => {
    setEditingId(dog._id);
    setEditData({
      nome: dog.nome || "",
      raca: dog.raca || "",
      peso: dog.peso ?? "",
      idade: dog.idade ?? "",
      proprietario: dog.proprietario || "",
      fotoUrl: dog.fotoUrl || "",
      novaImagem: null // Reseta a imagem nova
    });
    setDogMenuOpen(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ nome: "", raca: "", peso: "", idade: "", proprietario: "", fotoUrl: "", novaImagem: null });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      setSaving(true);

      // --- CORREÇÃO 2: Usando FormData para suportar envio de Arquivos e Texto ---
      const formData = new FormData();
      formData.append("nome", editData.nome);
      formData.append("raca", editData.raca);
      formData.append("peso", editData.peso);
      formData.append("idade", editData.idade);
      formData.append("proprietario", editData.proprietario);

      // Se houver uma nova imagem selecionada no input de edição, anexa ela
      if (editData.novaImagem) {
         formData.append("imagem", editData.novaImagem);
      }

      // Importante: Não definimos 'Content-Type' manualmente aqui, o axios/browser faz isso
      // ao detectar FormData, ou usamos explicitamente 'multipart/form-data'
      const res = await axios.put(`${API_URL}/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data;
      
      // Atualiza a lista localmente
      if (updated && updated._id) {
        setDogs((prev) => prev.map((d) => (d._id === editingId ? updated : d)));
      } else {
        // Fallback caso a API não retorne o objeto completo
        setDogs((prev) => prev.map((d) => (d._id === editingId ? { ...d, ...editData } : d)));
      }
      cancelEdit();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações. Verifique se todos os campos estão corretos.");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------- Excluir ------------------- */
  const removeDog = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cachorro?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDogs((prev) => prev.filter((d) => d._id !== id));
      const left = appointments.filter((a) => a.dogId !== id);
      saveAppointments(left);
      setDogMenuOpen(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir cachorro.");
    }
  };

  /* ------------------- Vacinado toggle ------------------- */
  const toggleVacinado = async (dog) => {
    try {
      const novo = !dog.vacinado;
      // Toggle geralmente é leve, JSON funciona bem, mas a URL agora está correta (Render)
      const res = await axios.put(`${API_URL}/${dog._id}`, { vacinado: novo }, {
        headers: { "Content-Type": "application/json" }
      });
      const data = res.data;
      setDogs((prev) =>
        prev.map((d) =>
          d._id === dog._id ? { ...d, vacinado: novo, ultimaVacina: data?.ultimaVacina ?? d.ultimaVacina } : d
        )
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao alterar status de vacinação.");
    }
  };

  /* ------------------- Datas / util ------------------- */
  const formatarData = (data) => {
    if (!data) return "—";
    if (typeof data === "string" && /^\d{4}-\d{2}-\d{2}/.test(data)) {
      const parts = data.split("-");
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    try {
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return String(data);
    }
  };

  const verificarVacinaVencida = (dog) => {
    if (!dog.ultimaVacina) return false;
    const d = new Date(dog.ultimaVacina);
    const hoje = new Date();
    const diffMeses = (hoje.getFullYear() - d.getFullYear()) * 12 + (hoje.getMonth() - d.getMonth());
    return diffMeses >= 12;
  };

  /* ------------------- Filtro / Sort / Paginação ------------------- */
  const filtrarPorRaca = dogs.filter((dog) =>
    filtroRaca ? (dog.raca || "").toLowerCase().includes(filtroRaca.toLowerCase()) : true
  );

  const sortedDogs = useMemo(() => {
    const list = [...filtrarPorRaca];
    const key = sortConfig.key;
    if (!key) return list;
    list.sort((a, b) => {
      const va = a[key] ?? "";
      const vb = b[key] ?? "";
      if (typeof va === "number" && typeof vb === "number")
        return sortConfig.direction === "ascending" ? va - vb : vb - va;
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortConfig.direction === "ascending" ? -1 : 1;
      if (sa > sb) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filtrarPorRaca, sortConfig]);

  const requestSort = (key) => {
    let dir = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") dir = "descending";
    setSortConfig({ key, direction: dir });
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedDogs.length / itemsPerPage));
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDogs.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedDogs]);

  const goToPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  /* ------------------- Zoom imagem ------------------- */
  const handleZoom = (e) => {
    e.preventDefault();
    setZoom((z) => Math.min(Math.max(z + e.deltaY * -0.001, 0.5), 3));
  };

  /* ------------------- Agendamentos (local) ------------------- */
  const agendarServico = (dog, tipo, data) => {
    if (!dog || !dog._id) return;
    const id = `APT-${Date.now().toString().slice(-6)}`;
    const novo = { id, dogId: dog._id, tipo, data, criadoEm: new Date().toISOString() };
    const lista = [novo, ...appointments];
    saveAppointments(lista);
    setComprovante({ dog, data, id });
    setSchedulingDog(null);
    setAppointmentDate("");
    setDogMenuOpen(null);
  };

  const handlePrint = () => window.print();

  // Render AuthScreen if not logged in
  if (!crmv) {
    return (
      <AuthScreen
        crmvInput={crmvInput}
        setCrmvInput={setCrmvInput}
        handleLogin={handleLogin}
        showVetRegister={showVetRegister}
        setShowVetRegister={setShowVetRegister}
        vetName={vetName}
        setVetName={setVetName}
        vetCrmvInput={vetCrmvInput}
        setVetCrmvInput={setVetCrmvInput}
        registerVeterinario={registerVeterinario}
        veterinarios={veterinarios}
      />
    );
  }

  // Main UI after login
  return (
    <div className="app-wrap">
      <style>{`:root{ --bgA: linear-gradient(120deg,#eaf7f0 0%, #f0f7ff 100%); --card: #ffffff; --accent: #0f9d82; --muted: #6b7280; --danger: #dc3545; --pill: #f8faf9; --table-head: #f3f6f8; } .app-wrap { min-height:100vh; padding: 28px; background: radial-gradient(circle at 10% 10%, #eef9f3, transparent 20%), linear-gradient(180deg,#e8f1ff 0%, #f3fbf6 100%); font-family: Inter, Roboto, Arial, sans-serif; } .container { max-width:1100px; margin: 0 auto; } .header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:16px; } .title { font-size:28px; font-weight:700; display:flex; align-items:center; gap:10px; color:#07201a; } .card { background:var(--card); border-radius:12px; padding:16px; box-shadow: 0 8px 30px rgba(2,6,23,0.06); } .filters { display:flex; gap:10px; align-items:center; margin-bottom:12px; } .input-filter { padding:10px 12px; border-radius:8px; border:1px solid #e6e9ef; width:100%; box-sizing: border-box; } .select { padding:10px 12px; border-radius:8px; border:1px solid #e6e9ef; background:white; } .user-box { text-align:right; } .muted { color:var(--muted); font-size:13px; } .logout { margin-top:8px; padding:8px 10px; border-radius:8px; background:#ef4444; color:white; border:none; cursor:pointer; font-weight:600; } table { width:100%; border-collapse:collapse; font-size:14px; } thead th { background: var(--table-head); padding:12px; text-align:left; font-weight:700; color:#0f172a; border-bottom: 1px solid #e6e9ef; } tbody td { padding:12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; } tbody tr:nth-child(even) { background: #fbfdfe; } tbody tr:hover { background: #f0f9ff; } .pet-img { width:64px; height:56px; object-fit:cover; border-radius:8px; box-shadow: 0 2px 6px rgba(2,6,23,0.06); } .btn { padding:8px 10px; border-radius:8px; border:1px solid #e6e9ef; background:white; cursor:pointer; } .btn-primary { background:var(--accent); color:white; border:none; font-weight:600; } .btn-warning { background:#f59e0b; color:white; border:none; } .btn-danger { background:var(--danger); color:white; border:none; } .actions-menu-button { padding:8px 12px; border-radius:8px; } .actions-menu { position:absolute; top:38px; right:0; background:white; padding:8px; border-radius:8px; box-shadow:0 8px 30px rgba(2,6,23,0.08); z-index:20; min-width:160px; } .actions-menu button { width:100%; margin-bottom:6px; display:block; text-align:left; padding:8px 10px; border-radius:6px; border:1px solid #eef2f6; background:white; } .table-danger { background: #fff6f6 !important; } .modal-backdrop { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background: rgba(2,6,23,0.35); z-index:10000; padding:20px; } .modal-card { background:white; border-radius:10px; width:100%; max-width:760px; padding:16px; box-shadow: 0 12px 40px rgba(2,6,23,0.12); max-height:90vh; overflow:auto; } .pager { display:flex; gap:8px; align-items:center; justify-content:center; padding:12px; } .pill { background:var(--pill); padding:6px 10px; border-radius:8px; border:1px solid #e6eef0; } .small-muted { color:var(--muted); font-size:13px; }
        .dog-row-clickable { cursor: pointer; }
      `}</style>
      
      <div className="container">
        <div className="header">
          <div>
            <div className="title">Lista de Cachorros <span style={{ fontSize: 20 }}>🐶</span></div>
            <div className="small-muted" style={{ marginTop: 6 }}>Painel de controle — Vacinação e agendamentos</div>
          </div>
          <div className="user-box">
            <div className="small-muted">Logado como</div>
            <div style={{ fontWeight: 700 }}>{crmv}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button onClick={handleLogout} className="btn" style={{ background: '#e5e7eb', color: '#1f2937' }}>Voltar para Login/Cadastro</button>
              <button onClick={handleLogout} className="logout">Sair</button>
            </div>
          </div>
        </div>

        <div className="card">
          {error && <div style={{ marginBottom: 12, padding: 10, background: "#fff1f2", color: "#7f1d1d", borderRadius: 8 }}>{error}</div>}
          
          <DogFilters 
            filtroRaca={filtroRaca}
            setFiltroRaca={setFiltroRaca}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />

          {loading ? (
            <div style={{ padding: 20 }}>Carregando...</div>
          ) : (
            <DogTable
              currentTableData={currentTableData}
              editingId={editingId}
              editData={editData}
              sortConfig={sortConfig}
              requestSort={requestSort}
              startEdit={startEdit}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              removeDog={removeDog}
              toggleVacinado={toggleVacinado}
              setSelectedImage={setSelectedImage}
              setSchedulingDog={setSchedulingDog}
              setViewingDog={setViewingDog}
              setDogMenuOpen={setDogMenuOpen}
              dogMenuOpen={dogMenuOpen}
              saving={saving}
              verificarVacinaVencida={verificarVacinaVencida}
              formatarData={formatarData}
              currentPage={currentPage}
              totalPages={totalPages}
              prevPage={prevPage}
              nextPage={nextPage}
              goToPage={goToPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              setAppointmentDate={setAppointmentDate}
              setEditData={setEditData}
              // --- CORREÇÃO 3: Passando a URL base para o componente de Tabela ---
              baseUrl={BASE_URL} 
            />
          )}
        </div>

        {/* All modals */}
        <Modals
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          schedulingDog={schedulingDog}
          setSchedulingDog={setSchedulingDog}
          appointmentDate={appointmentDate}
          setAppointmentDate={setAppointmentDate}
          agendarServico={agendarServico}
          appointments={appointments}
          formatarData={formatarData}
          comprovante={comprovante}
          setComprovante={setComprovante}
          handlePrint={handlePrint}
          viewingDog={viewingDog}
          setViewingDog={setViewingDog}
          startEdit={startEdit}
          zoom={zoom}
          setZoom={setZoom}
          handleZoom={handleZoom}
          // --- CORREÇÃO 3: Passando a URL base para os Modais ---
          baseUrl={BASE_URL}
        />
      </div>
    </div>
  );
};

export default ListaDogs;
