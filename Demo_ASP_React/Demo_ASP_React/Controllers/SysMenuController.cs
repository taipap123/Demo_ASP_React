using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Demo_ASP_React.DTO_ETITY;
using Newtonsoft.Json;


namespace Demo_ASP_React.Controllers
{
    public class SysMenuController : Controller
    {
        // GET: SysMenu
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult GetMenuLeft()
        {
            //JObject json = null;
            var contentData = new List<MenuLeftEntity>();
            try
            {
                LibGetDataDB getdb = new LibGetDataDB();
                string responseString = getdb.getDataUrl("http://localhost:55028/getMenuLeft/getMenuLeft");

                //json = JObject.Parse(responseString);

                contentData = JsonConvert.DeserializeObject<List<MenuLeftEntity>>(responseString);
                //List<MenuLeftEntity> oMyclass = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MenuLeftEntity>>(Jsonstring);

            }
            catch (Exception ex)
            {
                throw ex;
            }

            ViewBag.ListMenu = contentData;

            return PartialView("_GetMenuLeft", contentData);
        }
    }
}