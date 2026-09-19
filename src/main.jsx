import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const people = [
  { id: 'linh', name: 'Linh Trần', handle: '@linhtran', initials: 'LT', tone: 'peach', online: true, preview: 'Mình vừa gửi bản cuối nhé.', time: '09:41' },
  { id: 'studio', name: 'Qalo Studio', handle: 'Nhóm thiết kế', initials: 'QS', tone: 'violet', online: true, preview: 'Bạn: Hẹn gặp mọi người lúc 10:00', time: '08:26' },
  { id: 'minh', name: 'Minh Anh', handle: '@minhanh', initials: 'MA', tone: 'blue', preview: 'Cảm ơn bạn nhiều!', time: 'Hôm qua' },
  { id: 'dao', name: 'Đào Phương', handle: '@daophuong', initials: 'ĐP', tone: 'mint', online: true, preview: 'Có thể xem giúp mình không?', time: 'Thứ Hai' },
  { id: 'khoa', name: 'Khoa Lê', handle: '@khoale', initials: 'KL', tone: 'rose', preview: 'Đã lưu tin nhắn', time: 'Chủ nhật' },
];
const initialMessages = {
  linh: [
    { id: 1, from: 'them', text: 'Chào buổi sáng! Mình vừa xem bản thiết kế mới.', time: '09:37' },
    { id: 2, from: 'me', text: 'Chào Linh, cảm ơn bạn nhé. Mình đã tinh chỉnh phần điều hướng để dễ dùng hơn.', time: '09:39', read: true },
    { id: 3, from: 'them', text: 'Rất ổn! Không gian thoáng và cảm giác riêng tư hơn hẳn.', time: '09:41' },
  ],
  studio: [{ id: 4, from: 'them', text: 'Chào mừng bạn đến với không gian Qalo.', time: '08:26' }],
  minh: [{ id: 5, from: 'them', text: 'Cảm ơn bạn nhiều!', time: 'Hôm qua' }],
  dao: [{ id: 6, from: 'them', text: 'Có thể xem giúp mình không?', time: 'Thứ Hai' }],
  khoa: [{ id: 7, from: 'them', text: 'Đã lưu tin nhắn', time: 'Chủ nhật' }],
};

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>, plus: <path d="M12 5v14M5 12h14"/>,
    message: <path d="M20 11.5a7.8 7.8 0 0 1-8 7.5 9 9 0 0 1-3.7-.8L4 20l1.3-3.8A7.3 7.3 0 0 1 4 12a7.8 7.8 0 0 1 8-7.5 7.8 7.8 0 0 1 8 7.5Z"/>,
    bell: <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/>, video: <><rect x="3" y="6" width="12" height="12" rx="3"/><path d="m15 10 5-3v10l-5-3"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>, paperclip: <path d="m20.5 11.5-8.7 8.7a5 5 0 0 1-7.1-7.1l9-9a3.5 3.5 0 1 1 5 5l-9 9a2 2 0 1 1-2.8-2.8l8.3-8.3"/>,
    smile: <><circle cx="12" cy="12" r="9"/><path d="M8 14s1.3 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></>, send: <path d="m21 3-7 18-3.8-7.2L3 10 21 3Zm-10.8 10.8L14 10"/>,
    dots: <path d="M5 12h.01M12 12h.01M19 12h.01"/>, check: <path d="m5 12 4 4L19 6"/>, lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function Avatar({ person, compact = false }) { return <div className={`avatar ${person.tone} ${compact ? 'compact' : ''}`}>{person.initials}{person.online && <i/>}</div>; }
function App() {
  const [activeId, setActiveId] = useState('linh'); const [messages, setMessages] = useState(initialMessages); const [draft, setDraft] = useState(''); const [query, setQuery] = useState(''); const [theme, setTheme] = useState('dark');
  const active = people.find((person) => person.id === activeId); const visiblePeople = useMemo(() => people.filter((person) => person.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const send = async (event) => { event.preventDefault(); const text = draft.trim(); if (!text) return; const message = { id: Date.now(), from: 'me', text, time: new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date()), read: true }; setMessages((current) => ({ ...current, [activeId]: [...(current[activeId] || []), message] })); setDraft(''); try { await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contactId: activeId, text }) }); } catch { /* The optimistic local message remains visible when offline. */ } };
  return <div className="site" data-theme={theme}><main className="app"><aside className="rail"><div className="brand"><span className="brand-symbol">q</span><span>qalo</span></div><div className="rail-actions"><button className="rail-button selected" aria-label="Tin nhắn"><Icon name="message"/></button><button className="rail-button" aria-label="Thông báo"><Icon name="bell"/></button></div><button className="user-orb" aria-label="Tài khoản">AN</button></aside><aside className="inbox"><header className="inbox-header"><div><p className="eyebrow">KHÔNG GIAN CỦA BẠN</p><h1>Tin nhắn</h1></div><button className="round-button accent" aria-label="Cuộc trò chuyện mới"><Icon name="plus"/></button></header><label className="search"><Icon name="search" size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm"/></label><div className="inbox-label"><span>GẦN ĐÂY</span><span>{visiblePeople.length}</span></div><nav className="contact-list">{visiblePeople.map((person) => <button className={`contact ${person.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(person.id)} key={person.id}><Avatar person={person} compact/><span className="contact-text"><strong>{person.name}</strong><small>{person.preview}</small></span><time>{person.time}</time></button>)}</nav><div className="privacy-note"><Icon name="lock" size={15}/><span><b>Cuộc trò chuyện riêng tư</b><small>Qalo bảo vệ không gian của bạn.</small></span></div></aside><section className="chat"><header className="chat-header"><Avatar person={active} compact/><div className="chat-person"><h2>{active.name}</h2><span>{active.online ? 'Đang hoạt động' : active.handle}</span></div><div className="header-tools"><button className="round-button" aria-label="Gọi video"><Icon name="video"/></button><button className="round-button" aria-label="Thông tin"><Icon name="info"/></button><button className="theme-switch" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Đổi giao diện">{theme === 'dark' ? <Icon name="sun" size={17}/> : <Icon name="moon" size={17}/>}</button></div></header><div className="message-area"><div className="date-divider"><span>Hôm nay</span></div>{(messages[activeId] || []).map((message) => <div className={`message-row ${message.from === 'me' ? 'outgoing' : ''}`} key={message.id}>{message.from === 'them' && <Avatar person={active} compact/>}<div className="message-content"><div className="bubble">{message.text}</div><div className="message-time">{message.time}{message.read && <span className="read"><Icon name="check" size={12}/><Icon name="check" size={12}/></span>}</div></div></div>)}<div className="typing"><b/><b/><b/><span>Linh đang soạn tin</span></div></div><form className="composer" onSubmit={send}><button type="button" className="composer-action" aria-label="Đính kèm"><Icon name="paperclip"/></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Nhắn cho ${active.name}`}/><button type="button" className="composer-action" aria-label="Biểu tượng cảm xúc"><Icon name="smile"/></button><button className="send-button" aria-label="Gửi tin nhắn"><Icon name="send" size={19}/></button></form><p className="secure-footer"><Icon name="lock" size={13}/> Bảo vệ quyền riêng tư, từ cuộc trò chuyện đầu tiên.</p></section><aside className="profile"><button className="more-button" aria-label="Thêm tùy chọn"><Icon name="dots"/></button><Avatar person={active}/><h3>{active.name}</h3><p>{active.handle}</p><button className="profile-button">Xem hồ sơ</button><div className="profile-section"><h4>Cuộc trò chuyện</h4><button>Ảnh, liên kết và tệp <span>12</span></button><button>Quyền riêng tư <Icon name="lock" size={15}/></button></div><div className="calm-card"><span className="spark">✦</span><p>Nhịp chậm lại,<br/>kết nối sâu hơn.</p></div></aside></main></div>;
}
createRoot(document.getElementById('root')).render(<App/>);
