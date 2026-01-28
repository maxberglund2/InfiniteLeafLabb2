namespace InfiniteLeafLabb2.Models.DTOs
{
    public class LoginRequestDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public string Username { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }

    public class MenuItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public string Description { get; set; } = null!;
        public bool IsPopular { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
    }

    public class CafeTableDto
    {
        public int Id { get; set; }
        public int TableNumber { get; set; }
        public int Capacity { get; set; }
    }

    public class ReservationDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public int NumberOfGuests { get; set; }
        public int CafeTableId { get; set; }
        public CafeTableDto CafeTable { get; set; } = null!;
        public int CustomerId { get; set; }
        public CustomerDto Customer { get; set; } = null!;
    }

    public class CreateReservationDto
    {
        public DateTime StartTime { get; set; }
        public int NumberOfGuests { get; set; }
        public int CafeTableId { get; set; }
        public int CustomerId { get; set; }
    }
}