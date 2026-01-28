using InfiniteLeafLabb2.Filters;
using InfiniteLeafLabb2.Services;
using InfiniteLeafLabb2.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    [RequireAuthentication]
    public class ReservationsController : Controller
    {
        private readonly ReservationService _reservationService;

        public ReservationsController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Json(reservations);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound();
            return Json(reservation);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReservationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _reservationService.CreateReservationAsync(dto);
            if (result == null)
                return BadRequest(new { message = "Failed to create reservation" });

            return Json(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _reservationService.DeleteReservationAsync(id);
            if (!success)
                return NotFound(new { message = "Reservation not found" });

            return Ok(new { message = "Reservation deleted successfully" });
        }
    }
}