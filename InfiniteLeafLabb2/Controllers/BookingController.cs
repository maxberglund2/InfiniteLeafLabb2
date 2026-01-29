using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    public class BookingController : Controller
    {
        private readonly ILogger<BookingController> _logger;
        private readonly TableService _tableService;
        private readonly CustomerService _customerService;
        private readonly ReservationService _reservationService;

        public BookingController(
            ILogger<BookingController> logger,
            TableService tableService,
            CustomerService customerService,
            ReservationService reservationService)
        {
            _logger = logger;
            _tableService = tableService;
            _customerService = customerService;
            _reservationService = reservationService;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}