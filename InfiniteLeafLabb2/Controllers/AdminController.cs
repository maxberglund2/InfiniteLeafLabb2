using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            // Check if user has a valid JWT token
            var token = HttpContext.Session.GetString("JwtToken");
            var isAdmin = HttpContext.Session.GetString("IsAdmin");

            if (string.IsNullOrEmpty(token) || isAdmin != "true")
            {
                return RedirectToAction("Index", "Auth");
            }

            // Get username from session to display
            var username = HttpContext.Session.GetString("Username");
            ViewBag.Username = username;

            return View();
        }
    }
}