import React, { useState } from 'react';

const Modals = ({
  selectedImage,
  setSelectedImage,
  schedulingDog,
  setSchedulingDog,
  appointmentDate,
  setAppointmentDate,
  agendarServico,
  appointments,
  formatarData,
  comprovante,
  setComprovante,
  handlePrint,
  viewingDog,
  setViewingDog,
  startEdit,
  setSchedulingDog: setSchedulingDogFromView,
  zoom,
  setZoom,
  handleZoom
}) => {
  const handleSchedule = () => {
    if (!schedulingDog || !appointmentDate) {
      alert("Por favor, selecione uma data válida.");
      return;
    }
    agendarServico(schedulingDog, "vacina", appointmentDate);
  };

  const closeComprovante = () => setComprovante(null);

  return (
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Ampliação"
              onWheel={handleZoom}
              style={{ transform: `scale(${zoom})`, transition: "transform 0.2s", maxWidth: "100%", maxHeight: "70vh", borderRadius: 8 }}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setSelectedImage(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {schedulingDog && (
        <div className="modal-backdrop" onClick={() => setSchedulingDog(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4>Agendar serviço - {schedulingDog.nome}</h4>
            <div style={{ marginTop: 8 }}>
              <label>Data:</label>
              <input
                type="date"
                value={appointmentDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e6eef0", width: "100%" }}
              />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={handleSchedule} disabled={!appointmentDate}>💉 Vacina</button>
              <button className="btn" onClick={() => agendarServico(schedulingDog, "banho", appointmentDate)} disabled={!appointmentDate}>🧼 Banho</button>
              <button className="btn" onClick={() => agendarServico(schedulingDog, "tosa", appointmentDate)} disabled={!appointmentDate}>✂️ Tosa</button>
              <div style={{ flex: 1, minWidth: "10px" }} />
              <button className="btn" onClick={() => setSchedulingDog(null)}>Cancelar</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <h5>Histórico (últimos 5)</h5>
              {appointments.filter((a) => a.dogId === schedulingDog._id).slice(0, 5).map((a) => (
                <div key={a.id} style={{ padding: 6, borderBottom: "1px solid #eee" }}>
                  <strong>{a.tipo}</strong> — {formatarData(a.data)}
                  <span style={{ color: "#666", fontSize: 12 }}> ({new Date(a.criadoEm).toLocaleString()})</span>
                </div>
              ))}
              {appointments.filter((a) => a.dogId === schedulingDog._id).length === 0 && <div style={{ color: "#666" }}>Sem agendamentos</div>}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {comprovante && (
        <div className="modal-backdrop" onClick={closeComprovante}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4>Comprovante</h4>
            <p><strong>Nº:</strong> {comprovante.id}</p>
            <p><strong>Animal:</strong> {comprovante.dog.nome}</p>
            <p><strong>Raça:</strong> {comprovante.dog.raca}</p>
            <p><strong>Data:</strong> {formatarData(comprovante.data)}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handlePrint}>Imprimir</button>
              <button className="btn" onClick={closeComprovante}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Dog Details Modal */}
      {viewingDog && (
        <div className="modal-backdrop" onClick={() => setViewingDog(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Detalhes: {viewingDog.nome}</h3>
              <button className="btn" onClick={() => setViewingDog(null)}>Voltar para Home (Lista)</button>
            </div>
            
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {viewingDog.fotoUrl ? (
                <img
                  src={viewingDog.fotoUrl}
                  alt={viewingDog.nome}
                  style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(viewingDog.fotoUrl);
                  }}
                />
              ) : (
                <div style={{ width: 150, height: 150, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                  Sem foto
                </div>
              )}
              
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ margin: "4px 0" }}><strong>Raça:</strong> {viewingDog.raca || 'N/A'}</p>
                <p style={{ margin: "4px 0" }}><strong>Proprietário:</strong> {viewingDog.proprietario || 'N/A'}</p>
                <p style={{ margin: "4px 0" }}><strong>Peso:</strong> {viewingDog.peso ? `${viewingDog.peso} kg` : 'N/A'}</p>
                <p style={{ margin: "4px 0" }}><strong>Idade:</strong> {viewingDog.idade ? `${viewingDog.idade} anos` : 'N/A'}</p>
              </div>
            </div>

            <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button 
                className="btn btn-primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(viewingDog);
                  setViewingDog(null);
                }}
              >
                ✏️ Editar na Lista
              </button>
              <button 
                className="btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSchedulingDogFromView(viewingDog);
                  setViewingDog(null);
                }}
              >
                📅 Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;
