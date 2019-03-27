import React, { Component } from 'react';
//import Common from '../../../common/common.js'

class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pagingModel: {},
            //country: this.props.country
        }
       
    }

    render() {
        var placeholder = "Nhập tên " + this.props.placeholder;
        return (
            <div  className='x_panel box-filter'>
               <div className='row form-inline'>
                    <label className='col-md-1 col-sm-4 col-xs-12 validate'> Tìm kiếm </label>
                    <div className='col-md-3 col-sm-2 col-xs-12 margin-bottom-10'>
                        <input type='text' id='Keyword' name='Keyword' className='form-control input-sm width-per-100' placeholder={placeholder}  />
                    </div>
               
                    <label className='col-md-1 col-sm-4 col-xs-12 validate'>Quốc gia</label>
                    <div className='col-md-3 col-sm-2 col-xs-12 margin-bottom-10'>
                        <select className='form-control input-sm width-per-100' id='COUNTRY_ID' name='COUNTRY_ID'>
                            <option value=''>--Tất cả--</option>
                        </select>
                    </div>
                    <div className='col-md-1 col-sm-2 col-xs-4'>
                        <a href="javascript:void(0);" className='btn btn-primary btn-small' ><i className='glyphicon glyphicon-search'></i>Tìm kiếm</a>
                    </div>
               </div> 
            </div>
        );
    }
}

export default Filter;