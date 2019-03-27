using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace MyAPI.DTO
{
    public class ProvinceEntity
    {
        [DataMember]
        public string PROVINCE_ID { get; set; }
        [DataMember]
        public string PROVINCE_NAME { get; set; }
        [DataMember]
        public string COUNTRY_ID { get; set; }
        [DataMember]
        public string COUNTRY_NAME { get; set; }
        [DataMember]
        public string SHORT_NAME { get; set; }
        [DataMember]
        public string SORT_ORDER { get; set; }
        [DataMember]
        public string CUSTOMIZE_NAME { get; set; }
        [DataMember]
        public string DESCRIPTION { get; set; }

        public ProvinceEntity (string PROVINCE_ID, string PROVINCE_NAME, string COUNTRY_NAME, string SHORT_NAME, string CUSTOMIZE_NAME, string DESCRIPTION)
        {
            this.PROVINCE_ID = PROVINCE_ID;
            this.PROVINCE_NAME = PROVINCE_NAME;
            this.COUNTRY_NAME = COUNTRY_NAME;
            this.SHORT_NAME = SHORT_NAME;
            this.DESCRIPTION = DESCRIPTION;
            this.CUSTOMIZE_NAME = CUSTOMIZE_NAME;
        }

        public ProvinceEntity(string PROVINCE_ID, string PROVINCE_NAME, 
            string COUNTRY_NAME, string SHORT_NAME, string CUSTOMIZE_NAME, string DESCRIPTION, string COUNTRY_ID, string SORT_ORDER)
        {
            this.PROVINCE_ID = PROVINCE_ID;
            this.PROVINCE_NAME = PROVINCE_NAME;
            this.COUNTRY_NAME = COUNTRY_NAME;
            this.SHORT_NAME = SHORT_NAME;
            this.DESCRIPTION = DESCRIPTION;
            this.CUSTOMIZE_NAME = CUSTOMIZE_NAME;
            this.COUNTRY_ID = COUNTRY_ID;
            this.SORT_ORDER = SORT_ORDER;
        }
    }
}