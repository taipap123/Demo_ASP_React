using MyAPI.DTO;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Web.Http;


namespace MyAPI.Controllers
{
    public class PostDataController : ApiController
    {
        Connect _conn = new Connect();

        // GET: PostData
        public PostDataController()
        {
           
        }

        [Route("PostData/SaveItem")]
        [HttpPost]
        public IHttpActionResult SaveItem([FromBody]JObject jsonData)
        {
            _conn.Open();
            //ProvinceEntity obj = JsonConvert.DeserializeObject<ProvinceEntity>(jsonData.ToString());

            MySqlCommand cmd = new MySqlCommand("SAVEPROVINCE", _conn.conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@I_PROVINCE_NAME", jsonData["PROVINCE_NAME"].ToString());
            cmd.Parameters.AddWithValue("@I_SHORT_NAME", jsonData["SHORT_NAME"].ToString());
            cmd.Parameters.AddWithValue("@I_CUSTOMIZE_NAME", jsonData["CUSTOMIZE_NAME"].ToString());
            cmd.Parameters.AddWithValue("@I_DESCRIPTION", jsonData["DESCRIPTION"].ToString());
            cmd.Parameters.AddWithValue("@I_SORT_ORDER", jsonData["SORT_ORDER"].ToString());
            cmd.Parameters.AddWithValue("@I_COUNTRY_ID", jsonData["COUNTRY_ID"].ToString());
            cmd.Parameters.AddWithValue("@I_COUNTRY_NAME", jsonData["COUNTRY_NAME"].ToString());

            try
            {
                cmd.ExecuteNonQuery();
                _conn.Close();
                return Ok(true);
            }
            catch (Exception e)
            {
                _conn.Close();
                return Ok(false);
            }
        }

        [Route("PostData/UpdateItem")]
        [HttpPost]
        public IHttpActionResult UpdateItem([FromBody]JObject jsonData)
        {
            _conn.Open();
            //ProvinceEntity obj = JsonConvert.DeserializeObject<ProvinceEntity>(jsonData.ToString());

            MySqlCommand cmd = new MySqlCommand("EDITPROVINCE", _conn.conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@I_PROVINCE_ID", jsonData["PROVINCE_ID"].ToString());
            cmd.Parameters.AddWithValue("@I_PROVINCE_NAME", jsonData["PROVINCE_NAME"].ToString());
            cmd.Parameters.AddWithValue("@I_SHORT_NAME", jsonData["SHORT_NAME"].ToString());
            cmd.Parameters.AddWithValue("@I_CUSTOMIZE_NAME", jsonData["CUSTOMIZE_NAME"].ToString());
            cmd.Parameters.AddWithValue("@I_DESCRIPTION", jsonData["DESCRIPTION"].ToString());
            cmd.Parameters.AddWithValue("@I_SORT_ORDER", jsonData["SORT_ORDER"].ToString());
            cmd.Parameters.AddWithValue("@I_COUNTRY_ID", jsonData["COUNTRY_ID"].ToString());
            cmd.Parameters.AddWithValue("@I_COUNTRY_NAME", jsonData["COUNTRY_NAME"].ToString());

            try
            {
                cmd.ExecuteNonQuery();
                _conn.Close();
                return Ok(true);
            }
            catch (Exception e)
            {
                _conn.Close();
                return Ok(false);
            }
        }

        [Route("PostData/DeleteItem")]
        [HttpPost]
        public IHttpActionResult DeleteItem([FromBody]JObject jsonData)
        {
            _conn.Open();
           
            MySqlCommand cmd = new MySqlCommand("DELETEPROVINCE", _conn.conn);
            cmd.CommandType = CommandType.StoredProcedure;
            
            cmd.Parameters.AddWithValue("@I_PROVINCE_ID", jsonData["ID"].ToString());

            try
            {
                cmd.ExecuteNonQuery();
                _conn.Close();
                return Ok(true);
            }
            catch (Exception e)
            {
                _conn.Close();
                return Ok(false);
            }
        }

    }
}