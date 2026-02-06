"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- TOAST COMPONENT (Notifikasi) ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className="spf_toast" style={{ borderLeftColor: isError ? '#ef4444' : '#10b981' }}>
      <span className="material-symbols-rounded" style={{ color: isError ? '#ef4444' : '#10b981', fontSize: '24px' }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{isError ? 'Error' : 'Success'}</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#cbd5e1' }}>
        <span className="material-symbols-rounded">close</span>
      </button>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  // DATA
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 15; // Tampil lebih banyak

  // UI
  const [editingLink, setEditingLink] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else {
        setUser(user);
        fetchLinks(1, "");
      }
    }
    init();
  }, [router]);

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
    if (error) showToast("Error loading data", "error");
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus permanen?")) return;
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) {
      showToast("Terhapus");
      fetchLinks(page, search);
    } else showToast("Gagal hapus", "error");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('links').update({ slug: editingLink.slug, original_url: editingLink.original_url }).eq('id', editingLink.id);
    if (!error) {
      showToast("Update sukses");
      setEditingLink(null);
      fetchLinks(page, search);
    } else showToast("Slug mungkin sudah ada", "error");
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading && !links.length) return <div className="spf_loading"></div>;

  return (
    <>
      <Header />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      {/* WRAPPER UTAMA DENGAN CLASS UNIK */}
      <main className="spf_main_wrapper">
        <div className="spf_container">
          
          {/* HEADER AREA */}
          <div className="spf_header_row">
            <div>
              <h1 className="spf_title">Link Manager</h1>
              <p className="spf_subtitle">Total Links: <b>{totalCount}</b></p>
            </div>

            <div className="spf_actions">
               <div className="spf_search_box">
                 <span className="material-symbols-rounded spf_icon">search</span>
                 <input 
                    className="spf_input"
                    type="text" 
                    placeholder="Search..." 
                    value={search}
                    onChange={handleSearch}
                    onKeyDown={(e) => e.key === 'Enter' && fetchLinks(1, search)}
                 />
               </div>
               <button onClick={handleLogout} className="spf_btn_logout">
                  <span className="material-symbols-rounded">logout</span>
               </button>
            </div>
          </div>

          {/* TABLE AREA - FULL WIDTH & TAJAM */}
          <div className="spf_table_wrapper">
            <table className="spf_table">
              <thead>
                <tr>
                  <th width="15%">DATE</th>
                  <th width="20%">SHORT LINK</th>
                  <th width="40%">DESTINATION</th>
                  <th width="10%" align="center">HITS</th>
                  <th width="15%" align="right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {links.length > 0 ? links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      {new Date(link.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td>
                       <a href={`/${link.slug}`} target="_blank" className="spf_link">
                         /{link.slug}
                       </a>
                    </td>
                    <td>
                      <div className="spf_url_truncate">
                        {link.original_url}
                      </div>
                    </td>
                    <td align="center">
                       <span className="spf_badge">{link.clicks}</span>
                    </td>
                    <td align="right">
                       <div className="spf_btn_group">
                         <button onClick={() => setEditingLink(link)} className="spf_btn_edit">
                           <span className="material-symbols-rounded">edit</span>
                         </button>
                         <button onClick={() => handleDelete(link.id)} className="spf_btn_del">
                           <span className="material-symbols-rounded">delete</span>
                         </button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="spf_empty">No data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="spf_pagination">
             <button onClick={() => fetchLinks(page - 1, search)} disabled={page === 1} className="spf_page_btn">
               Prev
             </button>
             <span className="spf_page_info">{page} / {totalPages || 1}</span>
             <button onClick={() => fetchLinks(page + 1, search)} disabled={page === totalPages} className="spf_page_btn">
               Next
             </button>
          </div>
        </div>

        {/* MODAL EDIT */}
        {editingLink && (
          <div className="spf_modal_overlay">
            <div className="spf_modal_box">
              <div className="spf_modal_header">
                <h3>Edit Link</h3>
                <button onClick={() => setEditingLink(null)}><span className="material-symbols-rounded">close</span></button>
              </div>
              <form onSubmit={handleUpdate} className="spf_form">
                <label>Slug</label>
                <input type="text" value={editingLink.slug} onChange={(e) => setEditingLink({...editingLink, slug: e.target.value})} />
                
                <label>Original URL</label>
                <textarea value={editingLink.original_url} onChange={(e) => setEditingLink({...editingLink, original_url: e.target.value})} rows={3} />
                
                <button type="submit" className="spf_btn_save">Save Changes</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* --- CSS KHUSUS HALAMAN INI (SCOPED/RANDOM NAMES) --- */}
      <style jsx>{`
        /* Reset & Layout */
        .spf_main_wrapper {
          min-height: 100vh;
          background: #f8fafc;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          width: 100%;
          box-sizing: border-box;
        }
        .spf_container {
          width: 100%;
          max-width: 100%; /* Paksa Full Width */
          margin: 0 auto;
        }

        /* Header */
        .spf_header_row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .spf_title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
        .spf_subtitle { color: #64748b; margin: 5px 0 0 0; font-size: 0.9rem; }

        /* Search & Actions */
        .spf_actions { display: flex; gap: 10px; align-items: center; flex-grow: 1; justify-content: flex-end; }
        .spf_search_box {
          position: relative;
          width: 100%;
          max-width: 300px;
        }
        .spf_icon {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          font-size: 20px; color: #94a3b8;
        }
        .spf_input {
          width: 100%;
          padding: 10px 10px 10px 35px;
          border: 1px solid #cbd5e1;
          border-radius: 0; /* Tajam */
          font-size: 0.9rem;
          outline: none;
          background: #fff;
        }
        .spf_btn_logout {
          background: #fff; border: 1px solid #ef4444; color: #ef4444;
          width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }

        /* Table Area */
        .spf_table_wrapper {
          width: 100%;
          overflow-x: auto; /* Scroll samping di HP */
          background: #fff;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .spf_table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px; /* Lebar minimum biar gak gepeng */
        }
        .spf_table th {
          background: #f1f5f9;
          padding: 12px 15px;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }
        .spf_table td {
          padding: 12px 15px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          color: #334155;
          vertical-align: middle;
        }
        .spf_table tr:hover { background-color: #f8fafc; }

        /* Content Styles */
        .spf_link { color: #2563eb; text-decoration: none; font-weight: 600; }
        .spf_url_truncate {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #64748b;
        }
        .spf_badge {
          background: #f1f5f9; padding: 4px 10px; font-weight: bold; font-size: 0.8rem;
        }
        .spf_btn_group { display: flex; gap: 5px; justify-content: flex-end; }
        .spf_btn_edit, .spf_btn_del {
          border: 1px solid #e2e8f0; background: #fff;
          width: 32px; height: 32px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .spf_btn_edit { color: #3b82f6; }
        .spf_btn_del { color: #ef4444; }
        .spf_empty { text-align: center; padding: 40px; color: #94a3b8; }

        /* Pagination */
        .spf_pagination { display: flex; justify-content: flex-end; gap: 10px; align-items: center; }
        .spf_page_btn {
          padding: 8px 16px; background: #fff; border: 1px solid #e2e8f0; cursor: pointer; font-weight: 600;
        }
        .spf_page_btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spf_page_info { font-size: 0.9rem; color: #64748b; }

        /* Toast */
        .spf_toast {
          position: fixed; bottom: 30px; right: 30px; z-index: 9999;
          background: #fff; padding: 16px 20px; border-left: 5px solid #000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex; gap: 12px; align-items: center;
          animation: slideUp 0.3s ease;
        }

        /* Modal */
        .spf_modal_overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 9999;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .spf_modal_box {
          background: #fff; width: 100%; max-width: 500px; padding: 0;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .spf_modal_header {
          padding: 20px; border-bottom: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .spf_modal_header h3 { margin: 0; }
        .spf_modal_header button { border: none; background: transparent; cursor: pointer; }
        .spf_form { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .spf_form input, .spf_form textarea {
          width: 100%; padding: 12px; border: 1px solid #cbd5e1; outline: none; font-size: 1rem;
        }
        .spf_btn_save {
          background: #0f172a; color: #fff; padding: 12px; border: none; font-weight: bold; cursor: pointer;
        }

        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        /* Loading */
        .spf_loading { height: 100vh; background: #fff; }
      `}</style>
    </>
  );
}
