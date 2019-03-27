import React, { Component } from 'react';
import Filter from './md_province-filter.jsx'
import ListMD_PROVINCE from './list-md_province.jsx'

class MD_PROVINCE extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listData: this.props.listData,
            listCountry: this.props.listCountry,
            initData: {
                PROVINCE_ID: '',
                PROVINCE_NAME: '',
                COUNTRY_ID: '',
                COUNTRY_NAME: '',
                SHORT_NAME: '',
                SORT_ORDER: '',
                CUSTOMIZE_NAME: '',
                DESCRIPTION: ''
            },
        }
    }

    render() {
        return (
            <div>
                <Filter  placeholder="tỉnh/thành, tên quốc gia" />
                <ListMD_PROVINCE listData={this.state.listData} data = {this.state.initData} listCountry={this.state.listCountry}/>
            </div>
        );
    }
}

export default MD_PROVINCE;