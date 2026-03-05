'use client';

import FlowerDecor from '@/components/FlowerDecor/FlowerDecor';
import members from '@/data/members.json';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './members.module.css';

interface Member {
  id: number;
  name: string;
  role: string;
  division: string;
  photo: string;
  quote: string;
}

function styledName(str: string) {
  const words = str.toLowerCase().split(' ');
  return words.map((word, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span className="script-initial">{word.charAt(0).toUpperCase()}</span>
      {word.slice(1)}
    </span>
  ));
}

const NOMINATION_CATEGORIES = [
  // Original / Kategori Netral:
  { id: 'rajin', name: 'The Most Rajin', desc: 'Paling tekun & rajin dalam segala proker' },
  { id: 'santuy', name: 'The Most Santuy', desc: 'Paling santai dan tenang dalam segala situasi' },
  { id: 'receh', name: 'The Most Receh', desc: 'Paling mudah ketawa/humoris' },
  { id: 'photogenic', name: 'The Most Photogenic', desc: 'Selalu on-point di kamera, fotonya bagus-bagus' },
  { id: 'multitasking', name: 'The Most Multitasking', desc: 'Bisa ngerjain banyak hal sekaligus tanpa panik' },
  { id: 'fashionable', name: 'The Most Fashionable', desc: 'Pakaiannya paling stylish di posko' },
  { id: 'update', name: 'The Most Update', desc: 'Paling tahu informasi terbaru atau info kampus' },
  { id: 'problem-solver', name: 'The Most Problem Solver', desc: 'Selalu solutif dan bisa diandalkan di segala kondisi' },

  // Kategori Kocak & Drama KKN:
  { id: 'beban-kelompok', name: 'The Most Beban Kelompok', desc: 'Sering ngilang mendadak pas proker lagi jalan' },
  { id: 'rawan-cinlok', name: 'The Most Rawan Cinlok', desc: 'Paling sering modus ke warga lokal atau teman seposko' },
  { id: 'kang-gosip', name: 'The Most Kang Gosip', desc: 'Lambe Turah-nya posko, tahu silsilah keluarga Pak Kades' },
  { id: 'jam-karet', name: 'The Most Jam Karet', desc: 'Disuruh kumpul jam 7, baru mandi jam 8, dateng jam 9' },
  { id: 'tukang-tidur', name: 'The Most Tukang Tidur', desc: 'Nempel dinding dikit pelor, 3 hari proker 4 hari molor' },
  { id: 'jago-masak', name: 'The Most MasterChef', desc: 'Penyelamat pertengahan bulan buat anak-anak yang kelaparan' },
  { id: 'kalong', name: 'The Most Manusia Kalong', desc: 'Melek pas malam buat begadang, baru tidur setelah subuh' },
  { id: 'misterius', name: 'The Most Misterius', desc: 'Datang tak diundang, pulang tak pamit, tahu-tahu ngilang bawa motor' },
  { id: 'bucin', name: 'The Most Bucin Maksimal', desc: 'Pojokan teras nelpon ayang terus 24/7 sambil senyum sendiri' },
  { id: 'tumbal-lpj', name: 'The Most Tumbal LPJ', desc: 'Ngetik Laporan Pertanggungjawaban sendirian sampai begadang' },
  { id: 'hedon', name: 'The Most Si Paling Hedon', desc: 'KKN ngeluh capek, tapi checkout Shopee dan paket kurir jalan terus' },
  { id: 'sabar', name: 'The Most Paling Sabar', desc: 'Kerjanya ngelus dada doang ngadepin kelakuan anak posko yang bar-bar' },
  { id: 'overthinking', name: 'The Most Overthinking', desc: 'Mikirin proker mulu, "Duh besok acara lancar ngga ya?", sampai susah tidur' },
  { id: 'seksi-ribet', name: 'The Most Seksi Ribet', desc: 'Dikit-dikit "Eh foto dulu dong buat bahan feed IG dan dokumentasi LPJ!"' },
  { id: 'ambis', name: 'The Most Ambis Proker', desc: 'Belum nanya persetujuan desa udah bikin draft program kerja lengkap sama RAB' },
  { id: 'pawon', name: 'The Most Kang Ngopi', desc: 'Candu kopi hitam, nggak bisa nyangkul kalau pagi belum ngopi' },
  { id: 'melokal', name: 'The Most Paling Melokal', desc: 'Saking akrabnya, sampai hapal nama kambing tetangga & diangkat anak kades' },
  { id: 'sapu', name: 'The Most Si Paling Bersih', desc: 'Bawaannya ngomel mulu lihat posko berantakan, tukang bersih-bersih tengah malem' },
  { id: 'suhu', name: 'The Most Suhu Asmara', desc: 'Tempat curhat paling manjur kalau ada prahara asmara antar teman seposko' },
  { id: 'asbun', name: 'The Most Asbun', desc: 'Asal Bunyi, celetukannya random banget tanpa disaring dulu bikin ngakak' },
  { id: 'kambing-hitam', name: 'The Most Kambing Hitam', desc: 'Selalu jadi sasaran dituduh kalau ada barang hilang atau makanan ludes di kulkas' },
  { id: 'anak-ilang', name: 'The Most Anak Ilang', desc: 'Sering nyasar pas disuruh belanja ke pasar kecamatan atau pencarian lokasi survey' },
  { id: 'sambat-batin', name: 'The Most Sambat Batin', desc: 'Kelihatan senyum terus di depan warga, aslinya di posko ngeluh meledak-ledak' },
  { id: 'kang-php', name: 'The Most Kang PHP', desc: '"Iya OTW posko" = OTW mandi. "Udah di jalan" = Baru keluarin motor' },
  { id: 'sesepuh', name: 'The Most Sesepuh Posko', desc: 'Omongannya paling bijak, sering dimintai fatwa sama teman-teman' }
];

export default function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [votes, setVotes] = useState<Record<string, Record<string, number>>>({});
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchVotes();

    const channel = supabase
      .channel('public:member_votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'member_votes' }, (payload: any) => {
        const { member_name, category, votes_count } = payload.new as any;
        setVotes(prev => ({
          ...prev,
          [member_name]: {
            ...(prev[member_name] || {}),
            [category]: votes_count
          }
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVotes = async () => {
    const { data, error } = await supabase.from('member_votes').select('*');
    if (error) {
      console.error('Error fetching votes:', error);
      return;
    }
    
    const formattedVotes: Record<string, Record<string, number>> = {};
    if (data) {
      data.forEach((row: any) => {
        if (!formattedVotes[row.member_name]) formattedVotes[row.member_name] = {};
        formattedVotes[row.member_name][row.category] = row.votes_count;
      });
    }
    setVotes(formattedVotes);
  };

  const handleVote = async (member: Member, categoryId: string) => {
    const memberName = member.name;
    setIsVoting(prev => ({ ...prev, [`${memberName}-${categoryId}`]: true }));

    // Implement upsert increment using RPC or upsert.
    // For this example, we'll try to fetch current row, then upsert count + 1.
    // Replace with a Supabase RPC like `increment_vote` for better concurrency.
    const { data: currentVote } = await supabase
      .from('member_votes')
      .select('votes_count, id')
      .eq('member_name', memberName)
      .eq('category', categoryId)
      .single();

    if (currentVote) {
      await supabase
        .from('member_votes')
        .update({ votes_count: currentVote.votes_count + 1 })
        .eq('id', currentVote.id);
    } else {
      await supabase
        .from('member_votes')
        .insert({ member_name: memberName, category: categoryId, votes_count: 1 });
    }

    setIsVoting(prev => ({ ...prev, [`${memberName}-${categoryId}`]: false }));
  };

  // Group by division
  const divisions = members.reduce((acc: Record<string, Member[]>, member) => {
    if (!acc[member.division]) acc[member.division] = [];
    acc[member.division].push(member);
    return acc;
  }, {});

  // Order divisions: Inti first
  const divisionOrder = ['Inti', 'Kesehatan Masyarakat', 'Prasarana Fisik', 'Sosial Budaya', 'Peningkatan Produksi', 'PDD'];
  const sortedDivisions = divisionOrder.filter(d => divisions[d]);

  return (
    <>
      {/* ===== FOTO BARENG ===== */}
      <section className={`section ${styles.groupPhotoSection}`}>
        <div className="container">
          <div className="section-heading">
            <span className="script-title">Our Teams</span>
            <div className="ornament-divider">
              <span className="ornament-icon">✦</span>
            </div>
            <p className="subtitle">Keluarga Besar KKN</p>
          </div>
          <div className={styles.groupPhotoWrap}>
            <Image
              src="/images/Team.png"
              alt="Foto Bersama KKN"
              className={styles.groupPhotoImg}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
          </div>
        </div>
      </section>

      <div className={`container ${styles.contentArea}`}>
        {/* Scattered flowers across the member grid */}
        <FlowerDecor size="medium" opacity={0.10} rotation={60} delay={0} top="5%" right="-1%" />
        <FlowerDecor size="large" blur="light" opacity={0.08} rotation={200} delay={2} top="25%" left="-3%" />
        <FlowerDecor size="small" opacity={0.14} rotation={310} delay={4} top="45%" right="5%" />
        <FlowerDecor size="xs" opacity={0.18} rotation={130} delay={1} top="60%" left="8%" />
        <FlowerDecor size="medium" blur="light" opacity={0.10} rotation={280} delay={3} top="75%" right="-2%" />
        <FlowerDecor size="small" opacity={0.12} rotation={20} delay={5} bottom="5%" left="3%" />

        {sortedDivisions.map((divName) => {
          const koor = divisions[divName].filter(m => m.role.toLowerCase().includes('koordinator'));
          const anggota = divisions[divName].filter(m => !m.role.toLowerCase().includes('koordinator'));

          const renderCard = (member: Member) => {
            const memberVotes = votes[member.name] || {};
            // Find category with highest votes
            let topCategory = '';
            let maxVotes = 0;
            Object.entries(memberVotes).forEach(([cat, count]) => {
              if (count > maxVotes) {
                maxVotes = count;
                topCategory = cat;
              }
            });
            const topCategoryName = NOMINATION_CATEGORIES.find(c => c.id === topCategory)?.name;

            return (
              <div
                key={member.id}
                className={styles.memberCard}
                onClick={() => setSelectedMember(member)}
              >
                {topCategoryName && maxVotes > 0 && <div className={styles.topBadge}>👑 {topCategoryName}</div>}
                <div className={styles.memberPhoto}>
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} fill sizes="(max-width: 768px) 45vw, 180px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{styledName(member.name)}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              </div>
            );
          };

          return (
            <div key={divName} className={styles.divisionGroup}>
              <h2 className={styles.divisionTitle}>{divName}</h2>
              <div className={styles.divisionLine}></div>

              {/* Koordinator — selalu centered di atas */}
              {koor.length > 0 && (
                <div className={styles.koorRow}>
                  {koor.map(renderCard)}
                </div>
              )}

              {/* Anggota — centered di bawah koor */}
              {anggota.length > 0 && (
                <div className={styles.memberGrid}>
                  {anggota.map(renderCard)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedMember(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>
            <div className={styles.modalPhoto}>
              {selectedMember.photo ? (
                <Image src={selectedMember.photo} alt={selectedMember.name} fill sizes="(max-width: 768px) 90vw, 400px" style={{ objectFit: 'cover' }} />
              ) : (
                <div className={styles.photoPlaceholder} style={{ fontSize: '5rem' }}>
                  {selectedMember.name.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.modalInfo}>
              <h2 className={styles.modalName}>{styledName(selectedMember.name)}</h2>
              <div className={styles.modalRole}>{selectedMember.role}</div>
              <div className={styles.modalDivision}>Divisi {selectedMember.division}</div>
              
              <div className={styles.modalQuote}>
                &ldquo;{selectedMember.quote}&rdquo;
              </div>
            </div>
            
            <div className={styles.voteSection}>
              <h3 className={styles.voteTitle}>Nominasikan {selectedMember.name.split(' ')[0].toUpperCase()} Sebagai:</h3>
              <div className={styles.categoryList}>
                {NOMINATION_CATEGORIES.map(category => {
                  const numVotes = votes[selectedMember.name]?.[category.id] || 0;
                  const isLoad = isVoting[`${selectedMember.name}-${category.id}`];
                  return (
                    <div key={category.id} className={styles.categoryItem}>
                      <div className={styles.categoryInfo}>
                        <span className={styles.categoryName}>{category.name}</span>
                        <span className={styles.categoryDesc}>{category.desc}</span>
                      </div>
                      <button 
                        className={styles.voteButton} 
                        disabled={isLoad}
                        onClick={() => handleVote(selectedMember, category.id)}
                      >
                        {isLoad ? (
                          <span className={styles.voteLabel}>...</span>
                        ) : (
                          <>
                            <span className={styles.voteLabel}>+1 Vote</span>
                            <span className={styles.voteCount}>{numVotes}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: '60px' }}></div>
    </>
  );
}
