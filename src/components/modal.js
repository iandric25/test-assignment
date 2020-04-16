import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Modal extends React.Component{

    componentDidMount(){
        $(this.modal).modal('show');
        $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
    }

    componentWillUnmount() { 
        $(this.modal).modal('hide'); 
    }

    render(){
        return ReactDOM.createPortal( 
            <div className="modal fade" ref={modal=> this.modal = modal} id="exampleModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{this.props.modalTitle}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" onClick={this.props.onPrimaryBtnClick} className="btn btn-primary">{this.props.btnPrimaryText}</button>
                    </div>
                </div>
                </div>
            </div>, document.getElementById('modal-root')
        );
    }
}

export default Modal;