import React, { useState, useEffect } from 'react';
import { Search, PackageOpen, Edit, X, Save } from 'lucide-react';
import { getProductos, updateProducto } from '../services/db';

export function Inventario() {
    const [productos, setProductos] = useState([]);
    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        const data = await getProductos();
        setProductos(data);
    };

    const filtered = productos.filter(p =>
        p.nombre_descripcion?.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo_barras?.includes(search) ||
        p.familia?.nombre?.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditClick = (product) => {
        setEditingProduct({ ...product });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({
            ...prev,
            [name]: name.startsWith('precio') ? parseFloat(value) : value
        }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await updateProducto(editingProduct.id, {
                nombre_descripcion: editingProduct.nombre_descripcion,
                precio_venta_sugerido: parseFloat(editingProduct.precio_venta_sugerido),
                estado: editingProduct.estado
            });
            setEditingProduct(null);
            cargarProductos();
        } catch (error) {
            alert("Error actualizando: " + error.message);
        }
    };

    return (
        <div className="glass" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Inventario General</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código o familia..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', background: 'var(--surface-color)' }}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Código Barras</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Producto</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Familia</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Lote / F. Ingreso</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Costo Real</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Precio Sugerido</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(prod => (
                            <tr key={prod.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', ':hover': { background: 'rgba(0,0,0,0.02)' } }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600 }}>{prod.codigo_barras}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{prod.nombre_descripcion}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                                        {prod.familia?.nombre || 'S/F'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {prod.ingreso ? `Ingreso #${prod.ingreso.numero_ingreso}` : 'N/A'}<br />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {prod.ingreso?.fecha_ingreso ? new Date(prod.ingreso.fecha_ingreso).toLocaleDateString() : ''}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>S/ {parseFloat(prod.costo_real_total).toFixed(2)}</td>
                                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success-color)' }}>S/ {parseFloat(prod.precio_venta_sugerido).toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: prod.estado === 'disponible' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: prod.estado === 'disponible' ? 'var(--success-color)' : 'var(--danger-color)'
                                    }}>
                                        {prod.estado}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleEditClick(prod)}
                                        className="btn"
                                        style={{ padding: '0.5rem', background: 'var(--surface-color)', color: 'var(--accent-color)', border: '1px solid var(--glass-border)' }}
                                        title="Editar Producto"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <PackageOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No se encontraron productos en el inventario.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edición */}
            {editingProduct && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', animation: 'fadeIn 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Editar Producto</h3>
                            <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descripción / Nombre</label>
                                <input type="text" name="nombre_descripcion" required value={editingProduct.nombre_descripcion} onChange={handleEditChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Precio Sugerido S/</label>
                                <input type="number" step="0.01" name="precio_venta_sugerido" required value={editingProduct.precio_venta_sugerido} onChange={handleEditChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estado</label>
                                <select name="estado" value={editingProduct.estado} onChange={handleEditChange}>
                                    <option value="disponible">Disponible</option>
                                    <option value="vendido">Vendido / Agotado</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px' }}>
                                <strong>Nota:</strong> Costo base, flete y familia no se pueden editar aquí ya que vienen del comprobante de ingreso originado.
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                <Save size={18} /> Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
