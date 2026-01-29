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

        public async Task<MenuItemDto?> CreateMenuItemAsync(CreateMenuItemDto menuItem)
        {
            return await _apiService.PostAsync<CreateMenuItemDto, MenuItemDto>("api/menuitems", menuItem);
        }

        public async Task<MenuItemDto?> UpdateMenuItemAsync(int id, UpdateMenuItemDto menuItem)
        {
            return await _apiService.PutAsync<UpdateMenuItemDto, MenuItemDto>($"api/menuitems/{id}", menuItem);
        }

        public async Task<bool> DeleteMenuItemAsync(int id)
        {
            return await _apiService.DeleteAsync($"api/menuitems/{id}");
        }
    }

    public class CreateMenuItemDto
    {
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public string Description { get; set; } = null!;
        public bool IsPopular { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateMenuItemDto
    {
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public string Description { get; set; } = null!;
        public bool IsPopular { get; set; }
        public string? ImageUrl { get; set; }
    }
}