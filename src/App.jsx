import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import "./App.css"
import Question from "./components/Question"

export default function App() {
  const [questionObjects, setQuestionObjects] = useState([])

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((resp) => resp.json())
      .then((data) => {
        setQuestionObjects(
          data.results.map((entry) => {
            const answers = entry.incorrect_answers.map((answer) => ({
              id: nanoid(),
              value: answer,
              isCorrect: false,
              isSelected: false,
            }))

            answers.push({
              id: nanoid(),
              value: entry.correct_answer,
              isCorrect: true,
              isSelected: false,
            })

            return {
              id: nanoid(),
              question: entry.question,
              answers: answers,
            }
          })
        )
      })
  }, [])

  const questionElements = questionObjects.map(({ id, question, answers }) => {
    return <Question key={id} id={id} question={question} answers={answers} />
  })

  return <section>{questionElements}</section>
}
