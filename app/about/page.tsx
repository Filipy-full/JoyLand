export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-sage-50 to-white py-12 px-2">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-8 md:p-14 border border-sage-100">
        <h1 className="text-5xl font-serif text-sage-700 mb-6 text-center drop-shadow-lg tracking-tight">
          About Joyland
        </h1>
        <div className="w-20 h-1 bg-sage-300 rounded-full mx-auto mb-10" />
        <div className="prose prose-lg max-w-none text-sage-800">
          <section className="mb-14">
            <h2 className="text-2xl font-serif text-sage-700 mb-3 border-l-4 border-sage-400 pl-3">Our Story</h2>
            <p className="mb-2">Joyland began as a small project in northern Spain, rooted in a desire to care for the land and reconnect with natural rhythms. What started with a few olive and almond trees has grown into a living landscape, shaped by patience, observation, and a commitment to regeneration.</p>
            <p>We believe in working with nature, not against it. Our approach is slow, honest, and always evolving. Each season brings new lessons, challenges, and opportunities to deepen our relationship with the land and our community.</p>
          </section>
          <div className="w-full h-[2px] bg-sage-100 rounded-full mb-10" />
          <section className="mb-14">
            <h2 className="text-2xl font-serif text-sage-700 mb-3 border-l-4 border-sage-400 pl-3">Who We Are</h2>
            <p className="mb-2">Joyland is a family-run project, supported by friends, neighbors, and adopters from near and far. We are growers, caretakers, and learners—committed to sharing the real story of the land, its cycles, and its gifts.</p>
            <p>Our work is guided by respect for the soil, the trees, and the wider ecosystem. We invite you to join us, learn with us, and become part of this ongoing story.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
