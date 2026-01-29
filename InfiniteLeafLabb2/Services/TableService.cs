using InfiniteLeafLabb2.Models.DTOs;

namespace InfiniteLeafLabb2.Services
{
    public class TableService
    {
        private readonly ApiService _apiService;

        public TableService(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<List<CafeTableDto>?> GetAllTablesAsync()
        {
            return await _apiService.GetAsync<List<CafeTableDto>>("api/cafetables");
        }

        public async Task<CafeTableDto?> GetTableByIdAsync(int id)
        {
            return await _apiService.GetAsync<CafeTableDto>($"api/cafetables/{id}");
        }

        public async Task<CafeTableDto?> CreateTableAsync(CreateTableDto table)
        {
            return await _apiService.PostAsync<CreateTableDto, CafeTableDto>("api/cafetables", table);
        }

        public async Task<CafeTableDto?> UpdateTableAsync(int id, UpdateTableDto table)
        {
            return await _apiService.PutAsync<UpdateTableDto, CafeTableDto>($"api/cafetables/{id}", table);
        }

        public async Task<bool> DeleteTableAsync(int id)
        {
            return await _apiService.DeleteAsync($"api/cafetables/{id}");
        }
    }

    public class CreateTableDto
    {
        public int TableNumber { get; set; }
        public int Capacity { get; set; }
    }

    public class UpdateTableDto
    {
        public int TableNumber { get; set; }
        public int Capacity { get; set; }
    }
}