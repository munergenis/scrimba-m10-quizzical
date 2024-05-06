export default function Question({ id, question, answers, handleClick }) {
  return (
    <div>
      <h2>{question}</h2>
      {answers.map(({ id, value, isSelected }) => (
        <p
          className={isSelected ? "selected" : undefined}
          key={id}
          onClick={() => handleClick(id)}
        >
          {value}
        </p>
      ))}
    </div>
  )
}
