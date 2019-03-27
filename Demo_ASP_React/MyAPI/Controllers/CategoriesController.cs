using System;
using System.Collections.Generic;
using System.Web.Mvc;
using MyAPI.DTO;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;
using Newtonsoft.Json;
using System.Web.Http;

namespace MyAPI.Controllers
{
   
    public class CategoriesController : Controller
    {
        Connect _conn = new Connect();
        // GET: Categories
       
        public string getLstContry()
        {
            List<CountryEntity> lst = new List<CountryEntity>();
            _conn.Open();

            //---
            MySqlCommand cmd = new MySqlCommand("GETCOUNTTRY", _conn.conn);
            cmd.CommandType = CommandType.StoredProcedure;

            using (var cursor = cmd.ExecuteReader())
            {
                while (cursor.Read())
                {
                    CountryEntity item = new CountryEntity(
                        Convert.ToString(cursor["COUNTRY_ID"]),
                        Convert.ToString(cursor["COUNTRY_CODE"]),
                        Convert.ToString(cursor["COUNTRY_NAME"]));
                 
                    lst.Add(item);
                }
            }
            _conn.Close();

            return JsonConvert.SerializeObject(lst);
        }
        public string getLstProvince(string country_id)
        {
            List<ProvinceEntity> lst = new List<ProvinceEntity>();
            _conn.Open();

            //---
            MySqlCommand cmd = new MySqlCommand("GETPROVINCE", _conn.conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@I_COUNTRY_ID", "7023A3EE5371681DE054000C29748FC6");

            using (var cursor = cmd.ExecuteReader())
            {
                while (cursor.Read())
                {
                    ProvinceEntity item = new ProvinceEntity(
                        Convert.ToString(cursor["PROVINCE_ID"]),
                        Convert.ToString(cursor["PROVINCE_NAME"]),
                        Convert.ToString(cursor["COUNTRY_NAME"]),
                        Convert.ToString(cursor["SHORT_NAME"]),
                        Convert.ToString(cursor["CUSTOMIZE_NAME"]), 
                        Convert.ToString(cursor["DESCRIPTION"]),
                        Convert.ToString(cursor["COUNTRY_ID"]), 
                        Convert.ToString(cursor["SORT_ORDER"]));
                    lst.Add(item);
                }
            }
            _conn.Close();
            
            return JsonConvert.SerializeObject(lst);
        }
        
    }
}