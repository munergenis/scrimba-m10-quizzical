import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import { decode } from "html-entities"
import arrayShuffle from "array-shuffle"
import "./App.css"
import Question from "./components/Question"

const QUESTIONS_AMOUNT = 5
const fetchUrl = `https://opentdb.com/api.php?amount=${QUESTIONS_AMOUNT}&type=multiple`

export default function App() {
  const [startQuiz, setStartQuiz] = useState(false)
  const [questionObjects, setQuestionObjects] = useState([])
  const [selectedAnswersArr, setSelectedAnswersArr] = useState([])
  const [checked, setChecked] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    fetch(fetchUrl)
      .then((resp) => resp.json())
      .then((data) => {
        setQuestionObjects(
          data.results.map((entry) => {
            const question = {
              id: nanoid(),
              question: decode(entry.question),
              answers: [],
            }

            const answers = entry.incorrect_answers.map((answer) => ({
              questionID: question.id,
              id: nanoid(),
              value: decode(answer),
              isCorrect: false,
              isSelected: false,
            }))

            const correctAnswer = {
              questionID: question.id,
              id: nanoid(),
              value: decode(entry.correct_answer),
              isCorrect: true,
              isSelected: false,
            }

            question.answers = arrayShuffle([...answers, correctAnswer])

            return question
          })
        )
      })
  }

  function toggleSelected(id, questionID) {
    if (checked) return

    const targetQuestion = questionObjects.find(
      (question) => question.id === questionID
    )

    const targetAnswer = targetQuestion.answers.find(
      (answer) => answer.id === id
    )

    if (targetAnswer.isSelected) return

    setSelectedAnswersArr((prevSelAnswArr) => {
      const isQuestionAnswered = prevSelAnswArr.some(
        (answer) => answer.questionID === questionID
      )
      let newSelAnswArr
      if (isQuestionAnswered) {
        newSelAnswArr = prevSelAnswArr.map((selAns) =>
          selAns.questionID === questionID ? targetAnswer : selAns
        )
      } else {
        newSelAnswArr = [...prevSelAnswArr, targetAnswer]
      }
      return newSelAnswArr
    })

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

  function checkAnswers() {
    if (selectedAnswersArr.length < QUESTIONS_AMOUNT) {
      !showWarning && setShowWarning(true)
    } else {
      showWarning && setShowWarning(false)
      let correctAnswCount = correctAnswers
      for (const answer of selectedAnswersArr) {
        answer.isCorrect && correctAnswCount++
      }
      setCorrectAnswers(correctAnswCount)

      setChecked(true)
    }
  }

  function playAgain() {
    setStartQuiz(false)
    setQuestionObjects([])
    setSelectedAnswersArr([])
    setChecked(false)
    setShowWarning(false)
    setCorrectAnswers(0)

    fetchData()
  }

  const questionElements = questionObjects.map(({ id, question, answers }) => {
    return (
      <Question
        key={id}
        question={question}
        answers={answers}
        handleClick={toggleSelected}
        checked={checked}
      />
    )
  })

  const buttonObj = {
    text: checked ? "Play again" : "Check answers",
    handleClick: checked ? playAgain : checkAnswers,
  }

  function getPage() {
    if (startQuiz) {
      return (
        <main>
          {questionElements}
          {showWarning && <p>Answer all the questions</p>}
          {checked && (
            <p>
              {correctAnswers}/{QUESTIONS_AMOUNT} correct answers
            </p>
          )}
          <button onClick={buttonObj.handleClick}>{buttonObj.text}</button>
        </main>
      )
    } else {
      return (
        <main>
          <h1>Quizzical</h1>
          <button onClick={() => setStartQuiz(true)}>Start quiz</button>
        </main>
      )
    }
  }

  return getPage()
}
