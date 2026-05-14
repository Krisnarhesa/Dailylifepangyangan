'use client';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

interface Member {
  id: number;
  name: string;
  role: string;
  division: string;
  photo: string;
  quote: string;
}

export default function MembersManagementPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    initPage();
  }, []);

  async function initPage() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/manage');
      return;
    }
    setToken(session.access_token);
    await fetchMembers(session.access_token);
    setLoading(false);
  }

  async function fetchMembers(accessToken: string) {
    try {
      const res = await fetch('/api/admin/members', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetPath', `images/members/member-${Date.now()}.jpg`);
      formData.append('optimize', 'true');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success && editingMember) {
        setEditingMember({ ...editingMember, photo: data.path });
        showToast('Gambar berhasil diupload', 'success');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Gagal upload gambar', 'error');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    if (!editingMember) return;

    try {
      const method = editingMember.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/members', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ member: editingMember }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchMembers(token);
        setShowForm(false);
        setEditingMember(null);
        showToast('Data berhasil disimpan!', 'success');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      showToast('Gagal menyimpan data', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Yakin ingin menghapus member ini?')) return;

    try {
      const res = await fetch(`/api/admin/members?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        await fetchMembers(token);
        showToast('Member berhasil dihapus!', 'success');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      showToast('Gagal menghapus member', 'error');
    }
  }

  function handleNew() {
    setEditingMember({
      id: 0,
      name: '',
      role: '',
      division: '',
      photo: '/images/members/placeholder.jpg',
      quote: '',
    });
    setShowForm(true);
  }

  function handleEdit(member: Member) {
    setEditingMember({ ...member });
    setShowForm(true);
  }

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <ToastContainer />
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/manage/dashboard" className={styles.navTitle}>
            ← Kembali ke Dashboard
          </Link>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className={styles.pageTitle}>Kelola Anggota</h2>
          </div>
          <button onClick={handleNew} className={styles.primaryButton}>
            + Tambah Anggota
          </button>
        </div>

        {showForm && editingMember && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>
              {editingMember.id ? 'Edit Anggota' : 'Tambah Anggota Baru'}
            </h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  placeholder="I MADE CANDRA ARYA WIRANATA"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  placeholder="Koordinator Desa"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Divisi</label>
                <select
                  value={editingMember.division}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, division: e.target.value })
                  }
                >
                  <option value="">Pilih Divisi</option>
                  <option value="Inti">Inti</option>
                  <option value="PDD">PDD</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Ekonomi">Ekonomi</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p>Uploading...</p>}
                {editingMember.photo && (
                  <img
                    src={editingMember.photo}
                    alt="Preview"
                    style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 8 }}
                  />
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Pesan & Kesan</label>
                <textarea
                  value={editingMember.quote}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, quote: e.target.value })
                  }
                  placeholder="Pesan dan kesan selama KKN..."
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button onClick={handleSave} className={styles.primaryButton}>
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMember(null);
                }}
                className={styles.secondaryButton}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>Role</th>
                <th>Divisi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </td>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.division}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(member)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className={styles.deleteButton}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
