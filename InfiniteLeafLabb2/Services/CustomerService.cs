using InfiniteLeafLabb2.Models.DTOs;

namespace InfiniteLeafLabb2.Services
{
    public class CustomerService
    {
        private readonly ApiService _apiService;

        public CustomerService(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<List<CustomerDto>?> GetAllCustomersAsync()
        {
            return await _apiService.GetAsync<List<CustomerDto>>("api/customers");
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            return await _apiService.GetAsync<CustomerDto>($"api/customers/{id}");
        }

        public async Task<CustomerDto?> CreateCustomerAsync(CreateCustomerDto customer)
        {
            return await _apiService.PostAsync<CreateCustomerDto, CustomerDto>("api/customers", customer);
        }

        public async Task<CustomerDto?> UpdateCustomerAsync(int id, UpdateCustomerDto customer)
        {
            return await _apiService.PutAsync<UpdateCustomerDto, CustomerDto>($"api/customers/{id}", customer);
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            return await _apiService.DeleteAsync($"api/customers/{id}");
        }
    }

    // DTOs for Create/Update operations
    public class CreateCustomerDto
    {
        public string Name { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
    }

    public class UpdateCustomerDto
    {
        public string Name { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
    }
}