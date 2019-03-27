using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace MyAPI.DTO
{
    [Serializable]
    public class MenuLeftEntity
    {
        [DataMember]
        public string MenuID { get; set; }
        [DataMember]
        public string MenuName { get; set; }
        [DataMember]
        public string Parent_ID { get; set; }
        [DataMember]
        public string Url { get; set; }
        [DataMember]
        public string Display_Order { get; set; }

        public MenuLeftEntity(string MenuID, string MenuName, string Parent_ID, string Url, string Display_Order)
        {
            this.MenuID = MenuID;
            this.MenuName = MenuName;
            this.Parent_ID = Parent_ID;
            this.Url = Url;
            this.Display_Order = Display_Order;
        }
    }
}