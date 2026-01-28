using InfiniteLeafLabb2.Filters;
using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    [RequireAuthentication]
    public class TablesController : Controller
    {
        private readonly TableService _tableService;

        public TablesController(TableService tableService)
        {
            _tableService = tableService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tables = await _tableService.GetAllTablesAsync();
            return Json(tables);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var table = await _tableService.GetTableByIdAsync(id);
            if (table == null)
                return NotFound();
            return Json(table);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTableDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _tableService.CreateTableAsync(dto);
            if (result == null)
                return BadRequest(new { message = "Failed to create table" });

            return Json(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTableDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _tableService.UpdateTableAsync(id, dto);
            if (result == null)
                return NotFound(new { message = "Table not found" });

            return Json(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _tableService.DeleteTableAsync(id);
            if (!success)
                return NotFound(new { message = "Table not found" });

            return Ok(new { message = "Table deleted successfully" });
        }
    }
}