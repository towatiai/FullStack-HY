import { useState } from 'react'

const StatisticsLine = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ stats }) => {

  const { good, bad, neutral } = stats;
  const all = good + bad + neutral;

  return (<>
    <h1>statistics</h1>
    {all === 0 ? <p>No feedback given</p>
      : <table>
        <tbody>
          <StatisticsLine label="good" value={good} />
          <StatisticsLine label="neutral" value={neutral} />
          <StatisticsLine label="bad" value={bad} />
          <StatisticsLine label="all" value={all} />
          <StatisticsLine label="average" value={(good * 1 + bad * -1) / all} />
          <StatisticsLine label="positive" value={good / all * 100 + "%"} />
        </tbody>
      </table>}
  </>)
}

const Button = ({ label, onClick }) => (<button onClick={onClick}>{label}</button>);

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <div style={{ display: "flex" }}>
        <Button label="good" onClick={() => setGood(good + 1)} />
        <Button label="neutral" onClick={() => setNeutral(neutral + 1)} />
        <Button label="bad" onClick={() => setBad(bad + 1)} />
      </div>

      <Statistics stats={{ good, neutral, bad }} />

    </div>
  )
}

export default App