import React from 'react';
import AddGarbageForm from '../components/AddGarbageForm';

function adminroutes() {
  return (
    <div>
      <h1>Admin Routes</h1>
      <AddGarbageForm /> {/* Render the form here */}
    </div>
  );
}

export default adminroutes;
