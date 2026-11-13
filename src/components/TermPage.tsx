import { useState } from 'react'
import type { Course } from '../types/schedule'
import { getConflictingCourseList } from '../utilities/calculateConflicts'
import { useProfile } from '../utilities/profile'
import { CourseCard } from './CourseCard'
import { CoursePlan } from './CoursePlan'
import { TermSelector } from './TermSelector'

const termTypes = ['Fall', 'Winter', 'Spring']

interface TermPageProps {
  courses: Course[]
}

export const TermPage = ({ courses }: TermPageProps) => {
  const { isAdmin } = useProfile()
  const [selectedTerm, setSelectedTerm] = useState('Fall')
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [isCoursePlanOpen, setIsCoursePlanOpen] = useState(false)
  const filteredCourses = courses.filter(
    (course) => course.term === selectedTerm,
  )
  const toggleCourse = (courseToToggle: Course) => {
    setSelectedCourses((currentCourses) =>
      currentCourses.some((course) => course.code === courseToToggle.code)
        ? currentCourses.filter((course) => course.code !== courseToToggle.code)
        : getConflictingCourseList(courseToToggle, currentCourses).length > 0
          ? currentCourses
        : [...currentCourses, courseToToggle],
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <TermSelector
          options={termTypes}
          selectedTerm={selectedTerm}
          onSelectTerm={setSelectedTerm}
        />
        <button
          type="button"
          onClick={() => setIsCoursePlanOpen(true)}
          className="rounded-md border border-stone-900 bg-white px-4 py-2 font-medium text-stone-900 hover:bg-stone-200"
        >
          Course plan ({selectedCourses.length})
        </button>
      </div>
      <section
        aria-label={`${selectedTerm} computer science courses`}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {filteredCourses.map((course) => {
          const isSelected = selectedCourses.some(
            (selectedCourse) => selectedCourse.code === course.code,
          )

          return (
            <CourseCard
              key={course.code}
              course={course}
              isSelected={isSelected}
              isUnavailable={
                !isSelected &&
                getConflictingCourseList(course, selectedCourses).length > 0
              }
              canEdit={isAdmin}
              onToggle={toggleCourse}
            />
          )
        })}
      </section>
      {isCoursePlanOpen && (
        <CoursePlan
          courses={selectedCourses}
          onClose={() => setIsCoursePlanOpen(false)}
        />
      )}
    </>
  )
}
