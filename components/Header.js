import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ background: '#0070f3', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none' }}>{"FREESHORTEN"}</Link>
      <nav>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>{"Home"}</Link>
      </nav>
    </header>
  );
}
