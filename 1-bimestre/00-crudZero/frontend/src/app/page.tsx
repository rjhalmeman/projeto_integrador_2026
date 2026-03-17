import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-green-900 font-sans">

            {/* HEADER com fundo Aquamarine */}
            <header className="bg-[#7FFFD4] text-green-900 shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wider">
                        Candy Shop
                    </h1>

                    <ul className="flex space-x-6 font-medium">
                        <li>
                            <Link href="/" className="hover:text-green-700 transition-colors">
                                Início
                            </Link>
                        </li>
                   
                    </ul>
                </nav>
            </header>

            {/* BODY / MAIN CENTRALIZADO */}
            <main className="flex-grow flex items-center justify-center bg-white">

                {/* Link envolvendo uma tag <button> real com bordas arredondadas (rounded-xl) */}
                <Link href="/cargo">
                    <button className="w-[300px] h-[100px] bg-green-800 hover:bg-green-900 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                        CRUD Cargo
                    </button>
                </Link>

            </main>

            {/* FOOTER com fundo Aquamarine */}
            <footer className="bg-[#7FFFD4] border-t-2 border-[#60d6b0] text-green-900 text-center py-6">
                <p className="font-bold">
                    &copy; {new Date().getFullYear()} Candy Shop. Todos os direitos reservados.
                </p>
                <p className="text-sm mt-2 font-medium">
                    Painel de Gerenciamento do Sistema
                </p>
            </footer>

        </div>
    );
}