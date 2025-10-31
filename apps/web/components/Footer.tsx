export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Forestal MT. All rights reserved.</p>
      </div>
    </footer>
  );
}
