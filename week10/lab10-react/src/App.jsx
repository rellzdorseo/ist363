const students = [
  { suid: 123456, name: 'Sue Flay', year: 'senior', major: 'Applied Data Analytics' },
  { suid: 234567, name: 'Ella Vader', year: 'junior', major: 'Information Management and Technology' },
  { suid: 345678, name: 'Chris P Bacon', year: 'junior', major: 'Innovation, Society and Technology' }
];

function Students() {
  const filteredStudents = students.filter(
    (student) => student.name === 'Sue Flay'
  );

  return (
    <ul>
      {filteredStudents.map((student) => (
        <li key={student.suid}>
          {student.name}, {student.year}, {student.major}
        </li>
      ))}
    </ul>
  );
}

function handleClick(message) {
  console.log(message);
}

function App() {
  return (
    <div>
      <h1>Students</h1>
      <Students />
      <button onClick={() => handleClick("Button was clicked!")}>
        Click Me
      </button>
    </div>
  );
}

export default App;