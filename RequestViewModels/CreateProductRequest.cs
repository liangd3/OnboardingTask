using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.ViewModels
{
    public class CreateProductRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "The price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "The price must be greater than 0.")]
        [DataType(DataType.Currency)]
        [Display(Name = "Price")]
        public double Price { get; set; }
    }
}
