import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-gray-800">
            Joyland
          </Link>
          
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/adopt" className="text-gray-600 hover:text-gray-900 transition-colors">
                Adopt a Tree
              </Link>
            </li>
            <li>
              <Link href="/giftbox" className="text-gray-600 hover:text-gray-900 transition-colors">
                Giftbox
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
