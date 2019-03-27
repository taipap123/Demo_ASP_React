using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace MyAPI.DTO
{
    public class CountryEntity
    {
        [DataMember]
        public string COUNTRY_ID { get; set; }
        [DataMember]
        public string COUNTRY_CODE { get; set; }
        [DataMember]
        public string COUNTRY_NAME { get; set; }
       
        public CountryEntity(string COUNTRY_ID, string COUNTRY_CODE, string COUNTRY_NAME)
        {
            this.COUNTRY_ID = COUNTRY_ID;
            this.COUNTRY_CODE = COUNTRY_CODE;
            this.COUNTRY_NAME = COUNTRY_NAME;
           
        }
    }
}