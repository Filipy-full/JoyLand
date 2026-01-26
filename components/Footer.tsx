export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-orange-50 to-amber-50 border-t border-orange-100 mt-20">
      <div className="container mx-auto px-6 py-12">
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white p-8 rounded-lg mb-12 text-center shadow-lg">
          <h3 className="text-2xl font-serif mb-3">¿Listo para tu árbol?</h3>
          <p className="mb-6 opacity-90">Solo quedan 15 árboles disponibles</p>
          <a
            href="/adopt"
            className="inline-block bg-white text-orange-700 px-10 py-4 rounded-full hover:bg-orange-50 transition-all font-bold shadow-lg hover:shadow-xl"
          >
            ADOPTAR AHORA →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4 text-orange-900">Joyland</h3>
            <p className="text-orange-700 text-sm leading-relaxed mb-4">
              Olivares y almendros premium en el norte de España.
            </p>
            <div className="flex gap-2 text-yellow-500">
              ⭐⭐⭐⭐⭐ <span className="text-orange-700 text-sm">4.9/5</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-orange-900">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-orange-700">
              <li><a href="/adopt" className="hover:text-orange-600 transition-colors font-medium">🌿 Adoptar Árbol</a></li>
              <li><a href="/about" className="hover:text-orange-600 transition-colors">Sobre nosotros</a></li>
              <li><a href="/faq" className="hover:text-orange-600 transition-colors">Preguntas frecuentes</a></li>
              <li><a href="/contact" className="hover:text-orange-600 transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-orange-900">Garantías</h4>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>✓ Satisfacción garantizada</li>
              <li>✓ Envío gratis</li>
              <li>✓ Pago 100% seguro</li>
              <li>✓ Soporte 24/7</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-orange-900">Contacto</h4>
            <p className="text-orange-700 text-sm">
              📧 info@joyland.es<br />
              📍 Norte de España<br />
              📞 Soporte 24/7
            </p>
          </div>
        </div>
        
        <div className="border-t border-orange-200 mt-8 pt-8 text-center text-sm text-orange-700">
          <p>© {new Date().getFullYear()} Joyland. Todos los derechos reservados.</p>
          <p className="mt-2">🔒 Pago seguro con Stripe · 📦 Envío gratis · ⭐ 500+ clientes satisfechos</p>
        </div>
      </div>
    </footer>
  )
}
