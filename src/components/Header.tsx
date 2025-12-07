export default function Header() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 mb-8 shadow-2xl group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/welcome_bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            The Hybrid Athlete Blueprint
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            Combine Calisthenics & Bodybuilding • Hack the Game
          </p>
        </div>

        <div className="mt-6">
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
            Master the art of hybrid training by combining the functional strength and body control of calisthenics with the targeted muscle development of bodybuilding. This 5-day split is designed for the athlete who refuses to choose between disciplines.
          </p>
        </div>
      </div>
    </div>
  );
}
