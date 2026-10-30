import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeftRight, Download, Eye, Lock, LockOpen, Receipt, Search, Users, Wallet } from 'lucide-react';
import { api } from '../lib/api';
import { money } from '../lib/format';
import { useUser } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { C } from '../components/charts';
import { GlowCard } from '../components/fx';
import { Empty, ErrorState, Input, Modal, PageHead, Rise, Skeleton, SkeletonRows, Stage, StatCard, StatSkeleton } from '../components/ui';
import type { AdminUser } from '../types';

const tip = { background: 'rgba(16,23,50,.96)', border: '1px solid rgba(255,255,255,.17)', borderRadius: 14 };

function UserDetail({ id, onClose }: { id: number; onClose: () => void }) {
  const q = useQuery({ queryKey: ['admin', 'user', id], queryFn: () => api.adminUser(id) });
  const d = q.data;
  return (
    <Modal onClose={onClose} title="Thông tin người dùng">
      {q.isLoading ? <SkeletonRows n={3} /> : q.isError || !d ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : (
        <>
          <div className="row mb-2" style={{ gap: 14 }}>
            <span className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>{d.username.charAt(0).toUpperCase()}</span>
            <div><div style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600 }}>{d.username}</div><div className="muted fs-13">{d.email || 'Chưa cập nhật email'} · tham gia {d.created_at}</div></div>
          </div>
          <div className="grid g-2 mb-2" style={{ gap: 12 }}>
            <div className="card card--tight"><div className="strip__label">Tổng số dư</div><div className="strip__value">{money(Number(d.total_balance))}</div></div>
            <div className="card card--tight"><div className="strip__label">Số ví</div><div className="strip__value">{d.total_wallets}</div></div>
          </div>
          <h4 className="group-title">5 giao dịch gần nhất</h4>
          {d.recent_transactions.length === 0 ? <Empty compact icon={Receipt} title="Chưa có giao dịch" /> : d.recent_transactions.map(t => (
            <div className="list-row" style={{ padding: '10px 0' }} key={t.id}>
              <div className="grow"><div className="tx__title">{t.note || 'Không có ghi chú'}</div><div className="tx__sub">{t.date}</div></div>
              <div className={`amount ${t.type === 'INCOME' ? 'amount--income' : 'amount--expense'}`}>{t.type === 'INCOME' ? '+' : ''}{money(Number(t.amount))}</div>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
}

function exportCsv(users: AdminUser[]) {
  const esc = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['ID', 'Tên đăng nhập', 'Email', 'Ngày tạo', 'Vai trò', 'Trạng thái'], ...users.map(u => [u.id, u.username, u.email ?? '', u.created_at, u.role, u.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'])];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + rows.map(r => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = 'QuanLyTaiKhoan.csv'; a.click(); URL.revokeObjectURL(a.href);
}

export default function Admin() {
  const user = useUser();
  const qc = useQueryClient();
  const { toast, confirm } = useFeedback();
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<number | null>(null);
  const isAdmin = user.role === 'ADMIN';
  const stats = useQuery({ queryKey: ['admin', 'stats'], queryFn: api.adminStats, enabled: isAdmin });
  const users = useQuery({ queryKey: ['admin', 'users'], queryFn: api.adminUsers, enabled: isAdmin });
  const ban = useMutation({
    mutationFn: (id: number) => api.toggleBan(id),
    onSuccess: res => { toast('success', res.message, 'Đã cập nhật'); qc.invalidateQueries({ queryKey: ['admin'] }); },
    onError: err => toast('error', err instanceof Error ? err.message : 'Có lỗi xảy ra'),
  });
  const list = users.data ?? [];
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return q ? list.filter(u => `${u.id} ${u.username} ${u.email ?? ''} ${u.role} ${u.created_at}`.toLowerCase().includes(q)) : list; }, [list, search]);
  const active = list.filter(u => u.status === 'ACTIVE').length;
  const banned = list.length - active;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  async function toggle(u: AdminUser) {
    const banning = u.status === 'ACTIVE';
    if (await confirm({ title: `${banning ? 'Khóa' : 'Mở khóa'} tài khoản ${u.username}?`, text: banning ? 'Người dùng này sẽ bị đăng xuất và không thể truy cập.' : 'Tài khoản sẽ được mở lại bình thường.', confirmText: banning ? 'Khóa tài khoản' : 'Mở khóa', danger: banning })) ban.mutate(u.id);
  }
  const bars = [{ name: 'Người dùng', value: stats.data?.total_users ?? 0, color: C.blue }, { name: 'Số ví', value: stats.data?.total_wallets ?? 0, color: C.income }, { name: 'Giao dịch', value: stats.data?.total_tx ?? 0, color: C.violet }];

  return (
    <Stage>
      <PageHead title="Quản trị hệ thống" desc="Theo dõi số liệu toàn hệ thống và quản lý tài khoản người dùng." />
      <Rise className="mb-2">
        <div className="grid g-3">
          {stats.isLoading ? [1, 2, 3].map(i => <StatSkeleton key={i} />) : stats.isError ? <div className="card" style={{ gridColumn: '1 / -1' }}><ErrorState error={stats.error} onRetry={() => stats.refetch()} /></div> : (
            <>
              <StatCard icon={Users} tone="blue" label="Người dùng" value={<span className="money">{stats.data!.total_users.toLocaleString('vi-VN')}</span>} />
              <StatCard icon={Wallet} tone="income" label="Tổng số ví" value={<span className="money">{stats.data!.total_wallets.toLocaleString('vi-VN')}</span>} />
              <StatCard icon={ArrowLeftRight} tone="warn" label="Tổng giao dịch" value={<span className="money">{stats.data!.total_tx.toLocaleString('vi-VN')}</span>} />
            </>
          )}
        </div>
      </Rise>
      <Rise className="mb-2">
        <div className="grid g-main">
          <GlowCard>
            <h3 className="card__title mb-2">Quy mô hệ thống</h3>
            {stats.isLoading ? <Skeleton h={240} r={18} /> : (
              <div style={{ height: 240 }}><ResponsiveContainer><BarChart data={bars} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={C.grid} strokeDasharray="2 6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: C.tick, fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: C.tick, fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,.04)' }} contentStyle={tip} />
                <Bar dataKey="value" name="Số lượng" radius={[10, 10, 0, 0]} maxBarSize={70} animationDuration={900}>{bars.map(b => <Cell key={b.name} fill={b.color} />)}</Bar>
              </BarChart></ResponsiveContainer></div>
            )}
          </GlowCard>
          <GlowCard>
            <h3 className="card__title mb-2">Trạng thái tài khoản</h3>
            {users.isLoading ? <Skeleton h={200} r={18} /> : (
              <>
                <div style={{ height: 180 }}><ResponsiveContainer><PieChart>
                  <Pie data={[{ name: 'Đang hoạt động', value: active }, { name: 'Bị khóa', value: banned }]} dataKey="value" innerRadius="68%" outerRadius="94%" paddingAngle={4} cornerRadius={6} stroke="none" animationDuration={900}>
                    <Cell fill={C.income} /><Cell fill={C.expense} />
                  </Pie><Tooltip contentStyle={tip} />
                </PieChart></ResponsiveContainer></div>
                <ul className="keys mt-1">
                  <li><span className="dot" style={{ background: C.income }} /><span>Đang hoạt động</span><span className="pct" /><span className="val">{active}</span></li>
                  <li><span className="dot" style={{ background: C.expense }} /><span>Bị khóa</span><span className="pct" /><span className="val">{banned}</span></li>
                </ul>
              </>
            )}
          </GlowCard>
        </div>
      </Rise>
      <Rise>
        <GlowCard className="card--flush">
          <div className="row between wrap" style={{ padding: '22px 24px 16px' }}>
            <h3 className="card__title">Danh sách người dùng</h3>
            <div className="row wrap">
              <div className="input-affix" style={{ minWidth: 240 }}><Search size={17} /><Input type="search" placeholder="Tìm theo tên, email..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Tìm người dùng" /></div>
              <button className="btn" disabled={!list.length} onClick={() => { exportCsv(filtered); toast('success', 'Đã xuất danh sách ra tệp CSV.'); }}><Download size={16} />Xuất CSV</button>
            </div>
          </div>
          {users.isLoading ? <SkeletonRows n={5} /> : users.isError ? <ErrorState error={users.error} onRetry={() => users.refetch()} />
            : filtered.length === 0 ? <Empty icon={Users} title="Không tìm thấy người dùng" text="Thử từ khóa khác." /> : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead><tr><th>ID</th><th>Tên đăng nhập</th><th>Email</th><th>Ngày tạo</th><th>Vai trò</th><th>Trạng thái</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
                  <tbody>{filtered.map(u => (
                    <tr key={u.id}>
                      <td className="muted">#{u.id}</td><td style={{ fontWeight: 500 }}>{u.username}</td><td className="muted">{u.email || 'Chưa cập nhật'}</td><td className="muted nowrap">{u.created_at}</td>
                      <td><span className={`pill ${u.role === 'ADMIN' ? 'pill--blue' : ''}`}>{u.role}</span></td>
                      <td>{u.status === 'ACTIVE' ? <span className="pill pill--income">Hoạt động</span> : <span className="pill pill--expense">Bị khóa</span>}</td>
                      <td style={{ textAlign: 'right' }} className="nowrap">
                        {u.role === 'ADMIN' ? <span className="muted fs-13">Quản trị viên</span> : (
                          <>
                            <button className="btn btn--sm" onClick={() => setDetail(u.id)} style={{ marginRight: 8 }}><Eye size={15} />Xem</button>
                            <button className={`btn btn--sm ${u.status === 'ACTIVE' ? 'btn--danger' : ''}`} onClick={() => toggle(u)} disabled={ban.isPending}>{u.status === 'ACTIVE' ? <Lock size={15} /> : <LockOpen size={15} />}{u.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
        </GlowCard>
      </Rise>
      {detail !== null && <UserDetail id={detail} onClose={() => setDetail(null)} />}
    </Stage>
  );
}
