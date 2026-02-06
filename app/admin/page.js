"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- KOMPONEN TOAST (PENGGANTI ALERT) ---
// Muncul di pojok kanan bawah
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === 'error' ? '#ef4444' : '#10b981'; // Merah / Hijau
  
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: '#fff', borderLeft: `5px solid ${bgColor}`,
      padding: '16px 20px', borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: '12px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <span className="material-symbols-rounded" style={{ color: bgColor }}>
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <div>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>{type === 'error' ? 'Error' : 'Success'}</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
        <span className="material-symbols-rounded">close</span>
      </button>
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  // DATA & PAGINATION STATE
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10; // Jumlah data per halaman
  const [totalCount, setTotalCount] = useState(0);

  // EDIT STATE
  const [editingLink, setEditingLink] = useState(null);
  
  // TOAST STATE
  const [toast, setToast] = useState({ message: '', type: '' });

  // --- FUNGSI HELPER TOAST ---
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000); // Ilang dalam 3 detik
  };

  // --- CEK LOGIN & FETCH DATA ---
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        fetchLinks(1, search); // Fetch halaman 1
      }
    }
    init();
  }, [router]);

  // --- FETCH DENGAN PAGINATION & SEARCH ---
  const fetchLinks = async (pageNumber, searchQuery = "") => {
    setLoading(true);
    
    // Hitung range (0-9, 10-19, dst)
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('links')
      .select('*', { count: 'exact' }) // Minta total data juga
      .order('created_at', { ascending: false })
      .range(from, to);

    if (searchQuery) {
      // Search di slug atau original_url
      query = query.or(`slug.ilike.%${searchQuery}%,original_url.ilike.%${searchQuery}%`);
    }

    const { data, count, error } = await query;
    
    if (error) {
      showToast("Gagal mengambil data", "error");
    } else {
      setLinks(data || []);
      setTotalCount(count || 0);
      setPage(pageNumber);
    }
    setLoading(false);
  };

  // Handle Search (Debounce dikit biar gak spam server)
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Reset ke halaman 1 tiap search
    if (e.target.value === "") {
      fetchLinks(1, "");
    }
  };
  
  const executeSearch = () => fetchLinks(1, search); // Tombol enter/klik search

  // --- ACTIONS ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus permanen? Data tidak bisa dikembalikan.")) return;
    
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) {
      showToast("Link berhasil dihapus!", "success");
      fetchLinks(page, search); // Refresh data halaman ini
    } else {
      showToast("Gagal menghapus link.", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('links')
      .update({ slug: editingLink.slug, original_url: editingLink.original_url })
      .eq('id', editingLink.id);

    if (!error) {
      showToast("Link berhasil diupdate!", "success");
      setEditingLink(null);
      fetchLinks(page, search);
    } else {
      showToast("Gagal update. Kode mungkin duplikat.", "error");
    }
  };

  // --- LOGIC PAGINATION (1 2 3 ... 9 10) ---
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  
  const getPaginationGroup = () => {
    let start = Math.floor((page - 1) / 5) * 5;
    return new Array(Math.min(5, totalPages - start)).fill().map((_, idx) => start + idx + 1);
  };

  if (loading && !links.length) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading dashboard...</div>;

  return (
    <>
      <Header />
      {/* Script Icon */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      
      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <main style={{ minHeight: '85vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* TOP BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Dashboard</h1>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '5px 0 0 0' }}>Manage all your links here.</p>
            </div>
            
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>logout</span> Logout
            </button>
          </div>

          {/* SEARCH BAR */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '10px', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-rounded" style={{ position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '20px' }}>search</span>
              <input 
                type="text" 
                placeholder="Search by code or URL..." 
                value={search}
                onChange={handleSearch}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            <button onClick={executeSearch} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Search
            </button>
          </div>

          {/* TABLE CONTAINER (Responsive Scroll) */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}> {/* Kunci biar bisa digeser di HP */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Short Link</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destination</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Clicks</th>
                    <th style={{ padding: '16px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.length > 0 ? links.map((link) => (
                    <tr key={link.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Created Date Column */}
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(link.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      
                      <td style={{ padding: '16px', fontWeight: '600', fontSize: '0.9rem' }}>
                        <a href={`/${link.slug}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          /{link.slug} <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>open_in_new</span>
                        </a>
                      </td>
                      
                      <td style={{ padding: '16px', maxWidth: '300px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475569', fontSize: '0.85rem' }}>
                          {link.original_url}
                        </div>
                      </td>
                      
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                         <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>
                           {link.clicks}
                         </span>
                      </td>
                      
                      <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => setEditingLink(link)} 
                          style={{ background: '#fff', border: '1px solid #cbd5e1', cursor: 'pointer', marginRight: '8px', padding: '8px', borderRadius: '6px', color: '#334155' }} title="Edit"
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(link.id)} 
                          style={{ background: '#fff', border: '1px solid #fca5a5', cursor: 'pointer', padding: '8px', borderRadius: '6px', color: '#ef4444' }} title="Delete"
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No links found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* PAGINATION AREA */}
            {links.length > 0 && (
              <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: 'auto' }}>
                  Page {page} of {totalPages}
                </span>

                <button 
                  onClick={() => fetchLinks(page - 1, search)}
                  disabled={page === 1}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                   <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>chevron_left</span> Prev
                </button>

                {/* Number Buttons logic */}
                {totalPages <= 7 ? (
                   // Kalau halaman dikit, tampilin semua
                   Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
                     <button
                       key={num}
                       onClick={() => fetchLinks(num, search)}
                       style={{ 
                         background: page === num ? '#0f172a' : '#fff', 
                         color: page === num ? '#fff' : '#0f172a',
                         border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                       }}
                     >
                       {num}
                     </button>
                   ))
                ) : (
                   // Kalau halaman banyak, tampilin ringkasan
                   <>
                      <button onClick={() => fetchLinks(1, search)} style={{ background: page === 1 ? '#0f172a' : '#fff', color: page === 1 ? '#fff' : '#0f172a', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer' }}>1</button>
                      
                      {page > 3 && <span style={{ color: '#94a3b8' }}>...</span>}
                      
                      {/* Halaman tengah */}
                      {page > 1 && page < totalPages && (
                        <button style={{ background: '#0f172a', color: '#fff', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'default' }}>{page}</button>
                      )}

                      {page < totalPages - 2 && <span style={{ color: '#94a3b8' }}>...</span>}

                      <button onClick={() => fetchLinks(totalPages, search)} style={{ background: page === totalPages ? '#0f172a' : '#fff', color: page === totalPages ? '#fff' : '#0f172a', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer' }}>{totalPages}</button>
                   </>
                )}

                <button 
                  onClick={() => fetchLinks(page + 1, search)}
                  disabled={page === totalPages}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                   Next <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MODAL EDIT */}
        {editingLink && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Edit Link</h3>
                <button onClick={() => setEditingLink(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-rounded">close</span></button>
              </div>
              
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Short Code (Slug)</label>
                  <input type="text" value={editingLink.slug} onChange={(e) => setEditingLink({...editingLink, slug: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Destination URL</label>
                  <textarea value={editingLink.original_url} onChange={(e) => setEditingLink({...editingLink, original_url: e.target.value})} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setEditingLink(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
