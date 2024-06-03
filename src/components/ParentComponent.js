import React, { useState, useEffect } from 'react';
import Timer from './Timer';

const ParentComponent = () => {
  const [dueDateTime, setDueDateTime] = useState(null);

  useEffect(() => {
    // Example dynamic calculation of due date
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1); // 1 hour from now
    setDueDateTime(futureDate);
  }, []);

  const handleTimeOut = () => {
    console.log('Time is up!');
  };

  return (
    <div>
      <h1>Task Due Timer</h1>
      {dueDateTime && <Timer dueDateTime={dueDateTime} onTimeOut={handleTimeOut} />}
    </div>
  );
};

export default ParentComponent;
