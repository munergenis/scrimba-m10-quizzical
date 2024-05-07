export default function Question({ question, answers, handleClick }) {
  return (
    <div>
      <h2>{question}</h2>

      {/* TODO: EXPORT ANSWERS TO OWN COMPONENT */}

      {answers.map(({ id, questionID, value, isSelected }) => (
        <p
          className={isSelected ? "selected" : undefined}
          key={id}
          onClick={() => handleClick(id, questionID)}
        >
          {value}
        </p>
      ))}
    </div>
  )
}
