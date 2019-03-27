import React from 'react';
import ReactDOM from 'react-dom';
import MD_PROVINCE from '../../../jsx/category/md_province/md_province.jsx';
import Common from '../../../common/common.js'

var data = (window.PageCategory != undefined && window.PageCategory != null) ? JSON.parse(window.PageCategory) : null;

$(function () {
    Common.get('/Content/getLstCountry', null, (response) => {
       ReactDOM.render(<MD_PROVINCE listData={data} listCountry={JSON.parse(response.Data)}/>, document.getElementById('root'));
    }, (error) => {
       console.log(error)
    })
});