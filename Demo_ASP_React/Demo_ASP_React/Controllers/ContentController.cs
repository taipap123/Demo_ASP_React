using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Demo_ASP_React.DTO_ETITY;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Net.Http;
using RestSharp;
using System.Net;
using System.Text;
using System.IO;
using System.Web.Script.Serialization;

namespace Demo_ASP_React.Controllers
{
    public class ContentController : Controller
    {
        BaseApi api = new BaseApi();
        // GET: Content
        public ActionResult Index(string menuId)
        {
            LibGetDataDB getdb = new LibGetDataDB();

            string provinceString = getdb.getDataUrl("http://localhost:55028/Categories/getLstProvince/7023A3EE5371681DE054000C29748FC6");
            
            //ViewBag.PageCategory = "{\"province\":{" + provinceString + "}, \"country\":{" + countryString + "}}";

            ViewBag.PageCategory = provinceString;

            return View();
        }
        public ActionResult getLstProvince()
        {
            LibGetDataDB getdb = new LibGetDataDB();

            string provinceString = getdb.getDataUrl("http://localhost:55028/Categories/getLstProvince/7023A3EE5371681DE054000C29748FC6");

            return Json(new
            {
                Success = true,
                Data = provinceString
            }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getLstCountry()
        {
            LibGetDataDB getdb = new LibGetDataDB();

            string countryString = getdb.getDataUrl("http://localhost:55028/Categories/getLstContry");

            return Json(new
            {
                Success = true,
                Data = countryString,
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Content/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Content/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Content/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Content/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Content/Edit/5
       

        // GET: Content/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Content/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        public ActionResult SaveItem()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SaveItem(string json)
        {
            bool reply = false;
            //var obj = JsonConvert.SerializeObject(json);
            JObject obj = JsonConvert.DeserializeObject<JObject>(json);
           
            using (var client = new WebClient())
            {
                client.Encoding = UTF8Encoding.UTF8;
                client.Headers.Add("Content-Type", "application/json");
                try
                {
                    reply = Convert.ToBoolean(client.UploadString("http://localhost:55028/PostData/SaveItem", obj.ToString()));
                }
                catch(Exception e)
                {
                    return Json(new
                    {
                        Success = false,
                        Message = "Có lỗi xảy ra"
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            if (reply)
            {
                return Json(new
                {
                    Success = true,
                    Message = "Thêm thành công baby !"
                }, JsonRequestBehavior.AllowGet);
            }
            return Json(new
            {
                Success = false,
                Message = "Có lỗi xảy ra"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateItem(string json)
        {
            bool reply = false;
            //var obj = JsonConvert.SerializeObject(json);
            JObject obj = JsonConvert.DeserializeObject<JObject>(json);

            using (var client = new WebClient())
            {
                client.Encoding = UTF8Encoding.UTF8;
                client.Headers.Add("Content-Type", "application/json");
                try
                {
                    reply = Convert.ToBoolean(client.UploadString("http://localhost:55028/PostData/UpdateItem", obj.ToString()));
                }
                catch (Exception e)
                {
                    return Json(new
                    {
                        Success = false,
                        Message = "Có lỗi xảy ra"
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            if (reply)
            {
                return Json(new
                {
                    Success = true,
                    Message = "Sửa thành công baby !"
                }, JsonRequestBehavior.AllowGet);
            }
            return Json(new
            {
                Success = false,
                Message = "Có lỗi xảy ra"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult DeleteItem(string json)
        {
            bool reply = false;
           
            JObject obj = JsonConvert.DeserializeObject<JObject>(json);

            using (var client = new WebClient())
            {
                client.Encoding = UTF8Encoding.UTF8;
                client.Headers.Add("Content-Type", "application/json");
               try
                {
                    reply = Convert.ToBoolean(client.UploadString("http://localhost:55028/PostData/DeleteItem", json.ToString()));
                }
                catch(Exception e)
                {
                    return Json(new
                    {
                        Success = false,
                        Message = "Có lỗi xảy ra"
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            //HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create("http://localhost:55028/PostData/DeleteItem/" + ID.ToString());
            //httpWebRequest.ContentType = "application/json";
            //httpWebRequest.Method = "POST";
            //using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            //{
            //    streamWriter.Write(ID.ToString());
            //    streamWriter.Flush();
            //    streamWriter.Close();
            //}
            if (reply)
            {
                return Json(new
                {
                    Success = true,
                    Message = "Xóa thành công baby !"
                }, JsonRequestBehavior.AllowGet);
            }
            return Json(new
            {
                Success = false,
                Message = "Có lỗi xảy ra"
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
