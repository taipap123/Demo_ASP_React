using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Demo_ASP_React.Startup))]
namespace Demo_ASP_React
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
