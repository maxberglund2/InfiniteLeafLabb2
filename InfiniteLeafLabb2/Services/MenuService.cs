using InfiniteLeafLabb2.Models.DTOs;

namespace InfiniteLeafLabb2.Services
{
    public class MenuService
    {
        private readonly ApiService _apiService;

        public MenuService(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<List<MenuItemDto>?> GetAllMenuItemsAsync()
        {
            return await _apiService.GetAsync<List<MenuItemDto>>("api/menuitems");
        }

        public async Task<List<MenuItemDto>?> GetPopularMenuItemsAsync()
        {
            return await _apiService.GetAsync<List<MenuItemDto>>("api/menuitems/popular");
        }

        public async Task<MenuItemDto?> GetMenuItemByIdAsync(int id)
        {
            return await _apiService.GetAsync<MenuItemDto>($"api/menuitems/{id}");
        }
    }
}