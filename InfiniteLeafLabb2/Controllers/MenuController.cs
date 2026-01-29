using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    public class MenuController : Controller
    {
        private readonly ILogger<MenuController> _logger;
        private readonly MenuService _menuService;

        public MenuController(ILogger<MenuController> logger, MenuService menuService)
        {
            _logger = logger;
            _menuService = menuService;
        }
        public async Task<IActionResult> Index()
        {
            var menuItems = await _menuService.GetAllMenuItemsAsync();
            ViewBag.MenuItems = menuItems ?? new List<InfiniteLeafLabb2.Models.DTOs.MenuItemDto>();

            return View();
        }
    }
}
