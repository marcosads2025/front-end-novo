import React from 'react';

const DogFilters = ({
  filtroRaca,
  setFiltroRaca,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage
}) => {
  return (
    <div className="filters" style={{ marginBottom: 14 }}>
      <input
        className="input-filter"
        placeholder="Filtrar por raça..."
        value={filtroRaca}
        onChange={(e) => {
          setFiltroRaca(e.target.value);
          setCurrentPage(1);
        }}
      />
      <select
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="select"
        style={{ width: 120 }}
      >
        <option value={5}>5 / página</option>
        <option value={10}>10 / página</option>
        <option value={20}>20 / página</option>
      </select>
    </div>
  );
};

export default DogFilters;
