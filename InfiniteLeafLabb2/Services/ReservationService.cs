using InfiniteLeafLabb2.Models.DTOs;

namespace InfiniteLeafLabb2.Services
{
    public class ReservationService
    {
        private readonly ApiService _apiService;

        public ReservationService(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<List<ReservationDto>?> GetAllReservationsAsync()
        {
            return await _apiService.GetAsync<List<ReservationDto>>("api/reservations");
        }

        public async Task<ReservationDto?> GetReservationByIdAsync(int id)
        {
            return await _apiService.GetAsync<ReservationDto>($"api/reservations/{id}");
        }

        public async Task<ReservationDto?> CreateReservationAsync(CreateReservationDto reservation)
        {
            return await _apiService.PostAsync<CreateReservationDto, ReservationDto>("api/reservations", reservation);
        }

        public async Task<bool> DeleteReservationAsync(int id)
        {
            return await _apiService.DeleteAsync($"api/reservations/{id}");
        }
    }
}