export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Joyland</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Un pequeño olivar y almendral regenerativo en el norte de España.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-gray-900 transition-colors">Sobre nosotros</a></li>
              <li><a href="/faq" className="hover:text-gray-900 transition-colors">Preguntas frecuentes</a></li>
              <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-gray-600 text-sm">
              Email: info@joyland.es<br />
              Norte de España
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Joyland. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
