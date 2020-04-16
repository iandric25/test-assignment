import React from 'react';

class Datepicker extends React.Component {  
  render() {
    return (      
      <input type="text" id="birthDate" className="datepicker form-control" placeholder="YYYY/MM/DD"/>
    );    
  }
}


export default Datepicker;