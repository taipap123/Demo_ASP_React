using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyAPI.Controllers
{
    public class Result
    {
        public Result()
        {
        }

        public object Data { get; set; }
        public string MesageStatus { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
        public bool Success { get; set; }
    }
}