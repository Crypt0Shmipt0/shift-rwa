export function Footer() {
  return (
    <footer className="h-20 border-t border-border">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 text-xs text-muted-foreground">
        <span>© 2026 Shift Labs. Trading involves risk. Not investment advice.</span>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Disclaimer</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
