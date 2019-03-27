using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace MyAPI.DTO
{
    public class Connect
    {
        //string connstr = System.Configuration.ConfigurationManager.ConnectionStrings["LocalMysql"].ConnectionString;
        string connstr = "Data Source=localhost;Initial Catalog=masterdata;User ID=root;Password='';charset=utf8";
        public MySqlConnection conn;

        
        public void Open()
        {
            conn = new MySqlConnection(connstr);
          
            try
            {
                Console.WriteLine("Connecting to MySQL...");
                conn.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi kết nối !");

            }
        }
        public void Close()
        {
            Console.WriteLine("Đã ngắt kết nối");
            conn.Close();
        }

       
    }
}