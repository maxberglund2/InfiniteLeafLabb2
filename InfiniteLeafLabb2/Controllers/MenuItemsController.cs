using InfiniteLeafLabb2.Filters;
using InfiniteLeafLabb2.Models.DTOs;
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMenuItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _menuService.CreateMenuItemAsync(dto);
            if (result == null)
                return BadRequest(new { message = "Failed to create menu item" });

            return Json(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMenuItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _menuService.UpdateMenuItemAsync(id, dto);
            if (result == null)
                return NotFound(new { message = "Menu item not found" });

            return Json(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _menuService.DeleteMenuItemAsync(id);
            if (!success)
                return NotFound(new { message = "Menu item not found" });

            return Ok(new { message = "Menu item deleted successfully" });
        }
    }
}