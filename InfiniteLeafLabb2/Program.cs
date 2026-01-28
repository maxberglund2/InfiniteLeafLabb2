using InfiniteLeafLabb2.Services;

namespace InfiniteLeafLabb2
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            // Add HttpContextAccessor
            builder.Services.AddHttpContextAccessor();

            // Add Session support
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            // Configure HttpClient for API calls
            builder.Services.AddHttpClient<ApiService>(client =>
            {
                // Read API base URL from configuration
                var apiBaseUrl = builder.Configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7154";
                client.BaseAddress = new Uri(apiBaseUrl);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            });

            // Register application services
            builder.Services.AddScoped<MenuService>();
            builder.Services.AddScoped<ReservationService>();
            builder.Services.AddScoped<TableService>();
            builder.Services.AddScoped<CustomerService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            // Add Session middleware
            app.UseSession();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}