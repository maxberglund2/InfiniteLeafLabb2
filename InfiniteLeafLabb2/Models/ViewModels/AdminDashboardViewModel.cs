using InfiniteLeafLabb2.Models.DTOs;

namespace InfiniteLeafLabb2.Models.ViewModels
{
    public class AdminDashboardViewModel
    {
        public List<CafeTableDto> Tables { get; set; } = new();
        public List<CustomerDto> Customers { get; set; } = new();
        public List<ReservationDto> Reservations { get; set; } = new();
        public List<MenuItemDto> MenuItems { get; set; } = new();
        public string Username { get; set; } = string.Empty;
        public string ActiveSection { get; set; } = "tables"; // Default active section
    }

    public class DataTableViewModel
    {
        public string EntityName { get; set; } = string.Empty;
        public List<ColumnDefinition> Columns { get; set; } = new();
        public List<Dictionary<string, object>> Rows { get; set; } = new();
        public bool ShowActions { get; set; } = true;
    }

    public class ColumnDefinition
    {
        public string Key { get; set; } = string.Empty;
        public string Header { get; set; } = string.Empty;
        public string Type { get; set; } = "text"; // text, number, date, boolean
        public bool IsSortable { get; set; } = true;
    }

    public class ModalViewModel
    {
        public string Mode { get; set; } = "create"; // create or edit
        public string EntityType { get; set; } = string.Empty; // table, customer, reservation, menuitem
        public string Title { get; set; } = string.Empty;
        public Dictionary<string, FormField> Fields { get; set; } = new();
        public object? Data { get; set; } // Existing data for edit mode
    }

    public class FormField
    {
        public string Name { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = "text"; // text, number, select, datetime, textarea
        public bool Required { get; set; } = true;
        public List<SelectOption>? Options { get; set; } // For select fields
        public string? Placeholder { get; set; }
        public object? Value { get; set; }
    }

    public class SelectOption
    {
        public string Value { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }
}