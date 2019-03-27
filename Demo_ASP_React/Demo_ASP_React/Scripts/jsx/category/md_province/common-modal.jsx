import React, { Component, Children } from 'react';
import { Modal, Button } from 'react-bootstrap'
class CommonModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }

    hide() {
        this.setState({ showModal: false });
    }

    show() {
        this.setState({ showModal: true });
    }

    handleSave(isContinues) {
        if (isContinues) {
            this.props.onSaveContinues(isContinues);
        } else {
            this.props.onSave(isContinues);
        }
    }

    render() {
        let groupbtn =
            <div>
                <Button bsStyle="primary" onClick={this.handleSave.bind(this, false)}>Lưu</Button>
                <Button onClick={this.hide.bind(this)}>Đóng</Button>
            </div>
        if (this.props.groupbtn) {
            groupbtn = this.props.groupbtn
        }
        // let divButonBusiness =     
        //     <div>
        //         <Button bsStyle="primary" onClick={this.handleSave.bind(this, true)}>Lưu & Tiếp tục</Button>            
        //         <Button bsStyle="primary" onClick={this.handleSave.bind(this, false)}>Lưu & Đóng</Button>      
        //         <Button onClick={this.hide.bind(this)}>Đóng</Button> 
        //     </div> 
        // if(this.props.isEdit){
        //     divButonBusiness = 
        //         <div>
        //             <Button bsStyle="primary" onClick={this.handleSave.bind(this, false)}>Lưu</Button>  
        //             <Button onClick={this.hide.bind(this)}>Đóng</Button>   
        //         </div>    
        // }

        return (
            <Modal dialogClassName={this.props.dialogClassName ? this.props.dialogClassName : null} id='box-modal' show={this.state.showModal} onHide={this.hide.bind(this)} {...this.props} backdrop='static'>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    {groupbtn}
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CommonModal;