
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Demo_ASP_React.DTO_ETITY
{

    public class BaseApi
    {
       
        public Result CallApi(string api, Method method, object dataObject = null)
        {
            Result result;
            try
            {
                RestClient expr_0F = new RestClient();
                expr_0F.BaseUrl = "APIUrl";
                RestClient restClient = expr_0F;
                RestRequest expr_24 = new RestRequest(api, method);
                expr_24.RequestFormat = 0;
                RestRequest restRequest = expr_24;
               
                restRequest.AddHeader("Accept", "application/json");
               
                restRequest.AddBody(dataObject);
                
                IRestResponse restResponse = restClient.Execute(restRequest);
                bool flag3 = restResponse.StatusCode != HttpStatusCode.OK;
                if (flag3)
                {
                    result = new Result
                    {
                        Success = false,
                        StatusCode = (int)restResponse.StatusCode,
                        Message = restResponse.StatusDescription
                    };
                }
                else
                {
                    result = new Result
                    {
                        Success = true,
                        StatusCode = (int)restResponse.StatusCode,
                        Message = restResponse.StatusDescription
                    };
                }
            }
            catch (Exception ex)
            {
                result = new Result
                {
                    Success = false,
                    StatusCode = 500,
                    Message = ex.Message,
                    Data = ex.Data
                };
            }
            return result;
        }
    }
}