/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import axios from 'api/axios'
import useAuth from 'hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const questions = {
  q1: {
    question: 'Which one is correct team name in NBA?',
    options: [
      'New York Bulls',
      'Los Angeles Kings',
      'Golden State Warriros',
      'Huston Rocket'
    ],
    answer: 'Huston Rocket'
  },
  q2: {
    question: "'Namaste' is a traditional greeting in which Asian language?",
    options: ['Hindi', 'Mandarin', 'Nepalese', 'Thai'],
    answer: 'Hindi'
  },
  q3: {
    question:
      'The Spree river flows through which major European capital city?',
    options: ['Berlin', 'Paris', 'Rome', 'London'],
    answer: 'Berlin'
  }
}
export default function InsertCourse() {
  const navigate = useNavigate()
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)

  //Insert Course
  const [course, setCourse] = useState({
    name: '',
    slug: '',
    teacher_id: '2'
  })

  const handleInputChange = (event) => {
    setCourse({
      ...course,
      [event.target.name]: event.target.value
    })
  }

  const handleOptionSelect = (question, option) => {
    setSelectedAnswers({ ...selectedAnswers, [question]: option })
  }

  const handleSubmit = () => {
    let newScore = 0
    Object.keys(questions).forEach((question) => {
      if (selectedAnswers[question] === questions[question].answer) {
        newScore++
      }
    })
    setScore(newScore)
    setShowScore(true)
  }
  const submitCourse = async (event) => {
    event.preventDefault()
    console.log(course)

    axios({
      method: 'post',
      data: JSON.stringify(course),
      url: '/courses',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + auth.accessToken
      }
    })
      .then((res) => {
        // Update state
        console.log(res.data)
        navigate('/courses')
      })
      .catch((error) => {
        // handle any rejected Promises or errors, etc...
      })
  }

  const [teachers, setTeachers] = useState('')
  const { auth } = useAuth()

  useEffect(() => {
    axios({
      method: 'get',
      url: '/users?role=TEACHER',
      headers: { Authorization: 'Bearer ' + auth.accessToken }
    })
      .then((res) => {
        // Update state
        setTeachers(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        // handle any rejected Promises or errors, etc...
      })
  }, [auth])

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <form
        onSubmit={submitCourse}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Adicionar Curso
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Insira as informações do curso que deseja adicionar
              </p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Nome do Curso
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={course.name}
                    onChange={handleInputChange}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Sigla
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={course.slug}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Professor Responsável
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="teacher_id"
                    name="teacher_id"
                    value={course.teacher_id}
                    onSelect={handleInputChange}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  >
                    {teachers.data &&
                      teachers.data.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Adicionar
            </button>
          </div>
        </div>
      </form>
      <div className="container mx-auto px-4">
        {Object.keys(questions).map((question) => (
          <div className="mb-6" key={question}>
            <p className="text-lg font-medium">
              {questions[question].question}
            </p>
            <ul className="list-disc pl-5">
              {questions[question].options.map((option, i) => (
                <li key={i} className="text-base">
                  <input
                    type="radio"
                    name={question}
                    id={`${question}-${i}`}
                    value={option}
                    checked={selectedAnswers[question] === option}
                    onChange={() => handleOptionSelect(question, option)}
                  />
                  <label htmlFor={`${question}-${i}`}>{option}</label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
        {showScore && (
          <p className="text-lg font-medium">
            Your score is: {score} / {Object.keys(questions).length}
          </p>
        )}
      </div>
    </main>
  )
}
