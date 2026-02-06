"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// --- KOMPONEN TOAST ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className="spf_toast" style={{ borderLeftColor: isError ? '#ef4444' : '#10b981' }}>
      <span className="material-symbols-rounded" style={{ color: isError ? '#ef4444' : '#10b981' }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <div>
        <h4 className="spf_toast_title">{isError ? 'Error' : 'Success'}</h4>
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

  // --- FUNGSI ---
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
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
    if (!confirm("Hapus permanen?")) return;
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

  if (loading && !links.length) return <div className="spf_loading_screen">Loading Dashboard...</div>;

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      {/* WRAPPER UTAMA (STANDALONE) */}
      <div className="spf_admin_body">
        
        {/* TOP NAVBAR (GANTINYA HEADER) */}
        <nav className="spf_navbar">
          <div className="spf_brand">
            <span className="material-symbols-rounded">admin_panel_settings</span>
            <span>Admin Dashboard</span>
          </div>
          <div className="spf_nav_actions">
            <span className="spf_user_mail">{user?.email}</span>
            <button onClick={handleLogout} className="spf_btn_logout">Logout</button>
          </div>
        </nav>

        {/* CONTENT AREA */}
        <main className="spf_main_content">
          
          <div className="spf_toolbar">
            <div className="spf_stats_card">
              <h3>Total Links</h3>
              <h1>{totalCount}</h1>
            </div>

            <div className="spf_search_wrapper">
              <span className="material-symbols-rounded spf_search_icon">search</span>
              <input 
                type="text" 
                placeholder="Search slug or url..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLinks(1, search)}
                className="spf_search_input"
              />
            </div>
          </div>

          <div className="spf_table_card">
            <div className="spf_table_responsive">
              <table className="spf_table">
                <thead>
                  <tr>
                    <th width="150">DATE</th>
                    <th width="250">SHORT LINK</th>
                    <th>DESTINATION</th>
                    <th width="100" className="text-center">HITS</th>
                    <th width="120" className="text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td>{new Date(link.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <div className="spf_short_cell">
                          <a href={`/${link.slug}`} target="_blank" className="spf_link_text">/{link.slug}</a>
                          {/* TOMBOL COPY */}
                          <button onClick={() => handleCopy(link.slug)} className="spf_btn_copy" title="Copy Link">
                            <span className="material-symbols-rounded">content_copy</span>
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="spf_long_url" title={link.original_url}>{link.original_url}</div>
                      </td>
                      <td className="text-center">
                        <span className="spf_badge">{link.clicks}</span>
                      </td>
                      <td className="text-right">
                        <div className="spf_actions_group">
                          <button onClick={() => setEditingLink(link)} className="spf_action_btn edit">
                            <span className="material-symbols-rounded">edit</span>
                          </button>
                          <button onClick={() => handleDelete(link.id)} className="spf_action_btn delete">
                            <span className="material-symbols-rounded">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {links.length === 0 && (
                    <tr><td colSpan="5" className="spf_empty">No links found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="spf_pagination">
              <button onClick={() => fetchLinks(page - 1, search)} disabled={page === 1} className="spf_page_btn">Prev</button>
              <span>Page {page} of {totalPages || 1}</span>
              <button onClick={() => fetchLinks(page + 1, search)} disabled={page === totalPages} className="spf_page_btn">Next</button>
            </div>
          </div>

        </main>
      </div>

      {/* MODAL EDIT */}
      {editingLink && (
        <div className="spf_modal_overlay">
          <div className="spf_modal">
            <h3>Edit Link</h3>
            <label>Slug (Short Code)</label>
            <input type="text" value={editingLink.slug} onChange={(e) => setEditingLink({...editingLink, slug: e.target.value})} className="spf_input" />
            <label>Original URL</label>
            <textarea rows={3} value={editingLink.original_url} onChange={(e) => setEditingLink({...editingLink, original_url: e.target.value})} className="spf_input" />
            <div className="spf_modal_actions">
              <button onClick={() => setEditingLink(null)} className="spf_btn_cancel">Cancel</button>
              <button onClick={handleUpdate} className="spf_btn_save">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS ISOLASI TOTAL */}
      <style jsx global>{`
        body { margin: 0; padding: 0; }
      `}</style>
      <style jsx>{`
        /* RESET & LAYOUT */
        .spf_admin_body {
          background-color: #f1f5f9;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          display: flex;
          flex-direction: column;
        }

        /* NAVBAR */
        .spf_navbar {
          background: #ffffff;
          height: 64px;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          position: sticky; top: 0; z-index: 100;
        }
        .spf_brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.2rem; }
        .spf_nav_actions { display: flex; align-items: center; gap: 20px; }
        .spf_user_mail { font-size: 0.9rem; color: #64748b; }
        .spf_btn_logout { 
          background: #fee2e2; color: #ef4444; border: none; padding: 8px 16px; 
          border-radius: 6px; font-weight: 600; cursor: pointer;
        }

        /* MAIN CONTENT */
        .spf_main_content {
          padding: 30px;
          max-width: 1600px; /* LEBAR MAKSIMAL BESAR */
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* TOOLBAR */
        .spf_toolbar { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
        .spf_stats_card {
          background: #0f172a; color: #fff; padding: 20px 30px;
          border-radius: 12px; min-width: 200px;
        }
        .spf_stats_card h3 { margin: 0; font-size: 0.9rem; opacity: 0.8; }
        .spf_stats_card h1 { margin: 5px 0 0 0; font-size: 2.5rem; }

        .spf_search_wrapper {
          flex: 1; background: #fff; border-radius: 12px; display: flex; align-items: center;
          padding: 0 15px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .spf_search_input {
          flex: 1; border: none; outline: none; padding: 15px; font-size: 1rem;
        }
        .spf_search_icon { color: #94a3b8; font-size: 24px; }

        /* TABLE CARD */
        .spf_table_card {
          background: #fff; border-radius: 12px; overflow: hidden;
          border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .spf_table_responsive { overflow-x: auto; }
        .spf_table { width: 100%; border-collapse: collapse; min-width: 900px; }
        
        .spf_table th {
          background: #f8fafc; text-align: left; padding: 16px 20px;
          font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }
        .spf_table td {
          padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem; vertical-align: middle;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* CELLS */
        .spf_short_cell { display: flex; align-items: center; gap: 10px; }
        .spf_link_text { color: #2563eb; font-weight: 600; text-decoration: none; }
        .spf_long_url { 
          max-width: 400px; white-space: nowrap; overflow: hidden; 
          text-overflow: ellipsis; color: #64748b; 
        }
        .spf_badge {
          background: #f1f5f9; padding: 4px 10px; border-radius: 20px; 
          font-weight: bold; font-size: 0.8rem;
        }

        /* BUTTONS */
        .spf_btn_copy {
          background: #eff6ff; border: 1px solid #dbeafe; color: #2563eb;
          width: 30px; height: 30px; border-radius: 6px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .spf_btn_copy:hover { background: #2563eb; color: #fff; }

        .spf_actions_group { display: flex; gap: 8px; justify-content: flex-end; }
        .spf_action_btn {
          width: 34px; height: 34px; border-radius: 6px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; border: none;
        }
        .edit { background: #fff; border: 1px solid #cbd5e1; color: #334155; }
        .delete { background: #fff; border: 1px solid #fca5a5; color: #ef4444; }

        /* PAGINATION */
        .spf_pagination {
          padding: 15px 20px; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; align-items: center; gap: 15px;
          font-size: 0.9rem; color: #64748b;
        }
        .spf_page_btn {
          padding: 6px 14px; background: #fff; border: 1px solid #e2e8f0;
          border-radius: 6px; cursor: pointer; font-weight: 600;
        }
        .spf_page_btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* TOAST */
        .spf_toast {
          position: fixed; bottom: 30px; right: 30px; background: #fff;
          padding: 16px 20px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-left: 5px solid #333; display: flex; align-items: center; gap: 12px; z-index: 9999;
        }
        .spf_toast_title { margin: 0; font-size: 0.9rem; font-weight: 700; }
        .spf_toast_msg { margin: 0; font-size: 0.8rem; color: #64748b; }

        /* MODAL */
        .spf_modal_overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200;
        }
        .spf_modal {
          background: #fff; padding: 30px; border-radius: 12px; width: 500px;
          display: flex; flex-direction: column; gap: 15px;
        }
        .spf_input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; outline: none; }
        .spf_modal_actions { display: flex; gap: 10px; margin-top: 10px; }
        .spf_btn_save { flex: 1; padding: 12px; background: #0f172a; color: #fff; border: none; cursor: pointer; }
        .spf_btn_cancel { flex: 1; padding: 12px; background: #fff; border: 1px solid #cbd5e1; cursor: pointer; }

        .spf_loading_screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9; }
      `}</style>
    </>
  );
}
