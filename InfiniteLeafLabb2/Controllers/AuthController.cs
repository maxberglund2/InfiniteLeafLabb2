using InfiniteLeafLabb2.Models.DTOs;
using InfiniteLeafLabb2.Services;
using Microsoft.AspNetCore.Mvc;

namespace InfiniteLeafLabb2.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApiService _apiService;

        public AuthController(ApiService apiService)
        {
            _apiService = apiService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            var loginRequest = new LoginRequestDto
            {
                Username = username,
                Password = password
            };

            try
            {
                var response = await _apiService.PostAsync<LoginRequestDto>("api/auth/login", loginRequest);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var loginResponse = System.Text.Json.JsonSerializer.Deserialize<LoginResponseDto>(content,
                        new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (loginResponse != null)
                    {
                        // Store JWT token in session
                        HttpContext.Session.SetString("JwtToken", loginResponse.Token);
                        HttpContext.Session.SetString("Username", loginResponse.Username);
                        HttpContext.Session.SetString("IsAdmin", "true");

                        return RedirectToAction("Index", "Admin");
                    }
                }

                ViewBag.Error = "Invalid username or password";
                return View("Index");
            }
            catch (Exception ex)
            {
                ViewBag.Error = $"An error occurred: {ex.Message}";
                return View("Index");
            }
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Remove("JwtToken");
            HttpContext.Session.Remove("Username");
            HttpContext.Session.Remove("IsAdmin");
            return RedirectToAction("Index", "Home");
        }
    }
}