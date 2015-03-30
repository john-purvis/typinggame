using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace TypingGameService
{
    public partial class _Default : Page
    {
        //Enabling CORS in IISExpress

        //The solution is to go to C:\Program Files (x86)\IIS Express\AppServer and open the applicationhost.config file.
        //Also edit the C:\Users\username\Documents\IISExpress\config\applicationhost.config file.

        //Search for httpProtocol and you should see this:

        //<httpProtocol>
        //    <customHeaders>
        //        <clear />
        //        <add name="X-Powered-By" value="ASP.NET" />
        //    </customHeaders>
        //    <redirectHeaders>
        //        <clear />
        //    </redirectHeaders>
        //</httpProtocol>
        //Now add this to the customHeaders node:

        //<add name="Access-Control-Allow-Origin" value="*" />
        //<add name="Access-Control-Allow-Headers" value="Content-Type" />

        protected void Page_Load(object sender, EventArgs e)
        {
            var gradeLevel = Request.QueryString["gradeLevel"];

            var json = getJsonForGradeLevel(gradeLevel);
            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";
            Response.Write(json);
            Response.End();
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