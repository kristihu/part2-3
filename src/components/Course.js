import React from "react";

const Header = ({ title }) => {
  return <h1>{title}</h1>;
};

const Content = ({ course }) => {
  const sum = course.reduce((accumulator, part) => {
    return accumulator + part.exercises;
  }, 0);
  return (
    <>
      {course.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      Number of exercises: {sum}
    </>
  );
};

const Part = ({ part }) => {
  return (
    <div>
      <p>
        {part.name} {part.exercises}
      </p>
    </div>
  );
};

function Course({ course }) {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {course.map((part) => (
        <div key={part.id}>
          <Header title={part.name} />
          <Content course={part.parts} />
        </div>
      ))}
    </div>
  );
}

export default Course;
