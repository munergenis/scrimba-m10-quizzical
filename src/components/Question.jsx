export default function Question({ question, answers, handleClick, checked }) {
  function setAnswerStyle(isSelected, isCorrect) {
    let style
    if (checked && isCorrect) {
      style = "correct"
    } else if (checked && isSelected && !isCorrect) {
      style = "fail"
    } else if (isSelected) {
      style = "selected"
    }
    return style
  }

  return (
    <div>
      <h2>{question}</h2>

      {/* TODO: EXPORT ANSWERS TO OWN COMPONENT */}

      {answers.map(({ id, questionID, value, isSelected, isCorrect }) => (
        <p
          className={setAnswerStyle(isSelected, isCorrect)}
          key={id}
          onClick={() => handleClick(id, questionID)}
        >
          {value}
        </p>
      ))}
    </div>
  )
}
