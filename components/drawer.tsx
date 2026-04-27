interface DrawerProps {
  setOpen: (open: boolean) => void;
}

const drawer = ({ setOpen }: DrawerProps) => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'var(--charcoal)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button onClick={() => setOpen(false)}>
          insert x icon
        </button>
      </div>
      <ul>
        <li><a href="/" onClick={() => setOpen(false)}>Home</a></li>
        <li><a href="/about-me" onClick={() => setOpen(false)}>About Me</a></li>
        <li><a href="/training" onClick={() => setOpen(false)}>Training</a></li>
        <li><a href="/pricing" onClick={() => setOpen(false)}>Pricing</a></li>
        <li><a href="/contact" onClick={() => setOpen(false)}>Contact</a></li>
      </ul>
    </div>
  );


  export default drawer;