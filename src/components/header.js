import React from 'react';
import {Link} from 'react-router-dom';

class Header extends React.Component{

    render(){
        return(
            <div className="row header-row" >
                <div className="col-md-3 col-4 d-flex align-items-center">
                    <h5>Contact list</h5>
                </div>
                <div className="col-md-9 col-8 d-flex align-items-center">
                    <div className="col-md-12 d-flex justify-content-end">
                        <Link className="btn btn-primary"  to="/"><span>+</span> New contact</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header