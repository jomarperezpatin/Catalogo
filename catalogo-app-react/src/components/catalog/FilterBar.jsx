import React from 'react';
import {
  IconSearch,
  IconClose,
  IconGrid,
  IconList,
  IconFilter,
} from '../common/Icons';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalResults,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div className="filter-bar-container" id="catalogo">
      {/* Category Pills */}
      <div className="category-scroll-wrapper">
        <div className="category-pills">
          <button
            className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Todos los productos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-row">
        {/* Search input */}
        <div className="search-input-wrapper">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Limpiar búsqueda"
            >
              <IconClose size={15} />
            </button>
          )}
        </div>

        {/* Sort & View modes */}
        <div className="controls-right">
          <div className="sort-select-wrapper">
            <IconFilter size={16} className="sort-icon" />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista en cuadrícula"
            >
              <IconGrid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vista en lista"
            >
              <IconList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results summary bar */}
      <div className="results-summary">
        <span>
          Mostrando <strong>{totalResults}</strong> {totalResults === 1 ? 'producto' : 'productos'}
          {selectedCategory !== 'all' && ` en "${selectedCategory}"`}
          {searchQuery && ` para "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            className="btn-link"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};
