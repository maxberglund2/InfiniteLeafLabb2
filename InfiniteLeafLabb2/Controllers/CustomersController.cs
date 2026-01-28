using InfiniteLeafLabb2.Filters;
using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    [RequireAuthentication]
    public class CustomersController : Controller
    {
        private readonly CustomerService _customerService;

        public CustomersController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Json(customers);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null)
                return NotFound();
            return Json(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _customerService.CreateCustomerAsync(dto);
            if (result == null)
                return BadRequest(new { message = "Failed to create customer" });

            return Json(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _customerService.UpdateCustomerAsync(id, dto);
            if (result == null)
                return NotFound(new { message = "Customer not found" });

            return Json(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _customerService.DeleteCustomerAsync(id);
            if (!success)
                return NotFound(new { message = "Customer not found" });

            return Ok(new { message = "Customer deleted successfully" });
        }
    }
}