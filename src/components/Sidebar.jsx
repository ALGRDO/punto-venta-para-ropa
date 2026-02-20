import { NavLink } from 'react-router-dom';
import { Package, PlusCircle, ShoppingCart, BarChart3 } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="glass" style={{ width: '280px', height: 'calc(100vh - 40px)', position: 'fixed', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', padding: '1.5rem', zIndex: 100 }}>
            {/* Brand & Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <img
                    src="/avatar.webp"
                    alt="Foto del Babas"
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-color)' }}
                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=El+Babas&background=3b82f6&color=fff' }}
                />
                <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>El Babas</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admin de Inventario</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>

                <NavLink to="/" style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? '600' : '400'
                })}>
                    <BarChart3 size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/inventario" style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? '600' : '400'
                })}>
                    <Package size={20} />
                    <span>Inventario Local</span>
                </NavLink>

                <NavLink to="/ingresos" style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? '600' : '400'
                })}>
                    <PlusCircle size={20} />
                    <span>Nuevo Ingreso</span>
                </NavLink>

                <NavLink to="/ventas" style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? '600' : '400'
                })}>
                    <ShoppingCart size={20} />
                    <span>Punto de Venta</span>
                </NavLink>
            </nav>

            {/* Footer info */}
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Sistema de Inventario v1.0<br />Sincronizado en la nube ☁️
            </div>
        </aside>
    );
}
