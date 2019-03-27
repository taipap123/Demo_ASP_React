using System;
using System.Collections.Generic;
using System.Web.Mvc;
using MyAPI.DTO;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace MyAPI.Controllers
{
    public class GetMenuLeftController : Controller
    {
        Connect _conn = new Connect();

        // GET: GetMenuLeft
        public ActionResult Index()
        {
            return View();
        }

        public string getMenuLeft()
        {
            List<MenuLeftEntity> lst = new List<MenuLeftEntity>();
            _conn.Open();

            //---
            MySqlCommand cmd = new MySqlCommand("GETSYSMENU", _conn.conn);
            cmd.CommandType = CommandType.StoredProcedure;

            using (var cursor = cmd.ExecuteReader())
            {
                while (cursor.Read())
                {
                    MenuLeftEntity item = new MenuLeftEntity(
                        Convert.ToString(cursor["MENU_ID"]),
                        Convert.ToString(cursor["MENU_NAME"]),
                        Convert.ToString(cursor["PARENT_ID"]),
                        Convert.ToString(cursor["URL"]),
                        Convert.ToString(cursor["DISPLAY_ORDER"]));
                    lst.Add(item);
                }
            }
            _conn.Close();

            return Newtonsoft.Json.JsonConvert.SerializeObject(lst);

        }

    }
}