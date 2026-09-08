import { AnswerState } from './useLessonSession'

export function AnswerOptions({ label, options, answer, correct, state, onAnswer }: {
  label: string; options: string[]; answer: number | null | undefined; correct: number; state: AnswerState; onAnswer: (index: number) => void;
}) {
  return (
    <div className="qa-answer-list" role="radiogroup" aria-label={label}>
      {options.map((option, index) => {
        const selected = answer === index
        const checked = state !== 'idle' && selected
        return (
          <button key={option} role="radio" aria-checked={selected} tabIndex={index === (answer ?? 0) ? 0 : -1}
            className={`${selected ? 'selected' : ''} ${checked ? index === correct ? 'correct' : 'incorrect' : ''}`}
            onClick={() => onAnswer(index)}
            onKeyDown={event => {
              const direction = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
              if (direction === undefined && event.key !== 'Home' && event.key !== 'End') return
              event.preventDefault()
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + direction! + options.length) % options.length
              onAnswer(next)
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus()
            }}>
            <span className="qa-answer-marker">{String.fromCharCode(65 + index)}</span><span>{option}</span>{checked && <span aria-hidden="true">{index === correct ? '✓' : '×'}</span>}
          </button>
        )
      })}
    </div>
  )
}
