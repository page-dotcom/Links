"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// --- TOAST COMPONENT (Notifikasi) ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className="spf_toast" style={{ borderLeftColor: isError ? '#ef4444' : '#10b981' }}>
      <span className="material-symbols-rounded" style={{ color: isError ? '#ef4444' : '#10b981' }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <div style={{ flex: 1 }}>
        <p className="spf_toast_msg">{message}</p>
      </div>
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
  const PAGE_SIZE = 15;

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
      showToast("Link berhasil disalin!");
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus link ini permanen?")) return;
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
      showToast("Update sukses");
      setEditingLink(null);
      fetchLinks(page, search);
    } else showToast("Slug mungkin sudah ada", "error");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading && !links.length) return <div className="spf_loading">Loading Dashboard...</div>;

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="spf_body">
        
        {/* TOPBAR */}
        <nav className="spf_navbar">
          <div className="spf_brand">
            <span className="material-symbols-rounded">admin_panel_settings</span>
            <span>Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="spf_btn_logout">
            <span className="material-symbols-rounded">logout</span>
          </button>
        </nav>

        {/* CONTENT */}
        <div className="spf_container">
          
          {/* STATS & SEARCH (Stack on Mobile) */}
          <div className="spf_toolbar">
            <div className="spf_stat_box">
              <span className="label">Total Links</span>
              <span className="count">{totalCount}</span>
            </div>

            <div className="spf_search_box">
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLinks(1, search)}
              />
              <span className="material-symbols-rounded icon">search</span>
            </div>
          </div>

          {/* TABLE WRAPPER (SCROLLABLE) */}
          <div className="spf_table_card">
            <div className="spf_scroll_area">
              <table className="spf_table">
                <thead>
                  <tr>
                    <th style={{ width: '150px' }}>Short Link</th>
                    <th style={{ width: '300px' }}>Destination</th>
                    <th style={{ width: '100px' }} className="center">Date</th>
                    <th style={{ width: '80px' }} className="center">Hits</th>
                    <th style={{ width: '100px' }} className="right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      {/* SHORT LINK & COPY BUTTON */}
                      <td>
                        <div className="spf_short_col">
                          <span className="slug">/{link.slug}</span>
                          <button onClick={() => handleCopy(link.slug)} className="spf_btn_copy" title="Copy">
                            <span className="material-symbols-rounded">content_copy</span>
                          </button>
                        </div>
                      </td>
                      
                      {/* DESTINATION (Truncated) */}
                      <td>
                        <div className="spf_url_text" title={link.original_url}>
                          {link.original_url}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="center">
                        <span className="date-text">
                          {new Date(link.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>

                      {/* HITS */}
                      <td className="center">
                        <span className="spf_badge">{link.clicks}</span>
                      </td>

                      {/* ACTIONS */}
                      <td className="right">
                        <div className="spf_actions">
                          <button onClick={() => setEditingLink(link)} className="spf_icon_btn edit">
                            <span className="material-symbols-rounded">edit</span>
                          </button>
                          <button onClick={() => handleDelete(link.id)} className="spf_icon_btn del">
                            <span className="material-symbols-rounded">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {links.length === 0 && (
                    <tr><td colSpan="5" className="empty-msg">No links found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="spf_pagination">
              <button onClick={() => fetchLinks(page - 1, search)} disabled={page === 1} className="page-btn">Prev</button>
              <span className="page-info">{page} / {totalPages || 1}</span>
              <button onClick={() => fetchLinks(page + 1, search)} disabled={page === totalPages} className="page-btn">Next</button>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL EDIT */}
      {editingLink && (
        <div className="spf_modal_overlay">
          <div className="spf_modal">
            <h3>Edit Link</h3>
            <label>Short Code</label>
            <input type="text" value={editingLink.slug} onChange={(e) => setEditingLink({...editingLink, slug: e.target.value})} />
            <label>Original URL</label>
            <textarea rows={3} value={editingLink.original_url} onChange={(e) => setEditingLink({...editingLink, original_url: e.target.value})} />
            <div className="spf_modal_btns">
              <button onClick={() => setEditingLink(null)} className="cancel">Cancel</button>
              <button onClick={handleUpdate} className="save">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL RESET */}
      <style jsx global>{`
        body { margin: 0; padding: 0; background-color: #f8fafc; }
        * { box-sizing: border-box; }
      `}</style>

      {/* CSS KHUSUS HALAMAN INI */}
      <style jsx>{`
        .spf_body {
          font-family: system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          background: #f8fafc;
          padding-bottom: 40px;
        }

        /* NAVBAR */
        .spf_navbar {
          background: #fff; height: 60px; padding: 0 20px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          position: sticky; top: 0; z-index: 100;
        }
        .spf_brand { font-weight: 800; font-size: 1.1rem; display: flex; gap: 8px; align-items: center; color: #0f172a; }
        .spf_btn_logout {
          background: #fee2e2; border: none; color: #ef4444; width: 36px; height: 36px;
          border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }

        /* CONTAINER */
        .spf_container {
          max-width: 1200px; margin: 0 auto; padding: 20px;
        }

        /* TOOLBAR (STATS & SEARCH) */
        .spf_toolbar {
          display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;
        }
        .spf_stat_box {
          background: #0f172a; color: #fff; padding: 15px 25px; border-radius: 12px;
          flex: 1; min-width: 150px; display: flex; flex-direction: column; justify-content: center;
        }
        .spf_stat_box .label { font-size: 0.8rem; opacity: 0.8; }
        .spf_stat_box .count { font-size: 1.8rem; font-weight: 800; line-height: 1.2; }

        .spf_search_box {
          flex: 2; min-width: 250px; position: relative;
        }
        .spf_search_box input {
          width: 100%; height: 100%; padding: 15px 15px 15px 45px;
          border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-size: 1rem;
          background: #fff;
        }
        .spf_search_box .icon {
          position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
          color: #94a3b8;
        }

        /* TABLE CARD */
        .spf_table_card {
          background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;
          overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        
        /* SCROLL AREA - INI KUNCINYA BIAR GAK JEBOL */
        .spf_scroll_area {
          width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;
        }

        .spf_table {
          width: 100%; min-width: 800px; /* Lebar minimum biar kolom gak gepeng */
          border-collapse: collapse;
        }
        
        .spf_table th {
          text-align: left; padding: 16px; background: #f1f5f9;
          font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }
        .spf_table td {
          padding: 14px 16px; border-bottom: 1px solid #f8fafc;
          font-size: 0.9rem; vertical-align: middle; color: #334155;
        }

        /* HELPERS */
        .center { text-align: center; }
        .right { text-align: right; }
        .slug { color: #2563eb; font-weight: 600; }
        .date-text { color: #64748b; font-size: 0.85rem; }

        /* SHORT LINK CELL (Text + Button) */
        .spf_short_col { display: flex; align-items: center; gap: 8px; }
        .spf_btn_copy {
          background: #eff6ff; border: 1px solid #dbeafe; color: #2563eb;
          width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .spf_btn_copy:active { background: #2563eb; color: #fff; }

        /* URL TRUNCATE */
        .spf_url_text {
          max-width: 280px; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; color: #64748b;
        }

        /* BADGE */
        .spf_badge {
          background: #f1f5f9; padding: 4px 10px; border-radius: 20px;
          font-weight: bold; font-size: 0.8rem;
        }

        /* ACTIONS */
        .spf_actions { display: flex; gap: 6px; justify-content: flex-end; }
        .spf_icon_btn {
          width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .edit { background: #fff; border: 1px solid #cbd5e1; color: #475569; }
        .del { background: #fff; border: 1px solid #fca5a5; color: #ef4444; }

        /* PAGINATION */
        .spf_pagination {
          padding: 15px; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; align-items: center; gap: 12px;
        }
        .page-btn {
          padding: 6px 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;
          font-weight: 600; cursor: pointer; font-size: 0.85rem;
        }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-info { font-size: 0.85rem; color: #64748b; }

        /* TOAST */
        .spf_toast {
          position: fixed; bottom: 20px; right: 20px; z-index: 9999;
          background: #fff; padding: 12px 16px; border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-left: 4px solid #333;
          display: flex; align-items: center; gap: 10px;
        }
        .spf_toast_msg { margin: 0; font-size: 0.9rem; font-weight: 600; color: #334155; }

        /* MODAL */
        .spf_modal_overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px;
        }
        .spf_modal {
          background: #fff; padding: 25px; border-radius: 16px; width: 100%; max-width: 450px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .spf_modal input, .spf_modal textarea {
          width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;
        }
        .spf_modal_btns { display: flex; gap: 10px; margin-top: 10px; }
        .save { flex: 1; padding: 12px; background: #0f172a; color: #fff; border: none; border-radius: 8px; font-weight: bold; }
        .cancel { flex: 1; padding: 12px; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: bold; }
        
        .spf_loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
        .empty-msg { text-align: center; padding: 40px; color: #94a3b8; }
      `}</style>
    </>
  );
}
