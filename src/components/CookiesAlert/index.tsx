export default function CookiesAlert() {
  return (
    <div className="fixed bottom-0 right-0 z-[60] mx-auto w-full p-6 sm:max-w-sm">
      <div className="rounded-xl bg-gradient-to-br from-violet-700 to-sky-500 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="mt-2 text-sm text-white">
          Este site usa cookies para melhorar sua experiência de navegação.
        </p>
        <a
          className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/[.8] hover:text-white"
          href="#"
        >
          Saiba mais
          <svg
            className="h-2.5 w-2.5"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </a>
        <div className="mt-5 flex justify-between gap-x-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-3 py-[.4125rem] text-sm font-semibold text-white transition-all hover:border-white hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Aceitar todos
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-semibold text-white/[.8] ring-offset-white transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Rejeitar todos
          </button>
        </div>
      </div>
    </div>
  )
}
