export function Clients() {
    return (
        <section className="py-20 bg-white border-y border-gray-100">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl font-bold text-gray-400 mb-12 uppercase tracking-widest">
                    Empresas que confiam na RenovaMente
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
                    {/* Logos (Placeholders) */}
                    <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">
                        LOGO 1
                    </div>
                    <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">
                        LOGO 2
                    </div>
                    <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">
                        LOGO 3
                    </div>
                    <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">
                        LOGO 4
                    </div>
                    <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">
                        LOGO 5
                    </div>
                    <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-400">
                        LOGO 6
                    </div>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-16 opacity-30">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}
