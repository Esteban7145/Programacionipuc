'use client';

export function ThemePanel() {
  return (
    <div className="grid">
      <h3>Personalización por Iglesia</h3>
      <label>Color principal <input type="color" defaultValue="#3e7bff" /></label>
      <label>Color dorado <input type="color" defaultValue="#b9964e" /></label>
      <label>Tipografía
        <select defaultValue="inter">
          <option value="inter">Inter</option>
          <option value="montserrat">Montserrat</option>
          <option value="playfair">Playfair Display</option>
        </select>
      </label>
      <button>Subir logo local</button>
      <button>Cargar fondo cinemático</button>
    </div>
  );
}
