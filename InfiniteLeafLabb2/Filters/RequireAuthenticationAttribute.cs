using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace InfiniteLeafLabb2.Filters
{
    public class RequireAuthenticationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var token = context.HttpContext.Session.GetString("JwtToken");
            var isAdmin = context.HttpContext.Session.GetString("IsAdmin");

            if (string.IsNullOrEmpty(token) || isAdmin != "true")
            {
                context.Result = new RedirectToActionResult("Index", "Auth", null);
            }

            base.OnActionExecuting(context);
        }
    }
}