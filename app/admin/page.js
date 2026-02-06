"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingLink, setEditingLink] = useState(null);
  const router = useRouter();

  // CEK LOGIN SAAT HALAMAN DIBUKA
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Gak ada user? Tendang ke Login
      } else {
        setUser(user);
        fetchLinks(); // Ada user? Ambil data
      }
    }
    checkUser();
  }, [router]);

  const fetchLinks = async () => {
    const { data } = await supabase.from('links').select('*').order('created_at', { ascending: false });
    if (data) setLinks(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus permanen?")) return;
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) setLinks(links.filter(l => l.id !== id));
    else alert("Gagal hapus. Login dulu bos!");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('links').update({ slug: editingLink.slug, original_url: editingLink.original_url }).eq('id', editingLink.id);
    if (!error) {
      alert("Sukses!");
      setEditingLink(null);
      fetchLinks();
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Header />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <main style={{ minHeight: '85vh', padding: '40px 20px', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Dashboard Admin</h2>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {links.map(link => (
              <div key={link.id} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 'bold' }}>/{link.slug}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{link.original_url}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Hits: <b>{link.clicks}</b></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditingLink(link)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><span className="material-symbols-rounded">edit</span></button>
                  <button onClick={() => handleDelete(link.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><span className="material-symbols-rounded">delete</span></button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* MODAL EDIT (Sama kayak sebelumnya) */}
        {editingLink && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleUpdate} style={{ background: '#fff', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3>Edit Link</h3>
              <input value={editingLink.slug} onChange={e => setEditingLink({...editingLink, slug: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              <textarea value={editingLink.original_url} onChange={e => setEditingLink({...editingLink, original_url: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setEditingLink(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '6px' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px' }}>Simpan</button>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
