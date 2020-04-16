import React from 'react';
import defaultImg from '../defaultImg.png';
import {occupationRoles, defaultUser} from '../models/models';
import editImg from '../editbtn.png';
import Modal from './modal';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

class UserCard extends React.Component{
    constructor(props){
        super(props);
        this.state = { disabledInputs : [], user : {}, removeModal : false, file: null, imagePreviewUrl: null, cropModal : false};
        this.onEditBtn = this.onEditBtn.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onRemoveBtn = this.onRemoveBtn.bind(this);
        this.handleHideRemoveModal = this.handleHideRemoveModal.bind(this);
        this.handleHideCropModal = this.handleHideCropModal.bind(this);
        this.handleRemoveUser = this.handleRemoveUser.bind(this);
        this.onEditPictureBtn = this.onEditPictureBtn.bind(this);
        this.onImgChange = this.onImgChange.bind(this);
        this.onCrop = this.onCrop.bind(this);
    }

    componentDidMount(){
        $(this.inputDate).datepicker({dateFormat:'yy/mm/dd', onSelect : (value) =>{
            let user = {...this.state.user};
            user.born = value;
            this.setState({user:user});
        }});
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.user.id === this.props.user.id) return;
        if(this.props.newContact === true){
            this.setState({disabledInputs : [], user : this.props.user});
            return;
        }
        var disabledInputs = [];
        Object.keys(this.props.user).map((value)=>{
            if(value != "id"){ 
                disabledInputs.push(value);
            }

        });
        this.setState({disabledInputs : disabledInputs, user: this.props.user, removeModal:false, cropModal: false});
    }

    componentWillUnmount(){
        $(this.inputDate).datepicker('destroy');
    }

    handleInputChange(e){
        var user = this.props.user;
        user[e.target.id]= e.target.value;
        this.setState({user : user});
    }

    onEditBtn(e){
        var disabledInputs = this.state.disabledInputs;
        const index = disabledInputs.indexOf(e.currentTarget.dataset.target);
        if (index > -1) {
            disabledInputs.splice(index,1);
        }
        this.setState({disabledInputs : disabledInputs});
    }

    onRemoveBtn(){
        this.setState({removeModal : true});
    }

    handleHideRemoveModal(){
        this.setState({removeModal : false});
    }

    handleHideCropModal(){
        this.setState({cropModal : false});
    }

    handleRemoveUser(){
        this.props.removeUserFn(this.state.user.id);
        this.setState({removeModal : false});
    }

    onEditPictureBtn(){
        this.inputImg.click();
    }

    onImgChange(e){
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
        this.setState({
            file: file,
            imagePreviewUrl: reader.result,
            cropModal:true
        });
        }

        reader.readAsDataURL(file)
    }

    onCrop(){
        let {user} = this.state;
        user.img = this.cropRef.getCroppedCanvas().toDataURL();
        this.setState({user:user,cropModal: false});
    }

    render(){
        const {disabledInputs} = this.state;
        const {user} = this.state;
        return(
            <React.Fragment>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{user.name}</h5>
                        <div>
                        {user.id ? <div><button type="button" onClick={()=>this.props.updateUser(this.state.user)} className="btn btn-primary">Update</button><button type="button" onClick={this.onRemoveBtn} className="btn btn-primary">Remove</button></div> : <button type="button" onClick={()=>this.props.addUser(this.state.user)} className="btn btn-primary">Add</button>} 
                        </div>
                    </div>
                    <input id="id" hidden defaultValue={user.id} />
                    <div className="modal-body row">
                        <div className="col-sm-12 col-md-12 col-lg-9  user-info">
                            <div className="form-group row">
                                <label htmlFor="name" className="col-form-label col-sm-3 col-5 col-md-3">Name:</label>
                                <div className="col-sm-9 col-7 col-md-9 d-flex align-items-center">
                                    <input type="text" className="form-control" id="name" onChange={this.handleInputChange} value={user.name} disabled={disabledInputs.indexOf("name") > -1 ? true : false} />
                                    <button onClick={this.onEditBtn} data-target="name" className="editBtn">
                                        <img src={editImg} />
                                    </button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="occupation" className="col-form-label col-sm-3 col-5 col-md-3">Occupation:</label>
                                <div className="col-sm-9 col-7 col-md-9 d-flex align-items-center">
                                    <select value={user.occupation} className="form-control" onChange={this.handleInputChange} id="occupation" disabled={disabledInputs.indexOf("occupation") > -1 ? true : false} >
                                        {Object.keys(occupationRoles).map((value)=>{
                                                return <option key={occupationRoles[value]}  value={occupationRoles[value]}>{occupationRoles[value]}</option>;
                                        })
                                        }
                                    </select>
                                    <button onClick={this.onEditBtn} data-target="occupation" className="editBtn">
                                        <img src={editImg} />
                                    </button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="born" className="col-form-label col-sm-3 col-5 col-md-3">Born:</label>
                                <div className="col-sm-9 col-7 col-md-9 d-flex align-items-center">
                                    <input ref={input => this.inputDate = input} placeholder="YYYY/MM/DD" type="text" readOnly className="form-control datepicker" id="born" value={user.born} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-3 user-img">
                            <button className="editBtn editPictureBtn" onClick={this.onEditPictureBtn}>
                                <input accept="image/png, image/jpeg" onChange={this.onImgChange} ref={input => this.inputImg = input} type="file" />
                                <img src={editImg} />
                            </button>
                            <img src={!user.img || user.img==="" ? defaultImg : user.img}></img>
                        </div>
                    </div>
                </div>
                {this.state.removeModal &&
                <Modal modalTitle={`Remove ${user.name}`} handleHideModal={this.handleHideRemoveModal} onPrimaryBtnClick={this.handleRemoveUser} btnPrimaryText="Remove">
                    <div>Remove {user.name} from contact list?</div>
                </Modal>
                }
                {
                    this.state.cropModal &&
                    <Modal modalTitle="Crop image" handleHideModal={this.handleHideCropModal} onPrimaryBtnClick={this.onCrop} btnPrimaryText="Crop">
                        <Cropper dragMode={"move"} cropBoxResizable={false} minCropBoxWidth={164} minContainerWidth={350} minContainerHeight={300} ref={cropper => this.cropRef = cropper} src={this.state.imagePreviewUrl} aspectRatio={1/1 } />
                    </Modal>
                }
            </React.Fragment>
        );
    }
}


export default UserCard;