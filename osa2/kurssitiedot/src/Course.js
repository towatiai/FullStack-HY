const Header = ({course}) => <h2>{course}</h2>;

const Content = ({parts}) => parts.map((part, i) => (<Part key={i} part={part}/>));

const Part = ({part}) => (
  <p>{part.name} {part.exercises}</p>
)

const Total = ({parts}) => (<strong>Total of {parts.reduce((prev, part) => prev + part.exercises, 0)} exercises</strong>);

// Course
export default ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}