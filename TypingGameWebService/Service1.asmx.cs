using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace TypingGameRealWebService
{
    /// <summary>
    /// Summary description for Service1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Service1 : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetWordList(string gradeLevel)
        {
            var json = getJsonForGradeLevel(gradeLevel);
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(json);
            HttpContext.Current.Response.Flush();
            HttpContext.Current.Response.End();
        }

        protected string getJsonForGradeLevel(string gradeLevel)
        {
            string jsonString = null;
            try
            {
                var sr = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + "Game/wordlists/0" + gradeLevel + ".json");
                jsonString = sr.ReadToEnd();
            }
            catch (Exception e)
            {
                Console.WriteLine((e.Message));
            }
            return jsonString;
        }
    }
}