export default function ColorPalette() {
  const palettes = [
    {
      name: "Materiale Naturale",
      colors: [
        { name: "Lemn Natural", bg: "bg-[#B4916C]", text: "Navbar" },
        { name: "Var Natural", bg: "bg-[#F7F3E9]", text: "Background Principal" },
        { name: "Lemn Închis", bg: "bg-[#846C5B]", text: "Footer" },
        { name: "Cărămidă", bg: "bg-[#C8847D]", text: "Accente" },
      ]
    },
    {
      name: "Materiale Moderne",
      colors: [
        { name: "Sticlă Mată", bg: "bg-[#9EB3B4]", text: "Navbar" },
        { name: "Vată Minerală", bg: "bg-[#F5F5F5]", text: "Background Principal" },
        { name: "Aluminiu", bg: "bg-[#4A5859]", text: "Footer" },
        { name: "Termoizolație", bg: "bg-[#D9B391]", text: "Accente" },
      ]
    },
    {
      name: "Combinație Tradițional-Modern",
      colors: [
        { name: "Lemn Tratat", bg: "bg-[#A89076]", text: "Navbar" },
        { name: "Tencuială", bg: "bg-[#F9F6F0]", text: "Background Principal" },
        { name: "Ardezie", bg: "bg-[#4F4B45]", text: "Footer" },
        { name: "Cărămidă Aparentă", bg: "bg-[#BC8F8F]", text: "Accente" },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Palete de Culori - Inspirate din Materiale pentru Case Pasive</h1>
        
        <div className="space-y-12">
          {palettes.map((palette) => (
            <div key={palette.name} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{palette.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {palette.colors.map((color) => (
                  <div key={color.name} className="space-y-2">
                    <div className={`h-24 rounded-lg ${color.bg} shadow-md`}></div>
                    <p className="font-medium">{color.name}</p>
                    <p className="text-sm text-gray-600">{color.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold">Exemple de Aplicare</h2>
          
          {palettes.map((palette) => (
            <div key={palette.name} className="space-y-4">
              <h3 className="text-xl font-medium">{palette.name}</h3>
              
              {/* Navbar Example */}
              <div className={`${palette.colors[0].bg} p-4 rounded-lg shadow-md`}>
                <div className="flex justify-between items-center text-white">
                  <div className="font-bold">Passive House Guide</div>
                  <div className="flex space-x-6">
                    <span>Principii</span>
                    <span>Materiale</span>
                    <span>Calculator</span>
                    <span>Contact</span>
                  </div>
                </div>
              </div>

              {/* Content Example */}
              <div className={`${palette.colors[1].bg} p-6 rounded-lg shadow-md`}>
                <div className={`${palette.colors[2].bg} text-white p-4 rounded mb-4 w-1/2 shadow-md`}>
                  Card Informativ
                </div>
                <div className={`${palette.colors[3].bg} text-white p-4 rounded w-1/3 shadow-md`}>
                  Buton Acțiune
                </div>
              </div>

              {/* Footer Example */}
              <div className={`${palette.colors[2].bg} p-4 rounded-lg text-white shadow-md`}>
                <div className="flex justify-between items-center">
                  <div> 2024 Passive House Guide</div>
                  <div className="flex space-x-6">
                    <span>Politica de Confidențialitate</span>
                    <span>Termeni și Condiții</span>
                    <span>Contact</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
