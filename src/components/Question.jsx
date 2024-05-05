export default function Question({ id, question, answers }) {
  return (
    <div>
      <h2>{question}</h2>
      {answers.map(({ id, value }) => (
        <p key={id}>{value}</p>
      ))}
    </div>
  )
}
