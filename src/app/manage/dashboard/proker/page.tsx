'use client';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

interface Activity {
  id: string;
  title: string;
  division: string;
  description: string;
  date: string;
  coverImage: string;
  photos: string[];
  videos?: string[];
}

export default function ProkerManagementPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

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
    await fetchActivities(session.access_token);
    setLoading(false);
  }

  async function fetchActivities(accessToken: string) {
    try {
      const res = await fetch('/api/admin/proker', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setActivities(data.proker || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'photos' | 'videos') {
    const files = e.target.files;
    if (!files || !editingActivity) return;

    setUploadingFiles(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const ext = file.name.split('.').pop();
        formData.append('targetPath', `images/proker/${editingActivity.id}/${Date.now()}.${ext}`);
        formData.append('optimize', type !== 'videos' ? 'true' : 'false');

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        return data.path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);

      if (type === 'cover') {
        setEditingActivity({ ...editingActivity, coverImage: uploadedPaths[0] });
      } else if (type === 'photos') {
        setEditingActivity({
          ...editingActivity,
          photos: [...editingActivity.photos, ...uploadedPaths],
        });
      } else if (type === 'videos') {
        setEditingActivity({
          ...editingActivity,
          videos: [...(editingActivity.videos || []), ...uploadedPaths],
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      showToast('Gagal upload file', 'error');
    } finally {
      setUploadingFiles(false);
    }
  }

  async function handleSave() {
    if (!editingActivity) return;

    try {
      const exists = activities.find(a => a.id === editingActivity.id);
      const method = exists ? 'PUT' : 'POST';

      const res = await fetch('/api/admin/proker', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activity: editingActivity }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchActivities(token);
        setShowForm(false);
        setEditingActivity(null);
        showToast('Data berhasil disimpan!', 'success');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      showToast('Gagal menyimpan data', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;

    try {
      const res = await fetch(`/api/admin/proker?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        await fetchActivities(token);
        showToast('Kegiatan berhasil dihapus!', 'success');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      showToast('Gagal menghapus kegiatan', 'error');
    }
  }

  function handleNew() {
    setEditingActivity({
      id: '',
      title: '',
      division: '',
      description: '',
      date: '',
      coverImage: '',
      photos: [],
      videos: [],
    });
    setShowForm(true);
  }

  function handleEdit(activity: Activity) {
    setEditingActivity({ ...activity });
    setShowForm(true);
  }

  function removePhoto(index: number) {
    if (!editingActivity) return;
    const newPhotos = [...editingActivity.photos];
    newPhotos.splice(index, 1);
    setEditingActivity({ ...editingActivity, photos: newPhotos });
  }

  function removeVideo(index: number) {
    if (!editingActivity) return;
    const newVideos = [...(editingActivity.videos || [])];
    newVideos.splice(index, 1);
    setEditingActivity({ ...editingActivity, videos: newVideos });
  }

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
    <div className={styles.dashboardContainer}>
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
            <h2 className={styles.pageTitle}>Kelola Kegiatan</h2>
          </div>
          <button onClick={handleNew} className={styles.primaryButton}>
            + Tambah Kegiatan
          </button>
        </div>

        {showForm && editingActivity && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>
              {activities.find(a => a.id === editingActivity.id) ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>ID Kegiatan (slug)</label>
                <input
                  type="text"
                  value={editingActivity.id}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, id: e.target.value })
                  }
                  placeholder="pembekalan-kkn"
                  disabled={!!activities.find(a => a.id === editingActivity.id)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Judul Kegiatan</label>
                <input
                  type="text"
                  value={editingActivity.title}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, title: e.target.value })
                  }
                  placeholder="Pembekalan KKN"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Divisi</label>
                <input
                  type="text"
                  value={editingActivity.division}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, division: e.target.value })
                  }
                  placeholder="PDD / Kesehatan / dll"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tanggal</label>
                <input
                  type="text"
                  value={editingActivity.date}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, date: e.target.value })
                  }
                  placeholder="13 Juni 2025"
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Deskripsi</label>
                <textarea
                  value={editingActivity.description}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, description: e.target.value })
                  }
                  placeholder="Deskripsi kegiatan..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cover')}
                  disabled={uploadingFiles}
                />
                {editingActivity.coverImage && (
                  <img
                    src={editingActivity.coverImage}
                    alt="Cover"
                    style={{ width: 200, height: 120, objectFit: 'cover', marginTop: 8 }}
                  />
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Foto Kegiatan (multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'photos')}
                  disabled={uploadingFiles}
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {editingActivity.photos.map((photo, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          padding: '2px 6px',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Video Kegiatan (optional, multiple)</label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'videos')}
                  disabled={uploadingFiles}
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {editingActivity.videos?.map((video, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <video
                        src={video}
                        style={{ width: 150, height: 100, objectFit: 'cover' }}
                        controls
                      />
                      <button
                        onClick={() => removeVideo(idx)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          padding: '2px 6px',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {uploadingFiles && <p style={{ gridColumn: '1 / -1' }}>Uploading files...</p>}
            </div>

            <div className={styles.formActions}>
              <button onClick={handleSave} className={styles.primaryButton} disabled={uploadingFiles}>
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingActivity(null);
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
                <th>Cover</th>
                <th>Judul</th>
                <th>Divisi</th>
                <th>Tanggal</th>
                <th>Foto</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>
                    <img
                      src={activity.coverImage}
                      alt={activity.title}
                      style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </td>
                  <td>{activity.title}</td>
                  <td>{activity.division || '-'}</td>
                  <td>{activity.date}</td>
                  <td>{activity.photos.length} foto</td>
                  <td>
                    <button
                      onClick={() => handleEdit(activity)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
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
    </>
  );
}
