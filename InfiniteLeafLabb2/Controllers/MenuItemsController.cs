using InfiniteLeafLabb2.Filters;
using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    [RequireAuthentication]
    public class MenuItemsController : Controller
    {
        private readonly MenuService _menuService;

        public MenuItemsController(MenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var menuItems = await _menuService.GetAllMenuItemsAsync();
            return Json(menuItems);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var menuItem = await _menuService.GetMenuItemByIdAsync(id);
            if (menuItem == null)
                return NotFound();
            return Json(menuItem);
        }

        // Note: Create, Update, Delete methods would require 
        // corresponding methods in MenuService if needed
    }
}