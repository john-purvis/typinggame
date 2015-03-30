using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TypingGame.Startup))]
namespace TypingGame
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
