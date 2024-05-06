import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import { decode } from "html-entities"
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
              value: decode(answer),
              isCorrect: false,
              isSelected: false,
            }))

            answers.push({
              id: nanoid(),
              value: decode(entry.correct_answer),
              isCorrect: true,
              isSelected: false,
            })

            return {
              id: nanoid(),
              question: decode(entry.question),
              answers: answers,
            }
          })
        )
      })
  }, [])

  function toggleSelected(id) {
    const targetQuestion = questionObjects.find((question) =>
      question.answers.some((answer) => answer.id === id)
    )
    const targetAnswer = targetQuestion.answers.find(
      (answer) => answer.id === id
    )

    if (targetAnswer.isSelected) return

    setQuestionObjects((prevQuestionObj) => {
      const newQuestionObj = prevQuestionObj.map((question) => {
        if (question.id === targetQuestion.id) {
          return {
            ...question,
            answers: question.answers.map((answer) => {
              return answer.id === id
                ? { ...answer, isSelected: true }
                : { ...answer, isSelected: false }
            }),
          }
        } else {
          return question
        }
      })
      return newQuestionObj
    })
  }

  const questionElements = questionObjects.map(({ id, question, answers }) => {
    return (
      <Question
        key={id}
        id={id}
        question={question}
        answers={answers}
        handleClick={toggleSelected}
      />
    )
  })

  return <section>{questionElements}</section>
}
