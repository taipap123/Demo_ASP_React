import React, { Component } from 'react';
import Common from '../../../common/common.js'
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Confirm } from 'react-bootstrap'

class ListMD_PROVINCE extends Component {
    constructor(props) {
        super(props)
        let listData = this.props.listData;
        let listCountry = this.props.listCountry;
        this.state = {
            listData: listData,
            listCountry: listCountry,
            data: this.props.data,
            is_Modal: false,
            is_Confirm: false,
            is_Update: false,
            ModalTitle: '',
            lst_Country: []
        }

    }

    componentDidMount() {
        this.get_masterdata();
    }

    get_masterdata() {
        let state = this.state;
        state.listCountry.map((wp, i) => {
            state.lst_Country.push({ value: wp.COUNTRY_ID, label: wp.COUNTRY_NAME });
        });
        state.listData.map((wp, i) => {
            wp.Selected = false;
        });

        this.setState(state);
    }
    clearSelect(state) {
        state.listData.map((wp, i) => {
            wp.Selected = false;
        });
        this.setState(state);
    }
    clearValueModal(state) {
        state.data.PROVINCE_NAME = "";
        state.data.SHORT_NAME = "";
        state.data.CUSTOMIZE_NAME = "";
        state.data.DESCRIPTION = "";
        state.data.SORT_ORDER = "";
        state.data.COUNTRY_ID = null;
    }
    checkSelect(state) {
        return state.listData.findIndex(item => item.Selected === true)
    }
    handleAddItem(is_Update) {
        let state = this.state;
        console.log(is_Update);
        if (!is_Update) {
            state.ModalTitle = "Thêm Tỉnh/Thành";
            this.clearValueModal(state);
        }
        else {
            let index = this.checkSelect(state);
            if (index == -1) {
                alert("Chưa có Tỉnh/Thành phố được chọn !");
                return false;
            }
            else {
                state.ModalTitle = "Sửa Tỉnh/Thành";
                state.data.PROVINCE_ID = state.listData[index].PROVINCE_ID;
                state.data.PROVINCE_NAME = state.listData[index].PROVINCE_NAME;
                state.data.COUNTRY_ID = state.listData[index].COUNTRY_ID;
                state.data.COUNTRY_NAME = state.listData[index].COUNTRY_NAME;
                state.data.SHORT_NAME = state.listData[index].SHORT_NAME;
                state.data.CUSTOMIZE_NAME = state.listData[index].CUSTOMIZE_NAME;
                state.data.DESCRIPTION = state.listData[index].DESCRIPTION;
                state.data.SORT_ORDER = state.listData[index].SORT_ORDER;
            }
            state.is_Update = true;
        }
        state.is_Modal = true;
        this.setState(state);
    }

    handleHideModal() {
        let state = this.state;
        state.is_Modal = false;
        state.is_Update = false;
        this.setState(state);
    }

    handleChangeCountry(selectedOption) {
        let state = this.state;
        state.data.COUNTRY_ID = selectedOption.value;
        state.data.COUNTRY_NAME = selectedOption.label;
        this.setState(state);
    }
    handleClickItem(i) {
        let state = this.state;
        this.clearSelect(state);
        state.listData[i].Selected = true;
        console.log(i);
        this.setState(state);
    }
    DeleteItem(state) {
        state.listData.map((wp, i) => {
            if (wp.Selected) {
                let postData = {
                    json: JSON.stringify({ ID: wp.PROVINCE_ID })
                }
                console.log(postData);
                Common.post('/Content/DeleteItem', postData, (response) => {
                    if (response.Success) {
                        Common.get('/Content/getLstProvince', null, (response) => {
                            state.listData = JSON.parse(response.Data);
                            state.is_Modal = false;
                            this.setState(state);

                        })
                        $.notifySuccess(response)
                    } else {
                        $.notifyError(response)
                    }
                })
            }
        })
    }

    show_HandleDelete() {
        let state = this.state;
        confirmAlert({
            title: 'Xóa Tỉnh/Thành phố',
            message: 'Bạn chắc chưa ? Suy nghĩ kỹ',
            buttons: [
                {
                    label: 'Chơi lun',
                    onClick: () => this.DeleteItem(state)
                },
                {
                    label: 'Suy nghĩ',
                }
            ]
        });
    }

    handleInputChange(event) {
        let data = this.state.data;
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;

        if (target.type === 'select-one') {
            let index = event.nativeEvent.target.selectedIndex;
            data['COUNTRY_NAME'] = event.nativeEvent.target[index].text
        }

        if (target.type === 'checkbox') {
            switch (value) {
                case true:
                    value = 1;
                    break;
                default:
                    value = 0;
                    break;
            }
        }
        let name = target.name;
        data[name] = value;
        this.setState({
            data: data
        });
    }

    refreshData(state){
        Common.get('/Content/getLstProvince', null, (response) => {
            state.listData = JSON.parse(response.Data);
            state.is_Modal = false;
            this.setState(state);
        });
    }
    handleSaveModal() {
        var data = this.state.data;
        let state = this.state;
        let postData = {
            json: JSON.stringify(data)
        }
        if (state.is_Update) {
            Common.post('/Content/UpdateItem', postData, (response) => {
                if (response.Success) {
                    for (var key in this.state.data) {
                        this.state.data[key] = '';
                    }
                    $.notifySuccess(response);
                    this.refreshData(state);
                } else {
                    $.notifyError(response)
                }
            }, (error) => {
                console.log(error)
            })
        }
        else {
            Common.post('/Content/SaveItem', postData, (response) => {
                if (response.Success) {
                    for (var key in this.state.data) {
                        this.state.data[key] = '';
                    }
                    $.notifySuccess(response);
                    this.refreshData(state);
                } else {
                    $.notifyError(response)
                }
            }, (error) => {
                console.log(error)
            })
        }
    }
    renderFormModel() {
        return (
            <div>
                <form action='/Content/SaveItem' className='form-horzital' id='frmApartment' method='post'>
                    <div className='row'>
                        <div className='form-group col-md-12 col-sm-12 col-xs-12'>
                            <label className="required col-md-3 col-sm-3 col-xs-12">Tên tỉnh/thành</label>
                            <div className='col-md-9 col-sm-9 col-xs-12'>
                                <input type='text' className='form-control input-sm' id='PROVINCE_NAME' name='PROVINCE_NAME'
                                    onChange={this.handleInputChange.bind(this)} value={this.state.data.PROVINCE_NAME} />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-12 col-sm-12 col-xs-12'>
                            <label className="required col-md-3 col-sm-3 col-xs-12" htmlFor='COUNTRY_ID'>Quốc gia</label>
                            <div className='col-md-9 col-sm-9 col-xs-12'>
                                <Select
                                    classNamePrefix='react-select-level3'
                                    values={this.state.data.COUNTRY_ID}
                                    onChange={this.handleChangeCountry.bind(this)}
                                    options={this.state.lst_Country}
                                    placeholder='--Chọn Quốc gia--'
                                    ignoreAccents={true}
                                    ignoreCase={true}
                                    isLoading={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-12 col-sm-12 col-xs-12'>
                            <label className="col-md-3 col-sm-3 col-xs-12">Tên rút gọn</label>
                            <div className='col-md-9 col-sm-9 col-xs-12'>
                                <input type='text' className='form-control input-sm' id='SHORT_NAME' name='SHORT_NAME' onChange={this.handleInputChange.bind(this)} value={this.state.data.SHORT_NAME} />

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-12 col-sm-12 col-xs-12'>
                            <label className="col-md-3 col-sm-3 col-xs-12">Tên tùy biến</label>
                            <div className='col-md-9 col-sm-9 col-xs-12'>
                                <input type='text' className='form-control input-sm' id='CUSTOMIZE_NAME' name='CUSTOMIZE_NAME' onChange={this.handleInputChange.bind(this)} value={this.state.data.CUSTOMIZE_NAME} />

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-12 col-sm-12 col-xs-12'>
                            <label className="col-md-3 col-sm-3 col-xs-12">Mô tả</label>
                            <div className='col-md-9 col-sm-9 col-xs-12'>
                                <textarea className='form-control input-sm' id='DESCRIPTION' name='DESCRIPTION'
                                    onChange={this.handleInputChange.bind(this)} value={this.state.data.DESCRIPTION}>
                                </textarea>

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-12 col-sm-12 col-xs-12'>
                            <label className="col-md-3 col-sm-3 col-xs-12">Thứ tự hiển thị</label>
                            <div className='col-md-9 col-sm-9 col-xs-12'>
                                <input type='number' className='form-control input-sm' id='SORT_ORDER' name='SORT_ORDER' min='1' onChange={this.handleInputChange.bind(this)} value={this.state.data.SORT_ORDER} />

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
    renderActionForm(_this) {

        let btnAddItem =
            <button type='button' className='btn btn-grid btn-sm'
                onClick={this.handleAddItem.bind(_this, false)}
            ><i className='fa fa-plus'></i> Thêm</button>

        let btnEdit =
            <button type='button' className='btn btn-grid btn-sm' onClick={this.handleAddItem.bind(_this, true)}
            ><i className='fa fa-edit'></i> Sửa</button>

        let btnView =
            <button type='button' className='btn btn-grid btn-sm' ><i className='fa fa-eye-slash'></i> Xem</button>

        let btnDelete =
            <button type='button' className='btn btn-grid btn-sm' onClick={this.show_HandleDelete.bind(_this)} ><i className='fa fa-remove'></i> Xóa</button>

        let btnExport =
            <button type='button' className='btn btn-grid btn-sm' >
                <i className='fa fa-file-excel-o'></i> Xuất Excel</button>

        return (
            <div>
                <div className='toolbarTable'>
                    <div className='table-action'>
                        {btnAddItem}
                        {btnEdit}
                        {btnDelete}
                        {btnExport}
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className='x_content'>
                <div id='listContent'>
                    {
                        this.renderActionForm(this)
                    }

                    <div className='table-responsive table-fixed table-custom-scroll div-scroll'>
                        <table id='table-roles' className='table table-bordered jambo_table bulk_action fixed_headers'>
                            <thead className='thead-table'>
                                <tr className='headings'>
                                    <th width='34'></th>
                                    <th className='th-table' fieldname='PROVINCE_NAME' displayname='Tên tỉnh/thành' width='200'>Tên tỉnh/thành</th>
                                    <th className='th-table' fieldname='COUNTRY_ID' displayname='Quốc gia' width='200'>Quốc gia</th>
                                    <th className='th-table' fieldname='SHORT_NAME' displayname='Tên rút gọn' width='200'>Tên rút gọn</th>
                                    <th className='th-table' fieldname='CUSTOMIZE_NAME' displayname='Tên tùy biến' width='200'>Tên tùy biến</th>
                                    <th className='th-table' fieldname='DESCRIPTION' displayname='Mô tả'>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.listData == null || this.state.listData.length == 0 || this.state.listData == undefined ?
                                        <tr className=''>
                                            <td colSpan='7'>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                        :
                                        this.state.listData.map((wp, i) => {

                                            return (
                                                <tr key={i} className={wp.Selected ? 'selected' : ''}
                                                    onClick={this.handleClickItem.bind(this, i)}
                                                >
                                                    <td width='34'>
                                                        <div className='squaredcheck'>
                                                            <input type='checkbox' id={wp.COUNTRY_ID} className='checkbox' name='check' checked={wp.Selected}
                                                                onClick={this.handleClickItem.bind(this, i)}
                                                            />
                                                            <label htmlFor={wp.COUNTRY_ID}></label>
                                                        </div>
                                                    </td>
                                                    <td>{wp.PROVINCE_NAME}</td>
                                                    <td>{wp.COUNTRY_NAME}</td>
                                                    <td>{wp.SHORT_NAME}</td>
                                                    <td>{wp.CUSTOMIZE_NAME}</td>
                                                    <td>{wp.DESCRIPTION}</td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --------------Modal-------------- */}
                <div>
                    <Modal show={this.state.is_Modal}>
                        <ModalHeader >
                            <Modal.Title>{this.state.ModalTitle}</Modal.Title>
                        </ModalHeader>
                        <ModalBody>
                            {this.renderFormModel()}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primaty" onClick={this.handleSaveModal.bind(this)}>Lưu</Button>
                            <Button color="secondary" onClick={this.handleHideModal.bind(this)}>Đóng</Button>
                        </ModalFooter>
                    </Modal>
                </div>

            </div >

        );
    }
}
export default ListMD_PROVINCE;
