import React from 'react';
import {Link} from 'react-router-dom';

class UserList extends React.Component{

    render(){
        const userList = this.props.userList;
        const {activeId} = this.props;
        var classes = "";
        return(
            <div className="list-group">
                {userList.map(element => {
                    if(element.id == activeId){
                        classes = "list-group-item list-group-item-action active"
                    }
                    else{
                        classes = "list-group-item list-group-item-action"   
                    }
                    return <Link className={classes} key={element.id} to={`${element.id}`}>{element.name}</Link>
                })}
            </div>
        );
    }
}

export default UserList