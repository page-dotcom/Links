"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// --- NEW TOAST (Model Snackar/Pil Hitam) ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className="spf_snackbar">
      <span className="material-symbols-rounded icon">
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span>{message}</span>
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
  const PAGE_SIZE = 20; // Tampil lebih banyak karena full screen

  // UI
  const [editingLink, setEditingLink] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  // --- INIT ---
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

  // --- ACTIONS ---
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

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

  const handleCopy = (slug) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast("Link disalin ke clipboard");
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus link ini?")) return;
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) {
      showToast("Link berhasil dihapus");
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
    } else showToast("Gagal update", "error");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading && !links.length) return <div className="spf_loading">Loading...</div>;

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="spf_layout">
        
        {/* TOPBAR FULL WIDTH */}
        <header className="spf_header">
          <div className="spf_brand">
            <span className="material-symbols-rounded">dashboard</span>
            <span>Link Manager</span>
          </div>
          <div className="spf_header_right">
            <span className="spf_total_badge">{totalCount} Links</span>
            <button onClick={handleLogout} className="spf_logout_btn">
              <span className="material-symbols-rounded">logout</span>
            </button>
          </div>
        </header>

        {/* TOOLBAR (SEARCH) */}
        <div className="spf_toolbar">
          <div className="spf_search_wrap">
             <span className="material-symbols-rounded search-icon">search</span>
             <input 
                type="text" 
                placeholder="Cari link..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLinks(1, search)}
             />
          </div>
        </div>

        {/* TABLE AREA - FULL WIDTH & FLAT */}
        <div className="spf_table_container">
          <table className="spf_table">
            <thead>
              <tr>
                <th width="15%">CREATED</th>
                <th width="20%">SHORT LINK</th>
                <th width="40%">DESTINATION</th>
                <th width="10%" className="text-center">CLICKS</th>
                <th width="15%" className="text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td>
                    <span className="spf_date">
                      {new Date(link.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td>
                    <div className="spf_short_row">
                      <a href={`/${link.slug}`} target="_blank" className="spf_slug_link">/{link.slug}</a>
                      <button onClick={() => handleCopy(link.slug)} className="spf_icon_action copy" title="Copy">
                        <span className="material-symbols-rounded">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="spf_long_url">{link.original_url}</div>
                  </td>
                  <td className="text-center">
                    <span className="spf_click_count">{link.clicks}</span>
                  </td>
                  <td className="text-right">
                    <div className="spf_action_group">
                      <button onClick={() => setEditingLink(link)} className="spf_icon_action edit">
                        <span className="material-symbols-rounded">edit</span>
                      </button>
                      <button onClick={() => handleDelete(link.id)} className="spf_icon_action del">
                        <span className="material-symbols-rounded">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr><td colSpan="5" className="spf_empty">Tidak ada data link.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION - FLAT */}
        <div className="spf_pagination">
          <button onClick={() => fetchLinks(page - 1, search)} disabled={page === 1}>Prev</button>
          <span>Page {page} / {totalPages || 1}</span>
          <button onClick={() => fetchLinks(page + 1, search)} disabled={page === totalPages}>Next</button>
        </div>

      </div>

      {/* MODAL EDIT - TAJAM */}
      {editingLink && (
        <div className="spf_modal_overlay">
          <div className="spf_modal">
            <div className="spf_modal_head">
               <h3>Edit Link</h3>
               <button onClick={() => setEditingLink(null)}><span className="material-symbols-rounded">close</span></button>
            </div>
            <div className="spf_modal_body">
              <label>Short Slug</label>
              <input type="text" value={editingLink.slug} onChange={(e) => setEditingLink({...editingLink, slug: e.target.value})} />
              
              <label>Original URL</label>
              <textarea rows={3} value={editingLink.original_url} onChange={(e) => setEditingLink({...editingLink, original_url: e.target.value})} />
              
              <button onClick={handleUpdate} className="spf_save_btn">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL RESET & CSS */}
      <style jsx global>{`
        body { margin: 0; padding: 0; background: #fff; font-family: sans-serif; }
      `}</style>

      <style jsx>{`
        .spf_layout {
          width: 100%;
          min-height: 100vh;
          background: #fff;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .spf_header {
          height: 60px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: sticky; top: 0; background: #fff; z-index: 10;
        }
        .spf_brand { font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; color: #111; }
        .spf_header_right { display: flex; align-items: center; gap: 15px; }
        .spf_total_badge { background: #f3f4f6; padding: 5px 10px; font-size: 0.8rem; font-weight: bold; color: #374151; }
        .spf_logout_btn { border: none; background: transparent; cursor: pointer; color: #ef4444; display: flex; align-items: center; }

        /* TOOLBAR */
        .spf_toolbar {
          padding: 20px;
          background: #fff;
        }
        .spf_search_wrap {
          position: relative;
          width: 100%;
        }
        .spf_search_wrap input {
          width: 100%; padding: 12px 12px 12px 40px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 1rem;
          outline: none;
        }
        .spf_search_wrap input:focus { border-color: #000; background: #fff; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

        /* TABLE - FULL WIDTH & FLAT */
        .spf_table_container {
          flex: 1;
          overflow-x: auto; /* Scroll samping aktif di HP */
          width: 100%;
        }
        .spf_table {
          width: 100%;
          min-width: 800px; /* Biar di HP gak gepeng, tapi bisa discroll */
          border-collapse: collapse;
        }
        .spf_table th {
          text-align: left;
          padding: 15px 20px;
          border-bottom: 2px solid #e5e7eb;
          font-size: 0.75rem;
          font-weight: 800;
          color: #6b7280;
          text-transform: uppercase;
        }
        .spf_table td {
          padding: 15px 20px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.9rem;
          color: #1f2937;
          vertical-align: middle;
        }
        .spf_table tr:hover { background: #f9fafb; }

        /* CONTENT STYLES */
        .spf_date { color: #6b7280; font-size: 0.85rem; }
        .spf_short_row { display: flex; align-items: center; gap: 10px; }
        .spf_slug_link { color: #2563eb; font-weight: 600; text-decoration: none; }
        .spf_long_url { 
          max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #6b7280; 
        }
        .spf_click_count { font-weight: 800; }
        
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* BUTTONS */
        .spf_icon_action {
          width: 32px; height: 32px;
          border: none; background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #6b7280;
        }
        .spf_icon_action:hover { background: #f3f4f6; color: #000; }
        .copy { color: #2563eb; background: #eff6ff; }
        .del { color: #ef4444; }
        
        .spf_action_group { display: flex; justify-content: flex-end; gap: 5px; }

        /* PAGINATION */
        .spf_pagination {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex; justify-content: center; align-items: center; gap: 20px;
        }
        .spf_pagination button {
          padding: 8px 16px; background: #000; color: #fff; border: none; font-weight: bold; cursor: pointer;
        }
        .spf_pagination button:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }

        /* SNACKBAR / TOAST (Notif Pil) */
        .spf_snackbar {
          position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
          background: #1f2937; color: #fff;
          padding: 12px 24px;
          display: flex; align-items: center; gap: 10px;
          z-index: 9999;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          min-width: 300px; justify-content: center;
          animation: fadeUp 0.3s ease-out;
        }
        .spf_snackbar .icon { font-size: 20px; color: #4ade80; }
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }

        /* MODAL */
        .spf_modal_overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 200;
          display: flex; align-items: center; justify-content: center;
        }
        .spf_modal {
          background: #fff; width: 100%; max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .spf_modal_head {
          padding: 20px; border-bottom: 1px solid #e5e7eb;
          display: flex; justify-content: space-between; align-items: center;
        }
        .spf_modal_head h3 { margin: 0; }
        .spf_modal_head button { border: none; background: transparent; cursor: pointer; }
        
        .spf_modal_body { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .spf_modal_body input, .spf_modal_body textarea {
          width: 100%; padding: 12px; border: 1px solid #d1d5db; outline: none; font-size: 1rem;
        }
        .spf_save_btn {
          padding: 14px; background: #000; color: #fff; border: none; font-weight: bold; cursor: pointer; margin-top: 10px;
        }

        .spf_loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; color: #6b7280; }
        .spf_empty { text-align: center; padding: 40px; color: #9ca3af; }
      `}</style>
    </>
  );
}
