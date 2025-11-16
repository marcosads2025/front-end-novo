import React from 'react';

const DogTable = ({
  currentTableData,
  editingId,
  editData,
  sortConfig,
  requestSort,
  startEdit,
  saveEdit,
  cancelEdit,
  removeDog,
  toggleVacinado,
  setSelectedImage,
  setSchedulingDog,
  setViewingDog,
  setDogMenuOpen,
  dogMenuOpen,
  saving,
  verificarVacinaVencida,
  formatarData,
  currentPage,
  totalPages,
  prevPage,
  nextPage,
  goToPage,
  itemsPerPage,
  setItemsPerPage,
  setAppointmentDate,
  setEditData
}) => {
  return (
    <>
      {currentTableData.length === 0 ? (
        <div style={{ padding: 16, background: "#f1fbf7", borderRadius: 8 }}>Nenhum cachorro encontrado.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th style={{ cursor: "pointer" }} onClick={() => requestSort("nome")}>Nome</th>
                <th style={{ cursor: "pointer" }} onClick={() => requestSort("raca")}>Raça</th>
                <th style={{ cursor: "pointer" }} onClick={() => requestSort("peso")}>Peso</th>
                <th style={{ cursor: "pointer" }} onClick={() => requestSort("idade")}>Idade</th>
                <th>Proprietário</th>
                <th>Cadastro</th>
                <th>Vacinado?</th>
                <th style={{ width: 150 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((dog) => (
                <tr
                  key={dog._id}
                  className={`dog-row-clickable ${verificarVacinaVencida(dog) ? "table-danger" : ""}`}
                  title={verificarVacinaVencida(dog) ? "Vacina vencida" : `Clique para ver detalhes de ${dog.nome}`}
                  onClick={() => {
                    if (editingId !== dog._id) {
                      setViewingDog(dog);
                    }
                  }}
                >
                  <td style={{ width: 110 }}>
                    {dog.fotoUrl ? (
                      <img
                        src={dog.fotoUrl}
                        alt={dog.nome}
                        className="pet-img"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(dog.fotoUrl);
                        }}
                      />
                    ) : (
                      <div style={{ width: 64, height: 56, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Sem foto</div>
                    )}
                  </td>
                  <td>{dog.nome}</td>
                  <td>{dog.raca}</td>
                  <td style={{ textAlign: "center" }}>{dog.peso}</td>
                  <td style={{ textAlign: "center" }}>{dog.idade}</td>
                  <td>{dog.proprietario}</td>
                  <td>{formatarData(dog.createdAt)}</td>
                  <td>
                    <button
                      className={`btn ${dog.vacinado ? "btn-primary" : "btn-warning"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVacinado(dog);
                      }}
                    >
                      {dog.vacinado ? "✅ Sim" : "❌ Não"}
                    </button>
                  </td>
                  <td style={{ position: "relative", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn actions-menu-button"
                      onClick={() => setDogMenuOpen((prev) => (prev === dog._id ? null : dog._id))}
                      aria-expanded={dogMenuOpen === dog._id}
                    >
                      Ações ▾
                    </button>
                    {dogMenuOpen === dog._id && (
                      <div className="actions-menu" onMouseLeave={() => setDogMenuOpen(null)}>
                        <button onClick={() => { startEdit(dog); setDogMenuOpen(null); }}>
                          ✏️ Editar
                        </button>
                        <button onClick={() => { setSchedulingDog(dog); setAppointmentDate(""); setDogMenuOpen(null); }}>
                          📅 Agendar
                        </button>
                        <button
                          onClick={() => { removeDog(dog._id); setDogMenuOpen(null); }}
                          style={{ color: "white", background: "linear-gradient(180deg,#ef4444,#dc2626)", border: "none" }}
                        >
                          🗑 Excluir
                        </button>
                      </div>
                    )}
                    {editingId === dog._id && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                          <input value={editData.nome} onChange={(e) => setEditData({ ...editData, nome: e.target.value })} placeholder="Nome" style={{ padding: 8, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                          <input value={editData.raca} onChange={(e) => setEditData({ ...editData, raca: e.target.value })} placeholder="Raça" style={{ padding: 8, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                          <input value={editData.peso} onChange={(e) => setEditData({ ...editData, peso: e.target.value })} placeholder="Peso" style={{ padding: 8, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                          <input value={editData.idade} onChange={(e) => setEditData({ ...editData, idade: e.target.value })} placeholder="Idade" style={{ padding: 8, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                          <input value={editData.proprietario} onChange={(e) => setEditData({ ...editData, proprietario: e.target.value })} placeholder="Proprietário" style={{ padding: 8, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                          <input value={editData.fotoUrl} onChange={(e) => setEditData({ ...editData, fotoUrl: e.target.value })} placeholder="URL da foto" style={{ padding: 8, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                          <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
                          <button className="btn" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* paginação */}
          {totalPages > 1 && (
            <div className="pager">
              <button className="btn" onClick={prevPage} disabled={currentPage === 1}>« Anterior</button>
              {[...Array(totalPages).keys()].map((n) => (
                <button
                  key={n}
                  className="btn"
                  style={{ fontWeight: currentPage === n + 1 ? 700 : 400 }}
                  onClick={() => goToPage(n + 1)}
                >
                  {n + 1}
                </button>
              ))}
              <button className="btn" onClick={nextPage} disabled={currentPage === totalPages}>Próximo »</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DogTable;
