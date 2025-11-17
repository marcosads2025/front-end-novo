import React from 'react';

const AuthScreen = ({
  crmvInput,
  setCrmvInput,
  handleLogin,
  showVetRegister,
  setShowVetRegister,
  vetName,
  setVetName,
  vetCrmvInput,
  setVetCrmvInput,
  registerVeterinario,
  veterinarios
}) => {
  return (
    <div className="page-wrap">
      <style>{`:root{ --bg1: #e6f7f0; --accent: #138f6f; --card: #ffffffee; --muted: #6b7280; --danger: #dc3545; --pill: #f3f6f5; } body { margin:0; font-family: Inter, Roboto, Arial, sans-serif; } .page-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg,#e6f0ff 0%, #eaf7f0 100%); padding:32px; } .auth-card { width: 420px; background: var(--card); border-radius: 12px; box-shadow: 0 8px 30px rgba(15,23,42,0.08); padding: 20px; } .auth-head { text-align:center; margin-bottom:12px; } h3 { margin:0; font-size:20px; color:#0f172a; } .muted { color: var(--muted); font-size:13px; margin-bottom:8px; } label { font-size:13px; color:#111827; display:block; margin-bottom:6px; } .input { width:100%; padding:10px 12px; border-radius:8px; border:1px solid #e6e9ef; box-sizing:border-box; } .btn-full { width:100%; padding:10px 12px; border-radius:8px; border:none; background:var(--accent); color:white; cursor:pointer; font-weight:600; margin-top:12px; } .btn-outline { width:100%; padding:10px; border-radius:8px; background:transparent; border:1px solid #d1d5db; cursor:pointer; margin-top:8px; } .row { display:flex; gap:8px; align-items:center; margin-top:8px; } .small { font-size:13px; color:var(--muted); } .link-like { color: var(--accent); cursor:pointer; text-decoration:underline; font-weight:600; }`}</style>
      <div className="auth-card" role="dialog" aria-label="Login CRMV">
        <div className="auth-head">
          <h3>Portal Clínica Veterinária</h3>
          <div className="muted">Acesse com seu CRMV ou cadastre um veterinário</div>
        </div>
        <form onSubmit={handleLogin}>
          <label>Insira seu CRMV (ex: CRMV-SP 12345)</label>
          <input
            className="input"
            type="text"
            value={crmvInput}
            onChange={(e) => setCrmvInput(e.target.value)}
            placeholder="CRMV-SP 12345"
            aria-label="CRMV"
          />
          <button type="submit" className="btn-full">Entrar</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <div className="small">Ou</div>
          <button onClick={() => setShowVetRegister(true)} className="btn-outline" aria-haspopup="dialog">
            Cadastrar Veterinário
          </button>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: "#94a3b8" }}>
          Veterinários cadastrados: {veterinarios.length}
        </div>
      </div>
      
      {/* modal cadastrar veterinário */}
      {showVetRegister && (
        <div
          className="modal-backdrop"
          onClick={() => setShowVetRegister(false)}
          style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, background: "rgba(2,6,23,0.4)" }}
        >
          <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h3 style={{ marginBottom: 6 }}>Cadastrar Veterinário</h3>
            <div className="muted">Informe nome e CRMV (ex: CRMV-SP 12345)</div>
            <form onSubmit={registerVeterinario} style={{ marginTop: 12 }}>
              <label>Nome</label>
              <input className="input" value={vetName} onChange={(e) => setVetName(e.target.value)} placeholder="Nome completo" />
              <label style={{ marginTop: 8 }}>CRMV</label>
              <input className="input" value={vetCrmvInput} onChange={(e) => setVetCrmvInput(e.target.value)} placeholder="CRMV-SP 12345" />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="submit" className="btn-full">Cadastrar e Entrar</button>
                <button type="button" className="btn-outline" onClick={() => setShowVetRegister(false)}>Cancelar</button>
              </div>
            </form>
            <div style={{ marginTop: 14 }}>
              <strong>Veterinários já cadastrados</strong>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {veterinarios.length === 0 && <li style={{ color: "#64748b" }}>Nenhum</li>}
                {veterinarios.map((v) => (
                  <li key={v.id} style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{v.nome}</span>
                    <span style={{ color: "#94a3b8" }}>— {v.crmv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
