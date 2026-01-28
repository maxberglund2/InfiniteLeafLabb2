using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            // Check if user is authenticated (you can implement proper auth later)
            var isAuthenticated = HttpContext.Session.GetString("IsAdmin") == "true";

            if (!isAuthenticated)
            {
                return RedirectToAction("Index", "Auth");
            }

            return View();
        }
    }
}