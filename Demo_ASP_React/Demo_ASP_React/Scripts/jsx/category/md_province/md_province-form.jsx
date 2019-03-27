import React, { Component } from 'react';
import Select from 'react-select'
import CommonModal from '../common-modal.jsx'

const rules = [
  {
    field: 'PROVINCE_NAME',
    maxLength: 255,
    required: true,
    messages: {
      maxLength: 'Không được vượt quá 255 ký tự',
      required: 'Dữ liệu không được để trống',
    }
  },
  {
    field: 'COUNTRY_ID',
    maxLength: 36,
    required: true,
    messages: {
      required: 'Dữ liệu không được để trống',
    }
  },
  {
    field: 'DESCRIPTION',
    maxLength: 1000,
    messages: {
      maxLength: 'Không được vượt quá 1000 ký tự',
    }
  },
  {
    field: 'SORT_ORDER',
    messages: {
    }
  },
  {
    field: 'SHORT_NAME',
    maxLength: 255,
    messages: {
      maxLength: 'Không được vượt quá 255 ký tự',
    }
  },
  {
    field: 'CUSTOMIZE_NAME',
    maxLength: 255,
    messages: {
      maxLength: 'Không được vượt quá 255 ký tự',
    }
  }
]
class MD_PROVINCEForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Thêm mới',
      isEdit: false,
      data: this.props.data,
      isValid: false,
      errors: [],
      MD_COUNTRY: []
    }
  }

  validateForm(data) {
    var errors = Common.validateForm(data, rules)
    this.setState({
      errors: errors
    })
    return errors.length == 0
  }
  handleShow(data, title) {
    let _IsEdit = false;
    if (data.PROVINCE_ID != '' && data.PROVINCE_ID != undefined) {
      _IsEdit = true;
    }
    let initData = _.extend({}, data)
    this.modal.show()
    this.setState({
      data: initData,
      title: title,
      isEdit: _IsEdit
    })
    this.getMasterData((res) => {
      let state = this.state;
      //state.data = data;
      state.errors = [];
      state.isValid = false;
      if (res != undefined) {
        res.map((item, i) => {
          state[item.Key] = item.Value
        })
      }
      this.setState(state)
    })
  }
  handleHide() {
    this.modal.hide()
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
    let errors = this.state.errors;
    let isValid = Common.validateField(value, rules, name, errors)
    this.setState({
      data: data,
      isValid: isValid,
      errors: errors
    });
  }
  handleSaveModal(isContinues) {
    if (isContinues) {
      this.props.onSaveContinues();
    } else {
      this.props.onSave();
    }
  }
  handleShowErrors(errors) {
    this.setState({
      isValid: false,
      errors: errors
    })
  }
  getData() {
    return this.state.data;
  }
  isFormValid() {
    return this.validateForm(this.state.data);
  }

  getMasterData(onSuccess) {
    Common.get('/Categories/GetMasterData?menuId=' + this.props.menuid,
      null,
      (response) => {
        onSuccess(response.Data)
      }, (error) => {
        console.log(error)
      })
  }
  handleChangeCountry(selectedOption) {
    let state = this.state
    state.data.COUNTRY_ID = selectedOption.value
    this.setState(state)
  }
  render() {
    let groupbtn = this.state.data.IsView
      ? <button className='btn btn-default' onClick={this.handleHide.bind(this)}>Đóng</button>
      : <div>
        <button className="btn btn-primary" onClick={this.handleSaveModal.bind(this, false)}>Lưu</button>
        <button className='btn btn-default' onClick={this.handleHide.bind(this)}>Đóng</button>
      </div>
    return (
      <CommonModal ref={instance => { this.modal = instance; }} title={this.state.title} isEdit={this.state.isEdit}
        // onSave={this.handleSaveModal.bind(this, false)} onSaveContinues={this.handleSaveModal.bind(this, true)}
        groupbtn={groupbtn}
      >
        <form action='/Categories/SaveItem' className='form-horzital' id='frmApartment' method='post'>
          <div className='row'>
            <div className='form-group col-md-12 col-sm-12 col-xs-12'>
              <label className="required col-md-3 col-sm-3 col-xs-12">Tên tỉnh/thành</label>
              <div className='col-md-9 col-sm-9 col-xs-12'>
                <input type='text' className='form-control input-sm' id='PROVINCE_NAME' name='PROVINCE_NAME'
                  disabled={this.state.data.IsView}
                  onChange={this.handleInputChange.bind(this)} value={this.state.data.PROVINCE_NAME} />
                {
                  this.state.errors.map((err, i) => {
                    if (err.Key == 'PROVINCE_NAME') {
                      return <span className='error' key={i}>{err.Value}</span >
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-12 col-sm-12 col-xs-12'>
              <label className="required col-md-3 col-sm-3 col-xs-12" htmlFor='COUNTRY_ID'>Quốc gia</label>
              <div className='col-md-9 col-sm-9 col-xs-12'>
                {/* <select name='COUNTRY_ID' id='COUNTRY_ID' className='form-control input-sm'
                  value={this.state.data.COUNTRY_ID}
                  onChange={this.handleInputChange.bind(this)}
                >
                  <option value=''>--Chọn Quốc gia--</option>
                  {
                    this.state.MD_COUNTRY != null && this.state.MD_COUNTRY != undefined ?
                      this.state.MD_COUNTRY.map((item, i) =>
                        <option key={i} value={item.Value}>{item.Text}</option>
                      )
                      : null
                  }
                </select> */}
                <select
                  // disabled={this.state.data.IsView}
                  // value={this.state.data.COUNTRY_ID}
                  // onChange={this.handleChangeCountry.bind(this)}
                  // options={this.state.MD_COUNTRY}
                  // ignoreAccents={true}
                  // ignoreCase={true}
                  // isLoading={false}
                  placeholder='--Chọn Quốc gia--'
                />

                {
                  this.state.errors.map((err, i) => {
                    if (err.Key == 'COUNTRY_ID') {
                      return <span className='error' key={i}>{err.Value}</span >
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-12 col-sm-12 col-xs-12'>
              <label className="col-md-3 col-sm-3 col-xs-12">Tên rút gọn</label>
              <div className='col-md-9 col-sm-9 col-xs-12'>
                <input type='text' className='form-control input-sm' id='SHORT_NAME' name='SHORT_NAME' disabled={this.state.data.IsView} onChange={this.handleInputChange.bind(this)} value={this.state.data.SHORT_NAME} />
                {
                  this.state.errors.map((err, i) => {
                    if (err.Key == 'SHORT_NAME') {
                      return <span className='error' key={i}>{err.Value}</span >
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-12 col-sm-12 col-xs-12'>
              <label className="col-md-3 col-sm-3 col-xs-12">Tên tùy biến</label>
              <div className='col-md-9 col-sm-9 col-xs-12'>
                <input type='text' className='form-control input-sm' id='CUSTOMIZE_NAME' name='CUSTOMIZE_NAME' disabled={this.state.data.IsView} onChange={this.handleInputChange.bind(this)} value={this.state.data.CUSTOMIZE_NAME} />
                {
                  this.state.errors.map((err, i) => {
                    if (err.Key == 'CUSTOMIZE_NAME') {
                      return <span className='error' key={i}>{err.Value}</span >
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-12 col-sm-12 col-xs-12'>
              <label className="col-md-3 col-sm-3 col-xs-12">Mô tả</label>
              <div className='col-md-9 col-sm-9 col-xs-12'>
                <textarea className='form-control input-sm' id='DESCRIPTION' name='DESCRIPTION' disabled={this.state.data.IsView}
                  onChange={this.handleInputChange.bind(this)} value={this.state.data.DESCRIPTION}>
                </textarea>{
                  this.state.errors.map((err, i) => {
                    if (err.Key == 'DESCRIPTION') {
                      return <span className='error' key={i}>{err.Value}</span >
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-12 col-sm-12 col-xs-12'>
              <label className="col-md-3 col-sm-3 col-xs-12">Thứ tự hiển thị</label>
              <div className='col-md-9 col-sm-9 col-xs-12'>
                <input type='number' className='form-control input-sm' id='SORT_ORDER' name='SORT_ORDER' min='1' disabled={this.state.data.IsView} onChange={this.handleInputChange.bind(this)} value={this.state.data.SORT_ORDER} />
                {
                  this.state.errors.map((err, i) => {
                    if (err.Key == 'SORT_ORDER') {
                      return <span className='error' key={i}>{err.Value}</span >
                    }
                  })
                }
              </div>
            </div>
          </div>
          {/* <div className='form-group'>
            <div className='squaredcheck'>
              <input type='checkbox' id='IS_ACTIVE' name='IS_ACTIVE' checked={this.state.data.IS_ACTIVE} onChange={this.handleInputChange.bind(this)} />
              <label htmlFor='IS_ACTIVE'> <span>Kích hoạt</span> </label>
            </div>
            {
              this.state.errors.map((err, i) => {
                if (err.Key == 'IS_ACTIVE') {
                  return <span className='error' key={i}>{err.Value}</span >
                }
              })
            }
          </div>
          <div className='form-group'>
            <div className='squaredcheck'>
              <input type='checkbox' id='IS_SYSTEM' name='IS_SYSTEM' checked={this.state.data.IS_SYSTEM} onChange={this.handleInputChange.bind(this)} />
              <label htmlFor='IS_SYSTEM'> <span>Hệ thống</span> </label>
            </div>
            {
              this.state.errors.map((err, i) => {
                if (err.Key == 'IS_SYSTEM') {
                  return <span className='error' key={i}>{err.Value}</span >
                }
              })
            }
          </div> */}

        </form>
      </CommonModal>
    );
  }
}

export default MD_PROVINCEForm;