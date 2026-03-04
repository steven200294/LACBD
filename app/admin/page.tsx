'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  media_url?: string;
  media_type?: 'image' | 'video';
}

interface ProductMedia {
  id: number;
  product_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  position: number;
}

interface ProductVariation {
  id: number;
  product_id: number;
  title: string;
  price: number;
  position: number;
}

const categories = ["WEED 🍀", "HASH 🍫", "PHARMACIE 💊⚕️", "AUTRES 🪄"];

const categoryColors: Record<string, string> = {
  "WEED 🍀":        "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "HASH 🍫":        "bg-amber-500/20 text-amber-400 border-amber-500/40",
  "PHARMACIE 💊⚕️": "bg-blue-500/20 text-blue-400 border-blue-500/40",
  "AUTRES 🪄":      "bg-purple-500/20 text-purple-400 border-purple-500/40",
};

const emptyProduct: Omit<Product, 'id'> = { name: "", price: 0, description: "", category: categories[0], stock: 0 };

const ADMIN_PASSWORD = 'Seulcontretous.31200';

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [showAdminPwd, setShowAdminPwd] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'> & { id?: number }>(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [passwords, setPasswords] = useState<{ id: number; code: string; created_at: string }[]>([]);
  const [now, setNow] = useState(Date.now());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [pwdModal, setPwdModal] = useState<{ id: number; code: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Multi-media & variations state
  const [allMedia, setAllMedia] = useState<Record<number, ProductMedia[]>>({});
  const [allVariations, setAllVariations] = useState<Record<number, ProductVariation[]>>({});
  // For add/edit form
  const [formMedia, setFormMedia] = useState<ProductMedia[]>([]);
  const [formNewMediaFiles, setFormNewMediaFiles] = useState<File[]>([]);
  const [formVariations, setFormVariations] = useState<ProductVariation[]>([]);
  const [newVarTitle, setNewVarTitle] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('id');
    if (data) setProducts(data);
    setLoading(false);
  }, []);

  const fetchMedia = useCallback(async () => {
    const { data } = await supabase.from('product_media').select('*').order('position');
    if (data) {
      const grouped: Record<number, ProductMedia[]> = {};
      data.forEach((m: ProductMedia) => {
        if (!grouped[m.product_id]) grouped[m.product_id] = [];
        grouped[m.product_id].push(m);
      });
      setAllMedia(grouped);
    }
  }, []);

  const fetchVariations = useCallback(async () => {
    const { data } = await supabase.from('product_variations').select('*').order('position');
    if (data) {
      const grouped: Record<number, ProductVariation[]> = {};
      data.forEach((v: ProductVariation) => {
        if (!grouped[v.product_id]) grouped[v.product_id] = [];
        grouped[v.product_id].push(v);
      });
      setAllVariations(grouped);
    }
  }, []);

  const fetchPasswords = useCallback(async () => {
    const { data } = await supabase.from('passwords').select('*').order('created_at', { ascending: false });
    if (data) setPasswords(data);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchMedia();
    fetchVariations();
    fetchPasswords();
  }, [fetchProducts, fetchMedia, fetchVariations, fetchPasswords]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setPasswords(prev => {
        const expired = prev.filter(p => Date.now() - new Date(p.created_at).getTime() >= 24 * 60 * 60 * 1000);
        expired.forEach(p => supabase.from('passwords').delete().eq('id', p.id));
        return prev.filter(p => Date.now() - new Date(p.created_at).getTime() < 24 * 60 * 60 * 1000);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function uploadMedia(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    return { url: publicUrl, type: type as 'image' | 'video' };
  }

  async function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pwd = '';
    for (let i = 0; i < 6; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    const { error } = await supabase.from('passwords').insert({ code: pwd });
    if (!error) fetchPasswords();
  }

  async function removePassword(id: number) {
    await supabase.from('passwords').delete().eq('id', id);
    fetchPasswords();
  }

  function formatTimeLeft(createdAt: string) {
    const elapsed = now - new Date(createdAt).getTime();
    const remaining = Math.max(0, 24 * 60 * 60 * 1000 - elapsed);
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function openEdit(p: Product) {
    setForm({ ...p });
    setEditingId(p.id);
    setMediaFile(null);
    setFormMedia(allMedia[p.id] || []);
    setFormNewMediaFiles([]);
    setFormVariations(allVariations[p.id] || []);
    setNewVarTitle('');
    setNewVarPrice('');
  }

  function openAdd() {
    setForm({ ...emptyProduct });
    setShowAddModal(true);
    setMediaFile(null);
    setFormMedia([]);
    setFormNewMediaFiles([]);
    setFormVariations([]);
    setNewVarTitle('');
    setNewVarPrice('');
  }

  async function saveEdit() {
    if (editingId === null) return;
    let media_url = form.media_url;
    let media_type = form.media_type;
    if (mediaFile) {
      const uploaded = await uploadMedia(mediaFile);
      media_url = uploaded.url;
      media_type = uploaded.type;
    }

    // Upload new media files to product_media
    for (let i = 0; i < formNewMediaFiles.length; i++) {
      const uploaded = await uploadMedia(formNewMediaFiles[i]);
      await supabase.from('product_media').insert({
        product_id: editingId,
        media_url: uploaded.url,
        media_type: uploaded.type,
        position: (formMedia.length + i),
      });
    }

    // Update main product cover from first media if available
    const currentMedia = [...formMedia];
    if (formNewMediaFiles.length > 0 || currentMedia.length > 0) {
      if (!media_url && currentMedia.length > 0) {
        media_url = currentMedia[0].media_url;
        media_type = currentMedia[0].media_type;
      }
    }

    await supabase.from('products').update({
      name: form.name,
      price: formVariations.length > 0 ? Math.min(...formVariations.map(v => v.price)) : form.price,
      description: form.description,
      category: form.category,
      stock: form.stock,
      media_url,
      media_type,
    }).eq('id', editingId);

    setEditingId(null);
    setMediaFile(null);
    setFormNewMediaFiles([]);
    fetchProducts();
    fetchMedia();
    fetchVariations();
  }

  async function saveAdd() {
    let media_url = undefined;
    let media_type = undefined;
    if (mediaFile) {
      const uploaded = await uploadMedia(mediaFile);
      media_url = uploaded.url;
      media_type = uploaded.type;
    }

    const { data } = await supabase.from('products').insert({
      name: form.name,
      price: formVariations.length > 0 ? Math.min(...formVariations.map(v => v.price)) : form.price,
      description: form.description,
      category: form.category,
      stock: form.stock,
      media_url,
      media_type,
    }).select('id').single();

    if (data) {
      const productId = data.id;

      // Upload additional media files
      for (let i = 0; i < formNewMediaFiles.length; i++) {
        const uploaded = await uploadMedia(formNewMediaFiles[i]);
        await supabase.from('product_media').insert({
          product_id: productId,
          media_url: uploaded.url,
          media_type: uploaded.type,
          position: i,
        });
        // Set first as cover if no cover
        if (i === 0 && !media_url) {
          await supabase.from('products').update({ media_url: uploaded.url, media_type: uploaded.type }).eq('id', productId);
        }
      }

      // Save variations
      for (let i = 0; i < formVariations.length; i++) {
        await supabase.from('product_variations').insert({
          product_id: productId,
          title: formVariations[i].title,
          price: formVariations[i].price,
          position: i,
        });
      }
    }

    setShowAddModal(false);
    setMediaFile(null);
    setFormNewMediaFiles([]);
    fetchProducts();
    fetchMedia();
    fetchVariations();
  }

  async function deleteProduct(id: number) {
    await supabase.from('products').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchProducts();
    fetchMedia();
    fetchVariations();
  }

  function handleMediaSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    setForm(f => ({ ...f, media_url: url, media_type: type as 'image' | 'video' }));
  }

  function handleMultiMediaSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setFormNewMediaFiles(prev => [...prev, ...Array.from(files)]);
  }

  async function removeMediaItem(mediaId: number) {
    await supabase.from('product_media').delete().eq('id', mediaId);
    setFormMedia(prev => prev.filter(m => m.id !== mediaId));
    // Update cover if removed first item
    if (editingId) {
      const remaining = formMedia.filter(m => m.id !== mediaId);
      if (remaining.length > 0) {
        await supabase.from('products').update({ media_url: remaining[0].media_url, media_type: remaining[0].media_type }).eq('id', editingId);
      }
    }
  }

  function addVariation() {
    if (!newVarTitle.trim() || !newVarPrice) return;
    const newVar: ProductVariation = {
      id: Date.now(), // temp id for local state
      product_id: editingId || 0,
      title: newVarTitle.trim(),
      price: parseFloat(newVarPrice),
      position: formVariations.length,
    };
    setFormVariations(prev => [...prev, newVar]);
    // Save to DB if editing existing product
    if (editingId) {
      supabase.from('product_variations').insert({
        product_id: editingId,
        title: newVar.title,
        price: newVar.price,
        position: newVar.position,
      }).then(() => fetchVariations());
    }
    setNewVarTitle('');
    setNewVarPrice('');
  }

  async function removeVariation(varId: number) {
    await supabase.from('product_variations').delete().eq('id', varId);
    setFormVariations(prev => prev.filter(v => v.id !== varId));
    fetchVariations();
  }

  const isAdding = showAddModal;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-white font-black text-lg">ADMIN</h1>
            <p className="text-white/40 text-xs mt-1">Entrez le mot de passe administrateur</p>
          </div>
          <div className="relative mb-3">
            <input
              type={showAdminPwd ? "text" : "password"}
              value={adminPwd}
              onChange={e => { setAdminPwd(e.target.value); setAdminError(false); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (adminPwd === ADMIN_PASSWORD) setAuthenticated(true);
                  else setAdminError(true);
                }
              }}
              placeholder="Mot de passe..."
              className="w-full px-4 py-3 pr-12 text-sm bg-black/60 border border-pink-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500"
            />
            <button
              type="button"
              onClick={() => setShowAdminPwd(!showAdminPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-pink-400 transition-colors"
            >
              {showAdminPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
            </button>
          </div>
          {adminError && <p className="text-red-400 text-xs text-center mb-3">Mot de passe incorrect</p>}
          <button
            onClick={() => {
              if (adminPwd === ADMIN_PASSWORD) setAuthenticated(true);
              else setAdminError(true);
            }}
            className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]"
          >
            Accéder
          </button>
          <button
            onClick={() => router.push('/shop')}
            className="w-full py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 text-xs transition-all"
          >
            Retour au shop
          </button>
        </div>
      </div>
    );
  }

  // Reusable media & variations form section
  const renderMediaSection = () => (
    <div>
      <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Photos & Vidéos</label>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {/* Existing media from DB */}
        {formMedia.map(m => (
          <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden border border-pink-500/30">
            {m.media_type === 'video' ? (
              <video src={m.media_url} className="w-full h-full object-cover" muted autoPlay loop />
            ) : (
              <img src={m.media_url} alt="" className="w-full h-full object-cover" />
            )}
            <button type="button" onClick={() => removeMediaItem(m.id)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/70 hover:text-white text-[10px]">✕</button>
          </div>
        ))}
        {/* New files not yet uploaded */}
        {formNewMediaFiles.map((f, i) => (
          <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-pink-500/30 bg-black/40">
            {f.type.startsWith('video') ? (
              <video src={URL.createObjectURL(f)} className="w-full h-full object-cover" muted autoPlay loop />
            ) : (
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
            )}
            <button type="button" onClick={() => setFormNewMediaFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/70 hover:text-white text-[10px]">✕</button>
            <div className="absolute bottom-0 left-0 right-0 bg-pink-500/80 text-[8px] text-center text-black font-bold py-0.5">Nouveau</div>
          </div>
        ))}
        {/* Add button */}
        <label className="aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 hover:border-pink-500/50 cursor-pointer transition-all bg-white/5">
          <span className="text-lg text-white/30">+</span>
          <span className="text-[8px] text-white/30">Ajouter</span>
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMultiMediaSelect} />
        </label>
      </div>
    </div>
  );

  const renderVariationsSection = () => (
    <div>
      <label className="text-sm text-pink-400 uppercase tracking-wide font-bold">Variations de prix</label>
      <div className="mt-2 space-y-3">
        {formVariations.map(v => (
          <div key={v.id} className="flex items-center gap-3 bg-black/40 rounded-xl px-4 py-3.5 border border-white/10">
            <span className="flex-1 text-sm text-white font-semibold">{v.title}</span>
            <span className="text-pink-400 font-bold text-base">{v.price.toFixed(2)}€</span>
            <button type="button" onClick={() => removeVariation(v.id)} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm hover:bg-red-500/40 transition-all">✕</button>
          </div>
        ))}
        {/* Add variation */}
        <div className="space-y-2">
          <input
            placeholder="Titre (ex: 5g, 10g, 1L...)"
            value={newVarTitle}
            onChange={e => setNewVarTitle(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-black/60 border border-pink-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Prix en €"
              value={newVarPrice}
              onChange={e => setNewVarPrice(e.target.value)}
              className="flex-1 px-4 py-3 text-sm bg-black/60 border border-pink-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500"
            />
            <button
              type="button"
              onClick={addVariation}
              className="px-6 py-3 rounded-xl bg-pink-500 text-black text-sm font-bold hover:bg-pink-400 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="min-h-screen flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-20 bg-black border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.push('/shop')}
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/60 transition-all"
              aria-label="Retour"
            >
              <svg className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs text-pink-400/60 uppercase tracking-widest font-semibold">Panneau</span>
              <h1 className="text-lg font-black text-white tracking-wide">ADMIN</h1>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 transition-all text-black font-bold text-sm shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">

          {/* ── GÉNÉRATEUR DE MOT DE PASSE ── */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <h2 className="text-base font-bold text-white uppercase tracking-wide">Mots de passe</h2>
              </div>
              <button
                onClick={generatePassword}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Générer
              </button>
            </div>

            {passwords.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">Aucun mot de passe généré</p>
            ) : (
              <div className="space-y-3">
                {passwords.map((pwd) => (
                  <button
                    key={pwd.id}
                    onClick={() => setPwdModal({ id: pwd.id, code: pwd.code })}
                    className="w-full flex items-center justify-between bg-black/40 rounded-xl px-4 py-4 border border-white/5 hover:border-pink-500/30 hover:bg-black/60 transition-all active:scale-[0.98] text-left"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-lg font-bold text-pink-400 tracking-widest">{pwd.code}</span>
                      <span className="text-xs text-white/30 font-mono">{formatTimeLeft(pwd.created_at)} restant</span>
                    </div>
                    <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUITS ── */}
          {loading ? (
            <div className="text-center py-10 text-white/30 text-sm">Chargement...</div>
          ) : (
            <div className="space-y-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  {editingId === product.id ? (
                    /* ── Formulaire édition inline ── */
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Nom</label>
                          <input
                            className="w-full mt-0.5 px-2 py-1.5 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Prix principal (€)</label>
                          <input
                            type="number"
                            className="w-full mt-0.5 px-2 py-1.5 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Description</label>
                        <input
                          className="w-full mt-0.5 px-2 py-1.5 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                          value={form.description}
                          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        />
                      </div>
                      {/* Couverture */}
                      <div>
                        <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Couverture</label>
                        <div className="mt-1">
                          {form.media_url ? (
                            <div className="relative">
                              {form.media_type === 'video' ? (
                                <video src={form.media_url} className="w-full h-28 object-cover rounded-lg border border-pink-500/30" muted autoPlay loop />
                              ) : (
                                <img src={form.media_url} alt="Couverture" className="w-full h-28 object-cover rounded-lg border border-pink-500/30" />
                              )}
                              <button type="button" onClick={() => { setForm(f => ({ ...f, media_url: undefined, media_type: undefined })); setMediaFile(null); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/70 hover:text-white text-[10px]">✕</button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-20 rounded-lg border border-dashed border-white/20 hover:border-pink-500/50 cursor-pointer transition-all bg-white/5">
                              <span className="text-[10px] text-white/40">+ Photo / Vidéo couverture</span>
                              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaSelect} />
                            </label>
                          )}
                        </div>
                      </div>
                      {/* Multi-media */}
                      {renderMediaSection()}
                      {/* Variations */}
                      {renderVariationsSection()}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Catégorie</label>
                          <select
                            className="w-full mt-0.5 px-2 py-1.5 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                            value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Stock</label>
                          <input
                            type="number"
                            className="w-full mt-0.5 px-2 py-1.5 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                            value={form.stock}
                            onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={saveEdit} className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-black font-bold text-sm transition-all">Enregistrer</button>
                        <button onClick={() => { setEditingId(null); setMediaFile(null); }} className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    /* ── Affichage produit ── */
                    <div>
                      {/* Media couverture */}
                      {product.media_url && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                          {product.media_type === 'video' ? (
                            <video src={product.media_url} className="w-full h-36 object-cover" muted autoPlay loop />
                          ) : (
                            <img src={product.media_url} alt={product.name} className="w-full h-36 object-cover" />
                          )}
                        </div>
                      )}
                      {/* Mini preview des médias additionnels */}
                      {allMedia[product.id] && allMedia[product.id].length > 0 && (
                        <div className="flex gap-1 mb-2 overflow-x-auto">
                          {allMedia[product.id].map(m => (
                            <div key={m.id} className="w-10 h-10 rounded border border-white/10 overflow-hidden shrink-0">
                              {m.media_type === 'video' ? (
                                <video src={m.media_url} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                          ))}
                          <span className="text-[10px] text-white/30 self-center ml-1">{allMedia[product.id].length} média(s)</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm">{product.name}</h3>
                          <p className="text-white/50 text-xs mt-0.5 truncate">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openEdit(product)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-all"
                          >
                            <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {deleteConfirm === product.id ? (
                            <>
                              <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 rounded-lg bg-red-500/80 text-white text-xs font-bold hover:bg-red-500 transition-all">Suppr.</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-all">Non</button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
                            >
                              <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[product.category]}`}>
                          {product.category}
                        </span>
                        {allVariations[product.id] && allVariations[product.id].length > 0 ? (
                          <span className="text-pink-400 font-black text-sm">À partir de {Math.min(...allVariations[product.id].map(v => v.price)).toFixed(2)}€</span>
                        ) : (
                          <span className="text-pink-400 font-black text-sm">{product.price.toFixed(2)}€</span>
                        )}
                        <span className="text-white/40 text-xs">·</span>
                        <span className={`text-xs font-semibold ${product.stock < 10 ? 'text-red-400' : product.stock < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {product.stock} en stock
                        </span>
                        {allVariations[product.id] && allVariations[product.id].length > 0 && (
                          <span className="text-white/30 text-[10px]">· {allVariations[product.id].length} variation(s)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ajout produit ── */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-5 my-8">
            <h2 className="text-base font-black text-white mb-4">Nouveau produit</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Nom</label>
                  <input
                    className="w-full mt-0.5 px-3 py-2 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                    placeholder="CBD OIL 10%"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Prix principal (€)</label>
                  <input
                    type="number"
                    className="w-full mt-0.5 px-3 py-2 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                    placeholder="29.99"
                    value={form.price || ''}
                    onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Description</label>
                <input
                  className="w-full mt-0.5 px-3 py-2 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                  placeholder="Huile CBD premium..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              {/* Couverture */}
              <div>
                <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Photo de couverture</label>
                <div className="mt-1">
                  {form.media_url ? (
                    <div className="relative">
                      {form.media_type === 'video' ? (
                        <video src={form.media_url} className="w-full h-40 object-cover rounded-lg border border-pink-500/30" muted autoPlay loop />
                      ) : (
                        <img src={form.media_url} alt="Couverture" className="w-full h-40 object-cover rounded-lg border border-pink-500/30" />
                      )}
                      <button
                        type="button"
                        onClick={() => { setForm(f => ({ ...f, media_url: undefined, media_type: undefined })); setMediaFile(null); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/70 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-white/20 hover:border-pink-500/50 cursor-pointer transition-all bg-white/5">
                      <svg className="w-6 h-6 text-white/30 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[10px] text-white/40">Photo de couverture</span>
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaSelect} />
                    </label>
                  )}
                </div>
              </div>

              {/* Multi-media */}
              {renderMediaSection()}

              {/* Variations de prix */}
              {renderVariationsSection()}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Catégorie</label>
                  <select
                    className="w-full mt-0.5 px-3 py-2 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-pink-400/70 uppercase tracking-wide">Stock</label>
                  <input
                    type="number"
                    className="w-full mt-0.5 px-3 py-2 text-sm bg-black/60 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500"
                    placeholder="0"
                    value={form.stock || ''}
                    onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveAdd} className="flex-1 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">Ajouter</button>
              <button onClick={() => { setShowAddModal(false); setMediaFile(null); setFormNewMediaFiles([]); }} className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal mot de passe : Copier / Supprimer */}
      {pwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setPwdModal(null)}>
          <div className="w-full max-w-xs bg-black border border-white/10 rounded-2xl p-5 text-center" onClick={e => e.stopPropagation()}>
            <span className="font-mono text-2xl font-bold text-pink-400 tracking-widest">{pwdModal.code}</span>
            <div className="flex flex-col gap-3 mt-5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pwdModal.code);
                  setCopiedIndex(-1);
                  setTimeout(() => setCopiedIndex(null), 1500);
                  setPwdModal(null);
                }}
                className="w-full py-3.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2"
              >
                {copiedIndex === -1 ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Copié !
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copier
                  </>
                )}
              </button>
              <button
                onClick={() => { removePassword(pwdModal.id); setPwdModal(null); }}
                className="w-full py-3.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Supprimer
              </button>
              <button
                onClick={() => setPwdModal(null)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-sm transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
