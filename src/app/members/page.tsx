'use client';

import FlowerDecor from '@/components/FlowerDecor/FlowerDecor';
import members from '@/data/members.json';
import { useState } from 'react';
import styles from './members.module.css';

interface Member {
  id: number;
  name: string;
  role: string;
  division: string;
  photo: string;
  quote: string;
}

export default function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Team.png"
              alt="Foto Bersama KKN"
              className={styles.groupPhotoImg}
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

          const renderCard = (member: Member) => (
            <div
              key={member.id}
              className={styles.memberCard}
              onClick={() => setSelectedMember(member)}
            >
              <div className={styles.memberPhoto}>
                {member.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={member.photo} alt={member.name} />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            </div>
          );

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
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={selectedMember.photo} alt={selectedMember.name} />
              ) : (
                <div className={styles.photoPlaceholder} style={{ fontSize: '5rem' }}>
                  {selectedMember.name.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.modalInfo}>
              <h2 className={styles.modalName}>{selectedMember.name}</h2>
              <p className={styles.modalRole}>{selectedMember.role}</p>
              <p className={styles.modalDivision}>Divisi {selectedMember.division}</p>
              <p className={styles.modalQuote}>
                &ldquo;{selectedMember.quote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: '60px' }}></div>
    </>
  );
}
