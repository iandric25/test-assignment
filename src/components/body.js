import React from 'react';
import UserList from './user-list';
import UserCard from './user-card';
import {occupationRoles, defaultUser} from '../models/models';
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import Error from './error';

var userList=[
    {id:1,name:"Ivan", occupation: occupationRoles.DEVELOPER, born:"1995/01/25"},
    {id:2,name:"Marko", occupation: occupationRoles.CTO, born:"1996/01/21"},
    {id:3,name:"Kata", occupation: occupationRoles.CEO, born:"1969/03/11"}
]

function createDatabase(){
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
      }
    var dbPromise = openDB('test',1,{upgrade(db){
        if(!db.objectStoreNames.contains('users')){
            var usersOS = db.createObjectStore('users',{
                keyPath : 'id', autoIncrement: true
            });
        }
    }});
    return dbPromise;
}

class Body extends React.Component{
    constructor(props){
        super(props);
        this.state= {userList:[], id: undefined, contact: defaultUser, newContact:true, is404:false, dbPromise : createDatabase()};
        this.removeUser = this.removeUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    setActiveUser(id){
        if(id){
            let index = -1;
            let activeUser = null;
            this.state.userList.map((user, i) =>{
                if(id == user.id){
                    activeUser = {...user};
                    index = i;
                    return;
                }
                
            });
            if(index === -1){
                this.setState({is404:true});
                return;
            }
            this.setState({id:id, contact : activeUser, newContact : false, is404: false});
        }
        else{
            this.setState({newContact : true, contact : {...defaultUser}, id : undefined});
        }
    }

    componentDidMount(){
        this.state.dbPromise.then(db => {
            var tx = db.transaction('users','readonly');
            var store = tx.objectStore('users');
            return store.getAll();
        }).then(users => {
            if(users.length > 0){
                this.setState({userList : users});
            }
            const {id} = this.props.match.params;
            this.setActiveUser(id);
        });
        
    }

    componentDidUpdate(prevProps, prevState){
        const {id} = this.props.match.params;
        if(prevProps.match.params.id != id){
            this.setActiveUser(id);
        }
    }

    removeUser(id){
        this.state.dbPromise.then(function(db) {
            var tx = db.transaction('users', 'readwrite');
            var store = tx.objectStore('users');
            store.delete(id);
            return tx.complete;
          }).then(() => {
            let index = -1;
            var users = [...this.state.userList];
            this.state.userList.map((user, i) =>{
                if(id == user.id){
                    index = i;
                    return;
                }
            });
            if(index !== -1){
                users.splice(index,1)
            }
            this.setState({userList:users}, ()=>{this.props.history.push("/");});
          });
        

    }

    addUser(user){
        this.state.dbPromise.then(db=>{
            var tx = db.transaction('users','readwrite');
            var store = tx.objectStore('users');
            var OSRequest = store.add(user);
            OSRequest.then(e=>{
                user.id=e;
                var users = [...this.state.userList];
                users.push(user);
                this.setState({userList:users},()=>{this.props.history.push("/"+e)});
            });
            
        });
        
    }


    updateUser(user){
        this.state.dbPromise.then(function(db) {
            var tx = db.transaction('users', 'readwrite');
            var store = tx.objectStore('users');
            store.put(user);
            return tx.complete;
          }).then(()=> {
            let index = -1;
            var users = [...this.state.userList]
            users.forEach((value, i) =>{
                if(user.id == value.id){
                    index = i;
                }
            });
            if(index === -1){
                this.setState({is404:true});
                return;
            }
            users.splice(index,1,user);
            this.setState({userList:users});
          });
        
    }

    render(){
        var activeUser = this.state.contact;
        return(
            <Error>
                <div className="row body-row">
                    <div className="col-md-3 user-list">
                        <UserList  activeId={this.state.id} userList={this.state.userList}/>
                    </div>
                    <div className="col-md-9 user-card">
                        {!this.state.is404 ?
                            <UserCard newContact={this.state.newContact} user={activeUser} updateUser={this.updateUser} addUser={this.addUser} userList={this.state.userList} removeUserFn={this.removeUser} />
                            : <div><h2 className="text-center">User does not exist!</h2></div>
                        }
                    </div>
                </div>
            </Error>
        );
    }
}

export default Body