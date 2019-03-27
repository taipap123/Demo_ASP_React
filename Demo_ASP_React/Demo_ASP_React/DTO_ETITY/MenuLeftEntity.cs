using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Demo_ASP_React.DTO_ETITY
{
    public class MenuLeftEntity
    {
        public string MenuID { get; set; }
        public string MenuName { get; set; }
        public string Parent_ID { get; set; }
        public string Url { get; set; }
        public string Display_Order { get; set; }

        public MenuLeftEntity(string MenuID, string MenuName, string Parent_ID, string Url, string Display_Order)
        {
            this.MenuID = MenuID;
            this.MenuName = MenuName;
            this.Parent_ID = Parent_ID;
            this.Url = Url;
            this.Display_Order = Display_Order;
        }

        public MenuLeftEntity()
        {
        }
    }
}