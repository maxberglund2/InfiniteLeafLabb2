using System.Diagnostics;
using InfiniteLeafLabb2.Models;
using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly MenuService _menuService;

        public HomeController(ILogger<HomeController> logger, MenuService menuService)
        {
            _logger = logger;
            _menuService = menuService;
        }

        public async Task<IActionResult> Index()
        {
            // Get popular menu items to display on home page
            var popularItems = await _menuService.GetPopularMenuItemsAsync();
            ViewBag.PopularItems = popularItems ?? new List<InfiniteLeafLabb2.Models.DTOs.MenuItemDto>();

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}