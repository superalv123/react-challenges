interface TermSelectorProps {
  options: string[]
  selectedTerm: string
  onSelectTerm: (term: string) => void
}

export const TermSelector = ({
  options,
  selectedTerm,
  onSelectTerm,
}: TermSelectorProps) => (
  <nav aria-label="Choose academic term" className="flex gap-2">
    {options.map((term) => (
      <button
        key={term}
        type="button"
        aria-pressed={selectedTerm === term}
        onClick={() => onSelectTerm(term)}
        className={`rounded-md border px-4 py-2 font-medium ${
          selectedTerm === term
            ? 'border-stone-900 bg-stone-900 text-white'
            : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-200'
        }`}
      >
        {term}
      </button>
    ))}
  </nav>
)
