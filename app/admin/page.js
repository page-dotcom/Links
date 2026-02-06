"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- TOAST COMPONENT (Notifikasi Halus) ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div style={{
      position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999,
      background: '#fff', borderLeft: `6px solid ${isError ? '#ef4444' : '#10b981'}`,
      padding: '16px 24px', borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      display: 'flex', alignItems: 'center', gap: '16px', minWidth: '300px',
      animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <span className="material-symbols-rounded" style={{ color: isError ? '#ef4444' : '#10b981', fontSize: '24px' }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: '700' }}>{isError ? 'Error' : 'Success'}</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#cbd5e1', padding: '4px' }}>
        <span className="material-symbols-rounded">close</span>
      </button>
      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  // DATA STATES
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // UI STATES
  const [editingLink, setEditingLink] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  // --- INIT ---
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        fetchLinks(1, "");
      }
    }
    init();
  }, [router]);

  // --- FETCH DATA ---
  const fetchLinks = async (pageNumber, searchQuery) => {
    setLoading(true);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('links')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (searchQuery) {
      query = query.or(`slug.ilike.%${searchQuery}%,original_url.ilike.%${searchQuery}%`);
    }

    const { data, count, error } = await query;
    if (error) showToast("Gagal memuat data", "error");
    else {
      setLinks(data || []);
      setTotalCount(count || 0);
      setPage(pageNumber);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") fetchLinks(1, "");
  };

  // --- ACTIONS ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus link ini permanen?")) return;
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) {
      showToast("Link dihapus");
      fetchLinks(page, search);
    } else showToast("Gagal hapus", "error");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('links').update({ slug: editingLink.slug, original_url: editingLink.original_url }).eq('id', editingLink.id);
    if (!error) {
      showToast("Link berhasil diupdate");
      setEditingLink(null);
      fetchLinks(page, search);
    } else showToast("Gagal update (Slug mungkin duplikat)", "error");
  };

  // PAGINATION LOGIC
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading && !links.length) return <div style={{ height: '100vh', background: '#f8fafc' }}></div>; // Blank loading biar gak kedip

  return (
    <>
      <Header />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* CONTAINER UTAMA (LEBAR) */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          
          {/* HEADER DASHBOARD */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Link Manager</h1>
              <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Welcome back, {user?.email}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
               {/* Search Box */}
               <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
                 <span className="material-symbols-rounded" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>search</span>
                 <input 
                    type="text" 
                    placeholder="Search links..." 
                    value={search}
                    onChange={handleSearch}
                    onKeyDown={(e) => e.key === 'Enter' && fetchLinks(1, search)}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                 />
               </div>
               
               {/* Logout Button */}
               <button onClick={handleLogout} style={{ height: '44px', padding: '0 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#ef4444', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>logout</span> 
                  <span className="desktop-only">Logout</span>
               </button>
            </div>
          </div>

          {/* MAIN CARD (Table Wrapper) */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            
            {/* TABLE SCROLL AREA */}
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '900px' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    {['Date', 'Short Link', 'Original Destination', 'Clicks', 'Actions'].map((head, i) => (
                      <th key={i} style={{ padding: '16px 24px', textAlign: head === 'Clicks' ? 'center' : head === 'Actions' ? 'right' : 'left', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', letterSpacing: '0.05em' }}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {links.length > 0 ? links.map((link) => (
                    <tr key={link.id} style={{ transition: 'background 0.2s' }} className="hover-row">
                      <td style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        {new Date(link.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      
                      <td style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-rounded" style={{ fontSize: '18px', color: '#3b82f6' }}>link</span>
                            <a href={`/${link.slug}`} target="_blank" style={{ fontWeight: '700', color: '#0f172a', textDecoration: 'none', fontSize: '0.95rem' }}>/{link.slug}</a>
                         </div>
                      </td>

                      <td style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', maxWidth: '350px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475569', fontSize: '0.9rem' }}>
                          {link.original_url}
                        </div>
                      </td>

                      <td style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                         <span style={{ display: 'inline-block', padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                           {link.clicks}
                         </span>
                      </td>

                      <td style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', whiteSpace: 'nowrap' }}>
                         <button onClick={() => setEditingLink(link)} style={{ background: '#fff', border: '1px solid #cbd5e1', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', color: '#334155', marginRight: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>edit</span>
                         </button>
                         <button onClick={() => handleDelete(link.id)} style={{ background: '#fff', border: '1px solid #fca5a5', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>delete</span>
                         </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No links found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
               <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing page <b>{page}</b> of <b>{totalPages || 1}</b></span>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => fetchLinks(page - 1, search)} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.6 : 1, fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-rounded">chevron_left</span> Prev
                  </button>
                  <button onClick={() => fetchLinks(page + 1, search)} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.6 : 1, fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Next <span className="material-symbols-rounded">chevron_right</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* CSS GLOBAL UNTUK HALAMAN INI */}
        <style jsx global>{`
          .hover-row:hover td { background: #f8fafc; }
          @media (max-width: 600px) { .desktop-only { display: none; } }
        `}</style>

        {/* MODAL EDIT (Full Screen di HP, Pop-up di Desktop) */}
        {editingLink && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'slideIn 0.3s ease-out' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Edit Link</h3>
                <button onClick={() => setEditingLink(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><span className="material-symbols-rounded" style={{ fontSize: '24px', color: '#94a3b8' }}>close</span></button>
              </div>
              <form onSubmit={handleUpdate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Short Code (Slug)</label>
                   <input type="text" value={editingLink.slug} onChange={(e) => setEditingLink({...editingLink, slug: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>Destination URL</label>
                   <textarea value={editingLink.original_url} onChange={(e) => setEditingLink({...editingLink, original_url: e.target.value})} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', resize: 'none' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '14px', background: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Save Changes</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
