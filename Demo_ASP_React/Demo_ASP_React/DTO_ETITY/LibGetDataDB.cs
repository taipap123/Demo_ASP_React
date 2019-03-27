using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;

namespace Demo_ASP_React.DTO_ETITY
{
    public class LibGetDataDB
    {
        public string getDataUrl(string url)
        {

            WebClient wc = new WebClient { Encoding = System.Text.Encoding.UTF8 };

            var urlData = wc.DownloadString(url);

            return urlData;
        }
    }
}